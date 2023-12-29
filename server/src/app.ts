import express, {Request, Response} from "express"
import cors from "cors";

import { Route } from "./interfaces/routes";
import * as config from "./config/config";
import { runSignallingServer } from "./socket/server";
import { runMediaSoupWorkers } from "./mediasoup/server";


class App {
    app: express.Application;

    constructor (routes: Route[]){
        this.app = express();


        this.connectToDatabase();
        this.initializeMiddlewares();
        this.initializeRoutes(routes);

        runMediaSoupWorkers();
        runSignallingServer(this.app)
        
    }

    private connectToDatabase = () => {
        
    }

    private initializeMiddlewares = () => {
        const corsOption = {
            origin: "*",
            methods: ["GET", "POST"]
        }
        this.app.use(cors(corsOption))
        this.app.use(express.json())
    }

    private initializeRoutes = (routes: Route[]) => {
        routes.forEach((route) => {
            this.app.use(route.path, route.router)
        })

        // Default Route
        this.app.get('/', (_req: Request, res: Response) => {
            return res.status(200).send("<h1>Talkpod Service</h1>");
        })
        // Health check
        this.app.get('/health', (_req: Request, res: Response) => {
            return res.status(200).json({"status": "Healthy"})
        })
    }

    public listen = () => {
        this.app.get('server').listen(config.https.listenPort, () => {
            console.log(`Server running on port ${config.https.listenPort}`);
        })
    }

}

export default App;
