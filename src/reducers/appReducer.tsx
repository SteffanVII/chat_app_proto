import { IappState } from "@/interfaces";
import { EappActionTypes, EwsMessageType, TappAction } from "@/types";
import { threadId } from "worker_threads";

export function appReducer( state : IappState, action : TappAction ) {
    switch (action.type) {
        case EappActionTypes.SETWS:
            state.websocket = action.payload;
            return {...state};
        case EappActionTypes.SETTHREAD:
            state.thread = action.payload;
            return {...state};
        case EappActionTypes.SETMESSAGES:
            state.messages = action.payload;
            return {...state};
        case EappActionTypes.SETTHREADLIST:
            state.threads = action.payload;
            return {...state};
        case EappActionTypes.SETUSERDATA:
            state.userdata = action.payload;
            return {...state};
        case EappActionTypes.SETNEWMESSAGE:
            // --
            state.messages.unshift( action.payload );
            state.websocket?.send(JSON.stringify({
                type : EwsMessageType.MESSAGE_SEND,
                payload : {
                    id : action.payload._id,
                    message : action.payload.message,
                    threadId : action.payload.thread,
                    to : action.payload.to
                }
            }));
            return {...state};
        case EappActionTypes.SETCONFIRMMESSAGE:
            // --
            // state.messages.forEach( d => {
            //     if ( d._id.toString() === action.payload._id.toString() ) {
            //         d._id = action.payload._id;
            //         d.createdAt = action.payload.createdAt;
            //         d.updatedAt = action.payload.updatedAt;
            //         delete d.to;
            //         return;
            //     }
            // } )
            return {...state};
        case EappActionTypes.SETINCOMINGMESSAGE:
            state.messages.unshift(action.payload);
            return {...state};
        case EappActionTypes.RERENDER:
            // --
            return {...state};
        default:
            return state;
    }
}