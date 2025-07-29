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
        return res.status(401).json({
          success: false,
          message: "You are not authorized! Token missing.",
        });
      }

      const decoded = jwt.verify(
        token,
        envVars.JWT_ACCESS_SECRET as string
      ) as JwtPayload;

      const { userId, role } = decoded;
      console.log("user", role);

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "This user is not found!",
        });
      }

      if (user.isBlocked) {
        return res.status(403).json({
          success: false,
          message: "Your account has been blocked.",
        });
      }

      if (requiredRoles.length > 0 && !requiredRoles.includes(role)) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized for this action.",
        });
      }

      req.user = { _id: userId, role };
      next();
    } catch (err: any) {
      res.status(401).json({
        success: false,
        message: err.message || "Unauthorized",
      });
    }
  };
