# System Architecture Overview

**SentinelOps** implements an advanced architectural design tailored for high-volume telemetry ingestion and sophisticated incident resolution.

## Core Principles

1. **Decoupled Microservices**: Every component (ingestion, anomaly detection, incident structuring, insight generation, and alerting) functions autonomously. Failure cascades are prevented by strict separation of concerns.
2. **Event-Driven Asynchrony**: Synchronous HTTP requests are minimized. All state transfer occurs via an underlying messaging backbone (Apache Kafka), ensuring resilience against throughput spikes.
3. **Pipelined Analysis**: Data matures as it traverses the pipeline—from raw metrics (Level 1) to heuristic anomalies (Level 2), to structural incidents (Level 3), up to human-readable intelligence (Level 4).

## Infrastructure Ecosystem

- **Backend Logic**: Python 3.9+ relying heavily on FastAPI for rapid REST interfaces and `kafka-python` for streaming interactions.
- **Frontend Dashboard**: Next.js App Router providing a persistent, responsive, glassmorphic UI representing live system health.
- **Streaming Backbone**: Apache Kafka clusters backed by Zookeeper for fault-tolerant log durability.

## Operational Flow
The system operates by receiving logs and metrics from external applications via POST requests. Once ingested and standardized onto Kafka, these payloads are simultaneously processed by edge detection algorithms. Unhealthy signatures trigger incidents into a localized state store. Finally, these incidents are enriched with inferred root causes and shipped via external channels (Slack/Email) to Site Reliability Teams.
