import "dotenv/config";
import app from "./app";
import { redis } from "./redis";
import { logger } from "./logger";

const PORT = Number(process.env.PORT) || 3000;

async function start() {
    await redis.connect();

    logger.info("Redis connected");

    app.listen(PORT, () => {
        logger.info(`Server running on http://localhost:${PORT}`);
    });
}

start();