import { Request, Response } from "express";
import { mc } from "..";
import { log } from "console";

interface IContactsRequest extends Request {
    body : {
        _id : string
    }
}

export async function findContact( request : IContactsRequest, response : Response ) {

    let id_ = request.body._id;
    let user = request.cookies["user"];
    
    let ret = {
        email : "",
        _id : "",
        username : "",
        name : {
            first : "",
            last : ""
        },
        status : "none"
    }

    try {

        let contact = await mc.users.findOne({
            _id : id_
        })
        .select([
            "_id", "email", "username", "name"
        ]);

        if ( contact ) {
            ret.email = contact.email;
            ret._id = contact._id as string;
            ret.username = contact.username;
            ret.name = contact.name;

            if ( id_ !== user ) {
                let isFriend = await mc.contacts.findOne({
                    userId : user,
                    contactId : contact._id
                });
                if ( isFriend ) {
                    ret.status = "friend";
                }
                let isRequesting = await mc.request.findOne({
                    id : contact._id,
                    sender : user
                });
                if ( isRequesting ) {
                    ret.status = "requesting";
                }
            } else {
                ret.status = "you";
            }
            response.status(200).json(ret);
        } else {
            response.status(404).send();
        }

    } catch (error) {
        console.log(error);
        response.status(500).send();
    }

}

export async function sendRequest( request : IContactsRequest, response : Response ) {

    let id_ = request.body._id;
    let senderId = request.cookies["user"];

    try {
        await mc.request.create({
            id : id_,
            sender : senderId
        });
        response.status(200).send({
            message : "Ok"
        });
    } catch (error) {
        console.log(error);
        response.status(400).send();
    }
}

export async function cancelRequest( request : IContactsRequest, response : Response ) {

    let userId = request.cookies["user"];
    let id_ = request.body._id;

    try {
        await mc.request.findOneAndDelete({
            _id : id_,
            sender : userId
        });
        response.status(200).send({
            message : "Ok"
        });

    } catch (error) {
        console.log(error);
        response.status(500).send();
    }

}

export async function acceptRequest( request : IContactsRequest, response : Response ) {

    let user = request.cookies["user"];
    let senderUserId = request.body._id;

    try {
        
        let isRequestExist = await mc.request.findOne({
            id : user,
            sender : senderUserId
        });
        
        if ( isRequestExist ) {
            
            await mc.request.findOneAndDelete({
                id : user,
                sender : senderUserId
            });

            // Create thread
            let thread = await mc.threads.create({
                initiated : false,
                recipients : [
                    user,
                    senderUserId
                ]
            });

            // Update contacts
            let usercontacts = await mc.contacts.findByIdAndUpdate( user, {
                $push : {
                    contactIds : {
                        contactId : senderUserId,
                        thread : thread._id
                    }
                }
            } );

            let sendercontacts = await mc.contacts.findByIdAndUpdate( senderUserId, {
                $push : {
                    contactIds : {
                        contactId : user,
                        thread : thread._id
                    }
                }
            } );

            response.status(200).json({
                message : "Ok"
            });

        }

    } catch (error) {
        console.log(error);
        response.status(500).send();
    }

}

export async function getRequests( request : Request, response : Response ) {

    let user = request.cookies["user"];

    try {
        
        let requests = await mc.request.find({
            id : user
        })
        .populate('sender', '-password -createdAt -updatedAt');

        response.status(200).json({
            results : requests
        });

    } catch (error) {
        console.log(error);
        response.status(500).send();
    }

}

export async function getContacts( request : Request, response : Response ) {

    let user = request.cookies["user"];

    try {
        let contacts = await mc.contacts.findById({
            _id : user
        }).populate( {
            path : "contactIds.contactId",
            model : "users",
            select : "-password -createdAt -updatedAt"
        } );
        
        if ( contacts ) {
            response.status(200).json({
                results : contacts.contactIds
            });
        }

    } catch (error) {
        console.log(error);
        response.status(500).send();
    }

}