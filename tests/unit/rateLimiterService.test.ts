import { describe, expect, it, vi, beforeEach } from "vitest";

import { checkRateLimit } from "../../src/services/rateLimiterService";

import * as clientRepo from "../../src/repositories/clientRepository";
import * as algorithms from "../../src/algorithms";

vi.mock("../../src/repositories/clientRepository");

vi.mock("../../src/algorithms");

beforeEach(() => {
    vi.clearAllMocks();
});

it("returns a successful rate limit result", async () => {

    vi.spyOn(clientRepo, "getClient")
        .mockResolvedValue({
            clientId: "user1",
            apiKey: "sk_test",
            algorithm: "token_bucket",
            capacity: 10,
            refillRate: 2
        });

    vi.spyOn(algorithms, "executeAlgorithm")
        .mockResolvedValue({
            allowed: true,
            remaining: 9
        });

    const result = await checkRateLimit("sk_test");

    expect(result).toEqual({
        allowed: true,
        remaining: 9,
        capacity: 10
    });

});

it("throws when client does not exist", async () => {

    vi.spyOn(clientRepo, "getClient")
        .mockResolvedValue(null);

    await expect(
        checkRateLimit("invalid")
    ).rejects.toThrow("Client not found");

});

it("returns maxRequests for fixed window", async () => {

    vi.spyOn(clientRepo, "getClient")
        .mockResolvedValue({
            clientId: "user2",
            apiKey: "sk_test",
            algorithm: "fixed_window",
            windowSize: 60,
            maxRequests: 100
        });

    vi.spyOn(algorithms, "executeAlgorithm")
        .mockResolvedValue({
            allowed: true,
            remaining: 95
        });

    const result = await checkRateLimit("sk_test");

    expect(result.capacity).toBe(100);

});