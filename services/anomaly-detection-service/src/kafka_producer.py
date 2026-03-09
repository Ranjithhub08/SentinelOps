import json
import logging
from kafka import KafkaProducer
from typing import Dict, Any

logger = logging.getLogger(__name__)

class AnomalyProducer:
    def __init__(self, bootstrap_servers: str, topic: str):
        self.bootstrap_servers = bootstrap_servers
        self.topic = topic
        try:
            self.producer = KafkaProducer(
                bootstrap_servers=self.bootstrap_servers,
                value_serializer=lambda v: json.dumps(v).encode('utf-8'),
                api_version=(0, 10, 1)
            )
            logger.info(f"Connected to Kafka at {self.bootstrap_servers}")
        except Exception as e:
            logger.error(f"Failed to connect to Kafka for Anomaly Producer: {str(e)}")
            self.producer = None

    def publish_anomaly(self, anomaly_event: Dict[Any, Any]) -> bool:
        if not self.producer:
            logger.warning("Kafka producer not initialized. Cannot publish anomaly.")
            return False
            
        try:
            # Publish anomaly asynchronously
            future = self.producer.send(self.topic, value=anomaly_event)
            record_metadata = future.get(timeout=10)
            logger.debug(f"Anomaly published to {record_metadata.topic} partition {record_metadata.partition} offset {record_metadata.offset}")
            return True
        except Exception as e:
            logger.error(f"Failed to publish anomaly to Kafka topic {self.topic}: {str(e)}")
            return False

    def close(self):
        if self.producer:
            self.producer.close()
            logger.info("Kafka Anomaly Producer closed.")
