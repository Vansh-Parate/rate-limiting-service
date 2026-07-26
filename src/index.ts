import "dotenv/config";
import express from "express";
import { redis } from "./redis";
import clientRoutes from "./routes/clientRoute"
import ratelimitRoutes from "./routes/ratelimitRoute"
import healthRoutes from "./routes/healthRoute"
import { errorHandler } from "./middleware/errorHandler"
import pinoHttp from "pino-http";
import { logger } from "./logger";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";

console.log("INDEX FILE LOADED");

const app = express();

app.use(express.json());

app.use(pinoHttp({logger}));
app.get("/hello", (_, res) => {
    res.send("hello");
});
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);
app.use("/client",clientRoutes);
app.use("/",ratelimitRoutes);
app.use("/health",healthRoutes);

app.get("/", (req, res) => {
    res.send("Rate limiter service running");
});

app.use(errorHandler);

const PORT = Number(process.env.PORT) || 3000;

async function start(){
    await redis.connect();
    logger.info("Redis connected");

    app.listen(PORT, () => {
        logger.info(`Server running on http://localhost:${PORT}`)
    })
}

start();
