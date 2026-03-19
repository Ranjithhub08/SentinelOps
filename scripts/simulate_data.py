import time
import json
import random
import requests
from datetime import datetime

LOGS_URL = "http://localhost:8001/logs"
METRICS_URL = "http://localhost:8002/metrics"

SERVICES = ['auth-service', 'payment-api', 'inventory-db', 'gateway-node']

def generate_log():
    service = random.choice(SERVICES)
    is_error = random.random() < 0.2  # 20% chance of error
    level = "ERROR" if is_error else "INFO"
    message = "Database connection timeout" if is_error else "Request processed successfully"
    
    return {
        "service": service,
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "level": level,
        "message": message
    }

def generate_metric():
    service = random.choice(SERVICES)
    is_spike = random.random() < 0.2
    
    cpu_usage = random.uniform(92, 99) if is_spike else random.uniform(20, 60)
    memory_usage = random.uniform(85, 95) if is_spike else random.uniform(30, 70)
    latency_ms = random.uniform(1200, 2500) if is_spike else random.uniform(50, 200)
    error_rate = random.uniform(0.12, 0.3) if is_spike else random.uniform(0.01, 0.05)
    
    return {
        "service": service,
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "cpu_usage": round(cpu_usage, 2),
        "memory_usage": round(memory_usage, 2),
        "latency_ms": round(latency_ms, 2),
        "error_rate": round(error_rate, 2)
    }

def simulate():
    print("🚀 Starting Production Traffic Simulator...")
    print(f"Targeting {LOGS_URL} and {METRICS_URL}")
    print("Press Ctrl+C to stop.\n")
    
    try:
        while True:
            # Send Log
            log_data = generate_log()
            try:
                res = requests.post(LOGS_URL, json=log_data, timeout=3)
                print(f"[Simulator] Sent LOG ({log_data['level']}) to {log_data['service']} - Status: {res.status_code}")
            except Exception as e:
                print(f"[Simulator] Error sending log: {e}")
                
            # Send Metric
            metric_data = generate_metric()
            try:
                res = requests.post(METRICS_URL, json=metric_data, timeout=3)
                print(f"[Simulator] Sent METRIC (CPU: {metric_data['cpu_usage']}%) to {metric_data['service']} - Status: {res.status_code}")
            except Exception as e:
                print(f"[Simulator] Error sending metric: {e}")
                
            print("-" * 40)
            time.sleep(5)
    except KeyboardInterrupt:
        print("\n🛑 Simulator stopped.")

if __name__ == "__main__":
    simulate()
