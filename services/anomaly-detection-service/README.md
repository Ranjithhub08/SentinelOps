# Anomaly Detection Service

## Overview
The Anomaly Detection Service uses heuristic rules (and future Machine Learning models) to analyze logs and metrics in real-time, identifying abnormal patterns that could indicate a potential incident.

It operates asynchronously by consuming streams from the SentinelOps event bus (Kafka) and producing anomaly events back to Kafka whenever a threshold or rule is violated.

## Pipeline Integration
- **Service Purpose**: The core reasoning engine that separates nominal system events from dangerous edge-cases and threshold breaches.
- **Kafka Topics**: 
  - *Consumes* from `logs.raw` and `metrics.raw`.
  - *Produces* to `anomalies.detected`.
- **Pipeline Fit**: Sits in Stage 2 of the pipeline. It reads raw data from the ingesters, applies rules, and feeds isolated anomaly events forward to the `incident-management-service`.

## How it works
1. The service exposes a lightweight FastAPI server for health checks.
2. Upon startup, a background Kafka Consumer thread connects to the `logs.raw` and `metrics.raw` topics.
3. As messages flow in, heuristic rules are applied in real-time:
   - **Logs:** Triggers an `ERROR_LOG` anomaly if the log level is exactly `ERROR`.
   - **Metrics:** Triggers anomalies for CPU Usage > 90% (`HIGH_CPU`), Latency > 1000ms (`HIGH_LATENCY`), and Error Rate > 0.1 (`HIGH_ERROR_RATE`).
4. If an anomaly is detected, a structured `AnomalyEvent` is published to the `anomalies.detected` topic via the Kafka Producer.
5. Downstream services (like `incident-management-service`) consume these anomalies to build aggregate incident cases.

## Running Locally

### Prerequisites
- Python 3.9+
- The SentinelOps Kafka infrastructure must be running (see `infrastructure/docker/README.md`).
- Optionally, `log-ingestion-service` and `metrics-collector-service` can be running to produce live data.

### Setup
1. Navigate to the service directory:
   ```bash
   cd services/anomaly-detection-service
   ```
2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\\Scripts\\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### Execution
Run the FastAPI server (which automatically spins up the Kafka consumer loop):
```bash
uvicorn src.main:app --host 0.0.0.0 --port 8003 --reload
```
The service will be mapped to `http://localhost:8003`.

## Environment Variables
- `KAFKA_BOOTSTRAP_SERVERS`: Comma-separated list of Kafka broker addresses (default: `localhost:9092`).
- `LOGS_TOPIC`: Topic to consume logs from (default: `logs.raw`).
- `METRICS_TOPIC`: Topic to consume metrics from (default: `metrics.raw`).
- `ANOMALIES_TOPIC`: Topic to publish anomalies to (default: `anomalies.detected`).

## Example Anomaly Payload (Output)
When an anomaly is detected, it is published to the bus in the following schema:
```json
{
  "service": "payment-api",
  "type": "HIGH_CPU",
  "value": 95,
  "timestamp": "2026-03-09T10:15:00Z"
}
```

## Directories
- `src/`: Contains the main application code (FastAPI router, Kafka logic, heuristic definitions).
- `config/`: Contains configuration files for different environments.
