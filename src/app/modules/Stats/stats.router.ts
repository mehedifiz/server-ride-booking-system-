import { NextFunction, Request, Response, Router } from "express";
import { auth } from "../../middlewares/auth";
import { generateReport } from "./statscontroller";

const router = Router();

router.get("/", auth("admin"), generateReport);

export const StatsRoute = router;
