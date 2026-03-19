import json
import logging
import threading
import uuid
import sys
import os
from datetime import datetime
from typing import Optional, Dict
from kafka import KafkaConsumer

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../configs")))
try:
    import store_client
except ImportError:
    pass

from schemas import IncidentEvent
from kafka_producer import IncidentProducer

logger = logging.getLogger(__name__)

class AnomalyConsumer:
    def __init__(self, bootstrap_servers: str, anomaly_topic: str, incident_producer: IncidentProducer, incident_store: Dict[str, IncidentEvent]):
        self.bootstrap_servers = bootstrap_servers
        self.anomaly_topic = anomaly_topic
        self.incident_producer = incident_producer
        self.incident_store = incident_store
        self._stop_event = threading.Event()
        self.consumer_thread: Optional[threading.Thread] = None

    def start(self):
        """Starts the Kafka consumer loop in a background thread."""
        logger.info(f"Starting Anomaly Consumer on topic: {self.anomaly_topic}")
        self.consumer_thread = threading.Thread(target=self._consume_loop, daemon=True)
        self.consumer_thread.start()

    def _consume_loop(self):
        try:
            consumer = KafkaConsumer(
                self.anomaly_topic,
                bootstrap_servers=self.bootstrap_servers,
                group_id='incident_management_group',
                value_deserializer=lambda m: json.loads(m.decode('utf-8')),
                auto_offset_reset='latest',
                api_version=(0, 10, 1)
            )
            logger.info("Incident Management Consumer successfully connected to Kafka.")
            
            for message in consumer:
                if self._stop_event.is_set():
                    break
                
                payload = message.value
                self._process_anomaly(payload)
                
            consumer.close()
        except Exception as e:
            logger.error(f"Incident Management Consumer encountered an error: {e}")

    def stop(self):
        """Signals the background polling loop to stop."""
        logger.info("Stopping Incident Management Consumer...")
        self._stop_event.set()
        if self.consumer_thread:
            self.consumer_thread.join(timeout=5)

    def _process_anomaly(self, anomaly: dict):
        """Creates an incident from the incoming anomaly."""
        anomaly_type = anomaly.get("type", "UNKNOWN")
        service = anomaly.get("service", "unknown-service")
        
        # Determine severity
        severity = self._map_severity(anomaly_type)
        
        # Generate incident properties
        incident_id = str(uuid.uuid4())
        timestamp = datetime.utcnow().isoformat() + "Z"
        
        incident = IncidentEvent(
            incident_id=incident_id,
            service=service,
            type=anomaly_type,
            severity=severity,
            status="OPEN",
            timestamp=timestamp,
            context={"anomaly_value": anomaly.get("value"), "anomaly_timestamp": anomaly.get("timestamp")}
        )
        
        logger.info(f"Created new incident {incident_id} [{severity}] for service {service}")
        print(f"[Incident Service] Created incident {incident_id} for {service}")
        
        # 1. Update In-Memory Store
        self.incident_store[incident_id] = incident
        try:
            store_client.update_store("incidents", json.loads(incident.json()))
        except NameError:
            pass
        
        # 2. Publish to Kafka
        self.incident_producer.publish_incident(incident.dict())

    def _map_severity(self, anomaly_type: str) -> str:
        """Map anomaly type to severity level based on rules."""
        if anomaly_type == "HIGH_CPU" or anomaly_type == "HIGH_LATENCY":
            return "HIGH"
        elif anomaly_type == "HIGH_ERROR_RATE":
            return "CRITICAL"
        elif anomaly_type == "ERROR_LOG":
            return "MEDIUM"
        return "LOW"
