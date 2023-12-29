"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const config = __importStar(require("./config/config"));
const server_1 = require("./socket/server");
const server_2 = require("./mediasoup/server");
class App {
    constructor(routes) {
        this.connectToDatabase = () => {
        };
        this.initializeMiddlewares = () => {
            const corsOption = {
                origin: "*",
                methods: ["GET", "POST"]
            };
            this.app.use((0, cors_1.default)(corsOption));
            this.app.use(express_1.default.json());
        };
        this.initializeRoutes = (routes) => {
            routes.forEach((route) => {
                this.app.use(route.path, route.router);
            });
            this.app.get('/', (_req, res) => {
                return res.status(200).send("<h1>Talkpod Service</h1>");
            });
            this.app.get('/health', (_req, res) => {
                return res.status(200).json({ "status": "Healthy" });
            });
        };
        this.listen = () => {
            this.app.get('server').listen(config.https.listenPort, () => {
                console.log(`Server running on port ${config.https.listenPort}`);
            });
        };
        this.app = (0, express_1.default)();
        this.connectToDatabase();
        this.initializeMiddlewares();
        this.initializeRoutes(routes);
        (0, server_2.runMediaSoupWorkers)();
        (0, server_1.runSignallingServer)(this.app);
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map