import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../modules/users/userModel";
import { envVars } from "../config/env";
import { sendResponse } from "../utils/response";
import { StatusCodes } from "http-status-codes";

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
      // Get token from cookie
      const token = req.cookies?.token;

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "You are not authorized! Token missing.",
        });
      }

      // Verify JWT
      const decoded = jwt.verify(
        token,
        envVars.JWT_ACCESS_SECRET as string
      ) as JwtPayload;

      const { userId, role } = decoded;

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


  export const logout = async (req: Request, res: Response) => {
  try {
    // Clear the token cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict", // or 'lax' depending on your login cookie setup
    });

    return sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Logged out successfully",
      data: null as any,
    });
  } catch (error: any) {
    return sendResponse(res, {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      message: error.message || "Something went wrong",
      data: null as any,
    });
  }
};