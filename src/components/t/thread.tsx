import { Imessage, IthreadComponentProps, Ithread, ImessageSending } from "@/interfaces";
import styles from "../../styles/Thread.module.scss";
import Typer from "../typer";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import Bubble from "./sendingBubble";
import mongoose from "mongoose";
import { useRouter } from "next/router";
import { getMessages, threadData } from "@/backend/thread";
import parseCookie from "@/utils/parsecookie";
import { appContext } from "@/pages/_app";
import useUpdateEffect from "@/customs/useUpdateEffect";

export const threadContextImport = createContext<{
    data : Ithread | null
}>({
    data : null
});

export default function Thread( { data, messages } : IthreadComponentProps ) {

    const ac = useContext(appContext);

    const router = useRouter();

    function pushSend( message_ : string ) {

        // Create new id
        let new_id = new mongoose.Types.ObjectId();

        ac?.messages.new({
            _id : new_id,
            message : message_,
            sender : parseCookie()["user"],
            thread : data.threadData._id,
            to : getSendingRecipient()
        });

    }

    // Get new list of messages
    async function refresh( id : mongoose.Types.ObjectId | undefined = undefined ) {
        let messages_ = await getMessages( data.threadData._id );
        ac?.messages.set(messages_.results);
    }

    function getSendingRecipient() : string {
        let ret = "";
        data.threadData.recipients.forEach( d => {
            if ( d._id !== parseCookie()["user"] ) {
                ret = d._id;
            }
        } );
        return ret;
    }

    // useEffect(() => {
    //     if ( ac?.messages.get().length === 0 ) {
    //         refresh();
    //     }
    // }, [data]);

    useUpdateEffect( () => {
        refresh();
    }, [data] )

    useEffect(() => {
        // release();
    }, [messages]);

    return (
        <>
            <threadContextImport.Provider value={{
                data : data
            }} >
                <section className="center" id={styles["message-thread"]}>
                    <div id={styles["conversation-head"]}>
                        <div id={styles["thread-image"]} >

                        </div>
                        <span>{data.threadName}</span>
                    </div>
                    <div id={styles["message-floats-container"]}>
                        {/* {
                            // Render sending bubbles and skip when id is included in the releasing id array
                            sending.map( (e) => releasing.current.includes(e._id) ? "" : <Bubble key={`${e._id}-message`} id={e._id} sending={true} you={true} data={e} refreshCallback={refresh} to={e.to} /> )
                        } */}
                        {
                            messages.map( e => <Bubble key={`${e._id}-message`} id={e._id} sending={ ( "to" in e ? true : false ) } you={e.sender === parseCookie()["user"]} data={e} refreshCallback={refresh} to={ "to" in e ? e.to! : null } />  )
                        }
                    </div>
                    <Typer callback={pushSend} />
                </section>
            </threadContextImport.Provider>
        </>
    );

}