import { getMessages, getThreadList, threadData } from "@/backend/thread";
import { auth } from "@/backend/user";
import { IthreadComponentProps, Ithread, IthreadListComponentProps, IthreadListPageProps, IthreadPageProps, Imessage } from "@/interfaces";
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
        data : Ithread | null,
        threads : IthreadListComponentProps,
        messages : Imessage[]
    } = {
        isAuth : true,
        key : context.query.id as string,
        data : null,
        threads : {
            list : []
        },
        messages : []
    }

    let threads = await getThreadList( context.req.headers.cookie );
    _props.threads = threads;

    let messages = await getMessages( context.query["id"] as string, context.req.headers.cookie );
    _props.messages = messages.results;

    if ( context.query.id ) {
        let thread = await threadData( context.query.id as string, context.req.headers.cookie );
        _props.data = thread;
    }

    return {
        props : _props
    };
} 


export default function Id( { messages, threads, data, isAuth } : IthreadListPageProps ) {

    const ac = useContext(appContext);

    useEffect(() => {
        // Create websocket connection if is authenticated
        ac?.ws.set(isAuth);
        ac?.threadlist.set(threads);
        ac?.thread.set(data);
        ac?.messages.set(messages);
    }, [data, threads]);

    return (
        <>
            <Head>
                <title>{`${process.env.NEXT_PUBLIC_APP_NAME}`}</title>
            </Head>
        </>
    );

}