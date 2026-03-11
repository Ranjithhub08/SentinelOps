# Incident Management Service

## Service Purpose
The **Incident Management Service** is the orchestrator of the platform. It promotion raw, noisy anomalies into high-fidelity "Incidents." By grouping related anomalies, it reduces alert fatigue and provides a stable record for the AI intelligence layer to analyze.

## Pipeline Position
**Stage**: 3 (Orchestration)
- **Role**: Crisis Manager & Data Aggregator
- **Input**: `anomalies.detected` topic
- **Output**: `incidents.created` topic and REST API for Dashboard

## Kafka Topics
- **Consumed**: `anomalies.detected`
- **Produced**: `incidents.created` (Aggregated incident records)

## Logic
The service maintains the state of all system events. It deduplicates anomalies based on service and time-window, ensuring that a single root cause only generates a single incident.
