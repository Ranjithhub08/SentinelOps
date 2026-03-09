# Metrics Collector Service

## Overview
The Metrics Collector Service handles the aggregation, processing, and storage of system and application metrics to support real-time monitoring and anomaly detection.

It exposes a RESTful API to accept metrics payloads, validates them against a standard schema using Pydantic, and asynchronously publishes them to the SentinelOps event streaming backbone (Apache Kafka).

## Pipeline Integration
- **Service Purpose**: Serves as the high-throughput ingestion API for structured telemetry (CPU, memory, latency).
- **Kafka Topics**: 
  - *Produces* to `metrics.raw`.
- **Pipeline Fit**: Operates at the system edge (Stage 1) parallel to the log-ingester, formatting numeric metrics for consumption by the downstream `anomaly-detection-service`.

## How it works
1. External agents or applications send `POST` requests to the `/metrics` endpoint.
2. The payload is validated using FastAPI to ensure all required fields (e.g., `cpu_usage`, `memory_usage`, `latency_ms`, `error_rate`) are present and of the correct type.
3. Upon successful validation, the service serializes the metrics into JSON and publishes them to the `metrics.raw` Kafka topic.
4. Downstream services (like `anomaly-detection-service`) consume from this topic for analysis.

## Running Locally

### Prerequisites
- Python 3.9+
- The SentinelOps Kafka infrastructure must be running (see `infrastructure/docker/README.md`).

### Setup
1. Navigate to the service directory:
   ```bash
   cd services/metrics-collector-service
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
Run the FastAPI development server:
```bash
uvicorn src.main:app --host 0.0.0.0 --port 8002 --reload
```
The service will be available at `http://localhost:8002`. Swagger UI documentation is at `http://localhost:8002/docs`.

## Example Metrics Payload

To ingest metrics, send a POST request to `http://localhost:8002/metrics` with the following JSON schema:

```json
{
  "service": "payment-api",
  "cpu_usage": 75,
  "memory_usage": 62,
  "latency_ms": 210,
  "error_rate": 0.03,
  "timestamp": "2026-03-09T10:10:00Z"
}
```

### Example cURL command:
```bash
curl -X POST "http://localhost:8002/metrics" \\
     -H "Content-Type: application/json" \\
     -d '{
           "service": "payment-api",
           "cpu_usage": 75,
           "memory_usage": 62,
           "latency_ms": 210,
           "error_rate": 0.03,
           "timestamp": "2026-03-09T10:10:00Z"
         }'
```

## Environment Variables
- `KAFKA_BOOTSTRAP_SERVERS`: Comma-separated list of Kafka broker addresses (default: `localhost:9092`).
- `KAFKA_TOPIC`: The topic to publish raw metrics to (default: `metrics.raw`).

## Directories
- `src/`: Contains the main application source code (`main.py`, `schemas.py`, `kafka_producer.py`).
- `config/`: Contains configuration files for different environments.
