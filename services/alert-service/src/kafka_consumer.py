import json
import logging
import threading
import requests
import sys
import os
from datetime import datetime
from typing import Optional
from kafka import KafkaConsumer

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../configs")))
try:
    import store_client
except ImportError:
    pass

from schemas import AlertEvent
from kafka_producer import AlertProducer

logger = logging.getLogger(__name__)

class ExplainedIncidentConsumer:
    def __init__(self, bootstrap_servers: str, explained_topic: str, alert_producer: AlertProducer,
                 slack_webhook_url: str, smtp_server: str, alert_email: str):
        self.bootstrap_servers = bootstrap_servers
        self.explained_topic = explained_topic
        self.alert_producer = alert_producer
        self.slack_webhook_url = slack_webhook_url
        self.smtp_server = smtp_server
        self.alert_email = alert_email
        self._stop_event = threading.Event()
        self.consumer_thread: Optional[threading.Thread] = None

    def start(self):
        """Starts the Kafka consumer loop in a background thread."""
        logger.info(f"Starting Explained Incident Consumer on topic: {self.explained_topic}")
        self.consumer_thread = threading.Thread(target=self._consume_loop, daemon=True)
        self.consumer_thread.start()

    def _consume_loop(self):
        try:
            consumer = KafkaConsumer(
                self.explained_topic,
                bootstrap_servers=self.bootstrap_servers,
                group_id='alert_service_group',
                value_deserializer=lambda m: json.loads(m.decode('utf-8')),
                auto_offset_reset='latest',
                api_version=(0, 10, 1)
            )
            logger.info("Alert Consumer successfully connected to Kafka.")
            
            for message in consumer:
                if self._stop_event.is_set():
                    break
                
                payload = message.value
                self._process_and_alert(payload)
                
            consumer.close()
        except Exception as e:
            logger.error(f"Alert Consumer encountered an error: {e}")

    def stop(self):
        """Signals the background polling loop to stop."""
        logger.info("Stopping Alert Consumer...")
        self._stop_event.set()
        if self.consumer_thread:
            self.consumer_thread.join(timeout=5)

    def _process_and_alert(self, explained_incident: dict):
        """Formats the incident and dispatches alerts."""
        
        # 1. Extract context, relying on expected upstream structures
        incident_id = explained_incident.get("incident_id", "unknown-id")
        
        # NOTE: To perfectly match the requested output, we need 'service' and 'root_cause'.
        # Assuming the LLM payload passed those along, or we provide default fallbacks
        service = explained_incident.get("service", "unknown-service")
        root_cause = explained_incident.get("root_cause", "Unknown Root Cause")
        
        explanation = explained_incident.get("explanation", "No explanation available.")
        action = explained_incident.get("suggested_action", "No action suggested.")

        # 2. Format Message
        message = (
            f"🚨 *Incident Detected*\\n"
            f"Service: {service}\\n"
            f"Root Cause: {root_cause}\\n\\n"
            f"*Explanation:*\\n"
            f"{explanation}\\n\\n"
            f"*Suggested Action:*\\n"
            f"{action}"
        )

        channels_sent = []

        # 3. Dispatch to Slack
        if self._send_slack_alert(message):
            channels_sent.append("slack")

        # 4. Dispatch to Email
        if self._send_email_alert(message):
            channels_sent.append("email")

        # 5. Publish Audit Event to Kafka
        timestamp = datetime.utcnow().isoformat() + "Z"
        alert_event = AlertEvent(
            incident_id=incident_id,
            formatted_message=message,
            channels=channels_sent,
            timestamp=timestamp
        )
        
        logger.info(f"Alerted for incident {incident_id} to channels: {channels_sent}")
        print(f"[Alert Service] Triggered alert for {incident_id} on {channels_sent}")
        try:
            store_client.update_store("alerts", alert_event.dict())
        except NameError:
            pass
        self.alert_producer.publish_alert(alert_event.dict())

    def _send_slack_alert(self, formatted_message: str) -> bool:
        if not self.slack_webhook_url:
            logger.debug("Slack webhook URL not configured. Skipping Slack alert.")
            return False
            
        try:
            payload = {"text": formatted_message}
            # For local testing, this will fail gracefully if it's a dummy URL
            response = requests.post(self.slack_webhook_url, json=payload, timeout=5)
            if response.status_code == 200:
                logger.debug("Successfully sent Slack alert.")
                return True
            else:
                logger.warning(f"Failed to send Slack alert. Status code: {response.status_code}")
        except Exception as e:
            logger.error(f"Exception sending Slack alert: {e}")
        return False

    def _send_email_alert(self, formatted_message: str) -> bool:
        if not self.smtp_server or not self.alert_email:
            logger.debug("SMTP variables not fully configured. Skipping Email alert.")
            return False
            
        # Placeholder for actual SMTP implementation (e.g. smtplib.SMTP)
        logger.info(f"[PLACEHOLDER] Emulating Email dispatch via {self.smtp_server} to {self.alert_email}")
        return True
