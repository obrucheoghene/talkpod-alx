"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserByRoomId = exports.getRoomById = exports.getUserRooms = exports.getUserHomeRoom = exports.createRoom = void 0;
const db_1 = __importDefault(require("../lib/db"));
const createRoom = async (data) => {
    try {
        const room = await db_1.default.room.create({ data: data });
        return room;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
};
exports.createRoom = createRoom;
const getUserHomeRoom = async (userId) => {
    try {
        const room = await db_1.default.room.findFirst({
            where: {
                userId: userId
            }
        });
        return room;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
};
exports.getUserHomeRoom = getUserHomeRoom;
const getUserRooms = async (userId) => {
    try {
        const rooms = await db_1.default.room.findMany({
            where: {
                userId: userId
            }
        });
        return rooms;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
};
exports.getUserRooms = getUserRooms;
const getRoomById = async (roomId) => {
    try {
        const room = await db_1.default.room.findUnique({
            where: {
                id: roomId
            }
        });
        return room;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
};
exports.getRoomById = getRoomById;
const getUserByRoomId = async (roomId) => {
    try {
        const room = await db_1.default.room.findUnique({
            where: {
                id: roomId
            }
        });
        const user = await db_1.default.user.findUnique({
            where: {
                id: room === null || room === void 0 ? void 0 : room.userId
            }
        });
        return user;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
};
exports.getUserByRoomId = getUserByRoomId;
//# sourceMappingURL=room.service.js.map