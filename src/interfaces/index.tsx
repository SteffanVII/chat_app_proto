import mongoose, { Mongoose } from "mongoose";
import { Ref, RefObject } from "react";

// app --------------------------------------------------------------

export interface IappState {
    websocket : WebSocket | undefined,
    thread : Ithread | null,
    threads :  IthreadListComponentProps | null,
    messages : Imessage[],
    sending : Imessage[],
    sendingActive : boolean,
    userdata : {
        owner : string,
        lastViewedThread : mongoose.Types.ObjectId
    } | null
}

export interface IappContext {
    state : RefObject<IappState>,
    messagesArray : RefObject<Imessage[]>,
    ws : {
        set : Function,
        get : Function,
        close : Function
    },
    thread : {
        set : Function,
        get : Function
    },
    messages : {
        set : Function,
        get : () => Imessage[],
        new : ( data : ImessageSending ) => void
    },
    threadlist : {
        set : Function,
        get : Function
    },
    getRoute : Function
}

export interface IpageProps {
    isAuth : boolean
}

// User -------------------------------------------------------------

export interface IuserData {
    owner : string,
    lastViewedThread : mongoose.Types.ObjectId
}

// Thread ------------------------------------------------------------

export interface IthreadPageProps extends IpageProps {
    data : Ithread
}

export interface IthreadListPageProps extends IthreadPageProps {
    threads : IthreadListComponentProps,
    messages : Imessage[]
}

export interface IthreadComponentProps {
    data : Ithread,
    messages : Imessage[]
}

export interface Ithread {
    threadData : {
        _id : mongoose.Types.ObjectId,
        recipients : IuserCredentials[],
        latest : Imessage
    },
    threadName : String
}

export interface IgetThreadMessagesResponse {
    results : Imessage[]
}

export interface IthreadListComponentProps {
    list : Ithread[]
}

export interface IthreadRowProps {
    data : Ithread
}

// Message --------------------------------------------------------------

export interface ImessageData {
    message : string,
    id : mongoose.Types.ObjectId
}

export interface Imessage {
    _id : mongoose.Types.ObjectId,
    message : string,
    sender : string,
    thread : mongoose.Types.ObjectId,
    to? : string,
    createdAt? : Date,
    updatedAt? : Date,
    sent? : boolean
}

export interface ImessageSending extends Imessage {
    to : string
}

export interface IuserCredentials {
    _id : string,
    email : string,
    username : string,
    name : {
        first : string,
        last : string
    }
}

export interface IpushMessage {
    message : string,
    sender : string
}

export interface IbubbleProps {
    id : mongoose.Types.ObjectId,
    sending : boolean,
    you : boolean,
    data : Imessage,
    refreshCallback : Function,
    to : string | null
}

// Typer ----------------------------------------------------------------

export interface ItyperProps {
    callback :Function
}

// Response ------------------------------------------------------------

export interface IresponseGeneric {
    err? : {
        message : string,
    },
    message : string
}

// Contacts -------------------------------------------------------------

export interface Icontact {
    email : string,
    _id : string,
    username : string,
    name : IuserCredentials,
    status : string
}

export interface IcontactResultProps {
    data : Icontact
}

export interface IcontactRequestProps {
    data : IuserCredentials
}

export interface IcontactRequest {
    id : string,
    sender : IuserCredentials
}

export interface Icontacts {
    results : [{
            contactId : IuserCredentials,
            thread : string
        }
    ]
}