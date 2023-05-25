import { threadData } from "@/backend/thread";
import { auth } from "@/backend/user";
import {  Ithread, IthreadPageProps } from "@/interfaces";
import { appContext } from "@/pages/_app";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useContext, useEffect } from "react";

export async function getServerSideProps( context : GetServerSidePropsContext ) {
    const isAuth = await auth(context.req.headers.cookie);
    
    if ( isAuth.err ) {
        return {
            redirect : {
                permanent : false,
                destination : "/login"
            },
            props : {
                isAuth : false
            }
        }
    }

    let _props : {
        isAuth : boolean,
        key : string,
        data : Ithread | null
    } = {
        isAuth : true,
        key : context.query.id as string,
        data : null
    }

    if ( context.query.id ) {
        
        let thread = await threadData( context.query.id as string, context.req.headers.cookie );
        _props.data = thread;
    }

    return {
        props : {..._props}
    };
} 


export default function Id( { data, isAuth } : IthreadPageProps ) {

    const ac = useContext(appContext);

    useEffect(() => {
        // Create websocket connection if is authenticated
        ac?.ws.set(isAuth);
        // Set thread data state
        ac?.thread.set(data);
    }, [data]);

    return (
        <>
            <Head>
                <title>{`${process.env.NEXT_PUBLIC_APP_NAME}`}</title>
            </Head>
        </>
    );

}