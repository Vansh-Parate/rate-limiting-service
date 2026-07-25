import express from "express";
import { redis } from "../redis";

const router = express.Router();

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