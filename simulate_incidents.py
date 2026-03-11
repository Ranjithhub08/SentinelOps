import json
import time
import random
from datetime import datetime
from kafka import KafkaProducer

# Configuration
KAFKA_BOOTSTRAP_SERVERS = 'localhost:9092'
ANOMALIES_TOPIC = 'anomalies.detected'

# Sample data for simulation
SERVICES = ['payment-api', 'auth-service', 'inventory-db', 'gateway-node', 'recommendation-engine']
ANOMALY_TYPES = [
    ('HIGH_CPU', '98.5%'),
    ('HIGH_LATENCY', '2500ms'),
    ('HIGH_ERROR_RATE', '15%'),
    ('MEMORY_LEAK', '92% utilization'),
    ('REST_API_FAILURE', '503 Service Unavailable')
]

def simulate():
    print(f"🚀 Starting SentinelOps Incident Simulator...")
    print(f"📡 Connecting to Kafka at {KAFKA_BOOTSTRAP_SERVERS}...")
    
    try:
        producer = KafkaProducer(
            bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
            value_serializer=lambda v: json.dumps(v, default=str).encode('utf-8')
        )
    except Exception as e:
        print(f"❌ Failed to connect to Kafka: {e}")
        return

    print(f"✅ Connected! Injecting anomalies every 5-10 seconds...")
    print(f"Press Ctrl+C to stop.\n")

    try:
        while True:
            service = random.choice(SERVICES)
            a_type, a_value = random.choice(ANOMALY_TYPES)
            
            event = {
                "service": service,
                "type": a_type,
                "value": a_value,
                "timestamp": datetime.utcnow().isoformat()
            }
            
            print(f"🔥 Injecting Anomaly: {service} | {a_type} ({a_value})")
            producer.send(ANOMALIES_TOPIC, value=event)
            producer.flush()
            
            wait_time = random.uniform(5, 12)
            time.sleep(wait_time)
            
    except KeyboardInterrupt:
        print("\n🛑 Simulator stopped.")
    finally:
        producer.close()

if __name__ == "__main__":
    simulate()
