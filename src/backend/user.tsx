import { IuserCredentials, IuserData } from "@/interfaces";
import { _headers } from "./headers";

export type TuserResponse = {
    err? : {
        message : string
    },
    message? : string
}

export async function auth( cookies : string | undefined ) : Promise<TuserResponse> {
    const request = new Request( `${process.env.NEXT_PUBLIC_API_URL}/user/auth`, {
        method : "GET",
        credentials : "include",
        headers : _headers(cookies)
    } );

    let err = false;
    let body : TuserResponse;

    try {
        let response = await fetch(request);
        body = await response.json();
    } catch (err) {
        console.log(err);
        err = true
    }

    return new Promise((resolve, reject) => {
        if ( !err ) {
            resolve(body);
        } else {
            reject(body);
        }
    });
}

export async function signupUser( credentials : { email : string, password : string, username : string, first : string, last : string } ) : Promise<TuserResponse> {

    const request = new Request( `${process.env.NEXT_PUBLIC_API_URL}/user/signuser`, {
        headers : _headers(),
        method : "POST",
        credentials : "include",
        body : JSON.stringify(credentials)
    } )

    let err : any = false;
    let body : TuserResponse;

    try {
        const response = await fetch(request);
        body = await response.json();
    } catch ( error ) {
        console.log(error);
        err = error;
    }

    return new Promise((resolve, reject) => {
        if ( !err ) {
            resolve(body);
        } else {
            reject(body);
        }
    });
}

export async function loginUser( credentials : { email : string, password : string } ) : Promise<TuserResponse> {

    const request = new Request( `${process.env.NEXT_PUBLIC_API_URL}/user/loginuser`, {
        headers : _headers(),
        method : "POST",
        credentials : "include",
        body : JSON.stringify(credentials)
    } )

    let err : any = false;
    let body : TuserResponse;

    try {
        const response = await fetch(request);
        body = await response.json();

    } catch ( error ) {
        console.log(err);
        err = error;
    }

    return new Promise((resolve, reject) => {
        if ( !err ) {
            resolve(body);
        } else {
            reject(err);
        }
    });

}

export async function logoutUser() : Promise<TuserResponse> {

    const request = new Request( `${process.env.NEXT_PUBLIC_API_URL}/user/logoutuser`, {
        headers : _headers(),
        method : "GET",
        credentials : "include"
    } )

    let err : any = false;
    let body : TuserResponse;

    try {
        const response = await fetch(request);
        body = await response.json();
    } catch (error) {
        err = error;
    }

    return new Promise((resolve, reject) => {
        if ( !err ) {
            resolve(body);
        } else {
            reject(err);
        }
    })

}

export async function getUserCredentials( recipientId : string ) : Promise<IuserCredentials> {

    const request = new Request( `${process.env.NEXT_PUBLIC_API_URL}/user/getusercredentials`, {
        headers : _headers(),
        method : "POST",
        credentials : "include",
        body : JSON.stringify({
            id : recipientId
        })
    } )

    let err : any = false;
    let body : IuserCredentials;

    try {
        let fetched = await fetch( request );
        body = await fetched.json();
    } catch (error) {
        console.log(error);
        err = error;
    }

    return new Promise( (resolve, reject ) => {
        if ( !err ) {
            resolve(body);
        } else {
            reject(err);
        }
    } )
}

export async function getUserData( cookies : string | undefined ) : Promise<IuserData> {

    const request = new Request( `${process.env.NEXT_PUBLIC_API_URL}/user/getuserdata`, {
        headers : _headers(cookies),
        method : "POST",
        credentials : "include"
    } )

    let err : any = false;
    let body : IuserData;

    try {
        let fetched = await fetch( request );
        body = await fetched.json();
    } catch (error) {
        console.log(error);
        err = error;
    }

    return new Promise(( resolve, reject ) => {
        if ( !err ) {
            resolve(body);
        } else {
            reject(err);
        }
    })

}