# anomaly-detection-service

## Documentation Details

* **Service purpose:** Flags threshold breaches using heuristic and statistical models.
* **Kafka topics consumed:** `logs.raw`, `metrics.raw`
* **Kafka topics produced:** `anomalies.detected`
* **Role in the incident pipeline:** Core detection intelligence layer.
