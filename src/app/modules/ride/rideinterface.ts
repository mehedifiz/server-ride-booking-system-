import { Types } from "mongoose";

export interface IRide extends Document {
  rider: Types.ObjectId;
  driver?: Types.ObjectId;
  status:
    | "requested"
    | "accepted"
    | "picked_up"
    | "in_transit"
    | "completed"
    | "cancelled";
  pickupLocation: { lat: number; lng: number };
  destinationLocation: { lat: number; lng: number };
  price: number;
  paymentStatus: "paid" | "unpaid";
  paymentMethod?: "online" | "cash";
  requestedAt: Date;
  acceptedAt?: Date;
  pickedUpAt?: Date;
  completedAt?: Date;
}
