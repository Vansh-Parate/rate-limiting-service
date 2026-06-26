import { redis } from "./redis";
import { ClientConfig } from "./types";

export async function saveClient(
    client: ClientConfig
){
    await redis.set(
        `client:${client.clientId}`,
        JSON.stringify(client)
    )   
}

export async function getClient(clientId:string): Promise<ClientConfig | null> {
    const data = await redis.get(`client:${clientId}`);

    if (!data) return null;

    return JSON.parse(data);
}