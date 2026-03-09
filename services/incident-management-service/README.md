# Incident Management Service

## Overview
The Incident Management Service acts as the central hub for tracking, updating, and resolving incidents within SentinelOps. It coordinates workflows, determines incident severity based on the type of anomaly, and maintains the current state of all active internal incidents.

## Pipeline Integration
- **Service Purpose**: Aggregates disparate anomalies into stateful, trackable incident life-cycles and provides the queryable REST API for the frontend UI.
- **Kafka Topics**: 
  - *Consumes* from `anomalies.detected`.
  - *Produces* to `incidents.created`.
- **Pipeline Fit**: Operates at Stage 3. It converts stateless anomalies into contextual incidents, persisting them for the dashboard while emitting events to wake up the `root-cause-analysis-service`.

## Incident Lifecycle
1. **Anomaly Consumption:** The service listens to the `anomalies.detected` Kafka topic.
2. **Incident Creation:** When an anomaly is received, the service auto-generates a unique `incident_id` and constructs an `IncidentEvent`.
3. **Severity Mapping:** The service determines the severity of the incident based on the anomaly type:
   - `HIGH_CPU` -> **HIGH**
   - `HIGH_LATENCY` -> **HIGH**
   - `HIGH_ERROR_RATE` -> **CRITICAL**
   - `ERROR_LOG` -> **MEDIUM**
   - *Other* -> **LOW**
4. **State Management:** The new incident is saved into an **in-memory store** (accessible via the REST API) with an initial status of `OPEN`.
5. **Event Broadcasting:** The incident is then published to the `incidents.created` Kafka topic for downstream consumers (like the Alert Service and LLM Explanation Service).

## Running Locally

### Prerequisites
- Python 3.9+
- SentinelOps Kafka infrastructure running (`infrastructure/docker/docker-compose.yml`).
- `anomaly-detection-service` running to populate anomalies (optional for starting, but required for full lifecycle).

### Setup
1. Navigate to the service directory:
   ```bash
   cd services/incident-management-service
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\\Scripts\\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### Execution
Run the FastAPI application (which automatically launches the Kafka consumer thread):
```bash
uvicorn src.main:app --host 0.0.0.0 --port 8004 --reload
```
The service will be available at `http://localhost:8004`.

## REST API Endpoints

### 1. View all active incidents
```bash
curl -X GET "http://localhost:8004/incidents"
```

### 2. View a specific incident
```bash
curl -X GET "http://localhost:8004/incidents/{incident_id}"
```

## Example Incident Payload (Output to Kafka)
```json
{
  "incident_id": "auto-generated-id",
  "service": "payment-api",
  "type": "HIGH_CPU",
  "severity": "HIGH",
  "status": "OPEN",
  "timestamp": "2026-03-09T10:20:00Z",
  "context": {
    "anomaly_value": 95,
    "anomaly_timestamp": "2026-03-09T10:15:00Z"
  }
}
```

## Environment Variables
- `KAFKA_BOOTSTRAP_SERVERS`: Comma-separated list of Kafka broker addresses (default: `localhost:9092`).
- `ANOMALIES_TOPIC`: Topic to listen for new anomalies (default: `anomalies.detected`).
- `INCIDENTS_TOPIC`: Topic to broadcast newly created incidents (default: `incidents.created`).

## Directories
- `src/`: Main source code containing the FastAPI router, schemas, and Kafka producers/consumers.
- `config/`: Configuration files for different environments.
