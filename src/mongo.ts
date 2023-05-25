import mongoose, { Mongoose, Schema } from "mongoose";

interface IContactsSchema {
    _id : String,
    contactIds : String[]
}

export default class MongooseConnection {

    constructor( _uri : string ) {
        mongoose.connect( _uri, {
            dbName : "ChatApp"
        } )
            .then( ( res ) => {
                console.log("MongoDb Connected");
            } )
            .catch( err => {
                console.log(err);
            } );
    }

    #userCredentialsSchema : mongoose.Schema = new mongoose.Schema({
        _id : String,
        username : String,
        name : {
            first : String,
            last : String
        },
        email : String,
        password : String
    }, {
        timestamps : true
    });

    #userDataSchema : mongoose.Schema = new mongoose.Schema({
        owner : { type : String , ref : "users" },
        lastViewedThread : { type : mongoose.Types.ObjectId, ref : "threads" },
    });

    #threadSchema : mongoose.Schema = new mongoose.Schema({
        recipients : Array<{
            id : { type : string, ref : "users" }
        }>,
        latest : { type : mongoose.Types.ObjectId, ref : "messages" }
    }, {
        timestamps : true
    });

    #messageSchema : mongoose.Schema = new mongoose.Schema({
        _id : mongoose.Types.ObjectId,
        message : String,
        sender : { type : String, ref : "users" },
        thread : { type : mongoose.Types.ObjectId, ref : "threads" }
    }, {
        timestamps : true
    });

    #contactsSchema : mongoose.Schema = new mongoose.Schema({
        _id : String,
        contactIds : Array<{
            contactId : { type : String, ref : "users" },
            thread : { type : mongoose.Types.ObjectId, ref : "threads" }
        }>
    });

    #requestSchema : mongoose.Schema = new mongoose.Schema({
        id : String,
        sender : { type : String, ref : "users" }
    }, {
        timestamps : true
    });

    users = mongoose.model("users", this.#userCredentialsSchema);
    userdatas = mongoose.model("userdatas", this.#userDataSchema);
    threads = mongoose.model("threads", this.#threadSchema);
    messages = mongoose.model("messages", this.#messageSchema);
    request = mongoose.model("requests", this.#requestSchema);
    contacts = mongoose.model("contacts", this.#contactsSchema);

}

export interface Iuser {
    _id : String,
    email : String,
    password : String,
    createdAt : Date,
    updatedAt : Date,
    __v : Number
} 