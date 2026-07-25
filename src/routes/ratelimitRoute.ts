import express from "express";

import { checkRateLimit } from "../services/rateLimiterService";
import { getBucket } from "../repositories/bucketRepository";

const router = express.Router();

router.post("/check", async (req, res) => {

    const apiKey = req.get("X-API-Key");

    if (!apiKey) {
        return res.status(400).json({
            message: "Missing X-API-Key header"
        });
    }

    const result = await checkRateLimit(apiKey);

    res.setHeader(
        "X-RateLimit-Limit",
        result.capacity
    );

    res.setHeader(
        "X-RateLimit-Remaining",
        result.remaining
    );

    res.json({
        allowed: result.allowed,
        remaining: result.remaining
    });
});

router.get("/bucket/:apiKey", async (req, res) => {

    const bucket = await getBucket(req.params.apiKey);

    if (!bucket) {
        return res.status(404).json({
            message: "Bucket not found"
        });
    }

    res.json(bucket);
    logger.info({
        apiKey,
        algorithm: config.algorithm,
        allowed: result.allowed,
        remaining: result.remaining
    }, "Rate limit checked");
});

export default router;