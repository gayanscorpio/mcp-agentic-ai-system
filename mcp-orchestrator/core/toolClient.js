//👉 Calls Spring Boot MCP server
import axios from "axios";

/**
 * MCP Tool Registry
 * Maps tool names → Spring Boot endpoints
 */
const TOOL_REGISTRY = {
    "weather.get": "/tools/weather.get",
    "finance.rates": "/tools/finance.rates",
    "travel.countries": "/tools/travel.get"
};

/**
 * Get full tool URL
 */
function getToolUrl(toolName, MCP_SERVER) {
    const path = TOOL_REGISTRY[toolName];

    if (!path) {
        throw new Error(`Unknown MCP tool: ${toolName}`);
    }

    return `${MCP_SERVER}${path}`;
}

/**
 * Safe tool execution with retries + timeout + error normalization
 */
export async function callTool({
    tool,
    input = {},
    MCP_SERVER,
    retries = 1,
    timeout = 15000
}) {
    if (!tool) {
        throw new Error("Tool name is required");
    }

    const url = getToolUrl(tool, MCP_SERVER);

    let attempt = 0;

    while (attempt <= retries) {
        try {
            console.log(`🛠 Calling MCP Tool: ${tool}`);
            console.log(`🌐 URL: ${url}`);
            console.log(`📦 Payload:`, input);
            console.log(`🔁 Attempt: ${attempt + 1}`);

            const response = await axios.post(url, input, {
                timeout,
                headers: {
                    "Content-Type": "application/json"
                }
            });

            console.log(`✅ Tool Success: ${tool}`);

            return {
                success: true,
                tool,
                data: response.data,
                attempt: attempt + 1
            };

        } catch (error) {

            console.log(`❌ Tool Failed: ${tool}`);
            console.log(`Reason:`, error.message);

            attempt++;

            if (attempt > retries) {
                return {
                    success: false,
                    tool,
                    error: "TOOL_EXECUTION_FAILED",
                    message: error.message,
                    attempts: attempt
                };
            }

            console.log(`🔁 Retrying tool: ${tool}`);
        }
    }
}

/**
 * Batch tool execution (future agentic workflows)
 */
export async function callToolsBatch({
    tasks = [],
    MCP_SERVER
}) {
    const results = [];

    for (const task of tasks) {
        const result = await callTool({
            tool: task.tool,
            input: task.input,
            MCP_SERVER
        });

        results.push({
            task,
            result
        });
    }

    return results;
}