# Services Documentation

The SentinelOps platform comprises seven distinct Python microservices:

## 1. log-ingestion-service
**Responsibility**: Act as an ingestion proxy for disparate external application logs.
**Operation**: Validates JSON log structures (service name, log level, message body) and marshals them onto the `logs.raw` Kafka topic.

## 2. metrics-collector-service
**Responsibility**: High-throughput metric aggregation.
**Operation**: Exposes HTTP endpoints for CPU, memory, and latency heartbeat data, validating constraints before dumping to the `metrics.raw` pipeline.

## 3. anomaly-detection-service
**Responsibility**: Heuristic and statistical stream analysis.
**Operation**: A pure consumer/producer. Listens to both `logs.raw` and `metrics.raw`. Evaluates configured thresholds (e.g. CPU > 90%, Latency > 1000ms, Error logs) and flags violations by pushing events to `anomalies.detected`.

## 4. incident-management-service
**Responsibility**: Incident lifecycle and API state tracking.
**Operation**: Consumes raw anomalies and upgrades them to trackable, typed 'Incidents' mapped to varying severities. It persists an in-memory dictionary for active state querying by the frontend dashboard (`GET /incidents`) and publishes creation events to `incidents.created`.

## 5. root-cause-analysis-service
**Responsibility**: Context-aware technical inference.
**Operation**: Monitors `incidents.created`. Matches anomaly telemetry fingerprints against known system topologies or failure rules to derive a probable root cause and confidence score. Publishes enriched payloads to `incidents.analyzed`.

## 6. llm-explanation-service
**Responsibility**: Natural Language Generation (NLG).
**Operation**: Listens for `incidents.analyzed`. Converts technical root cause identifiers into plain-language summaries and remediation action items. Publishes the final textual result to `incidents.explained`.

## 7. alert-service
**Responsibility**: External notification dispatch.
**Operation**: The terminal node of the pipeline. Sweeps `incidents.explained` and triggers HTTP outbounds (Slack Webhooks) or SMTP Email chains to alert human operators. Confirms transmission by logging to `alerts.triggered`.
