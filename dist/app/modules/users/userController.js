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
exports.userBlockStatus = exports.setuspendStatus = exports.Allusers = exports.setAvailability = exports.myRideHistory = void 0;
const rideModel_1 = require("../ride/rideModel");
const http_status_codes_1 = require("http-status-codes");
const userModel_1 = require("./userModel");
const myRideHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user || !("_id" in req.user)) {
            return res
                .status(401)
                .json({ success: false, message: "Unauthorized: user not found" });
        }
        const { _id } = req.user;
        const rides = yield rideModel_1.Ride.find({ rider: _id })
            .sort({ requestedAt: -1 })
            .populate("driver", "name email")
            .populate("rider", "name email");
        res.status(200).json({
            success: true,
            count: rides.length,
            rides,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});
exports.myRideHistory = myRideHistory;
const setAvailability = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { availability } = req.body;
        const valid = ["Online", "Offline"];
        if (!valid.includes(availability)) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Invalid availability status. Use 'Online' or 'Offline'.",
            });
        }
        // find
        const user = yield userModel_1.User.findById(id);
        if (!user) {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                success: false,
                message: "User not found",
            });
        }
        // Update
        user.availability = availability;
        yield user.save();
        res.status(http_status_codes_1.StatusCodes.OK).json({
            success: true,
            message: `Availability set to ${availability}`,
            data: user,
        });
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to update availability status",
            error: error.message,
        });
    }
});
exports.setAvailability = setAvailability;
const Allusers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filter } = req.query;
        const data = yield userModel_1.User.find(filter ? { role: filter } : {});
        console.log(data);
        // Send response
        res.json({
            success: true,
            count: data.length,
            data,
        });
    }
    catch (err) {
        res.json({
            success: false,
            message: "Error fetching data",
            error: err.message || err,
        });
    }
});
exports.Allusers = Allusers;
const setuspendStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { suspend } = req.body;
        const driver = yield userModel_1.User.findById(id);
        if (!driver || driver.role !== "driver") {
            return res
                .status(404)
                .json({ success: false, message: "Driver not found" });
        }
        driver.isSuspend = suspend;
        yield driver.save();
        res.json({
            success: true,
            message: `Driver has been ${suspend ? "suspended" : "approved"}`,
            driver,
        });
    }
    catch (error) {
        res
            .status(500)
            .json({ success: false, message: "Error updating driver status", error });
    }
});
exports.setuspendStatus = setuspendStatus;
const userBlockStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { block } = req.body;
        const user = yield userModel_1.User.findById(id);
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }
        user.isBlocked = block;
        yield user.save();
        res.json({
            success: true,
            message: `User has been ${block ? "blocked" : "unblocked"}`,
            user,
        });
    }
    catch (error) {
        res
            .status(500)
            .json({ success: false, message: "Error updating block status", error });
    }
});
exports.userBlockStatus = userBlockStatus;
