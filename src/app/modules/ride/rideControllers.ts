import { Request, Response } from "express";
import { Ride } from "./rideModel";
import { sendResponse } from "../../utils/response";
import { StatusCodes } from "http-status-codes";
import { Types } from "mongoose";

export const requestRide = async (req: Request, res: Response) => {
  try {
    console.log("Request body:", req.body);
    const { pickupLocation, destinationLocation, price } = req.body;

    if (!pickupLocation || !destinationLocation || !price) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Pickup and destination locations are required",
      });
    }

    const ride = await Ride.create({
      rider: req.user?._id,
      pickupLocation,
      destinationLocation,
      price,
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

export const getallRides = async (req: Request, res: Response) => {
  try {
    const status = req.user?.role === "admin" ? "" : "requested";

    const rides = await Ride.find({ status: status })
      .populate("rider", "name email")
      .sort({ requestedAt: -1 });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Requested rides fetched successfully",
      data: rides,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch requested rides",
      error,
    });
  }
};

export const updateRideStatus = async (req: Request, res: Response) => {
  try {
    const { rideId } = req.params;
    const { status } = req.body;

    const validStatuses = [
      "accepted",
      "picked_up",
      "in_transit",
      "completed",
      "cancelled",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid ride status",
      });
    }

    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Ride not found",
      });
    }

    // Assign driver if ride is accepted
    if (status === "accepted" && req.user?._id) {
      ride?.driver = new Types.ObjectId(req.user._id);
      ride.acceptedAt = new Date();
    }

    if (status === "picked_up") {
      ride.pickedUpAt = new Date();
    }
    if (status === "completed") {
      ride.completedAt = new Date();
    }

    ride.status = status;
    await ride.save();

    res.status(StatusCodes.OK).json({
      success: true,
      message: `Ride status updated to ${status}`,
      data: ride,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to update ride status",
      error: (error as Error).message,
    });
  }
};

export const cancelRide = async (req: Request, res: Response) => {
  try {
    const { rideId } = req.params;
    const userId = (req as any).user._id;

    const ride = await Ride.findById(rideId);

    if (!ride) {
      return res
        .status(404)
        .json({ success: false, message: "Ride not found" });
    }

    if (ride.rider.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to cancel this ride",
      });
    }

    if (["completed", "cancelled"].includes(ride.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel a ${ride.status} ride`,
      });
    }

    ride.status = "cancelled";
    await ride.save();

    res.status(200).json({
      success: true,
      message: "Ride cancelled successfully",
      ride,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
