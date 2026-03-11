# Event Pipeline & Kafka Topics

SentinelOps relies on a central event backbone powered by **Apache Kafka**. This document details the topics used and the flow of events through the system.

## Ingestion Topics
These topics contain raw, unprocessed data from producers.

| Topic Name | Producer Service | Consumer Service | Payload Type |
| :--- | :--- | :--- | :--- |
| `logs.raw` | `log-ingestion-service` | `anomaly-detection-service` | JSON Log Struct |
| `metrics.raw` | `metrics-collector-service` | `anomaly-detection-service` | JSON Metric Struct |

## Analysis & Logic Topics
These topics drive the promotion of raw data into intelligence.

| Topic Name | Producer Service | Consumer Service | Stage |
| :--- | :--- | :--- | :--- |
| `anomalies.detected` | `anomaly-detection-service` | `incident-management-service` | Detected Anomaly |
| `incidents.created` | `incident-management-service` | `root-cause-analysis-service` | New Incident |
| `incidents.analyzed` | `root-cause-analysis-service` | `llm-explanation-service` | Root Cause ID'd |
| `incidents.explained` | `llm-explanation-service` | `alert-service` | Narrated Incident |

## Event Flow Lifecycle

1. **Generation**: External apps send logs/metrics to Ingestion APIs.
2. **Buffering**: Data is buffered in `logs.raw` or `metrics.raw`.
3. **Detection**: The Anomaly Detection service flags heuristic breaches.
4. **Promotion**: Incident Management grouping anomalies into an `Incident`.
5. **Inference**: RCA service identifies the failure origin.
6. **Narration**: LLM service writes the incident explanation.
7. **Notification**: Alert service dispatches the final payload to Slack/Email.
