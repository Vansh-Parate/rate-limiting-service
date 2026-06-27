import { getBucket, saveBucket } from "../bucketRepository";
import { getClient } from "../clientRepository";
import { allowRequest } from "../tokenBucket";
import { RateLimitResult } from "../types";
import { redis } from "../redis";

export async function checkRateLimit(
    clientId: string
): Promise<RateLimitResult> {

    for(let i=1;i<=5;i++){
        const config = await getClient(clientId);

        if (!config) {
            throw new Error("Client not found");
        }

        const bucketKey = `bucket:${clientId}`;
        await redis.watch(bucketKey);

        const bucket = await getBucket(clientId);

        if (!bucket) {
            throw new Error("Bucket not found");
        }

        const allowed = allowRequest(bucket, config);

        const tx = redis.multi();
        tx.set(
            bucketKey,
            JSON.stringify(bucket)
        );

        const result = await tx.exec();
        if (result === null) {
            console.log("Transaction conflict. Retrying...");
            continue;
        }

        return {
            allowed,
            tokensRemaining: Math.floor(bucket.tokens),
            capacity: config.capacity
        };
    }
    throw new Error(
        "Could not complete transaction after 5 retries."
    );
}