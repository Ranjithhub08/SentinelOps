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

## 📡 Kafka Topic Definitions

| Topic Name | Purpose | Data Schema |
| :--- | :--- | :--- |
| `logs.raw` | Raw ingested log streams | `LogEntry` |
| `metrics.raw` | Raw system performance metrics | `MetricEntry` |
| `anomalies.detected` | Flagged points of interest | `AnomalyEvent` |
| `incidents.created` | Aggregated anomaly incidents | `Incident` |
| `incidents.analyzed` | Incidents with identified root causes | `AnalyzedIncident` |
| `incidents.explained` | Incidents with LLM-generated summaries | `ExplainedIncident` |
| `alerts.triggered` | Final notifications for dispatch | `Alert` |

## 🎡 Event Lifecycle

1. **Capture**: `log-ingestion` or `metrics-collector` receives external data.
2. **Buffer**: Data is normalized and pushed to `*.raw` Kafka topics.
3. **Analyze**: `anomaly-detection` processes streams and flags issues in `anomalies.detected`.
4. **Escalate**: `incident-management` groups anomalies into a single `Incident`.
5. **Diagnose**: `root-cause-analysis` determines the "Why" and posts to `incidents.analyzed`.
6. **Interpret**: `llm-explanation` uses AI to write a natural language report.
7. **Notify**: `alert-service` sends the final intelligence to Slack or Email.
