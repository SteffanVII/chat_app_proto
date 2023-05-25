import { findContact } from "@/backend/contacts";
import Head from "next/head";
import { useRef, useState } from "react";
import styles from "../../styles/Contacts.module.scss";
import RequestsTab from "@/components/contacts/requestcontactstab";
import ContactResult from "@/components/contacts/contactresult";
import AllContactsTab from "@/components/contacts/allcontactstab";
import { Icontact } from "@/interfaces";

export default function ContactsSide() {

    const [ showFinder, setShowFinder ] = useState(false);
    const [ loading, setLoading ] = useState(false);
    const [ contactResult, setContactResult ] = useState<Icontact | null>(null);

    const [ tab, setTab ] = useState<string>("all");

    const findContactTimer = useRef<number>();

    function classNameBool( cname : string, value : boolean ) {
        if ( value ) return styles[cname];
        return "";
    };

    function createFindContactTimer( value : string ) {
        if ( value.length !== 5 ) {
            clearTimeout(findContactTimer.current);
        } else {
            clearTimeout(findContactTimer.current);
            findContactTimer.current = window.setTimeout(() => {
                setLoading(true);
                findContact( value )
                    .then( res => {
                        setContactResult(res);
                    } )
                    .catch( err => {
                        console.log(err);
                    } );
            }, 500);
        }
    }

    function toAllTab() {
        setTab("all");
    }

    function toRequestsTab() {
        setTab("requests");
    }

    return (
        <>
            <div id="main" >
                <aside id="container" >
                    <div id={styles["container-head"]}>
                        <h2>Contacts</h2>
                        <button
                            onClick={() => setShowFinder(true)}
                        >Add Contact</button>
                    </div>

                    <div id={styles["contacts-tab-buttons"]} >
                        <button className={ tab === "all" ? styles["active-tab"] : "" } onClick={() => toAllTab()} >All</button>
                        <button className={ tab === "requests" ? styles["active-tab"] : "" } onClick={() => toRequestsTab()}>Requests</button>
                    </div>

                    <div id={styles["contacts-tab-container"]} >
                        {
                            tab === "all" ?
                            <AllContactsTab/>
                            :
                            <RequestsTab/>
                        }
                    </div>
                    
                    <div id={styles["contact-finder"]} className={classNameBool("show", showFinder)}>
                        <div id={styles["contact-finder-controls"]}>
                            <input type="text" id={styles["contact-id-input"]} placeholder="Contact ID" maxLength={5}
                                onChange={( event ) => {
                                    createFindContactTimer(event.target.value);
                                }}
                            />
                            <button
                                onClick={() => setShowFinder(false)}
                            >Close</button>
                        </div>
                        <div id={styles["contact-found-container"]}>
                            { contactResult !== null ?
                                <ContactResult data={contactResult}/>
                                :
                                <span>No Result</span>
                            }
                        </div>
                    </div>
                </aside>
            </div>
        </>
    );

}