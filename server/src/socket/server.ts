import express from "express";
import https from "https"
import { Server } from "socket.io";
import fs from "fs";

import * as config from "../config/config"
import { handleRoomConnections } from "./room/handler";


export const runSignallingServer = (app: express.Application) => {
    const serverOption = {
        key: fs.readFileSync(config.https.tls.key, 'utf8'),
        cert: fs.readFileSync(config.https.tls.cert, 'utf8'),
    }
    const corsOption = {
        origin: "*",
        methods: ["GET", "POST"]
    }
    const server = https.createServer(serverOption, app);
    const io = new Server(server, {
        cors: corsOption
    });

    app.set('server', server)
  
    handleRoomConnections(io);
}
