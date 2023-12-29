"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mediasoup = exports.https = void 0;
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const certPath = path_1.default.join(__dirname, '..', 'certs', 'fullchain.pem');
const keyPath = path_1.default.join(__dirname, '..', 'certs', 'privkey.pem');
exports.https = {
    listenIp: '0.0.0.0',
    listenPort: process.env.SERVER_LISTEN_PORT || 8000,
    tls: {
        cert: process.env.HTTPS_CERT || certPath,
        key: process.env.HTTPS_KEY || keyPath,
    }
};
exports.mediasoup = {
    worker: {
        number: Object.keys(os_1.default.cpus()).length,
        settings: {
            dtlsCertificateFile: process.env.HTTPS_CERT || certPath,
            dtlsPrivateKeyFile: process.env.HTTPS_KEY || keyPath,
            rtcMinPort: parseInt(process.env.RTC_MIN_PORT || '2000'),
            rtcMaxPort: parseInt(process.env.RTC_MAX_PORT || '2100'),
            logLevel: 'warn',
            logTags: [
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
            ],
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
                parameters: {
                    'x-google-start-bitrate': 1000
                }
            },
        ],
    },
    transport: {
        listenIps: [
            {
                ip: process.env.MEDIASOUP_LISTEN_IP || '0.0.0.0',
                announcedIp: process.env.MEDIASOUP_ANNOUNCED_IP || '127.0.0.1'
            }
        ],
        webRtcServer: {
            listenInfos: [
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
};
//# sourceMappingURL=config.js.map