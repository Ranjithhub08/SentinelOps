import time
import requests
from datetime import datetime

LOGS_URL = "http://localhost:8001/logs"
METRICS_URL = "http://localhost:8002/metrics"

def trigger_security_incident():
    print("🛡️ Triggering SECURITY Breach Incident...")
    
    # Unique service for security demo
    service = "SECURITY-VORTEX-01"
    timestamp = datetime.utcnow().isoformat() + "Z"
    
    # 1. Send suspicious access logs
    log_data = {
        "service": service,
        "timestamp": timestamp,
        "level": "CRITICAL",
        "message": "SECURITY ALERT: Multiple failed root login attempts detected from unauthorized IP 192.168.1.50"
    }
    try:
        res = requests.post(LOGS_URL, json=log_data, timeout=3)
        if res.status_code == 202:
            print("✅ Sent Security Breach Logs")
    except Exception as e:
        print(f"❌ Failed to send log: {e}")

    # 2. Add an anomaly for the detection service (High Error Rate due to failed logins)
    metric_data = {
        "service": service,
        "timestamp": timestamp,
        "cpu_usage": 15.0,
        "memory_usage": 20.0,
        "latency_ms": 50.0,
        "error_rate": 0.88
    }
    try:
        res = requests.post(METRICS_URL, json=metric_data, timeout=3)
        if res.status_code == 202:
            print("✅ Sent High Error Metrics (Simulating authentication failures)")
    except Exception as e:
        print(f"❌ Failed to send metric: {e}")

    print("\n🕵️ Security Breach successfully injected!")
    print("➡️  Check (http://localhost:3005/incidents) for: SECURITY-VORTEX-01")

if __name__ == "__main__":
    trigger_security_incident()
