import { Server } from "socket.io"
import { SOCKET_EVENT_TYPES as SE } from "./events"
import * as MEET  from '../meet/meet'
import * as CHAT from '../chat/chat'

export const handleRoomConnections = (io :Server) => {
    
    io.on('connection', (socket) => {
        socket.emit('message', {eventType: SE.connected});
        socket.on('disconnect', () => {MEET.leaveRoom(socket)})
        socket.on('message', ({eventType, data}, callback)=>{
            switch(eventType) {
                case SE.getRouterRtpCapabilities:
                    // ! STEP >> 3 - 4
                    MEET.getRouterRtpCapabilities(data, callback)
                    break;
                case SE.joinRoom:
                    // ! STEP >> 9 - 11
                    MEET.joinRoom(socket, data, callback)
                    break;
                case SE.createWebRtcTransports:
                    // ! STEP >> 13 - 18
                    MEET.createWebRtcTransports(socket, data, callback)
                    break;
                case SE.createConsumersForExistingPeers:
                    // ! STEP >> 24 - 30     
                    MEET.createConsumersForExistingPeers(io, socket, data, callback)
                    break;
                case SE.connectProducerTransport:
                    MEET.connectProducerTransport(socket, data, callback)
                    break;
                case SE.produceOnTransport:
                    MEET.produceOnTransport(io,socket, data, callback)
                    break;
                case SE.connectConsumerTransport:
                    MEET.connectConsumerTransport(socket, data, callback)
                    break;
                case SE.producerClosed:
                    MEET.producerClosed(socket, data, callback);
                    break;
                case SE.sendPublicChat:
                    CHAT.sendPublicChat(socket, data, callback)
                    break
                case SE.leaveRoom:
                    MEET.leaveRoom(socket)
                    break
                default:
                    break;

            }
        })
    })
}
