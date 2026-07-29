import express from "express";
import pinoHttp from "pino-http";
import swaggerUi from "swagger-ui-express";

import clientRoutes from "./routes/clientRoute";
import ratelimitRoutes from "./routes/ratelimitRoute";
import healthRoutes from "./routes/healthRoute";

import { logger } from "./logger";
import { swaggerSpec } from "./config/swagger";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(express.json());
app.use(pinoHttp({ logger }));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/client", clientRoutes);
app.use("/", ratelimitRoutes);
app.use("/health", healthRoutes);

app.use(errorHandler);

export default app;