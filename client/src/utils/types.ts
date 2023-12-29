export interface User {
    data: {
        id: string;
        name: string;
        email: string;
    };
    token: string
}

export interface Room {
    id: string;
    name: string;
    userId: string;
}

export interface Session {
    id: string
    roomId: string;
}

export interface Participant {
    peerId: string
    name: string;
    isRoomOwner?: boolean;
}

export interface Peer {
    id: string,
    name: string,
    video?: MediaStream,
    audio?: MediaStream
}
export interface Comment {
    message: string
    name: string;
}

export interface MediaConstraints {
    audio: boolean;
    video?: boolean;
}

export const SOURCE_KIND = {
    camera: 'camera',
    screen: 'screen',
    micAudio: 'micAudio',
    screenAudio: 'screenAudio'
}

export interface Chat {
    id?: string,
    peerId: string,
    message: string
    peerName: string
}

export interface FeaturesType {
    name: string,
    iconClass: string,
    description: string
}
