# Root Cause Analysis Service

## Overview
The Root Cause Analysis (RCA) Service processes incidents to identify the underlying problems plaguing the system. It leverages a rule-based inference engine that consumes incidents, maps the triggering anomalies to probable causes with a confidence score, and publishes the enriched result.

## Pipeline Integration
- **Service Purpose**: AI/Rule-based inference engine that identifies *why* an incident is occurring based on technical telemetry mapping.
- **Kafka Topics**: 
  - *Consumes* from `incidents.created`.
  - *Produces* to `incidents.analyzed`.
- **Pipeline Fit**: Operates at Stage 4. It takes newly structured incidents, diagnoses them to append a `root_cause` and `confidence`, and feeds the Enriched Incident to the `llm-explanation-service`.

## Incident Analysis Workflow
1. **Consumption:** The service runs a background Kafka consumer polling the `incidents.created` topic.
2. **Rule-Based Classification:** As incidents arrive, the embedded heuristic logic determines the most likely root cause based on the anomaly `type`:
   - `HIGH_CPU` -> "Resource saturation" (Confidence: 0.85)
   - `HIGH_LATENCY` -> "Slow downstream dependency" (Confidence: 0.80)
   - `HIGH_ERROR_RATE` -> "Service instability" (Confidence: 0.90)
   - `ERROR_LOG` -> "Application exception" (Confidence: 0.95)
3. **Enrichment:** A new `AnalyzedIncident` payload is constructed, incorporating the original `incident_id` along with the identified `root_cause` and `confidence`.
4. **Publishing:** The enriched payload is broadcasted to the `incidents.analyzed` Kafka topic. Future services (e.g., the LLM Explanation service) use this context for generating human-readable remediations.

## Running Locally

### Prerequisites
- Python 3.9+
- The SentinelOps Kafka infrastructure running (`infrastructure/docker/docker-compose.yml`).
- `incident-management-service` running to produce incidents (optional, but necessary for the full lifecycle testing).

### Setup
1. Navigate to the service directory:
   ```bash
   cd services/root-cause-analysis-service
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
uvicorn src.main:app --host 0.0.0.0 --port 8005 --reload
```
The application will bind to `http://localhost:8005`.

## Example Enriched Payload (Output)
Upon reaching a conclusion, the RCA service emits:
```json
{
  "incident_id": "auto-generated-id",
  "service": "payment-api",
  "type": "HIGH_CPU",
  "root_cause": "Resource saturation",
  "confidence": 0.85,
  "timestamp": "2026-03-09T10:25:00Z"
}
```

## Environment Variables
- `KAFKA_BOOTSTRAP_SERVERS`: Comma-separated list of Kafka brokers (default: `localhost:9092`).
- `INCIDENTS_TOPIC`: Topic to listen for new incidents (default: `incidents.created`).
- `ANALYZED_TOPIC`: Topic to broadcast results (default: `incidents.analyzed`).

## Directories
- `src/`: Core logic, schemas, and Kafka wrappers.
- `config/`: Configuration setup for various environments.
