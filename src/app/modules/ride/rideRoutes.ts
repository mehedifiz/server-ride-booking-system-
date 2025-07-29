import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { requestRide } from "./rideControllers";
import { validateRequest } from "../../middlewares/validateRequest";
import { rideValidation } from "./validatRide";

const router = Router();

router.post(
  "/request",
  auth("rider"),
  router.post(
    "/request",
    auth("rider"),
    validateRequest(rideValidation.requestRide),
    requestRide
  ),
  requestRide
);

export const RideRoute = router;
