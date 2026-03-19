import os
import logging
from fastapi import FastAPI
from dotenv import load_dotenv

from schemas import AnalyzedIncident
from kafka_producer import AnalyzedIncidentProducer
from kafka_consumer import IncidentConsumer

# Setup basic logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

KAFKA_BOOTSTRAP_SERVERS = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092")
INCIDENTS_TOPIC = os.getenv("INCIDENTS_TOPIC", "incidents.created")
ANALYZED_TOPIC = os.getenv("ANALYZED_TOPIC", "incidents.analyzed")

app = FastAPI(
    title="Root Cause Analysis Service",
    description="SentinelOps intelligent service for automatically diagnosing incidents.",
    version="1.0.0"
)

# Global configurations
analyzed_producer = None
incident_consumer = None

@app.on_event("startup")
def startup_event():
    global analyzed_producer, incident_consumer
    logger.info("Initializing Root Cause Analysis Service...")
    
    # Initialize the producer (for enriched, analyzed incidents)
    analyzed_producer = AnalyzedIncidentProducer(
        bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS, 
        topic=ANALYZED_TOPIC
    )
    
    # Initialize the consumer (listening for raw incidents)
    incident_consumer = IncidentConsumer(
        bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
        incident_topic=INCIDENTS_TOPIC,
        analyzed_producer=analyzed_producer
    )
    
    # Start consuming incidents in the background
    incident_consumer.start()

@app.on_event("shutdown")
def shutdown_event():
    global analyzed_producer, incident_consumer
    logger.info("Shutting down Root Cause Analysis Service...")
    
    if incident_consumer:
        incident_consumer.stop()
        
    if analyzed_producer:
        analyzed_producer.close()

@app.get("/health")
async def health_check():
    """Simple health check endpoint."""
    return {"status": "healthy", "service": "root-cause-analysis-service"}
