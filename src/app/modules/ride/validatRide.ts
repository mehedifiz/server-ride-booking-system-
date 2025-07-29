import { z } from "zod";

// Schema for location object
const locationSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

// Ride request schema
export const rideValidation = {
  requestRide: z.object({
    body: z.object({
      pickupLocation: locationSchema,
      destinationLocation: locationSchema,
    }),
  }),
};
