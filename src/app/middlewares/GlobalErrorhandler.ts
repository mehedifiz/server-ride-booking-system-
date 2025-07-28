import { Request, Response, NextFunction } from "express";

const GlobalerrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);

  const statusCode = err.status || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Something went wrong!",
  });
};

export default GlobalerrorHandler;
