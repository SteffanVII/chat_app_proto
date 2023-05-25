import mongoose from "mongoose";
import { mc, ws } from "..";
import { Request, Response, response } from "express"; 

interface IextendedRequestBody extends Request {
    body : {
        id : string
    }
}

interface IpushMessageRequestBody extends Request {
    body : {
        message : string,
        threadId : string,
        to : string,
        id : mongoose.Types.ObjectId
    }
}

interface IgetThreadContentsRequestBody extends Request {
    body : {
        threadId : string
    }
}

export async function threadDetails( request : IextendedRequestBody, response : Response ) {

    let user = request.cookies["user"];
    let id = request.body.id;

    try {
        let thread = await mc.threads.findById( id ).populate( {
            path : "recipients",
            model : "users",
            select : "-password -createdAt -updatedAt"
        } );
        let tName = "";

        // Set thread name
        thread?.recipients.forEach( ( data : { _id : string, email : string, username : string } ) => {
            if ( data._id !== user ) {
                tName = data.username
            }
        });
        
        // Update users last viewed thread id
        await mc.userdatas.findOneAndUpdate({ owner : user }, {
            lastViewedThread : thread?._id
        });

        response.status(200).json({
            threadData : thread,
            threadName : tName
        });
    } catch (error) {
        response.status(500).send();
        throw new Error( error as string );
    }


}

export async function pushMessage( request : IpushMessageRequestBody, response : Response ) {

    let user = request.cookies["user"];
    let { message, threadId, to, id } = request.body;

    try {
        let m = await mc.messages.create({
            _id : id,
            message : message,
            sender : user,
            thread : threadId
        });
        await mc.threads.findOneAndUpdate( { _id : threadId }, {
            latest : m._id
        } );

        if ( ws.pool[to] ) {
            ws.pool[to].forEach( connection => {
                connection.send( JSON.stringify({
                    type : "message",
                    id : threadId
                }) );
            })
        }
        response.status(201).json({
            message : "Ok"
        });
    } catch (error) {
        response.status(500).send();
        throw new Error( error as string );
    }
    
}

export async function threadContents( request : IgetThreadContentsRequestBody, response : Response ) {

    // let user = request.cookies["user"];
    let { threadId } = request.body;

    try {
        let contents = await mc.messages.find({
            thread : threadId
        }).sort({
            createdAt : -1
        });
        response.status(200).json({
            results : contents
        });
    } catch (error) {
        response.status(500).send();
        throw new Error( error as string );
    }

}

export async function threadsList( request : Request, response : Response ) {

    let user = request.cookies["user"];

    try {
        let threads = await mc.threads.find({
            recipients : {
                $in : user
            }
        })
        .populate([{
            path : "recipients",
            model : "users",
            select : "-password -createdAt -updatedAt"
        } , {
            path : "latest",
            model : "messages"
        }])
        .sort( {
            updatedAt : 1
        } );

        function threadName( recipients : { _id : string, username : string }[] ) : string {

            let ret = "";

            recipients.forEach((element : { _id : string, username : string } ) => {
                if ( element._id !== user ) {
                    ret = element.username
                };
            });
            return ret;
        }

        let ret = {
            list : threads.map( data => ({
                threadData : data,
                threadName : threadName(data.recipients)
            }) )            
        }

        response.status(200).json(ret);
    } catch (error) {
        response.status(500).send();
        throw new Error( error as string );
    }

}