export type RateLimitAlgo =
  | "token_bucket"
  | "fixed_window";

export interface ClientConfig {
    clientId: string;
    algorithm: RateLimitAlgo
    apiKey: string;

    refillRate: number;
    capacity: number;

    windowSize?: number;
    maxRequests?: number;
  }

export interface AlgorithmResult {
    allowed: boolean;
    remaining: number;
}

export interface Bucket {
    tokens: number;
    lastRefill: number;
}  

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  capacity: number;
}