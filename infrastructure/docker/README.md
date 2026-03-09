# SentinelOps Event-Driven Architecture

This directory contains the Docker Compose configurations for the core infrastructure dependencies of the SentinelOps platform, primarily our event streaming backbone powered by Apache Kafka.

## Event-Driven Architecture Overview
The SentinelOps platform leverages an event-driven architecture using Kafka to asynchronously pass data and control events between independent microservices. This design ensures high scalability, fault tolerance, and loose coupling among the services. 

Data is published (produced) as events (messages) to specific Kafka topics, and relevant services subscribe (consume) to these topics to react in real-time. This is pivotal for our data ingestion, anomaly detection, and incident response lifecycles.

## Core Kafka Topics

The platform uses the following core topics for inter-service communication:

1. **`logs.raw`**
   - **Purpose:** Receives raw, unprocessed log lines from external systems or agents.
   - **Producers:** `log-ingestion-service`
   - **Consumers:** `anomaly-detection-service`, structured storage sinks.

2. **`metrics.raw`**
   - **Purpose:** Captures raw system and application metrics (e.g., CPU load, memory usage, latency).
   - **Producers:** `metrics-collector-service`
   - **Consumers:** `anomaly-detection-service`, timeseries database sinks.

3. **`anomalies.detected`**
   - **Purpose:** Used to signal when machine learning models or heuristic rules have identified irregular patterns in logs or metrics.
   - **Producers:** `anomaly-detection-service`
   - **Consumers:** `root-cause-analysis-service`, `incident-management-service`.

4. **`incidents.created`**
   - **Purpose:** Represents a formal incident that needs team attention, potentially enriched with RCA details.
   - **Producers:** `incident-management-service`
   - **Consumers:** `llm-explanation-service` (to generate remediation steps), `alert-service`.

5. **`alerts.triggered`**
   - **Purpose:** Dispatches parsed notifications to external communication channels (e.g., Slack, Email, PagerDuty).
   - **Producers:** `alert-service`
   - **Consumers:** Notification gateway workers (internal).

## Managing Kafka Locally

To bring up the event streaming backbone locally for development:

```bash
cd infrastructure/docker
docker-compose up -d
```

### Kafka UI
A graphical interface for monitoring Kafka topics, partitions, and viewing message payloads is included in the composition. Once the containers are running, navigate to:

**[http://localhost:8080](http://localhost:8080)**
