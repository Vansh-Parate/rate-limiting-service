import { getClient } from "../repositories/clientRepository";
import { RateLimitResult, ClientConfig } from "../types";
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
        remaining: result.remaining,
        capacity: getLimit(config)
    };
}

function getLimit(config: ClientConfig): number {
    switch (config.algorithm) {
        case "token_bucket":
            return config.capacity;

        case "fixed_window":
            return config.maxRequests!;

        default:
            throw new Error("Unsupported algorithm");
    }
}