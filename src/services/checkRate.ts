import { getClient } from "../clientRepository";
import { executeTokenBucket } from "../luaRepository";
import { RateLimitResult } from "../types";

export async function checkRateLimit(
    apiKey: string
): Promise<RateLimitResult> {

    const config = await getClient(apiKey);

    if (!config) {
        throw new Error("Client not found");
    }

    const result = await executeTokenBucket(
        apiKey,
        config.capacity,
        config.refillRate
    );

    return {
        allowed: result.allowed,
        tokensRemaining: result.tokensRemaining,
        capacity: config.capacity
    };
}