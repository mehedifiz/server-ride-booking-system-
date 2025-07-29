import { Request, Response } from "express";
import { Ride } from "../ride/rideModel";
import { User } from "../users/userModel";
import { sendResponse } from "../../utils/response";
import { StatusCodes } from "http-status-codes";

export const generateReport = async (req: Request, res: Response) => {
  try {
    const userCounts = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } },
    ]);

    const rideCounts = await Ride.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Report generated successfully",
      data: {
        userCounts,
        rideCounts,
      },
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      message: "Error generating report",
      data: error,
    });
  }
};
