import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendResponse } from "../../utils/response";
import { User } from "../users/userModel";
import { envVars } from "../../config/env";
import { StatusCodes } from "http-status-codes";


export const register = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "All fields are required.",
      data: null as any,
    });
  }

  const userExists = await User.findOne({ email: email });
  if (userExists) {
    return sendResponse(res, {
      statusCode: httpStatus.CONFLICT,
      success: false,
      message: "User already exists with this email.",
      data: null as any,
    });
  }
  const hashedPassword = await bcrypt.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
  });
  return sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User registered successfully.",
    data: newUser,
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "Email and password are required.",
      data: null as any,
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return sendResponse(res, {
        statusCode: httpStatus.UNAUTHORIZED,
        success: false,
        message: "Invalid email or password.",
        data: null as any,
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return sendResponse(res, {
        statusCode: httpStatus.UNAUTHORIZED,
        success: false,
        message: "Invalid email or password.",
        data: null as any,
      });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      envVars.JWT_ACCESS_SECRET,
      { expiresIn: "7d" }
    );

    // Set token in HTTP-only cookie
   res.cookie("token", token, {
  httpOnly: true,
  secure: false,         
  sameSite: "lax",  
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

    return sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Login successful.",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token, // optional, but you can still return it
      },
    });
  } catch (error: any) {
    return sendResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: error.message,
      data: null as any,
    });
  }
}


export const Getme = async (req: Request, res: Response) => {
  try {
    // req.user is populated by your auth middleware
    const userId = req.user?._id;

    if (!userId) {
      return sendResponse(res, {
        statusCode: StatusCodes.UNAUTHORIZED,
        success: false,
        message: "You are not authorized!",
        data: null as any,
      });
    }

    const user = await User.findById(userId).select("-password"); // exclude password

    if (!user) {
      return sendResponse(res, {
        statusCode: StatusCodes.NOT_FOUND,
        success: false,
        message: "User not found",
        data: null as any,
      });
    }

    return sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "User data fetched successfully",
      data: user,
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


export const logout = async (req: Request, res: Response) => {
  try {
    // Clear the token cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict", // or 'lax' depending on your login cookie setup
    });

    return sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Logged out successfully",
      data: null as any,
    });
  } catch (error: any) {
    return sendResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: error.message || "Something went wrong",
      data: null as any,
    });
  }
};