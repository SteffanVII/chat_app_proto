import { mc } from "..";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export async function authenticate( request : Request, response : Response, next : Function ) {

    const cookies = request.cookies;

    if ( cookies["user"] && cookies["token"] ) {

        try {
            let decoded = jwt.verify( cookies["token"], process.env.JWT_SECRET! );
            response.cookie( "token", cookies["token"] );
            next();
        } catch ( err ) {
            response.status(200).json({
                err : {
                    message : "Token expired"
                }
            });
        }
        
    } else {
        response.status(200).json({
            err : {
                message : "Invalid Token"
            }
        });
    }

}