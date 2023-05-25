import { logoutUser } from "@/backend/user";
import TSide from "@/components/t/tside";
import { appContext } from "@/pages/_app";
import { useRouter } from "next/router";
import { ReactNode, useContext, useEffect, useState } from "react";
import styles from "../styles/Layout.module.scss";
import ContactsSide from "@/components/contacts/contactsside";
import Thread from "@/components/t/thread";
import { Imessage } from "@/interfaces";

interface IlayoutProps {
    children? : ReactNode
}

export default function Layout( props : IlayoutProps ) {

    const ac = useContext(appContext);
    const router = useRouter();

    async function logout() {
        const response = await logoutUser();
        if ( !response.err ) {
            ac?.ws.close();
            router.push("/login");
        }
    }

    return ( 
        <>
            <main id={styles["main"]}>
                <aside id={styles["left-panel"]} >
                    <button
                        onClick={() => {
                            router.push( "/t" + ( router.pathname.split("/t")[1] ? "/[id]" : "" ), "/t" + ( router.pathname.split("/t")[1] ? `/${router.query.id}` : "" ) )
                        }}
                    >Chats</button>
                    <button
                        onClick={() => {
                            router.push( "/user" );
                        }}
                    >User</button>
                    <button
                        onClick={() => {
                            router.push( "/contacts/t" + ( router.pathname.split("/t")[1] ? "/[id]" : "" ), "/contacts/t" + ( router.pathname.split("/t")[1] ? `/${router.query.id}` : "" ) );
                        }}
                    >Contacts</button>
                    <button
                        onClick={() => logout()}
                    >Logout</button>
                </aside>
                { (router.pathname.match( /^\/t\/\w+/ ) || router.pathname.match( /^\/t/ ) ) && <TSide list={ac?.threadlist.get().list}/> }
                { router.pathname.match( /^\/contacts\/t\/\w+/ ) || router.pathname.match( /^\/contacts\/t/ ) && <ContactsSide/> }
                { (ac?.thread.get() !== null && !router.pathname.includes("/user")) && <Thread data={ac?.thread.get()} messages={ac?.messages.get() as Imessage[]} /> }
                {props.children}
            </main>
        </>
     );

}