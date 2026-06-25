export interface ClientConfig {
    clientId: string;
    capacity: number;
    refillRate: number;
  }

export interface Bucket {
    tokens: number;
    lastRefill: number;
}  
