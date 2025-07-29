import { NextFunction, Request, Response, Router } from "express";
import { auth } from "../../middlewares/auth";
import { myRideHistory } from "./userController";
const router = Router();

router.get("/myRideHistory", auth(), myRideHistory);

export const userRoute = router;
