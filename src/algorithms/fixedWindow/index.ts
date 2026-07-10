import fs from "fs";
import { redis } from "../../redis";

const script = fs.readFileSync(
    "./src/algorithms/fixedWindow/fixedWindow.lua",
    "utf8"
);

export async function executeFixedWindow(
    apiKey: string,
    maxRequests: number,
    windowSize: number
) {
    const result = await redis.eval(script, {
        keys: [`fixed-window:${apiKey}`],
        arguments: [
            maxRequests.toString(),
            windowSize.toString(),
            Date.now().toString()
        ]
    });

    return JSON.parse(result as string);
}