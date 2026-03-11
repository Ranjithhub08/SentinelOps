# LLM Explanation Service

## Service Purpose
The **LLM Explanation Service** is the "voice" of the SentinelOps platform. It takes technical incident data (including root causes) and uses AI to generate human-readable explanations. It ensures that responders don't just see cold metrics, but a clear narrative of the crisis and a set of actionable mitigation steps.

## Pipeline Position
**Stage**: 4 (Intelligence)
- **Role**: Narrator & Remediation Guide
- **Input**: `incidents.analyzed` topic
- **Output**: `incidents.explained` topic

## Kafka Topics
- **Consumed**: `incidents.analyzed`
- **Produced**: `incidents.explained` (Incidents containing AI-generated narrative context)

## Logic
The service utilizes advanced Prompt Engineering to feed technical JSON payloads (logs, metrics, and RCA IDs) into a Large Language Model (e.g., Gemini). The resulting narrative explains the "Why" and provides a "How-to-Fix" guide based on the detected failure pattern.
