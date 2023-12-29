"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const joi_1 = __importDefault(require("joi"));
const auth_service_1 = require("../services/auth.service");
const authRouter = (0, express_1.Router)();
authRouter.post('/signup', async (req, res) => {
    const signupSchema = joi_1.default.object({
        name: joi_1.default.string().required().max(200),
        email: joi_1.default.string().required().email().max(100),
        password: joi_1.default.string().max(16).min(4)
    });
    const { error, value } = signupSchema.validate(req.body);
    if (error) {
        res.status(400).send(error.details);
    }
    else {
        try {
            const result = await (0, auth_service_1.signUp)(value);
            res.send(result);
        }
        catch (error) {
            throw (error);
        }
    }
});
authRouter.post("/signin", async (req, res) => {
    const signinSchema = joi_1.default.object({
        email: joi_1.default.string().required().email().max(100),
        password: joi_1.default.string().max(16).min(4)
    });
    const { error, value } = signinSchema.validate(req.body);
    if (error) {
        res.status(400).send(error.details);
    }
    else {
        try {
            const result = await (0, auth_service_1.signIn)(value);
            res.send(result);
        }
        catch (error) {
            throw (error);
        }
    }
});
exports.default = authRouter;
//# sourceMappingURL=auth.controller.js.map