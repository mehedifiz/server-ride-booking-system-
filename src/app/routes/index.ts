import { Router } from "express";
import { AuthRoutes } from "../modules/auth/AuthRoute";
import { userRoute } from "../modules/users/userRouter";

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
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
