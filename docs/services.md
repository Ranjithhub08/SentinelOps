# Microservices Documentation

SentinelOps is built as a suite of specialized microservices, each owning a specific segment of the incident response lifecycle.

## 1. log-ingestion-service
- **Port**: 8001
- **Responsibility**: Provides a REST API for applications to send raw log data. It validates and standardizes the log format before publishing to the raw log stream.
- **Key Logic**: JSON schema validation and timestamp normalization.

## 2. metrics-collector-service
- **Port**: 8002
- **Responsibility**: Collects numerical system metrics (CPU, RAM, API Latency). It can pull data from external probes or receive them via push requests.
- **Key Logic**: Aggregation and deduplication of telemetry points.

## 3. anomaly-detection-service
- **Port**: 8003
- **Responsibility**: The primary monitoring engine. It subscribes to all `raw` telemetry topics and applies heuristic models to identify threshold breaches.
- **Key Logic**: Sliding window analysis and statistical outlier detection.

## 4. incident-management-service
- **Port**: 8004
- **Responsibility**: Orchestrates the incident lifecycle. It promotes "raw anomalies" into "incidents," preventing alert noise by grouping related issues.
- **Key Logic**: State machine for incident stages (Detected -> Investigating -> Resolved).

## 5. root-cause-analysis-service
- **Port**: 8005
- **Responsibility**: The inference engine. It uses pre-defined rules and graph correlation to identify the source of failure once an incident is created.
- **Key Logic**: Dependency mapping and causal correlation.

## 6. llm-explanation-service
- **Port**: 8006
- **Responsibility**: Generates human-readable context. It sends technical incident data to an LLM (AI) to produce a narrative explanation and remediation plan.
- **Key Logic**: Prompt engineering and context filtering.

## 7. alert-service
- **Port**: 8007
- **Responsibility**: Handles external notifications. It routes finalized incident data to specified integrations (Slack, Email, SMS).
- **Key Logic**: Template rendering and retry logic for external webhooks.
