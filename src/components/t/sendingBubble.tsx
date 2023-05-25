import { send } from "@/backend/thread";
import { IbubbleProps } from "@/interfaces";
import { useContext, useEffect } from "react";
import styles from "../../styles/Bubble.module.scss";
import { appContext } from "@/pages/_app";
import { EwsMessageType } from "@/types";

export default function Bubble( { id, sending, you, data, refreshCallback, to } : IbubbleProps ) {

    const ac = useContext(appContext);

    async function sendMessage() {
        // let response = await send( data.message, data.thread, id, to as string );

        // Send message through websocket
        ac?.state.current?.websocket?.send( JSON.stringify({
            type : EwsMessageType.MESSAGE_SEND,
            payload : {
                id : id,
                message : data.message,
                threadId : data.thread,
                to : to
            }
        }));

        // refreshCallback(data._id);
    }

    useEffect( () => {
        // if ( to ) {
        //     console.log(to);
        // }
        // if ( sending ) {
        //     sendMessage();
        // };
    }, []);

    return (
        <>
            <div className={`${styles["message-bubble"]} ${ you ? styles["you"] : ""} ${ sending ? styles["sending"] : "" }`} >
                <span>{data.message}</span>
            </div>
        </>
    );

}