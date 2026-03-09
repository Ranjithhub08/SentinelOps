from pydantic import BaseModel, Field
from datetime import datetime
from typing import Any, Union

class AnomalyEvent(BaseModel):
    service: str = Field(..., description="Name of the service where the anomaly occurred")
    type: str = Field(..., description="Type of anomaly (e.g., HIGH_CPU, HIGH_LATENCY, HIGH_ERROR_RATE, ERROR_LOG)")
    value: Union[float, str] = Field(..., description="The value that triggered the anomaly (e.g., metric value or log message)")
    timestamp: datetime = Field(..., description="Timestamp of the anomaly in ISO 8601 format")
