from pydantic import BaseModel, Field
from datetime import datetime

class AnalyzedIncident(BaseModel):
    incident_id: str = Field(..., description="Unique identifier for the incident")
    service: str = Field(..., description="Name of the affected service")
    type: str = Field(..., description="Root anomaly type causing the incident")
    root_cause: str = Field(..., description="Probable root cause identified by analysis")
    confidence: float = Field(..., description="Confidence score of the root cause identification (0.0 to 1.0)")
    timestamp: datetime = Field(..., description="Timestamp of the analysis in ISO 8601 format")
