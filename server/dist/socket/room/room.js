"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Room {
    constructor(id, name, router) {
        this.id = id;
        this.name = name;
        this.router = router;
        this.isOpen = false;
        this.host = [];
        this.peers = new Map();
        this.members = [];
        this.producerTransports = new Map();
        this.consumerTransports = new Map();
        this.cameraProducers = new Map();
        this.screenProducers = new Map();
        this.micAudioProducers = new Map();
        this.screenAudioProducers = new Map();
        this.cameraConsumers = new Map();
        this.screenConsumers = new Map();
        this.micAudioConsumers = new Map();
        this.screenAudioConsumers = new Map();
    }
    static addRoom(id, room) {
        Room.rooms.set(id, room);
    }
    static getRoom(id) {
        return Room.rooms.get(id);
    }
    static removeRoom(id) {
        Room.rooms.delete(id);
    }
    addPeer(peer) {
        this.peers.set(peer.id, peer);
    }
    getPeer(id) {
        return this.peers.get(id);
    }
    getPeers() {
        return this.peers;
    }
    updatePeer(id, peer) {
        this.peers.set(id, peer);
    }
    removePeer(id) {
        this.peers.delete(id);
    }
    addHost(key) {
        this.host.push(key);
    }
    getHost(key) {
        return this.host.find(hKey => hKey === key);
    }
    removeHost(key) {
        this.host = this.host.filter(hKey => hKey !== key);
    }
    addProducerTransport(socketId, transport) {
        this.producerTransports.set(socketId, transport);
    }
    getProducerTransport(socketId) {
        return this.producerTransports.get(socketId);
    }
    removeProducerTransport(socketId) {
        this.producerTransports.delete(socketId);
    }
    addConsumerTransport(rKey, transport) {
        this.consumerTransports.set(rKey, transport);
    }
    getConsumerTransport(rKey) {
        return this.consumerTransports.get(rKey);
    }
    removeConsumerTransport(rKey) {
        this.consumerTransports.delete(rKey);
    }
    addCameraProducer(socketId, producer) {
        this.cameraProducers.set(socketId, producer);
    }
    getCameraProducer(socketId) {
        return this.cameraProducers.get(socketId);
    }
    removeCameraProducer(socketId) {
        this.cameraProducers.delete(socketId);
    }
    addScreenProducer(socketId, producer) {
        this.screenProducers.set(socketId, producer);
    }
    getScreenProducer(socketId) {
        return this.screenProducers.get(socketId);
    }
    removeScreenProducer(socketId) {
        this.screenProducers.delete(socketId);
    }
    addScreenAudioProducer(socketId, producer) {
        this.screenAudioProducers.set(socketId, producer);
    }
    getScreenAudioProducer(socketId) {
        return this.screenAudioProducers.get(socketId);
    }
    removeScreenAudioProducer(socketId) {
        this.screenAudioProducers.delete(socketId);
    }
    addMicAudioProducer(socketId, producer) {
        this.micAudioProducers.set(socketId, producer);
    }
    getMicAudioProducer(socketId) {
        return this.micAudioProducers.get(socketId);
    }
    removeMicAudioProducer(socketId) {
        this.micAudioProducers.delete(socketId);
    }
    addCameraConsumer(rKey, consumer) {
        this.cameraConsumers.set(rKey, consumer);
    }
    getCameraConsumer(rKey) {
        return this.cameraConsumers.get(rKey);
    }
    removeCameraConsumer(rKey) {
        this.cameraConsumers.delete(rKey);
    }
    addScreenConsumer(rKey, consumer) {
        this.screenConsumers.set(rKey, consumer);
    }
    getScreenConsumer(rKey) {
        return this.screenConsumers.get(rKey);
    }
    removeScreenConsumer(rKey) {
        this.screenConsumers.delete(rKey);
    }
    addScreenAudioConsumer(rKey, consumer) {
        this.screenAudioConsumers.set(rKey, consumer);
    }
    getScreenAudioConsumer(rKey) {
        return this.screenAudioConsumers.get(rKey);
    }
    removeScreenAudioConsumer(rKey) {
        this.screenAudioConsumers.delete(rKey);
    }
    addMicAudioConsumer(rKey, consumer) {
        this.micAudioConsumers.set(rKey, consumer);
    }
    getMicAudioConsumer(rKey) {
        return this.micAudioConsumers.get(rKey);
    }
    removeMicAudioConsumer(rKey) {
        this.micAudioConsumers.delete(rKey);
    }
}
Room.rooms = new Map;
exports.default = Room;
//# sourceMappingURL=room.js.map