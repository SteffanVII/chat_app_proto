import { auth, getUserData } from "@/backend/user";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useContext, useEffect } from "react";
import { appContext } from "../_app";
import { IpageProps } from "@/interfaces";

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
    
    const userdata = await getUserData( context.req.headers.cookie );

    if ( userdata.lastViewedThread ) {
      return {
        redirect : {
          permanent : false,
          destination : `/t/${userdata.lastViewedThread.toString()}`
        },
        props : {
          isAuth : true
        }
      }
    }

    return {
        props : {
            isAuth : true
        }
    }

}

export default function t( props : IpageProps ) {

    const ac = useContext(appContext);

    useEffect(() => {
        if ( props.isAuth ) {
            ac?.ws.set();
        }
    }, []);

    return (
        <>
        </>
    );

}