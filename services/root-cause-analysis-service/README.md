# root-cause-analysis-service

## Documentation Details

* **Service purpose:** Identifies causation graphs and failure origins.
* **Kafka topics consumed:** `incidents.created`
* **Kafka topics produced:** `incidents.analyzed`
* **Role in the incident pipeline:** Determines the technical "why" of an outage.
