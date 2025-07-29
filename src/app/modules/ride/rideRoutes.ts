import { Router } from "express";
import { auth } from "../../middlewares/auth";
import {
  cancelRide,
  getallRides,
  requestRide,
  updateRideStatus,
} from "./rideControllers";
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

router.get("/all", auth(), getallRides);
router.post("/updateStatus/:rideId", auth("driver"), updateRideStatus);

router.patch("/cancelRide/:rideId", auth(), cancelRide);

export const RideRoute = router;
