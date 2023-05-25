import express from "express";
import { authToken, getUserCredentials, getUserData, loginUser, logoutUser, signNewUser } from "../controllers/usersController";
import { authenticate } from "../middlewares/authenticate";

export const userRoute = express.Router();

userRoute.post("/signuser", signNewUser);
userRoute.post("/loginuser", loginUser);
userRoute.post("/getusercredentials", getUserCredentials);
userRoute.post("/getuserdata", getUserData);
userRoute.get("/logoutuser", logoutUser);
userRoute.get("/auth", authenticate, authToken);