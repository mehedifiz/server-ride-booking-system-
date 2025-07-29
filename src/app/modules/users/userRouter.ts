import { NextFunction, Request, Response, Router } from "express";
import { auth } from "../../middlewares/auth";
import { myRideHistory, setAvailability } from "./userController";
const router = Router();

router.get("/myRideHistory", auth(), myRideHistory);

router.patch("/:id/availability", auth("admin", "driver"), setAvailability);

export const userRoute = router;
