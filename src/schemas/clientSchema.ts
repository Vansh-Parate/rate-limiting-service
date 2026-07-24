import { z } from "zod";

const tokenBucketSchema = z.object({
    clientId: z.string().min(1),

    algorithm: z.literal("token_bucket"),

    capacity: z.number().positive(),

    refillRate: z.number().nonnegative()
});

const fixedWindowSchema = z.object({
    clientId: z.string().min(1),

    algorithm: z.literal("fixed_window"),

    windowSize: z.number().positive(),

    maxRequests: z.number().positive()
});

export const clientSchema = z.discriminatedUnion("algorithm", [
    tokenBucketSchema,
    fixedWindowSchema
]);