#!/bin/bash
set -e
echo "🚀 Deploying HPA - auto scalling ..."

kubectl apply -f weather-hpa.yaml
kubectl apply -f mcp-server-hpa.yaml
kubectl apply -f mcp-orchestrator-hpa.yaml
kubectl apply -f api-gateway-hpa.yaml
kubectl apply -f finance-service-hpa.yaml
kubectl apply -f weather-service-hpa.yaml

echo "✅ All services deployed!"
