export interface ClientConfig {
    clientId: string;
    capacity: number;
    refillRate: number;
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