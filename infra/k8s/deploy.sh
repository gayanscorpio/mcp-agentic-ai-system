#!/bin/bash

set -e

echo "🚀 Deploying MCP System..."

kubectl apply -f redis-deployment.yaml
kubectl apply -f redis-service.yaml

kubectl apply -f mcp-server-deployment.yaml
kubectl apply -f mcp-server-service.yaml

kubectl apply -f mcp-orchestrator-deployment.yaml
kubectl apply -f mcp-orchestrator-service.yaml

kubectl apply -f weather-deployment.yaml
kubectl apply -f weather-service.yaml

kubectl apply -f api-gateway-deployment.yaml
kubectl apply -f api-gateway-service.yaml

kubectl apply -f api-gateway-ingress.yaml
kubectl apply -f ingress.yaml

echo "✅ All services deployed!"
