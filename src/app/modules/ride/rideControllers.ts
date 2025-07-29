import { Request, Response } from "express";
import { Ride } from "./rideModel";
import { sendResponse } from "../../utils/response";
import { StatusCodes } from "http-status-codes";
import { CLIENT_RENEG_LIMIT } from "tls";

export const requestRide = async (req: Request, res: Response) => {
  try {
    console.log("Request body:", req.body);
    const { pickupLocation, destinationLocation } = req.body;

    if (!pickupLocation || !destinationLocation) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Pickup and destination locations are required",
      });
    }

    const ride = await Ride.create({
      rider: req.user?._id,
      pickupLocation,
      destinationLocation,
    });

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Ride requested successfully",
      data: ride,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to request ride", error });
  }
};
