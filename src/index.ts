import express from "express";
import https from "https";
import http from "http"
import fs from "fs";
import path from "path";
import cors from "cors";
import * as dotenv from "dotenv";
import WebSocketConnection from "./websocket";
import MongooseConnection from "./mongo";
import cookieParser from "cookie-parser";
import { userRoute } from "./routes/usersRoute";
import { contactsRoute } from "./routes/contactsRoute";
import { threadsRoute } from "./routes/threadsRoute";

// Configure environment variables
dotenv.config();

const PORT = process.env.PORT || 8080;

// Create express app
const app = express();

// App middlewares
app.use(cookieParser());
app.use(express.urlencoded({
    extended : true
}));
app.use(express.json());
app.use(cors({
    origin : "http://localhost:3000",
    credentials : true
}));

// Creates https server
const server = http.createServer(app);

// Create Websocket server
export const ws : WebSocketConnection = new WebSocketConnection(server);

// Create Mongoose connection
export const mc : MongooseConnection = new MongooseConnection(process.env.MONGO_URI!);

// App routes
app.use("/user", userRoute);
app.use("/contacts", contactsRoute);
app.use("/threads", threadsRoute);

// Start the server
server
    .listen(process.env.PORT, () => {
        console.log(`Server running at port ${process.env.PORT}`);
    })

// run();

async function run() {
    try {
        await mc.users.create({
            email : "abaochrisjay@gmail.com",
            password : "123456789"
        });

        const user = await mc.users.findOne({
            email : "abaochrisja@gmail.com"
        });

        console.log(user);
    } catch (err) {
        console.log(err);
    }
}