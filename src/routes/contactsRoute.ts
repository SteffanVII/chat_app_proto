import express from "express";
import { acceptRequest, cancelRequest, findContact, getContacts, getRequests, sendRequest } from "../controllers/contactsController";
import { authenticate } from "../middlewares/authenticate";

export const contactsRoute = express.Router();

contactsRoute.get("/getrequests", authenticate, getRequests);
contactsRoute.get("/getcontacts", authenticate, getContacts);
contactsRoute.post("/find", authenticate, findContact);
contactsRoute.post("/request", authenticate, sendRequest);
contactsRoute.post("/requestaccept", authenticate, acceptRequest);
contactsRoute.delete("/requestcancel", authenticate, cancelRequest);