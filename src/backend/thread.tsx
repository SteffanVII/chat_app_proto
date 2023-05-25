import { IgetThreadMessagesResponse, IresponseGeneric, Ithread, IthreadListComponentProps } from "@/interfaces";
import { _headers } from "./headers"
import mongoose from "mongoose";

export async function threadData( id_ : string, cookies : string | undefined = undefined ) : Promise<Ithread> {

    const request = new Request( `${process.env.NEXT_PUBLIC_API_URL}/threads/data`, {
        headers : _headers(cookies),
        method : "POST",
        credentials : "include",
        body : JSON.stringify({
            id : id_
        })
    } )

    let err : any = false;
    let response : Ithread;

    try {
        let fetched = await fetch( request );
        response = await fetched.json();
    } catch (error) {
        err = error;
    }

    return new Promise( ( resolve, reject ) => {
        if ( !err ) {
            resolve(response);
        } else {
            reject(err);
        }
    } )

}

export async function getThreadList( cookies : string | undefined = undefined ) : Promise<IthreadListComponentProps> {

    const request = new Request( `${process.env.NEXT_PUBLIC_API_URL}/threads/list`, {
        headers : _headers( cookies ),
        method : "GET",
        credentials : "include"
    } )

    let err : any = false;
    let response : IthreadListComponentProps;

    try {
        let fetched = await fetch(request);
        response = await fetched.json();
    } catch (error) {
        err = error;
    }

    return new Promise(( resolve, reject ) => {
        if ( !err ) {
            resolve(response);
        } else {
            reject(err);
        }
    });

}

export async function send( text : string, thread : mongoose.Types.ObjectId, id : mongoose.Types.ObjectId, to : string ) : Promise<IresponseGeneric> {

    const request = new Request( `${process.env.NEXT_PUBLIC_API_URL}/threads/send`, {
        headers : _headers(),
        method : "POST",
        credentials : "include",
        body : JSON.stringify({
            message : text,
            threadId : thread,
            id : id,
            to : to
        })
    } )

    let err : any = false;
    let response : IresponseGeneric;

    try {
        let fetched = await fetch( request );
        response = await fetched.json();
    } catch (error) {
        err = error;
    }

    return new Promise(( resolve, reject ) => {
        if ( !err ) {
            resolve(response);
        } else {
            reject(err);
        }
    });

}

export async function getMessages( id : mongoose.Types.ObjectId | string, cookies : string = "" ) : Promise<IgetThreadMessagesResponse> {

    const request = new Request( `${process.env.NEXT_PUBLIC_API_URL}/threads/contents`, {
        headers : _headers(cookies),
        method : "POST",
        credentials : "include",
        body : JSON.stringify({
            threadId : id
        })
    } );

    let err : any = false;
    let response : IgetThreadMessagesResponse;

    try {
        let fetched = await fetch(request);
        response = await fetched.json();
    } catch (error) {
        err = error
    }

    return new Promise( ( resolve, reject ) => {
        if ( !err ) {
            resolve(response);
        } else {
            reject(err);
        }
    } );
}