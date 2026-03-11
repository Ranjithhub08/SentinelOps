# Anomaly Detection Service

## Service Purpose
The **Anomaly Detection Service** is the reactive heart of SentinelOps. It processes every log and metric event in real-time to identify heuristic and statistical violations. It acts as the first line of defense, flagging potential system issues for promotion into incidents.

## Pipeline Position
**Stage**: 2 (Detection)
- **Role**: Pattern Recognizer & Filter
- **Input**: Raw Kafka telemetry topics
- **Output**: Real-time Anomaly Events

## Kafka Topics
- **Consumed**: `logs.raw`, `metrics.raw`
- **Produced**: `anomalies.detected` (High-fidelity anomaly alerts)

## Logic
The service uses sliding window analysis and configurable thresholds to detect spikes, drops, or illegal patterns in system logs and performance metrics.
