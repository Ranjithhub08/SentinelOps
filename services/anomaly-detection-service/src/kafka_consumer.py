import json
import logging
import threading
import sys
import os
from typing import Optional
from kafka import KafkaConsumer

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../configs")))
try:
    import store_client
except ImportError:
    pass

from schemas import AnomalyEvent
from kafka_producer import AnomalyProducer

logger = logging.getLogger(__name__)

class AnomalyConsumer:
    def __init__(self, bootstrap_servers: str, logs_topic: str, metrics_topic: str, anomaly_producer: AnomalyProducer):
        self.bootstrap_servers = bootstrap_servers
        self.topics = [logs_topic, metrics_topic]
        self.anomaly_producer = anomaly_producer
        self._stop_event = threading.Event()
        self.consumer_thread: Optional[threading.Thread] = None

    def start(self):
        """Starts the Kafka consumer loop in a valid background thread."""
        logger.info(f"Starting Anomaly Consumer for topics: {self.topics}")
        self.consumer_thread = threading.Thread(target=self._consume_loop, daemon=True)
        self.consumer_thread.start()

    def _consume_loop(self):
        try:
            consumer = KafkaConsumer(
                *self.topics,
                bootstrap_servers=self.bootstrap_servers,
                group_id='anomaly_detection_group',
                value_deserializer=lambda m: json.loads(m.decode('utf-8')),
                auto_offset_reset='latest',
                api_version=(0, 10, 1)
            )
            logger.info("Anomaly Consumer successfully connected to Kafka and started polling.")
            
            for message in consumer:
                if self._stop_event.is_set():
                    break
                
                payload = message.value
                topic = message.topic
                
                # Route the message to the appropriate heuristic checker
                if topic == "logs.raw":
                    self._process_log(payload)
                elif topic == "metrics.raw":
                    self._process_metric(payload)
                
            consumer.close()
        except Exception as e:
            logger.error(f"Anomaly Consumer encountered an error: {e}")

    def stop(self):
        """Signals the background polling loop to stop."""
        logger.info("Stopping Anomaly Consumer...")
        self._stop_event.set()
        if self.consumer_thread:
            self.consumer_thread.join(timeout=5)

    def _process_log(self, log_entry: dict):
        """Heuristic check for logs."""
        level = log_entry.get("level", "").upper()
        
        # Rule: Detect ERROR level logs
        if level == "ERROR":
            self._trigger_anomaly(
                service=log_entry.get("service", "unknown-service"),
                anomaly_type="ERROR_LOG",
                value=log_entry.get("message", "Unknown error"),
                timestamp=log_entry.get("timestamp")
            )

    def _process_metric(self, metric_entry: dict):
        """Heuristic check for metrics."""
        service = metric_entry.get("service", "unknown-service")
        timestamp = metric_entry.get("timestamp")
        
        cpu_usage = metric_entry.get("cpu_usage")
        latency_ms = metric_entry.get("latency_ms")
        error_rate = metric_entry.get("error_rate")
        
        # Rule: Detect high CPU (> 90%)
        if cpu_usage is not None and cpu_usage > 90:
            self._trigger_anomaly(service, "HIGH_CPU", cpu_usage, timestamp)
            
        # Rule: Detect high latency (> 1000 ms)
        if latency_ms is not None and latency_ms > 1000:
            self._trigger_anomaly(service, "HIGH_LATENCY", latency_ms, timestamp)
            
        # Rule: Detect high error rate (> 0.1)
        if error_rate is not None and error_rate > 0.1:
            self._trigger_anomaly(service, "HIGH_ERROR_RATE", error_rate, timestamp)

    def _trigger_anomaly(self, service: str, anomaly_type: str, value: any, timestamp: str):
        """Constructs and publishes the anomaly event."""
        # Using the Pydantic schema for validation ensures consistency
        from datetime import datetime
        if not timestamp:
            timestamp = datetime.utcnow().isoformat() + "Z"
            
        anomaly = AnomalyEvent(
            service=service,
            type=anomaly_type,
            value=value,
            timestamp=timestamp
        )
        
        logger.warning(f"ANOMALY DETECTED: {anomaly_type} in {service} (Value: {value})")
        print(f"[Anomaly Service] Detected {anomaly_type} in {service}")
        try:
            store_client.update_store("anomalies", anomaly.dict())
        except NameError:
            pass
        self.anomaly_producer.publish_anomaly(anomaly.dict())
