"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signIn = exports.signUp = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../lib/db"));
const room_service_1 = require("./room.service");
const signUp = async (data) => {
    try {
        const { name, email, password } = data;
        const foundUser = await db_1.default.user.findFirst({
            where: {
                email: email
            }
        });
        if (foundUser) {
            return null;
        }
        const hashPassword = await bcrypt_1.default.hash(password, 12);
        const user = await db_1.default.user.create({
            data: {
                name: name,
                email: email,
                password: hashPassword
            }
        });
        await (0, room_service_1.createRoom)({
            userId: user.id,
            name: 'Home Room'
        });
        return {
            data: user,
            token: jsonwebtoken_1.default.sign({
                name: user.name,
                email: user.email
            }, process.env.JWT_SECRET || "invalid_hash")
        };
    }
    catch (error) {
        console.log("signUp", error);
        return null;
    }
};
exports.signUp = signUp;
const signIn = async (data) => {
    try {
        const { email, password } = data;
        const user = await db_1.default.user.findFirst({
            where: {
                email: email
            }
        });
        if (!user) {
            return null;
        }
        else {
            const hash = user.password;
            if (await bcrypt_1.default.compare(password, hash)) {
                return {
                    data: user,
                    token: jsonwebtoken_1.default.sign({
                        name: user.name,
                        email: user.email
                    }, process.env.JWT_SECRET || "invalid_hash")
                };
            }
            else {
                return null;
            }
        }
    }
    catch (error) {
        console.log("signIn", error);
        throw error;
    }
};
exports.signIn = signIn;
//# sourceMappingURL=auth.service.js.map