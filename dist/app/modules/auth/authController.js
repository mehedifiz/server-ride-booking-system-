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
exports.login = exports.register = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const response_1 = require("../../utils/response");
const userModel_1 = require("../users/userModel");
const env_1 = require("../../config/env");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
        return (0, response_1.sendResponse)(res, {
            statusCode: http_status_codes_1.default.BAD_REQUEST,
            success: false,
            message: "All fields are required.",
            data: null,
        });
    }
    const userExists = yield userModel_1.User.findOne({ email: email });
    if (userExists) {
        return (0, response_1.sendResponse)(res, {
            statusCode: http_status_codes_1.default.CONFLICT,
            success: false,
            message: "User already exists with this email.",
            data: null,
        });
    }
    const hashedPassword = yield bcryptjs_1.default.hash(password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    const newUser = yield userModel_1.User.create({
        name,
        email,
        password: hashedPassword,
        role,
    });
    return (0, response_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: "User registered successfully.",
        data: newUser,
    });
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return (0, response_1.sendResponse)(res, {
            statusCode: http_status_codes_1.default.BAD_REQUEST,
            success: false,
            message: "Email and password are required.",
            data: null,
        });
    }
    try {
        const user = yield userModel_1.User.findOne({ email });
        if (!user) {
            return (0, response_1.sendResponse)(res, {
                statusCode: http_status_codes_1.default.UNAUTHORIZED,
                success: false,
                message: "Invalid email or password.",
                data: null,
            });
        }
        const passwordMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!passwordMatch) {
            return (0, response_1.sendResponse)(res, {
                statusCode: http_status_codes_1.default.UNAUTHORIZED,
                success: false,
                message: "Invalid email or password.",
                data: null,
            });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id, role: user.role }, env_1.envVars.JWT_ACCESS_SECRET, { expiresIn: "7d" });
        return (0, response_1.sendResponse)(res, {
            statusCode: http_status_codes_1.default.OK,
            success: true,
            message: "Login successful.",
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token,
            },
        });
    }
    catch (error) {
        return (0, response_1.sendResponse)(res, {
            statusCode: http_status_codes_1.default.INTERNAL_SERVER_ERROR,
            success: false,
            message: error.message,
            data: null,
        });
    }
});
exports.login = login;
