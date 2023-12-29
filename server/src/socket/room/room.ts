import { types as mediasoupTypes } from "mediasoup"
import { Peer, RKey } from "../../interfaces/rooms";

class Room {
    id: string;
    name: string;
    host: string[];
    isOpen: boolean;
    router: mediasoupTypes.Router;
    private peers: Map<string, Peer>;
    members: string[];

    producerTransports: Map<string, mediasoupTypes.Transport>;
    consumerTransports: Map<RKey, mediasoupTypes.Transport>;

    cameraProducers: Map<string, mediasoupTypes.Producer>;
    screenProducers: Map<string, mediasoupTypes.Producer>;
    micAudioProducers: Map<string, mediasoupTypes.Producer>;
    screenAudioProducers: Map<string, mediasoupTypes.Producer>;
    
    cameraConsumers: Map<RKey, mediasoupTypes.Consumer>;
    screenConsumers: Map<RKey, mediasoupTypes.Consumer>;
    micAudioConsumers: Map<RKey, mediasoupTypes.Consumer>;
    screenAudioConsumers: Map<RKey, mediasoupTypes.Consumer>;


    static rooms = new Map<string, Room>

    constructor(id: string, name: string, router: mediasoupTypes.Router) {
        this.id = id;
        this.name = name;
        this.router = router;
        this.isOpen = false;
        this.host = [];
        this.peers = new Map();
        this.members = [];

        this.producerTransports = new Map()
        this.consumerTransports = new Map()

        this.cameraProducers = new Map()
        this.screenProducers = new Map()
        this.micAudioProducers = new Map()
        this.screenAudioProducers = new Map()

        this.cameraConsumers = new Map()
        this.screenConsumers = new Map()
        this.micAudioConsumers = new Map()
        this.screenAudioConsumers = new Map()
    }

    static addRoom(id: string, room: Room,) {
        Room.rooms.set(id, room);
    }

    static getRoom(id: string) {
        return Room.rooms.get(id);
    }

    static removeRoom(id: string) {
        Room.rooms.delete(id);
    }

    addPeer(peer: Peer) {
        this.peers.set(peer.id, peer)
    }

    getPeer(id: string) {
        return  this.peers.get(id);
    }

    getPeers() {
        return this.peers;
    }


    updatePeer(id: string, peer: Peer) {
        this.peers.set(id, peer)
    }

    removePeer(id: string) {
        this.peers.delete(id);
    }

    addHost (key: string) {
        this.host.push(key);
    }

    getHost (key: string) {
        return this.host.find(hKey => hKey === key)
    }

    removeHost (key: string) {
        this.host = this.host.filter(hKey => hKey !== key);
    }


    addProducerTransport (socketId:string, transport: mediasoupTypes.Transport) {
        this.producerTransports.set(socketId, transport);
    }

    getProducerTransport (socketId: string) {
        return this.producerTransports.get(socketId);
    }

    removeProducerTransport (socketId: string) {
        this.producerTransports.delete(socketId);
    }


    addConsumerTransport (rKey:RKey, transport: mediasoupTypes.Transport) {
        this.consumerTransports.set(rKey, transport);
    }

    getConsumerTransport (rKey:RKey) {
       
        return this.consumerTransports.get(rKey);
    }

    removeConsumerTransport (rKey:RKey,) {
        this.consumerTransports.delete(rKey);
    }


    addCameraProducer (socketId:string, producer: mediasoupTypes.Producer) {
        this.cameraProducers.set(socketId, producer);
    }

    getCameraProducer (socketId: string) {
        return this.cameraProducers.get(socketId);
    }

    removeCameraProducer (socketId: string) {
        this.cameraProducers.delete(socketId);
    }


    addScreenProducer (socketId:string, producer: mediasoupTypes.Producer) {
        this.screenProducers.set(socketId, producer);
    }

    getScreenProducer (socketId: string) {
        return this.screenProducers.get(socketId);
    }

    removeScreenProducer (socketId: string) {
        this.screenProducers.delete(socketId);
    }

    
    addScreenAudioProducer (socketId:string, producer: mediasoupTypes.Producer) {
        this.screenAudioProducers.set(socketId, producer);
    }

    getScreenAudioProducer (socketId: string) {
        return this.screenAudioProducers.get(socketId);
    }

    removeScreenAudioProducer (socketId: string) {
        this.screenAudioProducers.delete(socketId);
    }


    addMicAudioProducer (socketId:string, producer: mediasoupTypes.Producer) {
        this.micAudioProducers.set(socketId, producer);
    }

    getMicAudioProducer (socketId: string) {
        return this.micAudioProducers.get(socketId);
    }

    removeMicAudioProducer (socketId: string) {
        this.micAudioProducers.delete(socketId);
    }


    addCameraConsumer (rKey:RKey, consumer: mediasoupTypes.Consumer) {
        this.cameraConsumers.set(rKey, consumer);
    }

    getCameraConsumer (rKey:RKey) {
        return this.cameraConsumers.get(rKey);
    }

    removeCameraConsumer (rKey: RKey) {
        this.cameraConsumers.delete(rKey);
    }


    addScreenConsumer (rKey:RKey, consumer: mediasoupTypes.Consumer) {
        this.screenConsumers.set(rKey, consumer);
    }

    getScreenConsumer (rKey:RKey) {
        return this.screenConsumers.get(rKey);
    }

    removeScreenConsumer (rKey: RKey) {
        this.screenConsumers.delete(rKey);
    }


    addScreenAudioConsumer (rKey:RKey, consumer: mediasoupTypes.Consumer) {
        this.screenAudioConsumers.set(rKey, consumer);
    }

    getScreenAudioConsumer (rKey:RKey) {
        return this.screenAudioConsumers.get(rKey);
    }

    removeScreenAudioConsumer (rKey: RKey) {
        this.screenAudioConsumers.delete(rKey);
    }


    addMicAudioConsumer (rKey:RKey, consumer: mediasoupTypes.Consumer) {
        this.micAudioConsumers.set(rKey, consumer);
    }

    getMicAudioConsumer (rKey:RKey) {
        return this.micAudioConsumers.get(rKey);
    }

    removeMicAudioConsumer (rKey: RKey) {
        this.micAudioConsumers.delete(rKey);
    }

}

export default Room;
