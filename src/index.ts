import "dotenv/config";
import express from "express";
import { redis } from "./redis";
import clientRoutes from "./routes/clientRoute"
import ratelimitRoutes from "./routes/ratelimitRoute"

const app = express();

app.use(express.json());
app.use("/client",clientRoutes);
app.use("/",ratelimitRoutes);

app.get("/", (req, res) => {
    res.send("Rate limiter service running");
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
