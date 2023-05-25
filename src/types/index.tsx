import { Imessage, ImessageSending, Ithread, IthreadComponentProps, IthreadListComponentProps, IuserData } from "@/interfaces"
import mongoose from "mongoose"

export enum EappActionTypes {
    SETWS,
    SETTHREAD,
    SETMESSAGES,
    SETNEWMESSAGE,
    SETCONFIRMMESSAGE,
    SETINCOMINGMESSAGE,
    SETUSERDATA,
    SETTHREADLIST,
    RERENDER,
}

export type TappAction = {
    type : EappActionTypes.SETWS, payload : WebSocket | undefined
} | {
    type : EappActionTypes.SETTHREAD, payload : Ithread | null
} | {
    type : EappActionTypes.SETUSERDATA, payload : IuserData | null
} | {
    type : EappActionTypes.SETTHREADLIST, payload : IthreadListComponentProps | null
} | {
    type : EappActionTypes.SETMESSAGES, payload : Imessage[]
} | {
    type : EappActionTypes.SETNEWMESSAGE, payload : ImessageSending
} | {
    type : EappActionTypes.SETCONFIRMMESSAGE, payload : Imessage
} | {
    type : EappActionTypes.SETINCOMINGMESSAGE, payload : Imessage
} | {
    type : EappActionTypes.RERENDER
}

export enum EwsMessageType {
    MESSAGE_SEND
}

export enum EwsMessageResponseType {
    NEW_MESSAGE,
    MESSAGE_SENT
}

export type TwsMessage = {
    type : EwsMessageResponseType.NEW_MESSAGE,
    payload : Imessage
} | {
    type : EwsMessageResponseType.MESSAGE_SENT,
    payload : Imessage
}