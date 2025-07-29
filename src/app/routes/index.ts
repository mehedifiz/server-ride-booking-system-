import { Router } from "express";
import { AuthRoutes } from "../modules/auth/AuthRoute";
import { userRoute } from "../modules/users/userRouter";
import { RideRoute } from "../modules/ride/rideRoutes";

export const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/user",
    route: userRoute,
  },
  {
    path: "/ride",
    route: RideRoute,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
