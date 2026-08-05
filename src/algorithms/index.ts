import { executeTokenBucket } from "./tokenBucket";
import { ClientConfig } from "../types";
import { executeFixedWindow } from "./fixedWindow";

export async function executeAlgorithm(config: ClientConfig){
    switch(config.algorithm){
        case "token_bucket":
            return executeTokenBucket(
                config.apiKey,
                config.capacity,
                config.refillRate
            );

        case "fixed_window":
            return executeFixedWindow(
                config.apiKey,
                config.maxRequests!,
                config.windowSize!
            );
            
        default:
            throw new Error(
                `Unsupported algorithm: ${config.algorithm}`
            );    
    }
}