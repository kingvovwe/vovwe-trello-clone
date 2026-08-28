import express from "express"
import cookieParser from "cookie-parser"

import { API_PREFIX, PORT } from "./config/env.config.js";
import { logger } from "./middleware/basic.middleware.js";

import authRoute from './router/auth.router.js'
import { connDB } from "./config/db.config.js";

const app = express();

app.use(logger);
app.use(express.json());
app.use(cookieParser());

app.use(`${API_PREFIX}/auth`, authRoute);

console.log("Registering test route");



(async () => {

    try {

        console.log(API_PREFIX);

        await connDB();

        app.listen(PORT, () => {
            console.log("App Started and listening on: ", PORT);
        })
    } catch (e) {
        console.log("App failed to start: ", e);
        process.exit(1);
    }

})()

