import { Request, Response } from "express";
import { Ride, RideStatus } from "./rideModel";
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
    let rides;

    if (req.user?.role === "admin") {
      // Admin sees all rides
      rides = await Ride.find()
        .populate("rider", "name email")
        .sort({ requestedAt: -1 });
    } else {
      // Non-admin sees only requested rides
      rides = await Ride.find({ status: "requested" })
        .populate("rider", "name email")
        .sort({ requestedAt: -1 });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Rides fetched successfully",
      data: rides,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to fetch rides",
      error,
    });
  }
};
export const updateRideStatus = async (req: Request, res: Response) => {
  try {
    const { rideId } = req.params;
    const { status, payment } = req.body;

    const validStatuses: RideStatus[] = [
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

    const allowedTransitions: Record<RideStatus, RideStatus[]> = {
      requested: ["accepted", "cancelled"],
      accepted: ["picked_up"],
      picked_up: ["in_transit"],
      in_transit: ["completed"],
      completed: [],
      cancelled: [],
    };

    const currentStatus = ride.status as RideStatus;
    if (!allowedTransitions[currentStatus].includes(status)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: `Cannot change status from '${currentStatus}' to '${status}'`,
      });
    }

    if (status === "accepted" && req.user?._id) {
      ride.driver = new Types.ObjectId(req.user._id);
      ride.acceptedAt = new Date();
    }

    if (status === "picked_up") {
      ride.pickedUpAt = new Date();
    }
    if (status === "completed") {
      ride.completedAt = new Date();
    }
    // handcash
    if (payment === true) {
      ride.paymentStatus = "paid";
      ride.paymentMethod = "cash";
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

export const driveEarningsHistory = async (req: Request, res: Response) => {
  try {
    const driverId = req.user?._id;

    const rides = await Ride.find({
      driver: driverId,
      status: "completed",
      paymentStatus: "paid",
    })
      .sort({ completedAt: -1 })
      .select("price paymentMethod completedAt rider")
      .populate("rider", "name email");

    const totalEarnings = rides.reduce(
      (sum, ride) => sum + (ride.price || 0),
      0
    );

    res.status(200).json({
      success: true,
      count: rides.length,
      totalEarnings,
      rides,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
export const getMyRides = async (req: Request, res: Response) => {
  try {
    const rides = await Ride.find({
      rider: req.user?._id,
    }).sort({ requestedAt: -1 });

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Rider ride history fetched successfully",
      data: rides,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      message: "Error fetching rider ride history",
      data: error,
    });
  }
};

export const getMyAcceptedRides = async (req: Request, res: Response) => {
  try {
    const rides = await Ride.find({
      driver: req.user?._id,
      status: { $in: ["accepted", "completed"] },
    }).sort({ acceptedAt: -1 });

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Driver ride history fetched successfully",
      data: rides,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      message: "Error fetching driver ride history",
      data: error,
    });
  }
};
