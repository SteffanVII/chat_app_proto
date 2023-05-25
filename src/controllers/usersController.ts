import express, { Response, Request } from "express";
import { mc } from "..";
import { Iuser } from "../mongo";
import jwt from "jsonwebtoken";
import GenerateId from "../utilities/userIdGenerator";

interface IusersRequest extends Request {
    body : {
        email : string,
        password : string,
        first : string,
        last : string,
        username : string
    }
}

interface IgetUserDataBody extends Request {
    body : {
        id : string
    }
}

export async function authToken( requests : Request, response : Response ) {
    response.status(200).json({
        message : "Ok"
    });
}

export async function signNewUser( request : IusersRequest, response : Response ) {

    let body = request.body;
    let _email : string = body.email;
    let _password : string = body.password;
    let _first : string = body.first;
    let _last : string = body.last;
    let _username : string = body.username;

    try {
        const checkEmailExist = await mc.users.findOne({
            email : _email
        })
        const checkUsernameExist = await mc.users.findOne({
            username : _username
        });

        if ( checkEmailExist ) {
            response.status(200).json({
                err : {
                    message : "Email already existed, try loggin in instead."
                }
            });
            return;
        }
        if ( checkUsernameExist ) {
            response.status(200).json({
                err : {
                    message : "Username already existed, try using other username instead."
                }
            }); 
            return;
        }

        let id_ = "";
        let hasId = true;
        
        while( hasId ) {
            id_ = await GenerateId();
            let idResult = await mc.users.findOne({
                _id : id_
            });
            if ( !idResult ) {
                hasId = false;
            }
        }

        await mc.users.create({
            email : _email,
            password : _password,
            username : _username,
            name : {
                first : _first,
                last : _last
            },
            _id : id_
        })

        await mc.contacts.create({
            _id : id_,
            contactsIds : []
        });

        await mc.userdatas.create({
            owner : id_
        });

        response.cookie( "user", id_, {
            sameSite : "none",
            secure : true
        } );
        response.status(200).json({
            message : "Ok"
        });
        
    } catch ( err ) {
        response.status(400).send();
        throw new Error(err as string);
    }

}

export async function loginUser( request : IusersRequest, response : Response ) {

    let body = request.body;
    let _email : string = body.email;
    let _password : string = body.password;

    try {
        const checkEmailExist : Iuser | null = await mc.users.findOne({
            email : _email
        });

        if ( !checkEmailExist ) {
            response.status(200).json({
                err : {
                    message : "Email is not registered"
                }
            });
            return;
        }

        if ( checkEmailExist.password === _password ) {

            jwt.sign( {
                email : _email,
                password : _password 
            }, process.env.JWT_SECRET!, {
                expiresIn : "60min"
            }, ( err, token ) => {
                if ( !err ) {
                    response.cookie( "user", checkEmailExist._id, {
                        sameSite : "none",
                        secure : true
                    } );
                    response.cookie( "token", token, {
                        sameSite : "none",
                        httpOnly : true,
                        secure : true
                    } )
                    response.status(200).json({
                        message : "Ok"
                    });
                }
            } )

        } else {
            response.status(200).json({
                err : {
                    message : "Incorrect password"
                }
            })
        }

    } catch ( err ) {
        response.status(400).send();
        throw new Error(err as string);
    }

}

export function logoutUser( request : Request, response : Response ) {

    // response.cookie( "user", "" );
    response.cookie( "token", "" );
    response.status(200).json( {
        message : "OK"
    } );

}

export async function getUserCredentials( request : IgetUserDataBody, response : Response ) {

    let id = request.body.id;

    try {
        let data = await mc.users.findById(id, "id email username name -password");
        response.status(200).json(data);

    } catch (error) {
        response.status(500).send();
        throw new Error( error as string );
    }

}

export async function getUserData( request : Request, response : Response ) {

    let user = request.cookies["user"];
    try {
        let userdata =  await mc.userdatas.findOne({
            owner : user
        });
        response.status(200).json(userdata);
    } catch (error) {
        response.status(500).send();
        throw new Error( error as string );
    }

}