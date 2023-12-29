import {createWorker, types as mediasoupTypes } from "mediasoup"

import * as config from '../config/config'


const workers: Array<mediasoupTypes.Worker> = [];
let nextWorkerIndex = 0;

export async function runMediaSoupWorkers () {
    try {
        const numWorkers = config.mediasoup.worker.number;

        if (workers.length > 0) {
            console.log("Workers is already started");
            return
        }

        const {dtlsCertificateFile, dtlsPrivateKeyFile,
        rtcMaxPort, rtcMinPort, logLevel, logTags} = config.mediasoup.worker.settings;

        for (let i = 0; i < numWorkers; i++) {
            const worker = await createWorker({
                dtlsCertificateFile,
                dtlsPrivateKeyFile,
                logLevel,
                logTags,
                rtcMaxPort,
                rtcMinPort
            })

            worker.once('died', () => {
                console.error('worker::died [pide:%d] exiting in 2 seconds...', worker.pid);
                setTimeout(() => process.exit(1), 2000);
            });

            workers.push(worker);
        }
    } catch (error) {
        console.error('worker start error ! \n', error);
        process.exit(1);
    }

}


export function getMediasoupWorker() {

     const worker = workers[nextWorkerIndex];
    if (++nextWorkerIndex === workers.length) {
        nextWorkerIndex = 0;
    }

    return {worker: worker, index: nextWorkerIndex};
};


export function releaseWorkers() {
    for (const worker of workers) {
        worker.close();
    }

    workers.length = 0;
};
