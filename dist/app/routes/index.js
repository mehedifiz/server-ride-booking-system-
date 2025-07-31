"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const AuthRoute_1 = require("../modules/auth/AuthRoute");
const userRouter_1 = require("../modules/users/userRouter");
const rideRoutes_1 = require("../modules/ride/rideRoutes");
const stats_router_1 = require("../modules/Stats/stats.router");
exports.router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/auth",
        route: AuthRoute_1.AuthRoutes,
    },
    {
        path: "/user",
        route: userRouter_1.userRoute,
    },
    {
        path: "/ride",
        route: rideRoutes_1.RideRoute,
    },
    {
        path: "/stats",
        route: stats_router_1.StatsRoute,
    },
];
moduleRoutes.forEach((route) => {
    exports.router.use(route.path, route.route);
});
