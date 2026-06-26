import { redis } from "./redis";
import { Bucket } from "./types";

export async function saveBucket(
    clientId: string,
    bucket: Bucket
){
    await redis.set(
        `bucket:${clientId}`,
        JSON.stringify(bucket)
    )   
}

export async function getBucket(clientId:string): Promise<Bucket | null> {
    const data = await redis.get(`bucket:${clientId}`);

    if (!data) return null;

    return JSON.parse(data);
}