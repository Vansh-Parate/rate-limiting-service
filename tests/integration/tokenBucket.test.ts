import request from "supertest";
import { beforeAll, describe, expect, it } from "vitest";

import app from "../../src/app";
import { redis } from "../../src/redis";

beforeAll(async () => {
    if (!redis.isOpen) {
        await redis.connect();
    }
});

it("creates a token bucket client", async () => {

    const response = await request(app)
        .post("/client")
        .send({
            clientId: "integration-user",
            algorithm: "token_bucket",
            capacity: 3,
            refillRate: 1
        });

    expect(response.status).toBe(201);

    expect(response.body.apiKey).toBeDefined();

});

it("allows requests until bucket is empty", async () => {

    const client = await request(app)
        .post("/client")
        .send({
            clientId: "user",
            algorithm: "token_bucket",
            capacity: 2,
            refillRate: 0
        });

    const apiKey = client.body.apiKey;

    const r1 = await request(app)
        .post("/check")
        .set("X-API-Key", apiKey);

    expect(r1.body.allowed).toBe(true);

    const r2 = await request(app)
        .post("/check")
        .set("X-API-Key", apiKey);

    expect(r2.body.allowed).toBe(true);

    const r3 = await request(app)
        .post("/check")
        .set("X-API-Key", apiKey);

    expect(r3.body.allowed).toBe(false);

});

import { beforeEach } from "vitest";

beforeEach(async () => {
    await redis.flushDb();
});