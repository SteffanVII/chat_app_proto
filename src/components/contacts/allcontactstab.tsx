import { useContext, useEffect, useState } from "react";
import styles from "../../styles/AllContactsTab.module.scss";
import { getMyContacts } from "@/backend/contacts";
import Link from "next/link";
import { appContext } from "@/pages/_app";
import { useRouter } from "next/router";
import { IuserCredentials } from "@/interfaces";

export default function AllContactsTab() {

    const [ contacts, setContacts ] = useState<{ contactId : IuserCredentials, thread : string }[]>([]);
    const [ loading, setLoading ] = useState(true);
    const ac = useContext(appContext);
    const router = useRouter();

    async function getContacts() {
        let response = await getMyContacts();
        // console.log(response);
        setLoading(false);
        setContacts(response.results);
    }

    useEffect(() => {
        getContacts();
    }, []);

    return (
        <>
            <div id={styles["all-contacts-tab"]} >
                {
                    loading ?
                    <span>Loading</span>
                    :
                    contacts.length > 0 ?
                    contacts.map( r => 
                    <div className={styles["contact-row"]} key={`contact-${r.contactId._id}`} >
                        <div>
                            <span>{r.contactId.username}</span>
                            <span>{r.contactId._id}</span>
                        </div>
                        <button onClick={() => {
                            router.push( "/contacts/t/[id]", `/contacts/t/${r.thread}`);
                        }} >Message</button>
                    </div>
                    )
                    :
                    <span>No contacts</span>
                }
            </div>
        </>
    );

}