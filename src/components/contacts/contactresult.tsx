import { cancelRequest, sendRequest } from "@/backend/contacts";
import { useEffect, useState } from "react";
import styles from "../../styles/Contacts.module.scss";
import { IcontactResultProps } from "@/interfaces";

export default function ContactResult( props : IcontactResultProps ) {

    const [status ,setStatus] = useState(props.data.status);

    async function send() {
        try {
            await sendRequest( props.data._id );
            setStatus("requesting");
        } catch (error) {
            alert("Something Went Wrong");
            console.log(error);
        }
    }

    async function unsend() {
        try {
            await cancelRequest( props.data._id );
            setStatus("none");
        } catch (error) {
            alert("Something went wrong");
            console.log(error);
        }
    }

    useEffect(() => {
        setStatus(props.data.status);
    }, [props.data]);

    return (
        <>
            <div id={styles["find-contact-result"]} >
                <div id={styles["find-contact-result-texts"]} >
                    <span id={styles["find-contact-result-id"]} >{props.data._id}</span>
                    <span>{props.data.username}</span>
                </div>
                {
                    status === "you" ?
                    <span>YOU</span>
                    :
                    status === "friend" ?
                    ""
                    :
                    <button
                        onClick={() => {
                            if ( status === "requesting" ) {
                                unsend();
                            } else {
                                send();
                            }
                        }}
                    >{ status === "requesting" ? "Cancel" : "Add" }</button>
                }
            </div>
        </>
    );

}