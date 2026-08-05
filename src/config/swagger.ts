import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Rate Limiter API",
            version: "1.0.0",
            description:
                "A Redis-backed rate limiter supporting Token Bucket and Fixed Window algorithms."
        },

        servers: [
            {
                url: `http://localhost:${process.env.PORT || 3000}`
            }
        ]
    },

    apis: ["./src/routes/*.ts"]
};

export const swaggerSpec = swaggerJsdoc(options);