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
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleRoomConnections = void 0;
const events_1 = require("./events");
const MEET = __importStar(require("../meet/meet"));
const CHAT = __importStar(require("../chat/chat"));
const handleRoomConnections = (io) => {
    io.on('connection', (socket) => {
        socket.emit('message', { eventType: events_1.SOCKET_EVENT_TYPES.connected });
        socket.on('disconnect', () => { MEET.leaveRoom(socket); });
        socket.on('message', ({ eventType, data }, callback) => {
            switch (eventType) {
                case events_1.SOCKET_EVENT_TYPES.getRouterRtpCapabilities:
                    MEET.getRouterRtpCapabilities(data, callback);
                    break;
                case events_1.SOCKET_EVENT_TYPES.joinRoom:
                    MEET.joinRoom(socket, data, callback);
                    break;
                case events_1.SOCKET_EVENT_TYPES.createWebRtcTransports:
                    MEET.createWebRtcTransports(socket, data, callback);
                    break;
                case events_1.SOCKET_EVENT_TYPES.createConsumersForExistingPeers:
                    MEET.createConsumersForExistingPeers(io, socket, data, callback);
                    break;
                case events_1.SOCKET_EVENT_TYPES.connectProducerTransport:
                    MEET.connectProducerTransport(socket, data, callback);
                    break;
                case events_1.SOCKET_EVENT_TYPES.produceOnTransport:
                    MEET.produceOnTransport(io, socket, data, callback);
                    break;
                case events_1.SOCKET_EVENT_TYPES.connectConsumerTransport:
                    MEET.connectConsumerTransport(socket, data, callback);
                    break;
                case events_1.SOCKET_EVENT_TYPES.producerClosed:
                    MEET.producerClosed(socket, data, callback);
                    break;
                case events_1.SOCKET_EVENT_TYPES.sendPublicChat:
                    CHAT.sendPublicChat(socket, data, callback);
                    break;
                case events_1.SOCKET_EVENT_TYPES.leaveRoom:
                    MEET.leaveRoom(socket);
                    break;
                default:
                    break;
            }
        });
    });
};
exports.handleRoomConnections = handleRoomConnections;
//# sourceMappingURL=handler.js.map