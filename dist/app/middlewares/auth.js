"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = require("../modules/users/userModel");
const env_1 = require("../config/env");
const auth = (...requiredRoles) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "You are not authorized! Token missing.",
            });
        }
        const decoded = jsonwebtoken_1.default.verify(token, env_1.envVars.JWT_ACCESS_SECRET);
        const { userId, role } = decoded;
        console.log("user", role);
        const user = yield userModel_1.User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "This user is not found!",
            });
        }
        if (user.isBlocked) {
            return res.status(403).json({
                success: false,
                message: "Your account has been blocked.",
            });
        }
        if (requiredRoles.length > 0 && !requiredRoles.includes(role)) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized for this action.",
            });
        }
        req.user = { _id: userId, role };
        next();
    }
    catch (err) {
        res.status(401).json({
            success: false,
            message: err.message || "Unauthorized",
        });
    }
});
exports.auth = auth;
