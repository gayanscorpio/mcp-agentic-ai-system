# mcp-agentic-ai-system

1. Redis (via Docker)
2. Ollama (via Docker)
3. MCP Server (Spring Boot)
4. API Gateway
5. MCP Orchestrator
6. Weather Service
7. Finance Service
8. Frontend UI
   

     2. Pull / Ensure LLM is Ready (Ollama)

       docker exec -it ollama-local ollama pull llama3

     3. Start MCP Server (Spring Boot)

       cd mcp-server
       mvn spring-boot:run

     4. Start API Gateway

       cd api-gateway
       mvn spring-boot:run

     5. Start MCP Orchestrator

       cd mcp-orchestrator
       mvn spring-boot:run

     6. Start Weather Service
  
       cd services/weather-service
       mvn spring-boot:run

     7. Start Finance Service
  
       cd services/finance-service
       mvn spring-boot:run

     8. Start Frontend UI

       cd frontend-chat-ui
       npm install
       npm run dev


                      

   
