"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsRoute = void 0;
const express_1 = require("express");
const auth_1 = require("../../middlewares/auth");
const statscontroller_1 = require("./statscontroller");
const router = (0, express_1.Router)();
router.get("/", (0, auth_1.auth)("admin"), statscontroller_1.generateReport);
exports.StatsRoute = router;
