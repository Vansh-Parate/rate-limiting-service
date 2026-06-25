import express from "express";

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

    res.status(201).json({
        message: "Client created"
    })
})

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})