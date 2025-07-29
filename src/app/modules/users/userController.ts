import { Request, Response } from "express";
import { Ride } from "../ride/rideModel";
import { StatusCodes } from "http-status-codes";
import { User } from "./userModel";

export const myRideHistory = async (req: Request, res: Response) => {
  try {
    if (!req.user || !("_id" in req.user)) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: user not found" });
    }
    const { _id } = req.user;

    const rides = await Ride.find({ rider: _id })
      .sort({ requestedAt: -1 })
      .populate("driver", "name email")
      .populate("rider", "name email");

    res.status(200).json({
      success: true,
      count: rides.length,
      rides,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const setAvailability = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { availability } = req.body;

    const valid = ["Online", "Offline"];
    if (!valid.includes(availability)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid availability status. Use 'Online' or 'Offline'.",
      });
    }

    // find
    const user = await User.findById(id);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "User not found",
      });
    }

    // Update
    user.availability = availability;
    await user.save();

    res.status(StatusCodes.OK).json({
      success: true,
      message: `Availability set to ${availability}`,
      data: user,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to update availability status",
      error: (error as Error).message,
    });
  }
};

export const Allusers = async (req: Request, res: Response) => {
  try {
    const { filter } = req.query;
    const data = await User.find(filter ? { role: filter } : {});

    // Send response
    res.json({
      success: true,
      count: data.length,
      data,
    });
  } catch (err) {
    res.json({
      success: false,
      message: "Error fetching data",
      error: err.message || err,
    });
  }
};

export const setuspendStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { suspend } = req.body;

    const driver = await User.findById(id);
    if (!driver || driver.role !== "driver") {
      return res
        .status(404)
        .json({ success: false, message: "Driver not found" });
    }

    driver.isSuspend = suspend;
    await driver.save();

    res.json({
      success: true,
      message: `Driver has been ${suspend ? "suspended" : "approved"}`,
      driver,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error updating driver status", error });
  }
};

export const userBlockStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { block } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.isBlocked = block;
    await user.save();

    res.json({
      success: true,
      message: `User has been ${block ? "blocked" : "unblocked"}`,
      user,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error updating block status", error });
  }
};
