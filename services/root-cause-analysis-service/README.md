# Root Cause Analysis (RCA) Service

## Service Purpose
The **Root Cause Analysis (RCA) Service** is the first layer of the intelligence hub. It applies rule-based inference and dependency correlation to identify the source of a system incident. It translates raw anomalies into technical "root causes" that explain the origin of the failure.

## Pipeline Position
**Stage**: 4 (Intelligence)
- **Role**: Technical Investigator
- **Input**: `incidents.created` topic
- **Output**: `incidents.analyzed` topic

## Kafka Topics
- **Consumed**: `incidents.created`
- **Produced**: `incidents.analyzed` (Incidents containing technical root cause IDs)

## Logic
The service correlates logs and metrics events across different services within the same time-window. By mapping dependencies, it identifies whether an error in `service A` was actually caused by a bottleneck in `service B`.
