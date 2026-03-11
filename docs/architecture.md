# System Architecture

SentinelOps follows a cloud-native, event-driven microservices architecture designed for high availability, horizontal scalability, and isolated failure domains.

## Overview

The platform is designed to process massive streams of telemetry data (logs and metrics) and promotion them into actionable intelligence. This is achieved by decoupling data ingestion, analysis, and alerting using **Apache Kafka** as the central event bus.

## Architectural Layers

### 1. Ingestion Layer
The frontline of the platform. It handles raw data ingestion from external applications via REST APIs.
- **Log Ingestion**: Processes and schemas logs.
- **Metrics Collector**: Periodically aggregates system performance data.

### 2. Detection Layer
Subscribes to raw telemetry topics and applies heuristic models to identify threshold breaches or pattern anomalies. This layer is strictly for identification, not diagnosis.

### 3. Intelligence Layer (The Brain)
Triggered by detected anomalies. It performs two critical functions:
- **Rule-based Inference**: Pinpoints the root cause by correlating anomalies across different services.
- **Generative Diagnostics**: Uses LLMs to generate a human-readable narrative of the incident, including a "How-to-Fix" guide.

### 4. Alerting & Visualization Layer
The interface for SRE teams. It handles external notifications and live dashboard updates through Next.js.

## 🔄 Event Pipeline Flow

SentinelOps uses a strictly-defined event pipeline. Each service communicates only through Kafka, ensuring loose coupling and high resilience.

### Pipeline Stage & Kafka Topics

| Stage | Producer Service | Kafka Topic | Consumer Service |
| :--- | :--- | :--- | :--- |
| **Ingestion** | `log-ingestion` | `logs.raw` | `anomaly-detection` |
| **Ingestion** | `metrics-collector` | `metrics.raw` | `anomaly-detection` |
| **Detection** | `anomaly-detection` | `anomalies.detected` | `incident-management` |
| **Management** | `incident-management` | `incidents.created` | `root-cause-analysis` |
| **Analysis** | `root-cause-analysis` | `incidents.analyzed` | `llm-explanation` |
| **Intelligence** | `llm-explanation` | `incidents.explained` | `alert-service` |
| **Alerting** | `alert-service` | `alerts.triggered` | (External: Slack/Email) |

## Communication Pattern
All inter-service communication is **asynchronous** via Kafka. This ensures that a failure in the Intelligence layer (e.g., an LLM timeout) does not block the ingestion of new telemetry or the detection of other anomalies.

---
> [!NOTE]
> For a detailed breakdown of each service, see [Services Documentation](services.md).
