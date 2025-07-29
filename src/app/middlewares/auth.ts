import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../modules/users/userModel";
import { envVars } from "../config/env";

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        role: "admin" | "rider" | "driver";
      };
    }
  }
}

export const auth =
  (...requiredRoles: ("admin" | "rider" | "driver")[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        throw new Error("You are not authorized!");
      }

      const decoded = jwt.verify(
        token,
        envVars.JWT_ACCESS_SECRET as string
      ) as JwtPayload;

      const { userId, role } = decoded;

      const user = await User.findById(userId);

      if (!user) {
        throw new Error("This user is not found!");
      }

      if (user.isBlocked) {
        throw new Error("User account is blocked");
      }

      if (requiredRoles.length > 0 && !requiredRoles.includes(role)) {
        throw new Error("You are not authorized for this action");
      }

      req.user = { _id: userId, role };

      next();
    } catch (err: any) {
      const status = err.statusCode || 401;
      res
        .status(status)
        .json({ success: false, message: err.message || "Unauthorized" });
    }
  };
