export const SERVER_BASE_URL = import.meta.env.VITE_REACT_APP_SERVER_BASE_URL as string


export const SOCKET_EVENT_TYPES = {
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

  // Chats
  sendPublicChat: 'sendPublicChat',
  newPublicChat: 'newPublicChat',

  createWebRtcTransports: 'createWebRtcTransports',
  createConsumersForExistingPeers: 'createConsumersForExistingPeers'
}


export const producerOptions = {
  // mediasoup params
  encodings: [
    {
      rid: 'r0',
      maxBitrate: 100000,
      scalabilityMode: 'S1T3',
    },
    {
      rid: 'r1',
      maxBitrate: 300000,
      scalabilityMode: 'S1T3',
    },
    {
      rid: 'r2',
      maxBitrate: 900000,
      scalabilityMode: 'S1T3',
    },
  ],
  // https://mediasoup.org/documentation/v3/mediasoup-client/api/#ProducerCodecOptions
  codecOptions: {
    videoGoogleStartBitrate: 1000
  }
}
