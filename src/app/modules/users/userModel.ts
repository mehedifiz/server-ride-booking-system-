import { model, Schema } from "mongoose";
import { IUser } from "./userInterface";

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "rider", "driver"],
    required: true,
  },
  isBlocked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const User = model<IUser>("User", userSchema);
