import { getClient } from "../clientRepository";
import { executeTokenBucket } from "../luaRepository";
import { RateLimitResult } from "../types";

export async function checkRateLimit(
    clientId: string
): Promise<RateLimitResult> {

    const config = await getClient(clientId);

    if (!config) {
        throw new Error("Client not found");
    }

    const result = await executeTokenBucket(
        clientId,
        config.capacity,
        config.refillRate
    );

    return {
        allowed: result.allowed,
        tokensRemaining: result.tokensRemaining,
        capacity: config.capacity
    };
}