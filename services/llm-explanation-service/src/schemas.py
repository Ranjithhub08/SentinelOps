from pydantic import BaseModel, Field

class ExplainedIncident(BaseModel):
    incident_id: str = Field(..., description="Unique identifier for the incident")
    service: str = Field(..., description="Service name")
    root_cause: str = Field(..., description="Identified root cause")
    type: str = Field(..., description="Anomaly type")
    explanation: str = Field(..., description="Natural language explanation of the incident")
    suggested_action: str = Field(..., description="Recommended remediation action for the incident")
