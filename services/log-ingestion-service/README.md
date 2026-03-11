# Log Ingestion Service

## Service Purpose
The **Log Ingestion Service** is the primary entry point for all log telemetry in the SentinelOps ecosystem. It provides a robust REST API for external applications and infrastructure to push logs, ensuring that data is validated and standardized before it enters the event-driven pipeline.

## Pipeline Position
**Stage**: 1 (Ingestion)
- **Role**: Frontline Data Collector
- **Input**: External REST POST Requests
- **Output**: Standardized Kafka Events

## Kafka Topics
- **Produced**: `logs.raw` (Standardized, schema-validated JSON logs)
- **Consumed**: None (Source Service)

## Integration
Applications should POST log payloads to `/logs`. The service performs basic format validation and timestamp normalization before buffering the log into Kafka for downstream analysis.
