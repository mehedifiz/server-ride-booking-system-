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
exports.makAdmin = void 0;
const userModel_1 = require("../modules/users/userModel");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const makAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminExists = yield userModel_1.User.findOne({ role: "admin" });
        if (!adminExists) {
            const hashedPassword = yield bcryptjs_1.default.hash("12345678", 10);
            yield userModel_1.User.create({
                name: " Admin",
                email: "admin@example.com",
                password: hashedPassword,
                role: "admin",
            });
            console.log(" admin account created:");
            console.log("   Email: admin@example.com");
            console.log("   Password: 12345678");
        }
        else {
            console.log("ℹ Admin account already exists");
        }
    }
    catch (error) {
        console.error(" Error creating admin:", error);
    }
});
exports.makAdmin = makAdmin;
