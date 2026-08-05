import { ZodTypeAny } from "zod";
import { Request, Response, NextFunction } from "express";

export const validate =
    (schema: ZodTypeAny) =>
    (req: Request, res: Response, next: NextFunction) => {

        const result = schema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                success: false,
                errors: result.error.issues,
            });
        }

        req.body = result.data;

        next();
    };