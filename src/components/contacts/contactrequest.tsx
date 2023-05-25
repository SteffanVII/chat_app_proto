import { acceptRequest } from "@/backend/contacts";
import { useState } from "react";
import styles from "../../styles/RequestsTab.module.scss";
import { IcontactRequestProps } from "@/interfaces";

export default function ContactRequest( props : IcontactRequestProps ) {

    const [ accepted, setAccepted ] = useState(false);

    async function accept() {
        await acceptRequest( props.data._id );
        setAccepted(true);
    }

    return (
        <>
            <div className={styles["contact-request-result"]} >
                <div>
                    <span>{props.data.username}</span>
                    <span>{props.data._id}</span>
                </div>
                {
                    !accepted ?
                    <button
                        onClick={() => accept()}
                    >Accept</button>
                    :
                    ""
                }
            </div>
        </>
    );

}