"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rideValidation = void 0;
const zod_1 = require("zod");
const locationSchema = zod_1.z.object({
    lat: zod_1.z.number(),
    lng: zod_1.z.number(),
});
exports.rideValidation = {
    requestRide: zod_1.z.object({
        body: zod_1.z.object({
            pickupLocation: locationSchema,
            destinationLocation: locationSchema,
            price: zod_1.z.number().min(10, "Price must be a positive number"),
        }),
    }),
};
