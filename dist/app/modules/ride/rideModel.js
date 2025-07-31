"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ride = void 0;
const mongoose_1 = require("mongoose");
const rideSchema = new mongoose_1.Schema({
    rider: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    driver: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    status: {
        type: String,
        enum: [
            "requested",
            "accepted",
            "picked_up",
            "in_transit",
            "completed",
            "cancelled",
        ],
        default: "requested",
    },
    pickupLocation: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
    },
    destinationLocation: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
    },
    price: { type: Number, required: true, min: 10 },
    paymentStatus: {
        type: String,
        enum: ["paid", "unpaid"],
        default: "unpaid",
    },
    paymentMethod: {
        type: String,
        enum: ["online", "cash"],
    },
    requestedAt: { type: Date, default: Date.now },
    acceptedAt: Date,
    pickedUpAt: Date,
    completedAt: Date,
});
exports.Ride = (0, mongoose_1.model)("Ride", rideSchema);
