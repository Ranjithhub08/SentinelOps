# LLM Explanation Service

## Overview
The LLM Explanation Service leverages Natural Language Generation (currently via intelligent templates, designated for future Large Language Model integration) to translate technical incident data into human-readable action plans.

It acts as the final analytical step in the automated SentinelOps pipeline before an alert is dispatched to human operators.

## Pipeline Integration
- **Service Purpose**: Converts raw technical IDs and error strings into cohesive, human-readable explanations and remediation steps.
- **Kafka Topics**: 
  - *Consumes* from `incidents.analyzed`.
  - *Produces* to `incidents.explained`.
- **Pipeline Fit**: Operates at Stage 5. It consumes the diagnosed RCA incident, appends textual NLP data (`explanation`, `suggested_action`), and sends it to the `alert-service` for dispatch.

## Explanation Generation Workflow
1. **Consumption:** A background Kafka thread constantly listens to the `incidents.analyzed` topic for raw RCA events.
2. **Translation:** When an event is received, the service extracts the service name, anomaly type, and suspected root cause. It then maps these telemetry parameters to a clear, concisely templated natural language explanation describing the state of the system, and outputs a concrete suggested remediation action.
3. **Publishing:** The generated strings are packaged alongside the `incident_id` into an `ExplainedIncident` payload. This payload is asynchronously emitted to the `incidents.explained` Kafka topic.

## Running Locally

### Prerequisites
- Python 3.9+
- The SentinelOps Kafka infrastructure running (`infrastructure/docker/docker-compose.yml`).
- Upstream services running to produce analyzed incidents (optional, but necessary for a full end-to-end integration test).

### Setup
1. Navigate to the service directory:
   ```bash
   cd services/llm-explanation-service
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
Run the FastAPI application (which hosts the background Kafka pipeline):
```bash
uvicorn src.main:app --host 0.0.0.0 --port 8006 --reload
```
The application will map a health check endpoint to `http://localhost:8006`.

## Example Enriched Payload (Output)
Upon successful conversion, the Explanation Service emits:
```json
{
  "incident_id": "auto-generated-id",
  "explanation": "CPU usage exceeded safe limits on payment-api, indicating resource saturation.",
  "suggested_action": "Consider scaling the service horizontally or optimizing resource-intensive operations."
}
```

## Environment Variables
- `KAFKA_BOOTSTRAP_SERVERS`: Comma-separated list of Kafka brokers (default: `localhost:9092`).
- `ANALYZED_TOPIC`: Topic to listen for incoming RCA incidents (default: `incidents.analyzed`).
- `EXPLAINED_TOPIC`: Topic to broadcast natural language explanations (default: `incidents.explained`).

## Directories
- `src/`: Core logic, schemas, template definitions, and Kafka wrappers.
- `config/`: Configuration files mapping environments.
