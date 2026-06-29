import express from "express";
import { ClientConfig } from "./types";
import { redis } from "./redis";
import { getBucket, saveBucket } from "./repositories/bucketRepository";
import { getClient, saveClient } from "./repositories/clientRepository";
import { checkRateLimit } from "./services/rateLimiterService";
import crypto from "crypto"

const app = express();

app.use(express.json());

app.get('/', (req,res) => {
    res.send("Rate limiter service running");
})

app.post('/client', async(req,res) => {
    console.log(req.body);

    const {clientId, capacity, refillRate,algorithm="token_bucket" } = req.body;

    if(!clientId || !capacity){
        return res.status(400).json({
            message: "Missing required fields"
        })
    }

    const apiKey =
    "sk_" + crypto.randomBytes(32).toString("hex");

    const client: ClientConfig = {
        clientId,
        capacity,
        apiKey,
        refillRate,
        algorithm
    };

    await saveClient(client);

    await saveBucket(apiKey,{
        tokens: capacity,
        lastRefill: Date.now()
    })

    res.status(201).json(client);
})

app.get("/client/:clientId",async(req,res)=>{
    const client = await getClient(req.params.clientId);

    if(!client){
        return res.status(404).json({
            message: "Not found"
        })
    }

    res.json(client);
})

app.get("/bucket/:clientId",async(req,res)=>{
    const bucket = await getBucket(req.params.clientId);

    if(!bucket){
        return res.status(404).json({
            message: "Not found"
        })
    }

    res.json(bucket);
})

app.post("/check", async(req, res) => {
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
    )
    res.setHeader(
            "X-RateLimit-Remaining",
            result.tokensRemaining
    )
    res.json({
            allowed: result.allowed,
            tokensRemaining: result.tokensRemaining
    });
});

const PORT = 3000;

async function start(){
    await redis.connect();
    console.log("Redis connected");

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`)
    })
}

start();
