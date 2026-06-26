import express from "express";
import { ClientConfig } from "./types";
import { allowRequest } from "./tokenBucket";
import { redis } from "./redis";
import { getBucket, saveBucket } from "./bucketRepository";
import { getClient, saveClient } from "./clientRepository";

const app = express();

app.use(express.json());

app.get('/', (req,res) => {
    res.send("Rate limiter service running");
})

app.post('/client', async(req,res) => {
    console.log(req.body);

    const {clientId, capacity, refillRate } = req.body;

    if(!clientId || !capacity || !refillRate){
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
    const {clientId} = req.body;

    const config = await getClient(clientId);

    if(!config){
        return res.status(409).json({
            message: "Client not found"
        })
    }
    
    const bucket = await getBucket(clientId);

    if(!bucket){
        return res.status(500).json({
            message: "Bucket not found"
        });
    }

    const allowed = allowRequest(bucket, config);

    await saveBucket(clientId, bucket);
    console.log(bucket.tokens);
    
    res.json({
        allowed
    })   
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
