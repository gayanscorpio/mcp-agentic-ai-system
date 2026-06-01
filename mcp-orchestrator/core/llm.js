export function buildToolPrompt(tools) {

  console.log("\n=================================");
  console.log("🧠 BUILDING TOOL PROMPT");
  console.log("=================================");

  let toolDescriptions = "";

  Object.entries(tools).forEach(([name, t], i) => {

    toolDescriptions += `
${i + 1}. ${name}

Description:
${t.description}

Method:
${t.method}

Input Example:
${JSON.stringify(t.exampleInput, null, 2)}

Endpoint:
${t.url}

`;
  });

  const finalPrompt = `
You are a Tool Selector AI.

Your responsibilities:
- Select the MOST relevant tool
- Understand the user task carefully
- Return ONLY valid JSON
- No explanations
- No markdown

Available tools:

${toolDescriptions}

Rules:

- Weather questions → use weather.get
- Currency or exchange rate questions → use finance.rates
- Financial conversion → use finance.rates

Return format:

{
  "tool": "tool.name",
  "input": {}
}

Task:
`;

  console.log(finalPrompt);

  return finalPrompt;
}