//This is what makes it “agentic”
/**
 * 
👉 Checks:
failure?
retry needed?
 */

import axios from "axios";

export async function retryEngine(step, result) {

    const OLLAMA_URL = "http://localhost:11434/api/generate";

    const prompt = `
Check if result is valid.

Return JSON:
{ "retry": true/false }

Step:
${step}

Result:
${JSON.stringify(result)}
`;

    const res = await axios.post(OLLAMA_URL, {
        model: "mcp-llama3",
        prompt,
        stream: false
    });

    try {
        return JSON.parse(res.data.response);
    } catch {
        return { retry: false };
    }
}