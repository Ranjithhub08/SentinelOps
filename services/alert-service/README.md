# Alert Service

## Service Purpose
The **Alert Service** is the final stage of the SentinelOps pipeline. It is responsible for bridging the internal event bus with external notification channels. It ensures that critical, AI-analyzed incident data reaches the right responders on the right platform at the right time.

## Pipeline Position
**Stage**: 5 (Dispatch)
- **Role**: Notification Engine & Post-man
- **Input**: `incidents.explained` topic
- **Output**: Multi-channel Alerts (Slack, Email, SMS)

## Kafka Topics
- **Consumed**: `incidents.explained`
- **Produced**: None (Output Service)

## Logic
The service parses finalized incident payloads containing both technical RCA and human-readable AI explanations. It applies user-defined templates and dispatches alerts via configured webhooks (Slack) or SMTP (Email), providing a unified point for responder communication.
