"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const joi_1 = __importDefault(require("joi"));
const room_service_1 = require("../services/room.service");
const roomRoutes = (0, express_1.Router)();
roomRoutes.post('/', async (req, res, _next) => {
    const createRoomSchema = joi_1.default.object({
        name: joi_1.default.string().required(),
        userId: joi_1.default.string().required()
    });
    const { error, value } = createRoomSchema.validate(req.body);
    if (error) {
        return res.status(403).send(error.details);
    }
    try {
        const room = await (0, room_service_1.createRoom)(value);
        return res.status(200).send(room);
    }
    catch (error) {
        throw error;
    }
});
roomRoutes.get(`/:roomId`, async (req, res, _next) => {
    try {
        const roomId = req.params.roomId;
        const room = await (0, room_service_1.getRoomById)(roomId);
        return res.status(200).send(room);
    }
    catch (error) {
        throw error;
    }
});
roomRoutes.get(`/:roomId/owner`, async (req, res, _next) => {
    try {
        const roomId = req.params.roomId;
        const user = await (0, room_service_1.getUserByRoomId)(roomId);
        return res.status(200).send(user);
    }
    catch (error) {
        throw error;
    }
});
roomRoutes.get(`/user/:userId`, async (req, res, _next) => {
    try {
        const userId = req.params.userId;
        const rooms = await (0, room_service_1.getUserRooms)(userId);
        return res.status(200).send(rooms);
    }
    catch (error) {
        throw error;
    }
});
roomRoutes.get(`/user/:userId/home`, async (req, res, _next) => {
    try {
        const userId = req.params.userId;
        const room = await (0, room_service_1.getUserHomeRoom)(userId);
        return res.status(200).send(room);
    }
    catch (error) {
        throw error;
    }
});
exports.default = roomRoutes;
//# sourceMappingURL=room.controller.js.map