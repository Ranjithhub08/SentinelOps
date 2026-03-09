import os
import logging
from fastapi import FastAPI
from dotenv import load_dotenv

from .schemas import AlertEvent
from .kafka_producer import AlertProducer
from .kafka_consumer import ExplainedIncidentConsumer

# Setup basic logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Kafka configuration
KAFKA_BOOTSTRAP_SERVERS = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092")
EXPLAINED_TOPIC = os.getenv("EXPLAINED_TOPIC", "incidents.explained")
ALERTS_TOPIC = os.getenv("ALERTS_TOPIC", "alerts.triggered")

# Alerts Configuration
SLACK_WEBHOOK_URL = os.getenv("SLACK_WEBHOOK_URL", "")
SMTP_SERVER = os.getenv("SMTP_SERVER", "")
ALERT_EMAIL = os.getenv("ALERT_EMAIL", "")

app = FastAPI(
    title="Alert Service",
    description="SentinelOps notification dispatcher supporting Slack, Email, and Kafka audit trails.",
    version="1.0.0"
)

# Global configurations
alert_producer = None
explained_consumer = None

@app.on_event("startup")
def startup_event():
    global alert_producer, explained_consumer
    logger.info("Initializing Alert Service...")
    
    if not SLACK_WEBHOOK_URL:
        logger.warning("SLACK_WEBHOOK_URL is missing. Slack alerts will be skipped.")
    if not SMTP_SERVER or not ALERT_EMAIL:
        logger.warning("SMTP_SERVER or ALERT_EMAIL is missing. Email alerts will be skipped.")
    
    # Initialize the producer (for logging triggered alerts back to the bus)
    alert_producer = AlertProducer(
        bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS, 
        topic=ALERTS_TOPIC
    )
    
    # Initialize the consumer (listening for LLM explanations)
    explained_consumer = ExplainedIncidentConsumer(
        bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
        explained_topic=EXPLAINED_TOPIC,
        alert_producer=alert_producer,
        slack_webhook_url=SLACK_WEBHOOK_URL,
        smtp_server=SMTP_SERVER,
        alert_email=ALERT_EMAIL
    )
    
    # Start consuming explained incidents in the background
    explained_consumer.start()

@app.on_event("shutdown")
def shutdown_event():
    global alert_producer, explained_consumer
    logger.info("Shutting down Alert Service...")
    
    if explained_consumer:
        explained_consumer.stop()
        
    if alert_producer:
        alert_producer.close()

@app.get("/health")
async def health_check():
    """Simple health check endpoint."""
    return {"status": "healthy", "service": "alert-service"}
