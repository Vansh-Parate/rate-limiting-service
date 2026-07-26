import express from "express";
import crypto from "crypto";
import { saveBucket } from "../repositories/bucketRepository";
import { getClient, saveClient } from "../repositories/clientRepository";
import { ClientConfig } from "../types";
import {validate } from "../middleware/validate"
import { clientSchema } from "../schemas/clientSchema";
import { asyncHandler } from "../middleware/asyncHandler"
import { logger } from "../logger";

const router = express.Router();

/**
 * @swagger
 * /client:
 *   post:
 *     summary: Create a new API client
 *     tags:
 *       - Client
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clientId:
 *                 type: string
 *               algorithm:
 *                 type: string
 *                 enum:
 *                   - token_bucket
 *                   - fixed_window
 *               capacity:
 *                 type: integer
 *               refillRate:
 *                 type: integer
 *               windowSize:
 *                 type: integer
 *               maxRequests:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Client created successfully
 */

router.post("/",validate(clientSchema), asyncHandler(async (req, res) => {

    const {
        clientId,
        capacity,
        refillRate,
        algorithm = "token_bucket",
        windowSize,
        maxRequests
    } = req.body;

    const apiKey =
        "sk_" + crypto.randomBytes(32).toString("hex");

    const client: ClientConfig = {
        clientId,
        apiKey,
        algorithm,
        capacity,
        refillRate,
        windowSize,
        maxRequests
    };

    await saveClient(client);

    if (client.algorithm === "token_bucket") {
        await saveBucket(apiKey, {
            tokens: client.capacity,
            lastRefill: Date.now()
        });
    }

    res.status(201).json(client);
    logger.info({
        clientId,
        algorithm
    }, "Client created");
})
);

router.get("/:apiKey", async (req, res) => {

    const client = await getClient(req.params.apiKey);

    if (!client) {
        return res.status(404).json({
            message: "Client not found"
        });
    }

    res.json(client);
});

export default router;