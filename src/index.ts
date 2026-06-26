import express from "express";
import { ClientConfig } from "./types";
import { clients } from "./store";
import { allowRequest } from "./tokenBucket";
import { redis } from "./redis";
import { getBucket, saveBucket } from "./bucketRepository";

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

    if(clients.has(clientId)){
        return res.status(409).json({
            message: "Client already exits"
        })
    }

    const client: ClientConfig = {
        clientId,
        capacity,
        refillRate
    };

    clients.set(clientId, client);

    await saveBucket(clientId,{
        tokens: capacity,
        lastRefill: Date.now()
    })

    res.status(201).json(client);
})

app.get("/clients", (req, res) => {
    res.json(Array.from(clients.values()));
});

app.post("/check", async(req, res) => {
    const {clientId} = req.body;

    const config = clients.get(clientId)

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

app.get("/redis-bucket",async(req,res)=>{
    await saveBucket("demo",{
        tokens:10,
        lastRefill: Date.now()
    })

    const bucket = await getBucket("demo");

    res.json(bucket);
})

const PORT = 3000;

async function start(){
    await redis.connect();
    console.log("Redis connected");

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`)
    })
}

start();
