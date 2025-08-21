import { NextFunction, Request, Response, Router } from "express";
import { auth } from "../../middlewares/auth";
import {
  Allusers,
  myRideHistory,
  setAvailability,
  setuspendStatus,
  userBlockStatus,
} from "./userController";
import { Getme } from "../auth/authController";
const router = Router();

router.get("/me", auth(), Getme);
router.get("/myRideHistory", auth(), myRideHistory);

router.patch("/:id/availability", auth("admin", "driver"), setAvailability);

router.get("/allUsers", auth("admin"), Allusers);

router.patch("/driver/:id/approval", auth("admin"), setuspendStatus);

router.patch("/:id/block", auth("admin"), userBlockStatus);

export const userRoute = router;
