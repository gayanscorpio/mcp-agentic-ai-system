//👉 Redis storage

import { redis } from "../core/redis.js";

export async function saveMemory(sessionId, data) {
    const key = `session:${sessionId}:memory`;

    const existing = await redis.get(key);

    let memory = [];

    if (existing) {
        memory = JSON.parse(existing);
    }

    memory.push({
        timestamp: new Date().toISOString(),
        ...data
    });

    await redis.set(key, JSON.stringify(memory));

    return true;
}