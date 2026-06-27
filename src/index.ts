import express from "express";
import { ClientConfig } from "./types";
import { redis } from "./redis";
import { getBucket, saveBucket } from "./bucketRepository";
import { getClient, saveClient } from "./clientRepository";
import { checkRateLimit } from "./services/checkRate";

const app = express();

app.use(express.json());

app.get('/', (req,res) => {
    res.send("Rate limiter service running");
})

app.post('/client', async(req,res) => {
    console.log(req.body);

    const {clientId, capacity, refillRate } = req.body;

    if(!clientId || !capacity){
        return res.status(400).json({
            message: "Missing required fields"
        })
    }

    const client: ClientConfig = {
        clientId,
        capacity,
        refillRate
    };

    await saveClient(client);

    await saveBucket(clientId,{
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
    const result = await checkRateLimit(req.body.clientId);

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

import fs from "fs";

const script = fs.readFileSync(
    "./src/lua/tokenBucket.lua",
    "utf8"
);

const PORT = 3000;

async function start(){
    await redis.connect();
    console.log("Redis connected");

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`)
    })
}

start();
