import { Router } from "express";
import { auth } from "../../middlewares/auth";
import {
  cancelRide,
  driveEarningsHistory,
  getallRides,
  getMyAcceptedRides,
  getMyRides,
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

router.patch("/cancelRide/:rideId", auth(), cancelRide);

router.get("/myRides", auth("rider"), getMyRides);

router.post("/updateStatus/:rideId", auth("driver"), updateRideStatus);
router.get("/earningsHistory", auth("driver"), driveEarningsHistory);
router.get("/my-accepted", auth("driver"), getMyAcceptedRides);

export const RideRoute = router;
