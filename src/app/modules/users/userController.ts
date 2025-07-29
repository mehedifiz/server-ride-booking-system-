import { Request, Response } from "express";
import { Ride } from "../ride/rideModel";

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
