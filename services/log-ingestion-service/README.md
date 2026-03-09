# Log Ingestion Service

## Overview
The Log Ingestion Service is responsible for collecting, parsing, and standardizing logs from various sources across the infrastructure for SentinelOps.

It exposes a RESTful API to accept logs, validates them against a standard schema, and asynchronously publishes them to the SentinelOps event streaming backbone (Apache Kafka).

## Pipeline Integration
- **Service Purpose**: Acts as the primary entry point for raw text-based telemetry into the SentinelOps ecosystem.
- **Kafka Topics**: 
  - *Produces* to `logs.raw`.
- **Pipeline Fit**: It sits at the very edge of the system (Stage 1), receiving data from external applications and normalizing it for the downstream `anomaly-detection-service`.

## How it works
1. External agents or applications send `POST` requests to the `/logs` endpoint.
2. The payload is validated using FastAPI and Pydantic to ensure it meets the required structured log format.
3. Upon successful validation, the service serializes the log into JSON and publishes it to the `logs.raw` Kafka topic.
4. Downstream services (like `anomaly-detection-service`) consume from this topic for further processing.

## Running Locally

### Prerequisites
- Python 3.9+
- The SentinelOps Kafka infrastructure must be running (see `infrastructure/docker/README.md`).

### Setup
1. Navigate to the service directory:
   ```bash
   cd services/log-ingestion-service
   ```
2. Create a virtual environment and activate it (optional but recommended):
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
uvicorn src.main:app --host 0.0.0.0 --port 8001 --reload
```
The service will be available at `http://localhost:8001`. You can view the automatically generated Swagger UI documentation at `http://localhost:8001/docs`.

## Example Log Payload

To ingest a log, send a POST request to `http://localhost:8001/logs` with the following JSON schema:

```json
{
  "service": "payment-api",
  "level": "ERROR",
  "message": "Database connection timeout",
  "timestamp": "2026-03-09T10:00:00Z"
}
```

### Example cURL command:
```bash
curl -X POST "http://localhost:8001/logs" \\
     -H "Content-Type: application/json" \\
     -d '{
           "service": "payment-api",
           "level": "ERROR",
           "message": "Database connection timeout",
           "timestamp": "2026-03-09T10:00:00Z"
         }'
```

## Environment Variables
The service behavior can be configured with the following environment variables (can be placed in a `.env` file):

- `KAFKA_BOOTSTRAP_SERVERS`: Comma-separated list of Kafka broker addresses (default: `localhost:9092`).
- `KAFKA_TOPIC`: The topic to publish raw logs to (default: `logs.raw`).

## Directories
- `src/`: Contains the main application source code (`main.py`, `schemas.py`, `kafka_producer.py`).
- `config/`: Contains configuration files for different environments.
