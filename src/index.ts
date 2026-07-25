import "dotenv/config";
import express from "express";
import { redis } from "./redis";
import clientRoutes from "./routes/clientRoute"
import ratelimitRoutes from "./routes/ratelimitRoute"
import healthRoutes from "./routes/healthRoute"
import errorHandler from "./middleware/errorHandler"
import pinoHttp from "pino-http";
import { logger } from "./logger";

const app = express();

app.use(express.json());
app.use("/client",clientRoutes);
app.use("/",ratelimitRoutes);
app.use("/health",healthRoutes);
app.use(errorHandler);
app.use(pinoHttp({logger}));

app.get("/", (req, res) => {
    res.send("Rate limiter service running");
});


const PORT = 3000;

async function start(){
    await redis.connect();
    logger.info("Redis connected");

    app.listen(PORT, () => {
        logger.info(`Server running on http://localhost:${PORT}`)
    })
}

start();
