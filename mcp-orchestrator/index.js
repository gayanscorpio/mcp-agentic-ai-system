import express from "express";
import cors from "cors";

import { plannerAgent } from "./agents/planner.js";
import { executorAgent } from "./agents/executor.js";
import { retryEngine } from "./agents/reflection.js";
import { saveMemory } from "./agents/memory.js";
import { v4 as uuidv4 } from "uuid";
import { fetchTools } from "./core/fetchTools.js"

const TOOLS = await fetchTools();

const app = express();
app.use(express.json());
app.use(cors());

// ---------------------- CONFIG ----------------------

const PORT = 8085;

// ---------------------- HEALTH ----------------------

app.get("/health", (req, res) => {
  res.json({
    status: "UP",
    service: "AGENTIC MCP ORCHESTRATOR"
  });
});

// ---------------------- CHAT (CLEAN ENTRY POINT) ----------------------

app.post("/chat", async (req, res) => {

  try {

    const message = req.body?.message;

    if (!message) {
      return res.status(400).json({ error: "message required" });
    }

    const sessionId = uuidv4();

    console.log("\n🧠 SESSION:", sessionId);

    // 1. PLANNER
    const plan = await plannerAgent(message);

    console.log("PLAN:", plan);

    let results = [];

    // 2. EXECUTION LOOP
    for (const step of plan) {

      console.log("\n⚙️ STEP:", step);

      // EXECUTE TOOL OR LLM
      let result = await executorAgent(step, TOOLS);

      // 3. REFLECTION (SELF-HEALING)
      const check = await retryEngine(step, result);

      if (check.retry) {
        console.log("🔁 RETRY:", step);
        result = await executorAgent(step);
      }

      results.push({ step, result });
    }

    // 4. MEMORY (Redis / DB)
    await saveMemory(sessionId, {
      message,
      plan,
      results
    });

    // 5. RESPONSE
    return res.json({
      type: "agentic-mcp",
      sessionId,
      plan,
      results
    });

  } catch (error) {

    console.error("❌ ERROR:", error.message);

    return res.status(500).json({
      error: "Agentic MCP failed",
      details: error.message
    });
  }
});

// ---------------------- START ----------------------

app.listen(PORT, () => {
  console.log("\n=================================");
  console.log(`🚀 MCP ORCHESTRATOR RUNNING`);
  console.log(`🌍 http://localhost:${PORT}`);
  console.log("=================================\n");
});