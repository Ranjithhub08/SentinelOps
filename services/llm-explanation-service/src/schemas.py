from pydantic import BaseModel, Field

class ExplainedIncident(BaseModel):
    incident_id: str = Field(..., description="Unique identifier for the incident")
    explanation: str = Field(..., description="Natural language explanation of the incident")
    suggested_action: str = Field(..., description="Recommended remediation action for the incident")
