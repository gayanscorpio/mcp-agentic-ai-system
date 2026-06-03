import axios from "axios";

const OLLAMA_URL =
    "http://localhost:11434/api/generate";

export async function formatterAgent(
    userMessage,
    results
) {

    console.log("\n=================================");
    console.log("📝 FORMATTER AGENT STARTED");
    console.log("=================================");

    console.log("USER QUESTION:");
    console.log(userMessage);

    console.log("\nRAW RESULTS:");
    console.log(
        JSON.stringify(results, null, 2)
    );

    const prompt = `
You are an AI Response Formatter.

Your responsibility:

- Convert raw MCP tool outputs into a professional answer.
- Use natural language.
- Summarize JSON.
- Keep answers concise.
- If multiple tool results exist, combine them.
- Never explain tools.
- Never mention MCP.
- Never mention JSON.

USER QUESTION:

${userMessage}

TOOL RESULTS:

${JSON.stringify(results, null, 2)}

Create final answer.
`;

    try {

        const res = await axios.post(
            OLLAMA_URL,
            {
                model: "mcp-llama3",
                prompt,
                stream: false,
                options: {
                    temperature: 0.2
                }
            }
        );

        const answer =
            res.data.response || "";

        console.log("\n✅ FINAL ANSWER:");
        console.log(answer);

        return answer;

    } catch (error) {

        console.error(
            "❌ FORMATTER ERROR:",
            error.message
        );

        return JSON.stringify(
            results,
            null,
            2
        );
    }
}