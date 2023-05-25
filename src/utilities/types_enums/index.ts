import mongoose from "mongoose"

export enum EwsMessageTypes {
    MESSAGE_SEND
}

export enum EwsMessageResponseTypes {
    NEW_MESSAGE,
    MESSAGE_SENT
}

export type TwsMessage = {
    type : EwsMessageTypes.MESSAGE_SEND,
    payload : {
        id : mongoose.Types.ObjectId,
        message : string,
        threadId : string,
        to : string
    }
}