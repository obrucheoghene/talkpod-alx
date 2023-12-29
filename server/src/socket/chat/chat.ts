import { Socket } from "socket.io";
import Room from "../room/room";
import { SOCKET_EVENT_TYPES as SE } from "../room/events";

export const sendPublicChat = ( socket: Socket, data: Record<string, any>, callback: any) => {
    console.log('SEND PUBLIC CHAT', socket.id)

    const { peer: peerInfo, roomId } = socket.data;
    const room = Room.getRoom(roomId);
    if (!room) return callback(null, { error: 'Room was not found' });

    const peer = room.getPeer(peerInfo.id);
    if (!peer) return callback(null, { error: 'Peer was not found' });

    socket.broadcast.to(roomId).emit('message', {
        eventType: SE.newPublicChat,
        data: {chat: data}
    })

    callback({}, null);
}
