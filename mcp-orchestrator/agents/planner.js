// 👉 Planner Agent
// Breaks user request into executable steps

import axios from "axios";

const OLLAMA_URL = "http://localhost:11434/api/generate";

export async function plannerAgent(message) {

    console.log("\n=================================");
    console.log("🧠 PLANNER AGENT STARTED");
    console.log("=================================");
    console.log("👤 USER REQUEST:", message);

    const prompt = `
You are a Senior AI Planning Agent inside an Agentic MCP platform.

MISSION

Analyze the user request and create an execution plan.

Your plan will be executed by downstream agents.

AVAILABLE CAPABILITIES

1. weather.get
   Purpose:
   - Current weather
   - Temperature
   - Rain conditions
   - Climate information

2. finance.rates
   Purpose:
   - Currency exchange rates
   - Forex information
   - Currency conversion

3. travel.countries
   Purpose:
   - Travel destinations
   - Country information
   - Tourism information
   - Visa-related information

PLANNING RULES

1. Break complex requests into atomic executable steps.

2. Each step must represent ONE action only.

3. Do not combine multiple actions in a single step.

BAD:
[
  "Get weather and exchange rate"
]

GOOD:
[
  "Get weather in Colombo",
  "Get USD to LKR exchange rate"
]

4. Preserve execution order.

5. If a later step depends on an earlier step,
   place them in dependency order.

Example:

User:
"Should I travel to Japan next week if weather is good?"

Plan:
[
  "Get weather information for Japan",
  "Evaluate travel suitability for Japan based on weather"
]

6. If no external tool is required,
   create a single reasoning step.

Example:

User:
"Explain Java microservices"

Plan:
[
  "Explain Java microservices"
]

7. Never execute tools yourself.

8. Never answer the user question.

9. Only create the execution plan.

10. Return ONLY valid JSON array.

11. No markdown.

12. No explanations.

13. No extra text.

EXAMPLES

User:
weather in Colombo

Output:
[
  "Get weather in Colombo"
]

User:
weather in Colombo and USD to LKR rate

Output:
[
  "Get weather in Colombo",
  "Get USD to LKR exchange rate"
]

User:
weather, finance and travel information for Sri Lanka

Output:
[
  "Get weather in Sri Lanka",
  "Get currency exchange rates relevant to Sri Lanka",
  "Get travel information for Sri Lanka"
]

User:
Can I travel to Japan if the weather is rainy?

Output:
[
  "Get weather information for Japan",
  "Determine whether rainy weather affects travel suitability for Japan"
]

USER REQUEST

${message}

Return ONLY valid JSON array.
`;

    try {

        const res = await axios.post(OLLAMA_URL, {
            model: "mcp-llama3",
            prompt,
            stream: false,
            options: {
                temperature: 0.1
            }
        });

        console.log("\n📦 RAW PLANNER RESPONSE:");
        console.log(res.data.response);

        let parsed;

        try {

            parsed = JSON.parse(res.data.response);

        } catch (e) {

            console.log("\n⚠️ JSON PARSE FAILED");
            console.log("Fallback to single step");

            parsed = [message];
        }

        console.log("\n✅ FINAL PLAN:");
        console.log(parsed);

        console.log("=================================\n");

        return parsed;

    } catch (error) {

        console.log("\n❌ PLANNER ERROR");
        console.log(error.message);

        return [message];
    }
}