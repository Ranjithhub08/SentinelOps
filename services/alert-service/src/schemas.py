from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class AlertEvent(BaseModel):
    incident_id: str = Field(..., description="Unique identifier for the incident")
    formatted_message: str = Field(..., description="The fully formatted message ready for delivery")
    channels: list[str] = Field(..., description="List of channels the alert was sent to (e.g., ['slack', 'email'])")
    timestamp: datetime = Field(..., description="Timestamp of the alert in ISO 8601 format")
