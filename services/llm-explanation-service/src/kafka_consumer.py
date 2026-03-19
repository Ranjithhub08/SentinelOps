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

from schemas import ExplainedIncident
from kafka_producer import ExplainedIncidentProducer

logger = logging.getLogger(__name__)

class AnalyzedIncidentConsumer:
    def __init__(self, bootstrap_servers: str, analyzed_topic: str, explained_producer: ExplainedIncidentProducer):
        self.bootstrap_servers = bootstrap_servers
        self.analyzed_topic = analyzed_topic
        self.explained_producer = explained_producer
        self._stop_event = threading.Event()
        self.consumer_thread: Optional[threading.Thread] = None

    def start(self):
        """Starts the Kafka consumer loop in a background thread."""
        logger.info(f"Starting Analyzed Incident Consumer on topic: {self.analyzed_topic}")
        self.consumer_thread = threading.Thread(target=self._consume_loop, daemon=True)
        self.consumer_thread.start()

    def _consume_loop(self):
        try:
            consumer = KafkaConsumer(
                self.analyzed_topic,
                bootstrap_servers=self.bootstrap_servers,
                group_id='llm_explanation_group',
                value_deserializer=lambda m: json.loads(m.decode('utf-8')),
                auto_offset_reset='latest',
                api_version=(0, 10, 1)
            )
            logger.info("LLM Explanation Consumer successfully connected to Kafka.")
            
            for message in consumer:
                if self._stop_event.is_set():
                    break
                
                payload = message.value
                self._generate_explanation(payload)
                
            consumer.close()
        except Exception as e:
            logger.error(f"LLM Explanation Consumer encountered an error: {e}")

    def stop(self):
        """Signals the background polling loop to stop."""
        logger.info("Stopping LLM Explanation Consumer...")
        self._stop_event.set()
        if self.consumer_thread:
            self.consumer_thread.join(timeout=5)

    def _generate_explanation(self, analyzed_incident: dict):
        """Generates a natural language explanation using simple templates."""
        incident_id = analyzed_incident.get("incident_id", "unknown-id")
        service = analyzed_incident.get("service", "unknown-service")
        anomaly_type = analyzed_incident.get("type", "UNKNOWN")
        root_cause = analyzed_incident.get("root_cause", "Unknown cause")
        
        # Simple template-based natural language generation
        explanation, action = self._apply_template(service, anomaly_type, root_cause)
        
        explained_incident = ExplainedIncident(
            incident_id=incident_id,
            service=service,
            root_cause=root_cause,
            type=anomaly_type,
            explanation=explanation,
            suggested_action=action
        )
        
        logger.info(f"Generated explanation for Incident {incident_id}")
        print(f"[Explanation Service] Generated explanation for {incident_id}")
        
        # Save to store
        base_dict = explained_incident.dict()
        base_dict["service"] = service
        base_dict["root_cause"] = root_cause
        base_dict["type"] = anomaly_type
        
        try:
            store_client.update_store("explanations", base_dict)
        except NameError:
            pass
            
        # Publish enriched result
        self.explained_producer.publish_explained_incident(explained_incident.dict())

    def _apply_template(self, service: str, anomaly_type: str, root_cause: str) -> tuple[str, str]:
        """Returns (explanation, suggested_action) based on the input features."""
        
        if anomaly_type == "HIGH_CPU":
            explanation = f"CPU usage exceeded safe limits on {service}, indicating {root_cause.lower()}."
            action = "Consider scaling the service horizontally or optimizing resource-intensive operations."
            
        elif anomaly_type == "HIGH_LATENCY":
            explanation = f"Response times on {service} have spiked significantly, likely due to a {root_cause.lower()}."
            action = "Investigate downstream database queries or external API dependencies for bottlenecks."
            
        elif anomaly_type == "HIGH_ERROR_RATE":
            explanation = f"An abnormally high number of requests to {service} are failing, pointing towards {root_cause.lower()}."
            action = "Review recent deployments or configuration changes. Check the application logs for stack traces."
            
        elif anomaly_type == "ERROR_LOG":
            explanation = f"Critical {root_cause.lower()}s were detected in the log stream for {service}."
            action = "Inspect the specific log messages to identify the exact code path causing the exception."
            
        else:
            explanation = f"An unknown anomaly occurred on {service}."
            action = "Manual investigation required by the operations team."
            
        return explanation, action
