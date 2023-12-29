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
exports.producerClosed = exports.setScreen = exports.setVideo = exports.setMic = exports.connectConsumerTransport = exports.createConsumerTransport = exports.produceOnTransport = exports.connectProducerTransport = exports.createProducerTransport = exports.getRouterRtpCapabilities = exports.leaveRoom = exports.createConsumersForExistingPeers = exports.createWebRtcTransports = exports.joinRoom = void 0;
const room_1 = __importDefault(require("../room/room"));
const config = __importStar(require("../../config/config"));
const server_1 = require("../../mediasoup/server");
const events_1 = require("../room/events");
const errors_1 = require("../room/errors");
const joinRoom = async (socket, data, callback) => {
    console.log('JOIN_ROOM');
    const { roomId, peerInfo } = data;
    const socketId = socket.id;
    let room = room_1.default.getRoom(roomId);
    if (!room) {
        console.log(`JOIN_ROOM: ${roomId} > ${errors_1.ERROR.ROOM_DOES_NOT_EXIST}`);
        return callback(null, { event: events_1.SOCKET_EVENT_TYPES.joinRoom, error: errors_1.ERROR.ROOM_DOES_NOT_EXIST });
    }
    if (!peerInfo.rtpCapabilities) {
        console.log(`JOIN_ROOM: ${roomId} > ${errors_1.ERROR.INVALID_RTPCAPABILITIES}`);
        return callback(null, { event: events_1.SOCKET_EVENT_TYPES.joinRoom, error: errors_1.ERROR.INVALID_RTPCAPABILITIES });
    }
    if (room.getPeer(peerInfo.id)) {
        room.removePeer(peerInfo.id);
    }
    const peer = {
        socketId,
        id: peerInfo.id || socketId,
        name: peerInfo.name || 'peer',
        data: {
            transports: new Map(),
            producers: new Map(),
            consumers: new Map(),
            rtpCapabilities: peerInfo.rtpCapabilities
        }
    };
    socket.join(roomId);
    socket.data.roomId = roomId;
    socket.data.peer = peer;
    room.addPeer(peer);
    socket.broadcast.to(roomId).emit('message', {
        eventType: events_1.SOCKET_EVENT_TYPES.newPeer,
        data: { peer: { id: peer.id, name: peer.name } }
    });
    const peers = Array.from(room.getPeers().values()).map(peer => ({
        id: peer.id,
        name: peer.name,
        key: peer.key,
    }));
    callback({ peers }, null);
};
exports.joinRoom = joinRoom;
const createWebRtcTransports = async (socket, data, callback) => {
    console.log('CREAT_WEBRTC_TRANSPORT');
    const { roomId } = data;
    let room = room_1.default.getRoom(roomId);
    if (!room) {
        console.log(`JOIN_ROOM: ${roomId} > ${errors_1.ERROR.ROOM_DOES_NOT_EXIST}`);
        return callback(null, { event: events_1.SOCKET_EVENT_TYPES.joinRoom, error: errors_1.ERROR.ROOM_DOES_NOT_EXIST });
    }
    const producerTransport = await createTransport(room, 'producer');
    const consumerTransport = await createTransport(room, 'consumer');
    const peer = room.getPeer(socket.data.peer.id);
    if (!peer)
        return;
    peer.data.transports.set(producerTransport.transport.id, producerTransport.transport);
    peer.data.transports.set(consumerTransport.transport.id, consumerTransport.transport);
    room.updatePeer(peer.id, peer);
    callback({
        producerTransportParams: producerTransport.transportParams,
        consumerTransportParams: consumerTransport.transportParams
    }, null);
};
exports.createWebRtcTransports = createWebRtcTransports;
const createConsumersForExistingPeers = async (io, socket, data, callback) => {
    console.log('CREATE_CONSUMERS_FOR_EXISTING_PEERS');
    const { roomId } = data;
    const room = room_1.default.getRoom(roomId);
    if (!room) {
        console.log(`JOIN_ROOM: ${roomId} > ${errors_1.ERROR.ROOM_DOES_NOT_EXIST}`);
        return callback(null, { event: events_1.SOCKET_EVENT_TYPES.joinRoom, error: errors_1.ERROR.ROOM_DOES_NOT_EXIST });
    }
    const peer = room.getPeer(socket.data.peer.id);
    if (!peer)
        return callback(null, { event: events_1.SOCKET_EVENT_TYPES.joinRoom, error: 'NO PEER' });
    const existingPeers = room.getPeers().values();
    for (const existingPeer of existingPeers) {
        if (existingPeer.socketId === peer.socketId)
            continue;
        const existingPeerProducers = existingPeer.data.producers.values();
        for (const existingPeerProducer of existingPeerProducers) {
            await createConsumer(io, room, peer, existingPeer, existingPeerProducer);
        }
    }
    callback({ data: 'Consumer created for existing peers' });
};
exports.createConsumersForExistingPeers = createConsumersForExistingPeers;
const createConsumer = async (io, room, consumerPeer, producerPeer, producer) => {
    if (!room.router.canConsume({
        producerId: producer.id,
        rtpCapabilities: consumerPeer.data.rtpCapabilities
    })) {
        console.log(`CREATE_CONSUMER: ROOM: ${room.id}  PRODUCER: ${producer.id} > ${errors_1.ERROR.CANNOT_CONSUME}`);
        return;
    }
    const transport = Array.from(consumerPeer.data.transports.values()).find(tp => tp.appData.isConsumer === true);
    if (!transport) {
        console.log(`CREATE_CONSUMER: ROOM: ${room.id}  PRODUCER: ${producer.id} > ${errors_1.ERROR.NO_CONSUMER_TRANSPORT}`);
        return;
    }
    let consumer;
    try {
        consumer = await transport.consume({
            producerId: producer.id,
            rtpCapabilities: consumerPeer.data.rtpCapabilities,
            paused: true,
        });
    }
    catch (error) {
        console.log(error);
        return;
    }
    consumerPeer.data.consumers.set(producer.id, consumer);
    room.updatePeer(consumerPeer.id, consumerPeer);
    consumer.on('transportclose', () => {
        console.log(`CONSUMER TRANSPORT CLOSED, ${transport.id}`);
        consumer.close();
    });
    consumer.on('producerclose', () => {
        console.log(`CONSUMER PRODUCER CLOSED, ${producer.id}`);
        consumer.close();
        io.to(consumerPeer.socketId).emit('message', {
            eventType: events_1.SOCKET_EVENT_TYPES.consumerClosed,
            data: {
                consumerId: consumer.id,
                producerPeerId: producerPeer.id,
                producerSource: producer.appData.source
            }
        });
    });
    consumer.on('producerpause', () => {
        console.log(`CONSUMER PRODUCER PAUSED, ${producer.id}`);
    });
    const producerPeerInfo = {
        id: producerPeer.id,
        name: producerPeer.name,
    };
    io.to(consumerPeer.socketId).emit('message', {
        eventType: events_1.SOCKET_EVENT_TYPES.newConsumer,
        data: {
            producerPeer: producerPeerInfo,
            producerId: producer.id,
            transportId: transport.id,
            id: consumer.id,
            kind: consumer.kind,
            rtpParameters: consumer.rtpParameters,
            type: consumer.type,
            appData: Object.assign(Object.assign({}, producer.appData), { producerPeer: producerPeerInfo, transportId: transport.id }),
            producerPaused: consumer.producerPaused
        }
    }, async (_data, _error) => {
        console.log('RESUME_CONSUMER');
        await consumer.resume();
    });
};
const leaveRoom = (socket) => {
    console.log('LEAVE_ROOM');
    const { roomId, peer } = socket.data;
    let room = room_1.default.getRoom(roomId);
    if (!room)
        return;
    socket.broadcast.to(room.id).emit('message', {
        eventType: events_1.SOCKET_EVENT_TYPES.peerLeft,
        data: {
            peer: {
                id: peer.id,
                name: peer.name
            }
        }
    });
    const roomPeer = room.getPeer(peer.id);
    if (roomPeer) {
        console.log(`${roomPeer.name} left`);
        const peerTransports = Array.from(roomPeer.data.transports.values());
        peerTransports.forEach((transport) => {
            console.log(`Close ${roomPeer.name} transport ${transport.id}`);
            transport.close();
        });
    }
    room.removePeer(peer.id);
    if (Array.from(room.getPeers().values()).length === 0)
        room_1.default.rooms.delete(roomId);
};
exports.leaveRoom = leaveRoom;
const getRouterRtpCapabilities = async (data, callback) => {
    console.log('GET_ROUTER_RTP_CAPABILITIES');
    const { roomId, roomName } = data;
    let room = room_1.default.getRoom(roomId);
    if (!room) {
        const { worker } = (0, server_1.getMediasoupWorker)();
        const router = await worker.createRouter({
            mediaCodecs: config.mediasoup.router.mediaCodecs
        });
        room = new room_1.default(roomId, roomName, router);
        room_1.default.rooms.set(roomId, room);
    }
    const routerRtpCapabilities = room.router.rtpCapabilities;
    callback({ routerRtpCapabilities });
};
exports.getRouterRtpCapabilities = getRouterRtpCapabilities;
const createProducerTransport = async (socket, data, callback) => {
    console.log('CREATE_PRODUCER_TRANSPORT', socket.id);
    const { roomId } = data;
    const room = room_1.default.getRoom(roomId);
    if (!room) {
        console.log('No room with id', roomId);
        return;
    }
    const socketId = socket.id;
    const { transport, transportParams } = await createTransport(room);
    room.addProducerTransport(socketId, transport);
    transport.observer.on('close', () => {
        console.log('PEER LEFT: Peer producer tarnsport closed');
        const cameraProducer = room.getCameraProducer(socketId);
        const screenProducer = room.getScreenProducer(socketId);
        const micAudioProducer = room.getMicAudioProducer(socketId);
        const screenAudioProducer = room.getScreenAudioProducer(socketId);
        if (cameraProducer) {
            cameraProducer.close();
            room.removeCameraProducer(socketId);
        }
        if (screenProducer) {
            screenProducer.close();
            room.removeScreenProducer(socketId);
        }
        if (micAudioProducer) {
            micAudioProducer.close();
            room.removeMicAudioProducer(socketId);
        }
        if (screenAudioProducer) {
            screenAudioProducer.close();
            room.removeScreenAudioProducer(socketId);
        }
        room.removeProducerTransport(socketId);
    });
    callback({ transportParams }, null);
};
exports.createProducerTransport = createProducerTransport;
const connectProducerTransport = (socket, data, callback) => {
    console.log('CONNECT_PRODUCER_TRANSPORT', socket.id);
    const { dtlsParameters, transportId } = data;
    const { peer: peerInfo, roomId } = socket.data;
    const room = room_1.default.getRoom(roomId);
    if (!room)
        return callback(null, { error: 'Room was not found' });
    const peer = room.getPeer(peerInfo.id);
    if (!peer)
        return callback(null, { error: 'Peer was not found' });
    const transport = peer.data.transports.get(transportId);
    if (!transport)
        return callback(null, { error: 'Transport was not found' });
    transport.connect({ dtlsParameters });
    callback({}, null);
};
exports.connectProducerTransport = connectProducerTransport;
const produceOnTransport = async (io, socket, data, callback) => {
    console.log('PRODUCER_ON_TRANSPORT', socket.id);
    const { transportId, kind, rtpParameters, appData } = data;
    const { peer: peerInfo, roomId } = socket.data;
    const room = room_1.default.getRoom(roomId);
    if (!room)
        return callback(null, { error: 'Room was not found' });
    const peer = room.getPeer(peerInfo.id);
    if (!peer)
        return callback(null, { error: 'Peer was not found' });
    const transport = peer.data.transports.get(transportId);
    if (!transport)
        return callback(null, { error: 'Transport was not found' });
    const producer = await transport.produce({ kind, rtpParameters, appData: Object.assign({}, appData) });
    callback({ producerId: producer.id }, null);
    peer.data.producers.set(producer.id, producer);
    room.updatePeer(peer.id, peer);
    const existingPeers = room.getPeers().values();
    for (const existingPeer of existingPeers) {
        if (existingPeer.socketId === peer.socketId)
            continue;
        await createConsumer(io, room, existingPeer, peer, producer);
    }
};
exports.produceOnTransport = produceOnTransport;
const createConsumerTransport = async (socket, data, callback) => {
    console.log('CREATE_CONSUMER_TRANSPORT', socket.id);
    const { roomId, producerSocketId, } = data;
    const room = room_1.default.getRoom(roomId);
    if (!room) {
        console.log('No room with id', roomId);
        return;
    }
    const socketId = socket.id;
    const { transport, transportParams } = await createTransport(room);
    const rKey = { socketId, producerSocketId };
    console.log('RKey_CREATE', rKey);
    room.addConsumerTransport(rKey, transport);
    console.log('C_TRANSPRORTS', room.consumerTransports);
    console.log('GET TRANSPRORTS', room.getConsumerTransport(rKey));
    transport.observer.on('close', () => {
        console.log('PEER LEFT: Peer consumer tarnsport closed');
        const cameraConsumer = room.getCameraConsumer(rKey);
        const screenConsumer = room.getScreenConsumer(rKey);
        const micAudioConsumer = room.getMicAudioConsumer(rKey);
        const screenAudioConsumer = room.getScreenAudioConsumer(rKey);
        if (cameraConsumer) {
            cameraConsumer.close();
            room.removeCameraConsumer(rKey);
        }
        if (screenConsumer) {
            screenConsumer.close();
            room.removeScreenConsumer(rKey);
        }
        if (micAudioConsumer) {
            micAudioConsumer.close();
            room.removeMicAudioConsumer(rKey);
        }
        if (screenAudioConsumer) {
            screenAudioConsumer.close();
            room.removeScreenAudioConsumer(rKey);
        }
        room.removeConsumerTransport(rKey);
    });
    callback({ transportParams }, null);
};
exports.createConsumerTransport = createConsumerTransport;
const connectConsumerTransport = async (socket, data, callback) => {
    console.log('CONNECT_CONSUMER_TRANSPORT', socket.id);
    const room = room_1.default.getRoom(socket.data.roomId);
    if (!room)
        return;
    const { transportId, dtlsParameters } = data;
    const peer = room.getPeer(socket.data.peer.id);
    if (!peer)
        return;
    const transport = peer.data.transports.get(transportId);
    if (!transport)
        return;
    await transport.connect({ dtlsParameters });
    callback({}, null);
};
exports.connectConsumerTransport = connectConsumerTransport;
const setMic = () => {
};
exports.setMic = setMic;
const setVideo = () => {
};
exports.setVideo = setVideo;
const setScreen = () => {
};
exports.setScreen = setScreen;
const producerClosed = (socket, data, callback) => {
    console.log('PRODUCER CLOSED', socket.id);
    const room = room_1.default.getRoom(socket.data.roomId);
    if (!room)
        return;
    const peer = room.getPeer(socket.data.peer.id);
    if (!peer)
        return;
    const { producerId } = data;
    const producer = peer.data.producers.get(producerId);
    if (!producer)
        return;
    producer.close();
    peer.data.producers.delete(producerId);
    room.updatePeer(peer.id, peer);
    callback();
    const allPeers = room.getPeers().values();
    for (const onePeer of allPeers) {
        if (onePeer.socketId === peer.socketId)
            continue;
        onePeer.data.consumers.delete(producerId);
        room.updatePeer(onePeer.id, onePeer);
        console.log('DELETED CONSUMERS FROM PEER', onePeer.name);
    }
};
exports.producerClosed = producerClosed;
const createTransport = async (room, type = 'consumer') => {
    const transport = await room.router.createWebRtcTransport({
        listenIps: config.mediasoup.transport.listenIps,
        enableTcp: true,
        enableUdp: true,
        preferUdp: true,
        appData: {
            isConsumer: type === 'consumer',
            isProducer: type === 'producer'
        }
    });
    return {
        transport,
        transportParams: {
            id: transport.id,
            iceParameters: transport.iceParameters,
            iceCandidates: transport.iceCandidates,
            dtlsParameters: transport.dtlsParameters,
            sctpParameters: transport.sctpParameters,
        }
    };
};
//# sourceMappingURL=meet.js.map