import { Imessage } from "@/interfaces";
import { EwsMessageResponseType, TwsMessage } from "@/types";
import parseCookie from "@/utils/parsecookie";
import mongoose from "mongoose";

export function CreateWebsocket( callbacks : {
    open? : Function,
    close? : Function,
    appendNewMessage : ( data : Imessage ) => void,
    messageConfirm : ( data : Imessage  ) => void
} ) : WebSocket {
    
    const ws = new WebSocket(`ws://localhost:8080?user=${parseCookie()["user"]}`);

    // Set open event listener when open callback is provided
    if ( callbacks.open )
        ws.addEventListener( "open", callbacks.open() );

    // Set close event listener when close callback is provided
    if ( callbacks.close )
        ws.addEventListener( "close", callbacks.close() );

    // Process different message types
    ws.addEventListener( "message", ( message ) => {
        
        let data : TwsMessage = JSON.parse(message.data);

        switch ( data.type ) {
            case EwsMessageResponseType.NEW_MESSAGE:
                
                callbacks.appendNewMessage(data.payload);

                break;

            case EwsMessageResponseType.MESSAGE_SENT:

                callbacks.messageConfirm(data.payload);

                break;
        
            default:
                break;
        }

    } );

    return ws;
}