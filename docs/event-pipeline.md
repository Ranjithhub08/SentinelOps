# Event Pipeline

SentinelOps treats data as a continual stream. This document outlines the progression of an event across the Kafka topics from raw initiation to final resolution alerting.

## Event Stages

### Stage 1: Raw Telemetry
- **Topic**: `logs.raw` / `metrics.raw`
- **Producer**: `log-ingestion-service` / `metrics-collector-service`
- **Consumer**: `anomaly-detection-service`
- **Data Shape**: Base primitives (latency numbers, CPU percentages, text log dumps).

### Stage 2: Anomaly Detection
- **Topic**: `anomalies.detected`
- **Producer**: `anomaly-detection-service`
- **Consumer**: `incident-management-service`
- **Data Shape**: A flagged property type (e.g., `HIGH_CPU`) and the numeric/textual trigger value.

### Stage 3: Incident Creation
- **Topic**: `incidents.created`
- **Producer**: `incident-management-service`
- **Consumer**: `root-cause-analysis-service`
- **Data Shape**: A categorized event object with a unique UUID, designated severity mapping, and active system status (`OPEN`).

### Stage 4: Root Cause Enrichment
- **Topic**: `incidents.analyzed`
- **Producer**: `root-cause-analysis-service`
- **Consumer**: `llm-explanation-service`
- **Data Shape**: The Incident object appended with a specific system diagnosis (`root_cause`) and a probabilistic confidence score.

### Stage 5: Explanation & Alerting
- **Topic**: `incidents.explained`
- **Producer**: `llm-explanation-service`
- **Consumer**: `alert-service`
- **Data Shape**: Final human-readable outputs (`explanation`, `suggested_action`).

### Stage 6: Audit & Post-Mortem
- **Topic**: `alerts.triggered`
- **Producer**: `alert-service`
- **Consumer**: (Future Logging / Archival Systems)
- **Data Shape**: Delivery confirmation channels and timestamps.
