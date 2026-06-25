import express from "express";
import { ClientConfig } from "./types";
import { clients } from "./store";

const app = express();

app.use(express.json());

app.get('/', (req,res) => {
    res.send("Rate limiter service running");
})

app.post('/client', (req,res) => {
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

    clients.set(clientId, client)

    res.status(201).json(client);
})

app.get("/clients", (req, res) => {
    res.json(Array.from(clients.values()));
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})