import fs from "fs";
import { redis } from "./redis";

const script = fs.readFileSync(
    "./src/lua/tokenBucket.lua",
    "utf8"
);

export async function executeTokenBucket(
    clientId: string,
    capacity: number,
    refillRate: number
) {
    const result = await redis.eval(script, {
        keys: [`bucket:${clientId}`],
        arguments: [
            capacity.toString(),
            refillRate.toString(),
            Date.now().toString()
        ]
    });

    return JSON.parse(result as string);
}