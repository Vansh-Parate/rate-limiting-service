import { executeTokenBucket } from "./tokenBucket";
import { ClientConfig } from "../types";

export async function executeAlgorithm(config: ClientConfig){
    switch(config.algorithm){
        case "token_bucket":
            return executeTokenBucket(
                config.apiKey,
                config.capacity,
                config.refillRate
            );
        default:
            throw new Error(
                `Unsupported algorithm: ${config.algorithm}`
            );    
    }
}