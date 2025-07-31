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
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateReport = void 0;
const rideModel_1 = require("../ride/rideModel");
const userModel_1 = require("../users/userModel");
const response_1 = require("../../utils/response");
const http_status_codes_1 = require("http-status-codes");
const generateReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userCounts = yield userModel_1.User.aggregate([
            { $group: { _id: "$role", count: { $sum: 1 } } },
        ]);
        const rideCounts = yield rideModel_1.Ride.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } },
        ]);
        (0, response_1.sendResponse)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: "Report generated successfully",
            data: {
                userCounts,
                rideCounts,
            },
        });
    }
    catch (error) {
        (0, response_1.sendResponse)(res, {
            statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            success: false,
            message: "Error generating report",
            data: error,
        });
    }
});
exports.generateReport = generateReport;
