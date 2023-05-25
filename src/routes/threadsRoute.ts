import express from "express";
import { authenticate } from "../middlewares/authenticate";
import { pushMessage, threadContents, threadDetails, threadsList } from "../controllers/threadsController";

export const threadsRoute = express.Router();

threadsRoute.post("/data", authenticate, threadDetails);
threadsRoute.post("/send", authenticate, pushMessage);
threadsRoute.post("/contents", authenticate, threadContents);
threadsRoute.get("/list", authenticate, threadsList);