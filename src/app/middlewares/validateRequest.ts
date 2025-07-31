import { Request, Response, NextFunction } from "express";

export const validateRequest =
  (schema: any) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: "Validation esdrror",
        errors: error,
      });
    }
  };
