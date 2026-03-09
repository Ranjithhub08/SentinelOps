import os
import logging
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

from .schemas import LogEntry
from .kafka_producer import LoggerProducer

# Setup basic logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

KAFKA_BOOTSTRAP_SERVERS = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092")
KAFKA_TOPIC = os.getenv("KAFKA_TOPIC", "logs.raw")

app = FastAPI(
    title="Log Ingestion Service",
    description="SentinelOps microservice for receiving and publishing logs to Kafka",
    version="1.0.0"
)

# Initialize Kafka Producer
kafka_producer = LoggerProducer(bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS, topic=KAFKA_TOPIC)

@app.on_event("shutdown")
def shutdown_event():
    logger.info("Shutting down Log Ingestion Service...")
    kafka_producer.close()

@app.get("/health")
async def health_check():
    """Simple health check endpoint."""
    return {"status": "healthy", "service": "log-ingestion-service"}

@app.post("/logs", status_code=202)
async def ingest_log(log_entry: LogEntry):
    """
    Ingest a single log entry and publish it to the Kafka topic.
    """
    logger.debug(f"Received log entry: {log_entry.dict()}")
    
    # Publish to Kafka
    success = kafka_producer.publish_log(log_entry.dict())
    
    if not success:
        # If Kafka is completely unreachable we could return a 503, 
        # but often ingestion services prefer to fail open or buffer. 
        # For simplicity here, we return a 500.
        raise HTTPException(status_code=500, detail="Failed to publish log to message broker.")
    
    return {"status": "accepted", "message": "Log entry queued for processing."}

# Allow handling of raw JSON if we wanted to batch things later,
# but for now we enforce the Pydantic schema validation.
