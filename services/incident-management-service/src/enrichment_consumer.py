import json
import logging
import threading
from typing import Optional, Dict
from kafka import KafkaConsumer

from schemas import IncidentEvent

import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../configs")))
try:
    import store_client
except ImportError:
    pass

logger = logging.getLogger(__name__)

class EnrichmentConsumer:
    def __init__(self, bootstrap_servers: str, analyzed_topic: str, explained_topic: str, incident_store: Dict[str, IncidentEvent]):
        self.bootstrap_servers = bootstrap_servers
        self.analyzed_topic = analyzed_topic
        self.explained_topic = explained_topic
        self.incident_store = incident_store
        self._stop_event = threading.Event()
        self.consumer_thread: Optional[threading.Thread] = None

    def start(self):
        """Starts the Kafka consumer loop in a background thread."""
        logger.info(f"Starting Enrichment Consumer on topics: {self.analyzed_topic}, {self.explained_topic}")
        self.consumer_thread = threading.Thread(target=self._consume_loop, daemon=True)
        self.consumer_thread.start()

    def _consume_loop(self):
        try:
            consumer = KafkaConsumer(
                self.analyzed_topic,
                self.explained_topic,
                bootstrap_servers=self.bootstrap_servers,
                group_id='incident_enrichment_group',
                value_deserializer=lambda m: json.loads(m.decode('utf-8')),
                auto_offset_reset='latest',
                api_version=(0, 10, 1)
            )
            logger.info("Enrichment Consumer successfully connected to Kafka.")
            
            for message in consumer:
                if self._stop_event.is_set():
                    break
                
                payload = message.value
                topic = message.topic
                self._process_enrichment(topic, payload)
                
            consumer.close()
        except Exception as e:
            logger.error(f"Enrichment Consumer encountered an error: {e}")

    def stop(self):
        """Signals the background polling loop to stop."""
        logger.info("Stopping Enrichment Consumer...")
        self._stop_event.set()
        if self.consumer_thread:
            self.consumer_thread.join(timeout=5)

    def _process_enrichment(self, topic: str, payload: dict):
        """Updates the incident store with enriched data."""
        incident_id = payload.get("incident_id")
        if not incident_id:
            return

        incident = self.incident_store.get(incident_id)
        if not incident:
            logger.warning(f"Received enrichment for unknown incident: {incident_id}")
            return

        if topic == self.analyzed_topic:
            incident.root_cause = payload.get("root_cause")
            logger.info(f"Enriched incident {incident_id} with root cause: {incident.root_cause}")
        elif topic == self.explained_topic:
            incident.explanation = payload.get("explanation")
            incident.suggested_action = payload.get("suggested_action")
            logger.info(f"Enriched incident {incident_id} with AI explanation.")
        
        # PERSIST TO SHARED STORE
        try:
            store_client.update_store("incidents", json.loads(incident.json()))
        except NameError:
            pass
