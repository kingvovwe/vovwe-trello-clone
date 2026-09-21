import express from "express"
import cookieParser from "cookie-parser"

import { createServer } from "http"
import { Server } from "socket.io"

import { API_PREFIX, PORT } from "./config/env.config.js";
import { logger } from "./middleware/basic.middleware.js";
import { initSocket } from "./socket/socket.handler.js";

import authRoute from './router/auth.router.js'
import boardRoute from "./router/board.router.js";
import columnRoute from "./router/column.router.js";
import taskRoute from "./router/task.router.js";

import { connDB } from "./config/db.config.js";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer);

initSocket(io);

app.use(logger);
app.use(express.json());
app.use(cookieParser());

app.use(`${API_PREFIX}/auth`, authRoute);
app.use(`${API_PREFIX}/board`, boardRoute);
app.use(`${API_PREFIX}/column`, columnRoute);
app.use(`${API_PREFIX}/tasks`, taskRoute);


(async () => {

    try {

        await connDB();

        httpServer.listen(PORT, () => {
            console.log("App Started and listening on: ", PORT);
        })
    } catch (e) {
        console.log("App failed to start: ", e);
        process.exit(1);
    }

})()

