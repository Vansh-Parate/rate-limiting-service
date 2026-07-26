import express from "express";

import { checkRateLimit } from "../services/rateLimiterService";
import { getBucket } from "../repositories/bucketRepository";
import { logger } from "../logger";
import { asyncHandler } from "../middleware/asyncHandler"

const router = express.Router();

/**
 * @swagger
 * /check:
 *   post:
 *     summary: Check whether a request is allowed
 *     tags:
 *       - Rate Limiter
 *     parameters:
 *       - in: header
 *         name: X-API-Key
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rate limit evaluated
 */

router.post("/check", asyncHandler(async (req, res) => {

    const apiKey = req.get("X-API-Key");

    if (!apiKey) {
        return res.status(400).json({
            message: "Missing X-API-Key header"
        });
    }

    const result = await checkRateLimit(apiKey);

    logger.info({
        apiKey: apiKey.slice(0, 8) + "...",
        allowed: result.allowed,
        remaining: result.remaining
    }, "Rate limit checked");

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
})
);

router.get("/bucket/:apiKey", async (req, res) => {

    const bucket = await getBucket(req.params.apiKey);

    if (!bucket) {
        return res.status(404).json({
            message: "Bucket not found"
        });
    }

    res.json(bucket);
});

export default router;