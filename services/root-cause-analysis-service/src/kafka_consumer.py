import json
import logging
import threading
from datetime import datetime
from typing import Optional
from kafka import KafkaConsumer

from .schemas import AnalyzedIncident
from .kafka_producer import AnalyzedIncidentProducer

logger = logging.getLogger(__name__)

class IncidentConsumer:
    def __init__(self, bootstrap_servers: str, incident_topic: str, analyzed_producer: AnalyzedIncidentProducer):
        self.bootstrap_servers = bootstrap_servers
        self.incident_topic = incident_topic
        self.analyzed_producer = analyzed_producer
        self._stop_event = threading.Event()
        self.consumer_thread: Optional[threading.Thread] = None

    def start(self):
        """Starts the Kafka consumer loop in a background thread."""
        logger.info(f"Starting Incident Consumer on topic: {self.incident_topic}")
        self.consumer_thread = threading.Thread(target=self._consume_loop, daemon=True)
        self.consumer_thread.start()

    def _consume_loop(self):
        try:
            consumer = KafkaConsumer(
                self.incident_topic,
                bootstrap_servers=self.bootstrap_servers,
                group_id='root_cause_analysis_group',
                value_deserializer=lambda m: json.loads(m.decode('utf-8')),
                auto_offset_reset='latest',
                api_version=(0, 10, 1)
            )
            logger.info("Root Cause Analysis Consumer successfully connected to Kafka.")
            
            for message in consumer:
                if self._stop_event.is_set():
                    break
                
                payload = message.value
                self._analyze_incident(payload)
                
            consumer.close()
        except Exception as e:
            logger.error(f"Root Cause Analysis Consumer encountered an error: {e}")

    def stop(self):
        """Signals the background polling loop to stop."""
        logger.info("Stopping Root Cause Analysis Consumer...")
        self._stop_event.set()
        if self.consumer_thread:
            self.consumer_thread.join(timeout=5)

    def _analyze_incident(self, incident: dict):
        """Applies heuristic rules to determine the root cause."""
        incident_id = incident.get("incident_id", "unknown-id")
        service = incident.get("service", "unknown-service")
        anomaly_type = incident.get("type", "UNKNOWN")
        
        # Rule-based classification
        root_cause, confidence = self._determine_root_cause(anomaly_type)
        
        timestamp = datetime.utcnow().isoformat() + "Z"
        
        analyzed_incident = AnalyzedIncident(
            incident_id=incident_id,
            service=service,
            type=anomaly_type,
            root_cause=root_cause,
            confidence=confidence,
            timestamp=timestamp
        )
        
        logger.info(f"Analyzed Incident {incident_id}: {root_cause} (Confidence: {confidence})")
        
        # Publish enriched result
        self.analyzed_producer.publish_analyzed_incident(analyzed_incident.dict())

    def _determine_root_cause(self, anomaly_type: str) -> tuple[str, float]:
        """Map anomaly type to a probable root cause and confidence score."""
        if anomaly_type == "HIGH_CPU":
            return "Resource saturation", 0.85
        elif anomaly_type == "HIGH_LATENCY":
            return "Slow downstream dependency", 0.80
        elif anomaly_type == "HIGH_ERROR_RATE":
            return "Service instability", 0.90
        elif anomaly_type == "ERROR_LOG":
            return "Application exception", 0.95
        
        return "Unknown underlying issue", 0.50
