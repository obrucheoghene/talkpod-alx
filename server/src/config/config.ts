import path from 'path';
import os from 'os';
import { types as mediasoupTypes } from "mediasoup"

const certPath = path.join(__dirname, '..', 'certs', 'fullchain.pem');
const keyPath = path.join(__dirname, '..', 'certs', 'privkey.pem');

export const https = {
    listenIp: '0.0.0.0',
    listenPort: process.env.SERVER_LISTEN_PORT || 8000,
    tls:
    {
        cert: process.env.HTTPS_CERT || certPath,
        key: process.env.HTTPS_KEY || keyPath,
    }
}

export const mediasoup = {
    worker: {
        number: Object.keys(os.cpus()).length,
        settings: {
            dtlsCertificateFile: process.env.HTTPS_CERT || certPath,
            dtlsPrivateKeyFile: process.env.HTTPS_KEY || keyPath,
            rtcMinPort: parseInt(process.env.RTC_MIN_PORT || '2000'),
            rtcMaxPort: parseInt(process.env.RTC_MAX_PORT || '2100' ),
            logLevel: 'warn' as mediasoupTypes.WorkerLogLevel,
            logTags:
                [
                    'info',
                    'ice',
                    'dtls',
                    'rtp',
                    'srtp',
                    'rtcp',
                    'rtx',
                    'bwe',
                    'score',
                    'simulcast',
                    'svc',
                    'sctp'
                ] as Array<mediasoupTypes.WorkerLogTag>,
        },
    },

    router: {
        mediaCodecs: [
            {
                kind: 'audio',
                mimeType: 'audio/opus',
                clockRate: 48000,
                channels: 2
            },
            {
                kind: 'video',
                mimeType: 'video/VP8',
                clockRate: 90000,
                parameters:
                {
                    'x-google-start-bitrate': 1000
                }
            },
        ] as Array<mediasoupTypes.RtpCodecCapability>,
    },

    transport: {
        listenIps: [
            {
                ip: process.env.MEDIASOUP_LISTEN_IP || '0.0.0.0',
                announcedIp: process.env.MEDIASOUP_ANNOUNCED_IP || '127.0.0.1' // very important to set
            }
        ] as Array<mediasoupTypes.TransportListenIp>,

        webRtcServer:
        {
            listenInfos:
                [
                    {
                        protocol: 'udp',
                        ip: process.env.MEDIASOUP_LISTEN_IP || '0.0.0.0',
                        announcedIp: process.env.MEDIASOUP_ANNOUNCED_IP,
                        port: 44444
                    },
                    {
                        protocol: 'tcp',
                        ip: process.env.MEDIASOUP_LISTEN_IP || '0.0.0.0',
                        announcedIp: process.env.MEDIASOUP_ANNOUNCED_IP,
                        port: 44444
                    }
                ]
        }
    }
}

