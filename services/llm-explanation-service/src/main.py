import os
import logging
from fastapi import FastAPI
from dotenv import load_dotenv

from schemas import ExplainedIncident
from kafka_producer import ExplainedIncidentProducer
from kafka_consumer import AnalyzedIncidentConsumer

# Setup basic logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

KAFKA_BOOTSTRAP_SERVERS = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092")
ANALYZED_TOPIC = os.getenv("ANALYZED_TOPIC", "incidents.analyzed")
EXPLAINED_TOPIC = os.getenv("EXPLAINED_TOPIC", "incidents.explained")

app = FastAPI(
    title="LLM Explanation Service",
    description="SentinelOps AI service for translating technical root causes into human-readable action plans.",
    version="1.0.0"
)

# Global configurations
explained_producer = None
analyzed_consumer = None

@app.on_event("startup")
def startup_event():
    global explained_producer, analyzed_consumer
    logger.info("Initializing LLM Explanation Service...")
    
    # Initialize the producer (for the final explained text)
    explained_producer = ExplainedIncidentProducer(
        bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS, 
        topic=EXPLAINED_TOPIC
    )
    
    # Initialize the consumer (listening for RCA incidents)
    analyzed_consumer = AnalyzedIncidentConsumer(
        bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
        analyzed_topic=ANALYZED_TOPIC,
        explained_producer=explained_producer
    )
    
    # Start consuming analyzed incidents in the background
    analyzed_consumer.start()

@app.on_event("shutdown")
def shutdown_event():
    global explained_producer, analyzed_consumer
    logger.info("Shutting down LLM Explanation Service...")
    
    if analyzed_consumer:
        analyzed_consumer.stop()
        
    if explained_producer:
        explained_producer.close()

@app.get("/health")
async def health_check():
    """Simple health check endpoint."""
    return {"status": "healthy", "service": "llm-explanation-service"}
