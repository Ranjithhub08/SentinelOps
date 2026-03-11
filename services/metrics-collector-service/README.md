# Metrics Collector Service

## Service Purpose
The **Metrics Collector Service** handles the ingestion and aggregation of numerical performance data (e.g., CPU load, memory usage, API latency). It ensures that systemhealth metrics are collected at regular intervals and formatted for real-time analysis by the detection engine.

## Pipeline Position
**Stage**: 1 (Ingestion)
- **Role**: Telemetry Aggregator
- **Input**: Pull-based probes or Push-based REST events
- **Output**: Standardized Metric Streams

## Kafka Topics
- **Produced**: `metrics.raw` (Time-series system metrics)
- **Consumed**: None (Source Service)

## Integration
The collector serves as a centralized point for system performance monitoring. It normalizes distinct metric types into a unified JSON schema before publishing to the `metrics.raw` Kafka topic.
