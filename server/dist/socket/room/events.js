"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SOCKET_EVENT_TYPES = void 0;
exports.SOCKET_EVENT_TYPES = {
    disconnect: 'disconnect',
    connected: 'connected',
    startRoom: 'startRoom',
    joinRoom: 'joinRoom',
    leaveRoom: 'leaveRoom',
    getRouterRtpCapabilities: 'getRouterRtpCapabilities',
    getOtherProducers: 'getOtherProducers',
    createProducerTransport: 'createProducerTransport',
    connectProducerTransport: 'connectProducerTransport',
    produceOnTransport: 'produceOnTransport',
    createConsumerTransport: 'createConsumerTransport',
    connectConsumerTransport: 'connectConsumerTransport',
    consumeOnTransport: 'consumeOnTransport',
    resume: 'resume',
    setMic: 'setMic',
    setVideo: 'setVideo',
    setScreen: 'setScreen',
    newProducer: 'newProducer',
    newConsumer: 'newConsumer',
    newPeer: 'newPeer',
    peerLeft: 'peerLeft',
    producerClosed: 'producerClosed',
    consumerClosed: 'consumerClosed',
    sendPublicChat: 'sendPublicChat',
    newPublicChat: 'newPublicChat',
    createWebRtcTransports: 'createWebRtcTransports',
    createConsumersForExistingPeers: 'createConsumersForExistingPeers'
};
//# sourceMappingURL=events.js.map