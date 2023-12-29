import Room from "../room/room"
import * as config from '../../config/config'
import { types as mediasoupTypes } from "mediasoup";
import { Server, Socket } from "socket.io";
import { Peer, RKey, TransportKind } from "../../interfaces/rooms";
import { getMediasoupWorker } from "../../mediasoup/server";
import { SOCKET_EVENT_TYPES as SE } from "../room/events";
import { ERROR } from "../room/errors";



export const joinRoom = async (socket: Socket, data: Record<string, any>, callback: any) => {
    console.log('JOIN_ROOM')
    const { roomId, peerInfo } = data
    const socketId = socket.id;
    let room = Room.getRoom(roomId);
    if (!room) {
        console.log(`JOIN_ROOM: ${roomId} > ${ERROR.ROOM_DOES_NOT_EXIST}`)
        return callback(null, { event: SE.joinRoom, error: ERROR.ROOM_DOES_NOT_EXIST })
    }

    if (!peerInfo.rtpCapabilities) {
        console.log(`JOIN_ROOM: ${roomId} > ${ERROR.INVALID_RTPCAPABILITIES}`)
        return callback(null, { event: SE.joinRoom, error: ERROR.INVALID_RTPCAPABILITIES })
    }

    if (room.getPeer(peerInfo.id)) {
        // peer is in room already
        // Remove the existing and update with new connection
        room.removePeer(peerInfo.id);
    }

    const peer: Peer = {
        socketId,
        id: peerInfo.id || socketId,
        name: peerInfo.name || 'peer',
        data: {
            transports: new Map(),
            producers: new Map(),
            consumers: new Map(),
            rtpCapabilities: peerInfo.rtpCapabilities
        }
    }

    socket.join(roomId);
    socket.data.roomId = roomId;
    socket.data.peer = peer;
    room.addPeer(peer);
    //  SEND NEW PEER DATA TO EXISTING PEERS
    socket.broadcast.to(roomId).emit('message', {
        eventType: SE.newPeer,
        data: { peer: { id: peer.id, name: peer.name } }
    })


    const peers = Array.from(room.getPeers().values()).map(peer => ({
        id: peer.id,
        name: peer.name,
        key: peer.key,
    }))
    // RETURN ALL PEERS DATA TO NEW PEER
    callback({ peers }, null)
}

export const createWebRtcTransports = async (socket: Socket, data: Record<string, any>, callback: any) => {
    console.log('CREAT_WEBRTC_TRANSPORT');
    const { roomId } = data;
    let room = Room.getRoom(roomId);
    if (!room) {
        console.log(`JOIN_ROOM: ${roomId} > ${ERROR.ROOM_DOES_NOT_EXIST}`)
        return callback(null, { event: SE.joinRoom, error: ERROR.ROOM_DOES_NOT_EXIST })
    }
    const producerTransport = await createTransport(room, 'producer');
    const consumerTransport = await createTransport(room, 'consumer')
    // TODO listen to events on transposrt
    const peer = room.getPeer(socket.data.peer.id);
    if (!peer) return;
    peer.data.transports.set(producerTransport.transport.id, producerTransport.transport)
    peer.data.transports.set(consumerTransport.transport.id, consumerTransport.transport)
    room.updatePeer(peer.id, peer)

    callback({
        producerTransportParams: producerTransport.transportParams,
        consumerTransportParams: consumerTransport.transportParams
    }, null)
}


export const createConsumersForExistingPeers = async (io: Server, socket: Socket, data: Record<string, any>, callback: any) => {
    console.log('CREATE_CONSUMERS_FOR_EXISTING_PEERS');
    const { roomId } = data;
    const room = Room.getRoom(roomId);
    if (!room) {
        console.log(`JOIN_ROOM: ${roomId} > ${ERROR.ROOM_DOES_NOT_EXIST}`)
        return callback(null, { event: SE.joinRoom, error: ERROR.ROOM_DOES_NOT_EXIST })
    }
    const peer = room.getPeer(socket.data.peer.id);
    if (!peer) return callback(null, { event: SE.joinRoom, error: 'NO PEER' })
    // LOOP THROUGH ALL PEERS OF A ROOM
    // GET ALL THE PRODUCERS FOR PEERS
    // FOR EVERY PRODUCER CREATE A CONSUMER
    // CHECK IF PEER CAN CONSUME BEFORE CREATING THE CONSUMER

    const existingPeers = room.getPeers().values();

    for (const existingPeer of existingPeers) {
        // Ingore new peer
        if (existingPeer.socketId === peer.socketId) continue;
        const existingPeerProducers = existingPeer.data.producers.values();
        for (const existingPeerProducer of existingPeerProducers) {
           await  createConsumer(io, room, peer, existingPeer, existingPeerProducer);
        }

    }


    callback({ data: 'Consumer created for existing peers' })

}


const createConsumer = async (io: Server, room: Room, consumerPeer: Peer, producerPeer: Peer, producer: mediasoupTypes.Producer) => {
    if (!room.router.canConsume({
        producerId: producer.id,
        rtpCapabilities: consumerPeer.data.rtpCapabilities
    })) {
        console.log(`CREATE_CONSUMER: ROOM: ${room.id}  PRODUCER: ${producer.id} > ${ERROR.CANNOT_CONSUME}`)
        return;
    }
    // GET CONSUMER PEER CONSUMER TRANSPORT
    const transport = Array.from(consumerPeer.data.transports.values()).find(tp => tp.appData.isConsumer === true);

    if (!transport) {
        console.log(`CREATE_CONSUMER: ROOM: ${room.id}  PRODUCER: ${producer.id} > ${ERROR.NO_CONSUMER_TRANSPORT}`)
        return;
    }
    let consumer: mediasoupTypes.Consumer;
    try {
        consumer = await transport.consume({
            producerId: producer.id,
            rtpCapabilities: consumerPeer.data.rtpCapabilities,
            paused: true,
        });

    } catch (error) {
        console.log(error);
        return;
    }

    consumerPeer.data.consumers.set(producer.id, consumer);
    room.updatePeer(consumerPeer.id, consumerPeer);

    consumer.on('transportclose', () => {
        console.log(`CONSUMER TRANSPORT CLOSED, ${transport.id}`)
        consumer.close()
    })

    consumer.on('producerclose', () => {
        console.log(`CONSUMER PRODUCER CLOSED, ${producer.id}`)
        consumer.close()
        io.to(consumerPeer.socketId).emit('message', {
            eventType: SE.consumerClosed,
            data: {
                consumerId: consumer.id,
                producerPeerId: producerPeer.id,
                producerSource: producer.appData.source
            }})
    })

    consumer.on('producerpause', () => {
        console.log(`CONSUMER PRODUCER PAUSED, ${producer.id}`)

    })

    // Tell
    const producerPeerInfo = {
        id: producerPeer.id,
        name: producerPeer.name,
    };
    io.to(consumerPeer.socketId).emit('message', {
        eventType: SE.newConsumer,
        data: {
            producerPeer: producerPeerInfo,
            producerId: producer.id,
            transportId: transport.id,
            id: consumer.id,
            kind: consumer.kind,
            rtpParameters: consumer.rtpParameters,
            type: consumer.type,
            appData: {...producer.appData, producerPeer: producerPeerInfo, transportId: transport.id },
            producerPaused: consumer.producerPaused
        }
    }, async (_data: Record<string, any>, _error: any) => {

            console.log('RESUME_CONSUMER')
            // ! STEP >> 36
          await  consumer.resume()
    })

}


export const leaveRoom = (socket: Socket) => {
    console.log('LEAVE_ROOM')
    const { roomId, peer } = socket.data;
    let room = Room.getRoom(roomId);
    if (!room) return

    socket.broadcast.to(room.id).emit('message', {
        eventType: SE.peerLeft,
        data: {
            peer: {
                id: peer.id,
                name: peer.name
            }
        }
    })
    
    // Close all transport associated to peers, its consumer and producer will close as well
    const roomPeer =  room.getPeer(peer.id);
    if (roomPeer) {
        console.log(`${roomPeer.name} left`)

        const peerTransports: mediasoupTypes.Transport[] = Array.from(roomPeer.data.transports.values())

        peerTransports.forEach((transport) => {
            console.log(`Close ${roomPeer.name} transport ${transport.id}`);
            transport.close();
        })
    }
   
    room.removePeer(peer.id);

    if (Array.from(room.getPeers().values()).length === 0) Room.rooms.delete(roomId);
}


export const getRouterRtpCapabilities = async (data: Record<string, any>, callback: any) => {
    console.log('GET_ROUTER_RTP_CAPABILITIES')
    const { roomId, roomName } = data
    let room = Room.getRoom(roomId);
    if (!room) {
        const { worker } = getMediasoupWorker();
        const router = await worker.createRouter({
            mediaCodecs: config.mediasoup.router.mediaCodecs
        })
        room = new Room(roomId, roomName, router);
        Room.rooms.set(roomId, room);
    }
    const routerRtpCapabilities = room.router.rtpCapabilities;
    callback({ routerRtpCapabilities });
}


// Producer
export const createProducerTransport = async (socket: Socket, data: Record<string, any>, callback: any) => {
    console.log('CREATE_PRODUCER_TRANSPORT', socket.id)

    const { roomId } = data;
    const room = Room.getRoom(roomId);
    if (!room) {
        console.log('No room with id', roomId);
        return;
    }
    const socketId = socket.id;
    const { transport, transportParams } = await createTransport(room);

    room.addProducerTransport(socketId, transport);

    transport.observer.on('close', () => {
        console.log('PEER LEFT: Peer producer tarnsport closed')
        // close and remove all its producers
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
    })

    callback({ transportParams }, null)
}

// ! STEP >> 43
export const connectProducerTransport = (socket: Socket, data: Record<string, any>, callback: any) => {
    console.log('CONNECT_PRODUCER_TRANSPORT', socket.id)

    const { dtlsParameters, transportId } = data;
    const { peer: peerInfo, roomId } = socket.data;
    const room = Room.getRoom(roomId);
    if (!room) return callback(null, { error: 'Room was not found' });

    const peer = room.getPeer(peerInfo.id);
    if (!peer) return callback(null, { error: 'Peer was not found' });


    const transport = peer.data.transports.get(transportId);
    if (!transport) return callback(null, { error: 'Transport was not found' });

    transport.connect({ dtlsParameters });
    callback({}, null);
}

// ! STEP >> 45-47
export const produceOnTransport = async (io: Server, socket: Socket, data: Record<string, any>, callback: any) => {
    console.log('PRODUCER_ON_TRANSPORT', socket.id)

    const { transportId, kind, rtpParameters, appData } = data;

    const { peer: peerInfo, roomId } = socket.data;
    const room = Room.getRoom(roomId);
    if (!room) return callback(null, { error: 'Room was not found' });

    const peer = room.getPeer(peerInfo.id);
    if (!peer) return callback(null, { error: 'Peer was not found' });

    const transport = peer.data.transports.get(transportId);
    if (!transport) return callback(null, { error: 'Transport was not found' });

    const producer = await transport.produce({ kind, rtpParameters, appData: { ...appData } })

    callback({ producerId: producer.id }, null);

    peer.data.producers.set(producer.id, producer);
    room.updatePeer(peer.id, peer);

    // Create consumer for each joined peer 
    const existingPeers = room.getPeers().values();

    for (const existingPeer of existingPeers) {
        // Ingore producer peer
        if (existingPeer.socketId === peer.socketId) continue;
        
            await createConsumer(io, room, existingPeer, peer, producer);

    }
}



// Consumer
export const createConsumerTransport = async (socket: Socket, data: Record<string, any>, callback: any) => {
    console.log('CREATE_CONSUMER_TRANSPORT', socket.id)

    const { roomId, producerSocketId, } = data;
    const room = Room.getRoom(roomId);
    if (!room) {
        console.log('No room with id', roomId);
        return;
    }
    const socketId = socket.id;
    const { transport, transportParams } = await createTransport(room);
    const rKey: RKey = { socketId, producerSocketId }
    console.log('RKey_CREATE', rKey)

    room.addConsumerTransport(rKey, transport);

    console.log('C_TRANSPRORTS', room.consumerTransports)
    console.log('GET TRANSPRORTS', room.getConsumerTransport(rKey))



    transport.observer.on('close', () => {
        // close and remove all its consumers
        console.log('PEER LEFT: Peer consumer tarnsport closed')
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
    })

    callback({ transportParams }, null)
}

// ! STEP >> 34
export const connectConsumerTransport = async (socket: Socket, data: Record<string, any>, callback: any) => {
    console.log('CONNECT_CONSUMER_TRANSPORT', socket.id)

    const room = Room.getRoom(socket.data.roomId);
    if (!room) return;

    const { transportId, dtlsParameters } = data;

    const peer = room.getPeer(socket.data.peer.id);

    if (!peer) return;

    const transport = peer.data.transports.get(transportId);
    if (!transport) return;


    await transport.connect({ dtlsParameters })

    callback({}, null);
}






export const setMic = () => {

}
export const setVideo = () => {

}
export const setScreen = () => {

}


export const producerClosed = (socket: Socket, data: Record<string, any>, callback: any) => {
    console.log('PRODUCER CLOSED', socket.id)

    const room = Room.getRoom(socket.data.roomId);
    if (!room) return;
    const peer = room.getPeer(socket.data.peer.id);
    if (!peer) return;

    const { producerId } = data;

    const producer = peer.data.producers.get(producerId);

    if (!producer) return;

    producer.close();

   peer.data.producers.delete(producerId);
   room.updatePeer(peer.id, peer);
   callback();
//    Remove all consumers of this peer
const allPeers = room.getPeers().values();

for (const onePeer of allPeers) {
    // Ingore new peer
    if (onePeer.socketId === peer.socketId) continue;

    onePeer.data.consumers.delete(producerId) // Consumers are store with producerId as key
    room.updatePeer(onePeer.id, onePeer);

    console.log('DELETED CONSUMERS FROM PEER', onePeer.name);
}


}



const createTransport = async (room: Room, type: TransportKind = 'consumer') => {
    const transport = await room.router.createWebRtcTransport({
        listenIps: config.mediasoup.transport.listenIps,
        enableTcp: true,
        enableUdp: true,
        preferUdp: true,
        appData: {
            isConsumer: type === 'consumer',
            isProducer: type === 'producer'
        }
    })

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
}


