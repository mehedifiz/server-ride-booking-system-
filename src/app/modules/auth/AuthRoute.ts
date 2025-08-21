import { NextFunction, Request, Response, Router } from "express";
import { login, register } from "./authController";
import { logout } from "../../middlewares/auth";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);


export const AuthRoutes = router;
