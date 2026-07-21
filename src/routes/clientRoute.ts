import express from "express";
import crypto from "crypto";

import { saveBucket } from "../repositories/bucketRepository";
import { getClient, saveClient } from "../repositories/clientRepository";
import { ClientConfig } from "../types";

const router = express.Router();

router.post("/", async (req, res) => {

    const {
        clientId,
        capacity,
        refillRate,
        algorithm = "token_bucket",
        windowSize,
        maxRequests
    } = req.body;

    if (!clientId) {
        return res.status(400).json({
            message: "Missing clientId"
        });
    }

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

    if (algorithm === "token_bucket") {
        await saveBucket(apiKey, {
            tokens: capacity,
            lastRefill: Date.now()
        });
    }

    res.status(201).json(client);
});

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