import { types as mediasoupTypes } from "mediasoup";


export const SOURCE_KIND = {
    camera: 'camera',
    screen: 'screen',
    micAudio: 'micAudio',
    screenAudio: 'screenAudio'
}
export type TransportKind = 'producer' | 'consumer';

export interface Peer {
    id: string;
    key?: string;  // can be an email / username/ id 
    socketId: string;
    name: string;
    data: {
        transports: Map<string, mediasoupTypes.Transport>,
        producers: Map<string, mediasoupTypes.Producer>,
        consumers: Map<string, mediasoupTypes.Consumer>
        rtpCapabilities: mediasoupTypes.RtpCapabilities,
    }
}

export interface RKey { // Relationship key
    socketId: string;
    producerSocketId: string;
}


