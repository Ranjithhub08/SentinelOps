import os
import logging
from fastapi import FastAPI, HTTPException
from dotenv import load_dotenv

from schemas import MetricsEntry
from kafka_producer import MetricsProducer

# Setup basic logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

KAFKA_BOOTSTRAP_SERVERS = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092")
KAFKA_TOPIC = os.getenv("KAFKA_TOPIC", "metrics.raw")

app = FastAPI(
    title="Metrics Collector Service",
    description="SentinelOps microservice for receiving and publishing system/application metrics to Kafka",
    version="1.0.0"
)

# Initialize Kafka Producer
kafka_producer = MetricsProducer(bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS, topic=KAFKA_TOPIC)

@app.on_event("shutdown")
def shutdown_event():
    logger.info("Shutting down Metrics Collector Service...")
    kafka_producer.close()

@app.get("/health")
async def health_check():
    """Simple health check endpoint."""
    return {"status": "healthy", "service": "metrics-collector-service"}

@app.post("/metrics", status_code=202)
async def ingest_metrics(metrics_entry: MetricsEntry):
    """
    Ingest a metrics payload and publish it to the Kafka topic.
    """
    logger.debug(f"Received metrics entry: {metrics_entry.dict()}")
    
    # Publish to Kafka
    success = kafka_producer.publish_metrics(metrics_entry.dict())
    
    if not success:
        raise HTTPException(status_code=500, detail="Failed to publish metrics to message broker.")
    
    return {"status": "accepted", "message": "Metrics entry queued for processing."}
