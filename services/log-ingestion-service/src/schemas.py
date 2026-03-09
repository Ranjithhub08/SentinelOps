from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class LogEntry(BaseModel):
    service: str = Field(..., description="Name of the service emitting the log")
    level: str = Field(..., description="Log level (e.g., INFO, WARN, ERROR)")
    message: str = Field(..., description="The actual log message")
    timestamp: datetime = Field(..., description="Timestamp of the log event in ISO 8601 format")
    context: Optional[dict] = Field(default=None, description="Optional structural context (e.g., trace_id, user_id)")
