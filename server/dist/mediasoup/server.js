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
Object.defineProperty(exports, "__esModule", { value: true });
exports.releaseWorkers = exports.getMediasoupWorker = exports.runMediaSoupWorkers = void 0;
const mediasoup_1 = require("mediasoup");
const config = __importStar(require("../config/config"));
const workers = [];
let nextWorkerIndex = 0;
async function runMediaSoupWorkers() {
    try {
        const numWorkers = config.mediasoup.worker.number;
        if (workers.length > 0) {
            console.log("Workers is already started");
            return;
        }
        const { dtlsCertificateFile, dtlsPrivateKeyFile, rtcMaxPort, rtcMinPort, logLevel, logTags } = config.mediasoup.worker.settings;
        for (let i = 0; i < numWorkers; i++) {
            const worker = await (0, mediasoup_1.createWorker)({
                dtlsCertificateFile,
                dtlsPrivateKeyFile,
                logLevel,
                logTags,
                rtcMaxPort,
                rtcMinPort
            });
            worker.once('died', () => {
                console.error('worker::died [pide:%d] exiting in 2 seconds...', worker.pid);
                setTimeout(() => process.exit(1), 2000);
            });
            workers.push(worker);
        }
    }
    catch (error) {
        console.error('worker start error ! \n', error);
        process.exit(1);
    }
}
exports.runMediaSoupWorkers = runMediaSoupWorkers;
function getMediasoupWorker() {
    const worker = workers[nextWorkerIndex];
    if (++nextWorkerIndex === workers.length) {
        nextWorkerIndex = 0;
    }
    return { worker: worker, index: nextWorkerIndex };
}
exports.getMediasoupWorker = getMediasoupWorker;
;
function releaseWorkers() {
    for (const worker of workers) {
        worker.close();
    }
    workers.length = 0;
}
exports.releaseWorkers = releaseWorkers;
;
//# sourceMappingURL=server.js.map