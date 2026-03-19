import time
import requests
from datetime import datetime

LOGS_URL = "http://localhost:8001/logs"
METRICS_URL = "http://localhost:8002/metrics"

def trigger_incident():
    print("🚨 Triggering DEMO Critical Incident...")
    
    # We will target a unique service name for easy identification
    service = "TITAN-DEMO-SERVICE"
    timestamp = datetime.utcnow().isoformat() + "Z"
    
    # 1. Send a Critical Error Log
    log_data = {
        "service": service,
        "timestamp": timestamp,
        "level": "ERROR",
        "message": "CRITICAL: Database connection completely lost! All transactions failing."
    }
    try:
        res = requests.post(LOGS_URL, json=log_data, timeout=3)
        if res.status_code == 202:
            print("✅ Sent Critical Error Log")
    except Exception as e:
        print(f"❌ Failed to send log: {e}")

    # 2. Send Massive Metric Spikes
    metric_data = {
        "service": service,
        "timestamp": timestamp,
        "cpu_usage": 99.9,
        "memory_usage": 98.5,
        "latency_ms": 5000.0,
        "error_rate": 0.95
    }
    try:
        res = requests.post(METRICS_URL, json=metric_data, timeout=3)
        if res.status_code == 202:
            print("✅ Sent Massive Metric Spikes (CPU: 99.9%, Latency: 5000ms, Error Rate: 95%)")
    except Exception as e:
        print(f"❌ Failed to send metric: {e}")

    print("\n💥 Incident successfully injected!")
    print("➡️  Look at your dashboard (http://localhost:3005) right now! It will appear in ~3 seconds.")

if __name__ == "__main__":
    trigger_incident()
