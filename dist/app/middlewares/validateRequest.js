"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const validateRequest = (schema) => (req, res, next) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: "Validation esdrror",
            errors: error,
        });
    }
};
exports.validateRequest = validateRequest;
