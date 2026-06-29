import { getClient } from "../repositories/clientRepository";
import { executeTokenBucket } from "../algorithms/tokenBucket";
import { RateLimitResult } from "../types";
import { executeAlgorithm } from "../algorithms";

export async function checkRateLimit(
    apiKey: string
): Promise<RateLimitResult> {

    const config = await getClient(apiKey);

    if (!config) {
        throw new Error("Client not found");
    }

    const result = await executeAlgorithm(config);

    return {
        allowed: result.allowed,
        tokensRemaining: result.tokensRemaining,
        capacity: config.capacity
    };
}