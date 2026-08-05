import express from "express";
import { redis } from "../redis";
import { logger } from "../logger";

const router = express.Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Check service health
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: Service is healthy
 */

router.get("/", async (_, res) => {
    try {
        const pong = await redis.ping();

        res.status(200).json({
            status: "UP",
            redis: pong,
            timestamp: new Date().toISOString()
        });
    } catch {
        res.status(503).json({
            status: "DOWN",
            redis: "Unavailable",
            timestamp: new Date().toISOString()
        });
    }
    logger.info("Health check");
});

export default router;