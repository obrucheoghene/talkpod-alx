import App from "./app";
import roomRoutes from "./controllers/room.controller";
import authRoutes from "./controllers/auth.controller";


const app = new App([
    {path: '/auth', router: authRoutes},
    {path: '/rooms', router: roomRoutes}
]);

app.listen();
