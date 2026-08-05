import { describe, expect, it } from "vitest";
import { clientSchema } from "../../src/schemas/clientSchema";

describe("Client Schema", () => {

    it("accepts a valid token bucket client", () => {

        const result = clientSchema.safeParse({
            clientId: "user1",
            algorithm: "token_bucket",
            capacity: 10,
            refillRate: 2
        });

        expect(result.success).toBe(true);

    });

    it("rejects negative capacity", () => {

        const result = clientSchema.safeParse({
            clientId: "user1",
            algorithm: "token_bucket",
            capacity: -5,
            refillRate: 2
        });

        expect(result.success).toBe(false);

    });

});