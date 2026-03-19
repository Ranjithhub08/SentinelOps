import os
import logging
from fastapi import FastAPI
from dotenv import load_dotenv

from kafka_producer import AnomalyProducer
from kafka_consumer import AnomalyConsumer

# Setup basic logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

KAFKA_BOOTSTRAP_SERVERS = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092")
LOGS_TOPIC = os.getenv("LOGS_TOPIC", "logs.raw")
METRICS_TOPIC = os.getenv("METRICS_TOPIC", "metrics.raw")
ANOMALIES_TOPIC = os.getenv("ANOMALIES_TOPIC", "anomalies.detected")

app = FastAPI(
    title="Anomaly Detection Service",
    description="SentinelOps AI/Heuristics component for detecting anomalies in logs and metrics",
    version="1.0.0"
)

# Global variables for background services
anomaly_producer = None
anomaly_consumer = None

@app.on_event("startup")
def startup_event():
    global anomaly_producer, anomaly_consumer
    logger.info("Initializing Anomaly Detection Service...")
    
    # Initialize the producer (for outgoing anomaly events)
    anomaly_producer = AnomalyProducer(
        bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS, 
        topic=ANOMALIES_TOPIC
    )
    
    # Initialize the consumer (subscribing to logs and metrics)
    anomaly_consumer = AnomalyConsumer(
        bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
        logs_topic=LOGS_TOPIC,
        metrics_topic=METRICS_TOPIC,
        anomaly_producer=anomaly_producer
    )
    
    # Start consuming in the background
    anomaly_consumer.start()

@app.on_event("shutdown")
def shutdown_event():
    global anomaly_producer, anomaly_consumer
    logger.info("Shutting down Anomaly Detection Service...")
    
    if anomaly_consumer:
        anomaly_consumer.stop()
        
    if anomaly_producer:
        anomaly_producer.close()

@app.get("/health")
async def health_check():
    """Simple health check endpoint."""
    return {"status": "healthy", "service": "anomaly-detection-service"}
