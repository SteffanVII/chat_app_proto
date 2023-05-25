import { _headers } from "./headers";
import { Icontacts, Icontact, IcontactRequest } from "@/interfaces";

export interface IContactResponse {
    err? : {
        message : string
    },
    message? : string
}

export async function findContact( id_ : string ) : Promise<Icontact> {

    let request = new Request( `${process.env.NEXT_PUBLIC_API_URL}/contacts/find`, {
        method : "POST",
        headers : _headers(),
        credentials : "include",
        body : JSON.stringify({_id : id_})
    } );

    let err : any = null;
    let contact : Icontact;

    try {
        let response = await fetch(request);
        contact = await response.json();
    } catch (error) {
        console.log(error);
        err = error;
    }

    return new Promise(( resolve, reject ) => {
        if ( !err ) {
            resolve(contact);
        } else {
            reject(err);
        }
    })

}

export async function sendRequest( id_ : string ) : Promise<IContactResponse> {

    let request = new Request( `${process.env.NEXT_PUBLIC_API_URL}/contacts/request`, {
        method : "POST",
        headers :_headers(),
        credentials : "include",
        body : JSON.stringify({
            _id : id_
        })
    } );

    let err : any = null;
    let response : IContactResponse;
    
    try {
        let fetched = await fetch(request);
        response = await fetched.json();
    } catch ( error ) {
        console.log(error);
        err = error;
    }

    return new Promise((resolve, reject) => {
        if ( !err ) {
            resolve(response);
        } else {
            reject(err);
        }
    })

}

export async function cancelRequest( id_ : string ) : Promise<IContactResponse> {

    let request = new Request( `${process.env.NEXT_PUBLIC_API_URL}/contacts/requestcancel`, {
        method : "DELETE",
        headers : _headers(),
        credentials : "include",
        body : JSON.stringify({
            _id : id_
        })
    } );

    let err : any = null;
    let response : IContactResponse;

    try {
        let fetched = await fetch(request);
        response = await fetched.json();
    } catch (error) {
        console.log(error);
        err = error;
    }

    return new Promise( ( resolve, reject ) => {
        if ( !err ) {
            resolve(response);
        } else {
            reject(err);
        }
    } );

}

export async function acceptRequest( _senderId : string ) : Promise<null> {

    let request = new Request( `${process.env.NEXT_PUBLIC_API_URL}/contacts/requestaccept`, {
        method : "POST",
        headers : _headers(),
        credentials : "include",
        body : JSON.stringify({
            _id : _senderId
        })
    } );

    let err : any = null;

    try {
        await fetch(request);
    } catch (error) {
        console.log(error);
        err = error;
    }

    return new Promise( ( resolve, reject ) => {
        if ( !err ) {
            resolve(null);
        } else {
            reject(err);
        }
    } );

}

export async function getMyRequests() : Promise<{ results : IcontactRequest[] }> {

    let request = new Request( `${process.env.NEXT_PUBLIC_API_URL}/contacts/getrequests`, {
        method : "GET",
        headers : _headers(),
        credentials : "include"
    } );

    let err : any = null;
    let response : { results : IcontactRequest[] };

    try {
        let fetched = await fetch(request);
        response = await fetched.json();
    } catch (error) {
        console.log(error);
        err = error;
    }

    return new Promise( ( resolve, reject ) => {
        if ( !err ) {
            resolve(response);
        } else {
            reject(err);
        }
    } );

}

export async function getMyContacts() : Promise<Icontacts> {

    let request = new Request( `${process.env.NEXT_PUBLIC_API_URL}/contacts/getcontacts`, {
        method : "GET",
        headers : _headers(),
        credentials : "include"
    } );

    let err : any = null;
    let response : Icontacts;

    try {
        let fetched = await fetch(request);
        response = await fetched.json();
    } catch (error) {
        console.log(error);
        err = error;
    }

    return new Promise( ( resolve, reject ) => {
        if ( !err ) {
            resolve(response);
        } else {
            reject(err);
        }
    } );

}