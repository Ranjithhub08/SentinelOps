# Alert Service

## Overview
The Alert Service is designed to sit at the end of the SentinelOps anomaly pipeline. It consumes plain-text explanations and remediation actions produced by the LLM Explanation Service and dispatches them directly to human operators across various communication channels.

Every time an alert is successfully dispatched, the service logs an audit record back to the Kafka event bus under the `alerts.triggered` topic.

## Pipeline Integration
- **Service Purpose**: The final dispatch agent responsible for waking up human engineers via configured protocols (Slack, SMTP).
- **Kafka Topics**: 
  - *Consumes* from `incidents.explained`.
  - *Produces* to `alerts.triggered`.
- **Pipeline Fit**: The terminal point of the active pipeline (Stage 6). It takes the fully enriched, human-readable incident, fires external HTTP/SMTP connections, and writes an audit log back to the bus.

## Delivery Channels
- **Slack**: Supports sending formatted blocks to a standard Slack Incoming Webhook.
- **Email**: Emulates sending SMTP emails to an on-call alias or distribution list (currently a placeholder structure).

## Message Flow
1. **Consumption:** Background Kafka thread listens to the `incidents.explained` topic.
2. **Formatting:** Converts the structured JSON payloads into a universally readable "SIREN" structured string block.
3. **Dispatch:** Triggers concurrent HTTP POST requests to Slack and delegates to the internal SMTP client logic.
4. **Auditing:** Constructs an `AlertEvent` detailing which channels successfully received the message, timestamping it, and publishing it to `alerts.triggered`.

## Running Locally

### Prerequisites
- Python 3.9+
- The SentinelOps Kafka infrastructure running (`infrastructure/docker/docker-compose.yml`).

### Setup
1. Navigate to the service directory:
   ```bash
   cd services/alert-service
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

### Configuration (.env)
You should create a `.env` file referencing your required outbound integrations:
```env
KAFKA_BOOTSTRAP_SERVERS=localhost:9092
EXPLAINED_TOPIC=incidents.explained
ALERTS_TOPIC=alerts.triggered

# Channels
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR_WORKSPACE/YOUR_BOT/YOUR_TOKEN
SMTP_SERVER=smtp.local.com:587
ALERT_EMAIL=oncall@sentinelops.local
```

### Execution
Run the FastAPI application (which hosts the background Kafka pipeline and health check endpoint on port 8007):
```bash
uvicorn src.main:app --host 0.0.0.0 --port 8007 --reload
```

## Example Alert Payload (Output to Kafka)
This is what gets logged internally when an alert triggers:
```json
{
  "incident_id": "auto-generated-id",
  "formatted_message": "🚨 *Incident Detected*\\nService: payment-api\\nRoot Cause: Resource saturation\\n\\n*Explanation:*\\nCPU usage exceeded safe limits.\\n\\n*Suggested Action:*\\nScale the service or investigate heavy workload.",
  "channels": [
    "slack",
    "email"
  ],
  "timestamp": "2026-03-09T10:30:00Z"
}
```

## Directories
- `src/`: Routing logic, Slack/SMTP dispatch definitions, schemas, and Kafka wrappers.
- `config/`: Configuration files mapping environments.
