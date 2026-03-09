import json
import logging
from kafka import KafkaProducer
from typing import Dict, Any

logger = logging.getLogger(__name__)

class ExplainedIncidentProducer:
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
            logger.error(f"Failed to connect to Kafka for Explained Incident Producer: {str(e)}")
            self.producer = None

    def publish_explained_incident(self, explained_event: Dict[Any, Any]) -> bool:
        if not self.producer:
            logger.warning("Kafka producer not initialized. Cannot publish explained incident.")
            return False
            
        try:
            future = self.producer.send(self.topic, value=explained_event)
            record_metadata = future.get(timeout=10)
            logger.debug(f"Explained incident published to {record_metadata.topic} partition {record_metadata.partition} offset {record_metadata.offset}")
            return True
        except Exception as e:
            logger.error(f"Failed to publish explained incident to Kafka topic {self.topic}: {str(e)}")
            return False

    def close(self):
        if self.producer:
            self.producer.close()
            logger.info("Kafka Explained Incident Producer closed.")
