from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class IncidentEvent(BaseModel):
    incident_id: str = Field(..., description="Unique identifier for the incident")
    service: str = Field(..., description="Name of the affected service")
    type: str = Field(..., description="Root anomaly type causing the incident")
    severity: str = Field(..., description="Severity level: CRITICAL, HIGH, MEDIUM, LOW")
    status: str = Field(..., description="Current status: OPEN, IN_PROGRESS, RESOLVED")
    timestamp: datetime = Field(..., description="Timestamp of incident creation in ISO 8601 format")
    context: Optional[dict] = Field(default=None, description="Additional properties or context regarding the source anomaly")
    root_cause: Optional[str] = Field(default=None, description="AI-identified root cause")
    explanation: Optional[str] = Field(default=None, description="Human-readable AI explanation")
    suggested_action: Optional[str] = Field(default=None, description="Recommended remediation action")
