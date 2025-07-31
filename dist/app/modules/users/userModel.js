"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ["admin", "rider", "driver"],
        required: true,
    },
    isBlocked: { type: Boolean, default: false },
    availability: {
        type: String,
        enum: ["Online", "Offline"],
        required: true,
        default: "Online",
    },
    isSuspend: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});
exports.User = (0, mongoose_1.model)("User", userSchema);
