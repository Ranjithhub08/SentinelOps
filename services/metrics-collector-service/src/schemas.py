from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class MetricsEntry(BaseModel):
    service: str = Field(..., description="Name of the service emitting the metrics")
    cpu_usage: float = Field(..., description="CPU usage percentage")
    memory_usage: float = Field(..., description="Memory usage percentage or absolute value based on convention")
    latency_ms: float = Field(..., description="Average latency in milliseconds")
    error_rate: float = Field(..., description="Error rate as a percentage or fraction")
    timestamp: datetime = Field(..., description="Timestamp of the metrics event in ISO 8601 format")
    context: Optional[dict] = Field(default=None, description="Optional extra context dimensions (e.g., node_id, region)")
