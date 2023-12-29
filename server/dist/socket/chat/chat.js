"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPublicChat = void 0;
const room_1 = __importDefault(require("../room/room"));
const events_1 = require("../room/events");
const sendPublicChat = (socket, data, callback) => {
    console.log('SEND PUBLIC CHAT', socket.id);
    const { peer: peerInfo, roomId } = socket.data;
    const room = room_1.default.getRoom(roomId);
    if (!room)
        return callback(null, { error: 'Room was not found' });
    const peer = room.getPeer(peerInfo.id);
    if (!peer)
        return callback(null, { error: 'Peer was not found' });
    socket.broadcast.to(roomId).emit('message', {
        eventType: events_1.SOCKET_EVENT_TYPES.newPublicChat,
        data: { chat: data }
    });
    callback({}, null);
};
exports.sendPublicChat = sendPublicChat;
//# sourceMappingURL=chat.js.map