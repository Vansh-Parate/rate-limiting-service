import fs from "fs";
import { redis } from "../../redis";
import path from "path";

const script = fs.readFileSync(
    path.join(__dirname, "tokenBucket.lua"),
    "utf8"
);

export async function executeTokenBucket(
    apiKey: string,
    capacity: number,
    refillRate: number
) {
    const result = await redis.eval(script, {
        keys: [`token_bucket:${apiKey}`],
        arguments: [
            capacity.toString(),
            refillRate.toString(),
            Date.now().toString()
        ]
    });

    return JSON.parse(result as string);
}