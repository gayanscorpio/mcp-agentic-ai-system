/**
 * Executor Agent
 * Decides:
 * 1. Normal LLM response
 * 2. MCP Tool Execution
 */

import axios from "axios";
import { callTool } from "../core/toolClient.js";
import { buildToolPrompt } from "../core/llm.js";

//const OLLAMA_URL = "http://localhost:11434/api/generate";
const OLLAMA_URL =
    process.env.OLLAMA_URL ||
    "http://host.docker.internal:11434/api/generate";

export async function executorAgent(step, tools) {

    console.log("\n=================================");
    console.log("⚙️ EXECUTOR AGENT STARTED");
    console.log("=================================");

    console.log("📝 STEP:");
    console.log(step);

    console.log("\n🔧 AVAILABLE TOOLS:");
    console.log(JSON.stringify(tools, null, 2));

    // -----------------------------------------
    // BUILD PROMPT
    // -----------------------------------------

    const prompt = buildToolPrompt(tools) + "\n\nTask:\n" + step;

    console.log("\n📤 TOOL SELECTION PROMPT:");
    console.log(prompt);

    try {

        // -----------------------------------------
        // OLLAMA CALL
        // -----------------------------------------

        console.log("\n🚀 CALLING OLLAMA...");
        console.log("URL:", OLLAMA_URL);

        const res = await axios.post(
            OLLAMA_URL,
            {
                model: "mcp-llama3",
                prompt,
                stream: false,
                options: {
                    temperature: 0.1
                }
            },
            {
                timeout: 60000
            }
        );

        console.log("\n✅ OLLAMA RESPONSE RECEIVED");

        console.log("\n📦 FULL OLLAMA RESPONSE:");
        console.log(JSON.stringify(res.data, null, 2));

        const llmResponse =
            res.data?.response || "";

        console.log("\n🧠 RAW LLM OUTPUT:");
        console.log(llmResponse);

        // -----------------------------------------
        // JSON PARSE
        // -----------------------------------------

        let toolRequest;

        try {

            toolRequest = JSON.parse(llmResponse);

            console.log("\n✅ TOOL JSON PARSED:");
            console.log(JSON.stringify(
                toolRequest,
                null,
                2
            ));

        } catch (e) {

            console.log("\n⚠️ NOT A TOOL REQUEST");
            console.log("Reason:", e.message);

            console.log("\n💬 RETURNING TEXT RESPONSE");

            return {
                type: "text",
                response: llmResponse
            };
        }

        // -----------------------------------------
        // TOOL EXECUTION
        // -----------------------------------------

        if (toolRequest.tool) {

            console.log("\n=================================");
            console.log("🛠 MCP TOOL DETECTED");
            console.log("=================================");

            console.log("Tool:");
            console.log(toolRequest.tool);

            console.log("\nInput:");
            console.log(
                JSON.stringify(
                    toolRequest.input,
                    null,
                    2
                )
            );

            const startTime = Date.now();

            const toolResult =
                await callTool({
                    tool: toolRequest.tool,
                    input: toolRequest.input,
                    MCP_SERVER: "http://mcp-server:8086",
                    retries: 2
                });

            const duration =
                Date.now() - startTime;

            console.log("\n✅ TOOL EXECUTION COMPLETED");

            console.log("⏱ Duration:");
            console.log(duration + " ms");

            console.log("\n📦 TOOL RESULT:");
            console.log(
                JSON.stringify(
                    toolResult,
                    null,
                    2
                )
            );

            console.log("\n=================================");
            console.log("⚙️ EXECUTOR AGENT COMPLETED");
            console.log("=================================\n");

            return toolResult;
        }

        console.log("\n📄 JSON RESPONSE WITHOUT TOOL");

        console.log(
            JSON.stringify(
                toolRequest,
                null,
                2
            )
        );

        return toolRequest;

    } catch (error) {

        console.log("\n=================================");
        console.log("❌ EXECUTOR AGENT FAILED");
        console.log("=================================");

        console.log("Message:");
        console.log(error.message);

        if (error.response) {

            console.log("\n📦 RESPONSE STATUS:");
            console.log(error.response.status);

            console.log("\n📦 RESPONSE DATA:");
            console.log(error.response.data);
        }

        console.log("\n📚 STACK:");
        console.log(error.stack);

        throw error;
    }
}