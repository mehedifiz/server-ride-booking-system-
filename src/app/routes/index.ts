import { Router } from "express";
import { AuthRoutes } from "../modules/auth/AuthRoute";
import { userRoute } from "../modules/users/userRouter";
import { RideRoute } from "../modules/ride/rideRoutes";
import { StatsRoute } from "../modules/Stats/stats.router";

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
  {
    path: "/stats",
    route: StatsRoute,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
