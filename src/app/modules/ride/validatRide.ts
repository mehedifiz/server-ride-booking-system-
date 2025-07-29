import { z } from "zod";

const locationSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

export const rideValidation = {
  requestRide: z.object({
    body: z.object({
      pickupLocation: locationSchema,
      destinationLocation: locationSchema,
      price: z.number().min(10, "Price must be a positive number"),
    }),
  }),
};
