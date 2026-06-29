export type RateLimitAlgo =
  | "token_bucket"
  | "fixed_window";

export interface ClientConfig {
    clientId: string;
    capacity: number;
    algorithm: RateLimitAlgo
    refillRate: number;
    apiKey: string;
  }

export interface Bucket {
    tokens: number;
    lastRefill: number;
}  

export interface RateLimitResult {
  allowed: boolean;
  tokensRemaining: number;
  capacity: number;
}