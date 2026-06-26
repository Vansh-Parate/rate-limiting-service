import { getBucket, saveBucket } from "../bucketRepository";
import { getClient } from "../clientRepository";
import { allowRequest } from "../tokenBucket";
import { RateLimitResult } from "../types";

export async function checkRateLimit(
    clientId: string
): Promise<RateLimitResult> {

    const config = await getClient(clientId);

    if (!config) {
        throw new Error("Client not found");
    }

    const bucket = await getBucket(clientId);

    if (!bucket) {
        throw new Error("Bucket not found");
    }

    const allowed = allowRequest(bucket, config);

    await saveBucket(clientId, bucket);

    return {
        allowed,
        tokensRemaining: Math.floor(bucket.tokens),
        capacity: config.capacity
    };
}