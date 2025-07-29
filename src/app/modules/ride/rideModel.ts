import { Schema, model, Types } from "mongoose";

export type RideStatus =
  | "requested"
  | "accepted"
  | "picked_up"
  | "in_transit"
  | "completed"
  | "cancelled";

export type PaymentStatus = "paid" | "unpaid";
export type PaymentMethod = "online" | "cash";

const rideSchema = new Schema({
  rider: { type: Types.ObjectId, ref: "User", required: true },
  driver: { type: Types.ObjectId, ref: "User" },

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

  price: {
    type: Number,
    required: true,
    min: 10,
  },

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

export const Ride = model("Ride", rideSchema);
