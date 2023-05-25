import { Imessage } from "@/interfaces";
import { useRef, useState } from "react";

export function useMessages( initial : Imessage[] ) {

    const messages = useRef<Imessage[]>(initial);
    const sending = useRef<{ [key : string] : Imessage }>({});
    
    const [ r, rerender ] = useState(false)
    
    function append( message : Imessage ) {
        messages.current.unshift(message);
        // Add to sending object if message is being send
        if ( message.to ) {
            sending.current[message._id.toString()] = message;
        }

        rerender(!r)
    }

    function update( message : Imessage ) {
        rerender(!r)
    }

    function confirm( message : Imessage ) {
        let object = sending.current[message._id.toString()];
        object._id = message._id;
        object.createdAt = message.createdAt;
        object.updatedAt = message.updatedAt;
        delete object.to
        rerender(!r)
    }

    return { messages, append, update, confirm };
}