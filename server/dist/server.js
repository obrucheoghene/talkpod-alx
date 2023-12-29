"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const room_controller_1 = __importDefault(require("./controllers/room.controller"));
const auth_controller_1 = __importDefault(require("./controllers/auth.controller"));
const app = new app_1.default([
    { path: '/auth', router: auth_controller_1.default },
    { path: '/rooms', router: room_controller_1.default }
]);
app.listen();
//# sourceMappingURL=server.js.map