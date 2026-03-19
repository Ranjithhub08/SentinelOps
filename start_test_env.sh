#!/bin/bash

echo "Starting SentinelOps Testing Environment..."

# 1. Start Infrastructure
echo "Starting Kafka via Docker Compose..."
cd infrastructure/docker
docker-compose up -d
cd ../..

echo "Waiting for Kafka to be ready..."
sleep 15

# 2. Start Backend Services
SERVICES=("log-ingestion-service" "metrics-collector-service" "anomaly-detection-service" "incident-management-service" "root-cause-analysis-service" "llm-explanation-service" "alert-service")
PORTS=(8001 8002 8003 8004 8005 8006 8007)

mkdir -p logs

for i in "${!SERVICES[@]}"; do
    SERVICE="${SERVICES[$i]}"
    PORT="${PORTS[$i]}"
    echo "Starting $SERVICE on port $PORT..."
    
    cd "services/$SERVICE"
    
    # Create venv if not exists
    if [ ! -d "venv" ]; then
        python3 -m venv venv
    fi
    
    # Install reqs using the venv pip directly
    ./venv/bin/pip install -r requirements.txt > /dev/null 2>&1
    
    # Run service using the venv uvicorn directly
    PYTHONPATH=src nohup ./venv/bin/uvicorn src.main:app --host 0.0.0.0 --port "$PORT" > "../../logs/${SERVICE}.log" 2>&1 &
    
    cd ../..
done

# 3. Start Frontend Dashboard
echo "Starting Next.js Frontend Dashboard..."
cd frontend/incident-dashboard
npm install > /dev/null 2>&1
nohup npm run dev > "../../logs/frontend.log" 2>&1 &
cd ../..

echo "All services initiated! Checking status..."
sleep 10
echo "Done."
