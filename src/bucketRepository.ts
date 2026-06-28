import { redis } from "./redis";
import { Bucket } from "./types";

export async function saveBucket(
    apiKey: string,
    bucket: Bucket
){
    await redis.set(
        `bucket:${apiKey}`,
        JSON.stringify(bucket)
    )   
}

export async function getBucket(apiKey:string): Promise<Bucket | null> {
    const data = await redis.get(`bucket:${apiKey}`);

    if (!data) return null;

    return JSON.parse(data);
}