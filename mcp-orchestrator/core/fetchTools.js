import axios from "axios";

let cachedTools = null;

export async function fetchTools() {
    console.log("\n fetchTools ........ ");

    if (cachedTools) {
        return cachedTools;
    }

    const res = await axios.get("http://mcp-server:8086/tools");

    cachedTools = res.data;

    console.log("\n fetchTools ........+res data ", cachedTools);
    return cachedTools;
}