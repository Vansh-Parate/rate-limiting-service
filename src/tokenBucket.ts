import { Bucket, ClientConfig } from "./types";

export function allowRequest(
    bucket: Bucket,
    config: ClientConfig
): boolean {
    const now = Date.now();
    const elapsed = (now - bucket.lastRefill)/1000;
    const refill = elapsed * config.refillRate

    bucket.tokens = Math.min(
        config.capacity,
        bucket.tokens + refill
    )

    bucket.lastRefill = now;

    if(bucket.tokens<1){
        return false;
    }

    bucket.tokens -= 1
    return true;
}