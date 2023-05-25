import https from "https";
import http from "http";
import { WebSocketServer } from "ws";
import { URLSearchParams } from "url";
import WebSocket from "ws";
import { EwsMessageResponseTypes, EwsMessageTypes, TwsMessage } from "./utilities/types_enums";
import { mc } from ".";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

export default class WebSocketConnection {
    connection;
    pool : Record<string, WebSocket.WebSocket[]>;

    constructor( _server: http.Server ) {

        this.connection = new WebSocketServer({
            server : _server
        });
        this.pool = {};
        
        this.connection.on( "connection", (ws, req) => {

            let cookies : { [ key : string ] : string } = {};
            decodeURIComponent(req.headers.cookie as string).split("; ").forEach(c => {
                cookies[c.split("=")[0]] = c.split("=")[1];
            });

            // Do somthing when a client connected
            console.log("Client Connected");

            let params = new URLSearchParams(req.url?.split("?")[1]);

            ws.on("message", message => {
                //Do something when a message is recieved
                this.processMessage( JSON.parse(message.toString()), cookies["user"], ws );
            })

            ws.on("close", () => {
                this.pool[params.get("user") as string].splice( this.pool[params.get("user") as string].indexOf(ws), 1 );
                console.log("Client disconnected");
            })

            if ( this.pool[params.get("user") as string] ) {
                this.pool[params.get("user") as string].push(ws);
            } else {
                this.pool[params.get("user") as string] = [ws];
            }
            // console.log(this.pool);
        } )
    }

    async processMessage( event : TwsMessage, sender : string, ws : WebSocket.WebSocket ) {

        switch (event.type) {
            case EwsMessageTypes.MESSAGE_SEND:
                
                let { id, message, threadId, to } = event.payload;

                // Create the message
                let m = await mc.messages.create({
                    _id : id,
                    message : message,
                    sender : sender,
                    thread : threadId
                });

                // Update the latest massage of the thread
                await mc.threads.findOneAndUpdate( { _id : threadId }, {
                    latest : m._id
                } );

                // Update the thread of the connected recipients
                if ( this.pool[to] ) {
                    this.pool[to].forEach( connection => {
                        connection.send( JSON.stringify({
                            type : EwsMessageResponseTypes.NEW_MESSAGE,
                            payload : m
                        }) );
                    })
                }

                // Send back confirmation that message is sent
                ws.send(JSON.stringify({
                    type : EwsMessageResponseTypes.MESSAGE_SENT,
                    payload : m
                }));

                break;
        
            default:
                break;
        }

    }

}