import { Request, Response, NextFunction } from "express";
import {logger} from "../logger"

export function errorHandler(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) {
    logger.error(err);

    if (res.headersSent) {
        return next(err);
    }

    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
}