"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyAcceptedRides = exports.getMyRides = exports.driveEarningsHistory = exports.cancelRide = exports.updateRideStatus = exports.getallRides = exports.requestRide = void 0;
const rideModel_1 = require("./rideModel");
const response_1 = require("../../utils/response");
const http_status_codes_1 = require("http-status-codes");
const mongoose_1 = require("mongoose");
const requestRide = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        console.log("Request body:", req.body);
        const { pickupLocation, destinationLocation, price } = req.body;
        if (!pickupLocation || !destinationLocation || !price) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Pickup and destination locations are required",
            });
        }
        const ride = yield rideModel_1.Ride.create({
            rider: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
            pickupLocation,
            destinationLocation,
            price,
        });
        (0, response_1.sendResponse)(res, {
            statusCode: http_status_codes_1.StatusCodes.CREATED,
            success: true,
            message: "Ride requested successfully",
            data: ride,
        });
    }
    catch (error) {
        res
            .status(500)
            .json({ success: false, message: "Failed to request ride", error });
    }
});
exports.requestRide = requestRide;
const getallRides = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const status = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === "admin" ? "" : "requested";
        const rides = yield rideModel_1.Ride.find({ status: status })
            .populate("rider", "name email")
            .sort({ requestedAt: -1 });
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            message: "Requested rides fetched successfully",
            data: rides,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch requested rides",
            error,
        });
    }
});
exports.getallRides = getallRides;
const updateRideStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { rideId } = req.params;
        const { status, payment } = req.body;
        const validStatuses = [
            "accepted",
            "picked_up",
            "in_transit",
            "completed",
            "cancelled",
        ];
        if (!validStatuses.includes(status)) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Invalid ride status",
            });
        }
        const ride = yield rideModel_1.Ride.findById(rideId);
        if (!ride) {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Ride not found",
            });
        }
        const allowedTransitions = {
            requested: ["accepted", "cancelled"],
            accepted: ["picked_up"],
            picked_up: ["in_transit"],
            in_transit: ["completed"],
            completed: [],
            cancelled: [],
        };
        const currentStatus = ride.status;
        if (!allowedTransitions[currentStatus].includes(status)) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                success: false,
                message: `Cannot change status from '${currentStatus}' to '${status}'`,
            });
        }
        if (status === "accepted" && ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id)) {
            ride.driver = new mongoose_1.Types.ObjectId(req.user._id);
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
        yield ride.save();
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            message: `Ride status updated to ${status}`,
            data: ride,
        });
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to update ride status",
            error: error.message,
        });
    }
});
exports.updateRideStatus = updateRideStatus;
const cancelRide = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rideId } = req.params;
        const userId = req.user._id;
        const ride = yield rideModel_1.Ride.findById(rideId);
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
        yield ride.save();
        res.status(200).json({
            success: true,
            message: "Ride cancelled successfully",
            ride,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});
exports.cancelRide = cancelRide;
const driveEarningsHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const driverId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const rides = yield rideModel_1.Ride.find({
            driver: driverId,
            status: "completed",
            paymentStatus: "paid",
        })
            .sort({ completedAt: -1 })
            .select("price paymentMethod completedAt rider")
            .populate("rider", "name email");
        const totalEarnings = rides.reduce((sum, ride) => sum + (ride.price || 0), 0);
        res.status(200).json({
            success: true,
            count: rides.length,
            totalEarnings,
            rides,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});
exports.driveEarningsHistory = driveEarningsHistory;
const getMyRides = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const rides = yield rideModel_1.Ride.find({
            rider: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
        }).sort({ requestedAt: -1 });
        (0, response_1.sendResponse)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: "Rider ride history fetched successfully",
            data: rides,
        });
    }
    catch (error) {
        (0, response_1.sendResponse)(res, {
            statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            success: false,
            message: "Error fetching rider ride history",
            data: error,
        });
    }
});
exports.getMyRides = getMyRides;
const getMyAcceptedRides = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const rides = yield rideModel_1.Ride.find({
            driver: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
            status: { $in: ["accepted", "completed"] },
        }).sort({ acceptedAt: -1 });
        (0, response_1.sendResponse)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: "Driver ride history fetched successfully",
            data: rides,
        });
    }
    catch (error) {
        (0, response_1.sendResponse)(res, {
            statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            success: false,
            message: "Error fetching driver ride history",
            data: error,
        });
    }
});
exports.getMyAcceptedRides = getMyAcceptedRides;
