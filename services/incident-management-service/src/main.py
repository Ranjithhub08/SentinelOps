import os
import logging
from typing import Dict, List
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from .schemas import IncidentEvent
from .kafka_producer import IncidentProducer
from .kafka_consumer import AnomalyConsumer

# Setup basic logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

KAFKA_BOOTSTRAP_SERVERS = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092")
ANOMALIES_TOPIC = os.getenv("ANOMALIES_TOPIC", "anomalies.detected")
INCIDENTS_TOPIC = os.getenv("INCIDENTS_TOPIC", "incidents.created")

app = FastAPI(
    title="Incident Management Service",
    description="SentinelOps core incident routing and management service.",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For demo purposes, allow all. Could be ["http://localhost:3000", "http://localhost:3002"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-Memory Store
incident_store: Dict[str, IncidentEvent] = {}

# Global configurations
incident_producer = None
anomaly_consumer = None

@app.on_event("startup")
def startup_event():
    global incident_producer, anomaly_consumer
    logger.info("Initializing Incident Management Service...")
    
    # Initialize the producer (for outgoing incident events)
    incident_producer = IncidentProducer(
        bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS, 
        topic=INCIDENTS_TOPIC
    )
    
    # Initialize the consumer (listening for anomalies)
    anomaly_consumer = AnomalyConsumer(
        bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
        anomaly_topic=ANOMALIES_TOPIC,
        incident_producer=incident_producer,
        incident_store=incident_store
    )
    
    # Start consuming anomalies in the background
    anomaly_consumer.start()

@app.on_event("shutdown")
def shutdown_event():
    global incident_producer, anomaly_consumer
    logger.info("Shutting down Incident Management Service...")
    
    if anomaly_consumer:
        anomaly_consumer.stop()
        
    if incident_producer:
        incident_producer.close()

@app.get("/health")
async def health_check():
    """Simple health check endpoint."""
    return {"status": "healthy", "service": "incident-management-service"}

@app.get("/incidents", response_model=List[IncidentEvent])
async def get_all_incidents():
    """
    Retrieve all tracked active incidents from the in-memory store.
    """
    return list(incident_store.values())

@app.get("/incidents/{incident_id}", response_model=IncidentEvent)
async def get_incident(incident_id: str):
    """
    Retrieve a specific incident by ID.
    """
    incident = incident_store.get(incident_id)
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    return incident
