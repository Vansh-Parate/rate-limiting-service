import { redis } from "./redis";
import { ClientConfig } from "./types";

export async function saveClient(
    client: ClientConfig
){
    await redis.set(
        `client:${client.apiKey}`,
        JSON.stringify(client)
    )   
}

export async function getClient(apiKey:string): Promise<ClientConfig | null> {
    const data = await redis.get(`client:${apiKey}`);

    if (!data) return null;

    return JSON.parse(data);
}