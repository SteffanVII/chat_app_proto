import Head from "next/head";
import styles from "@/styles/Login.module.scss";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef } from "react";
import { auth, loginUser, TuserResponse } from "@/backend/user";
import { GetServerSidePropsContext } from "next";
import { IpageProps } from "@/interfaces";

export async function getServerSideProps( context : GetServerSidePropsContext ) {
    const isAuth = await auth(context.req.headers.cookie);

    if ( !isAuth.err ) {
        return {
            redirect : {
                permanent : false,
                destination : "/t"
            },
            props : {
                isAuth : true
            }
        }
    }

    return {
        props : {
            isAuth : false
        }
    }
}

export default function Login( props : IpageProps ) {

    const email = useRef<HTMLInputElement>(null);
    const password = useRef<HTMLInputElement>(null);

    const router = useRouter();

    async function sendCredentials() {
        if ( email.current?.value == undefined && password.current?.value == undefined ) return;

        const response : TuserResponse = await loginUser( { 
            email : email.current?.value!,
            password : password.current?.value!
         } );

         if ( !response.err ) {
             router.push("/t");
        } else {
             console.log(response.err);
             alert(response.err!.message);
         }
    }

    return (
        <>
            <Head>
                <title>{`${process.env.NEXT_PUBLIC_APP_NAME} | Login`}</title>
                <meta name="description" content="Chatting web application" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <main id={styles["main"]}>
                <form id={styles["login-form"]}>
                    <h1>Login</h1>
                    <input ref={email} type="email" id={styles["login-email-input"]} placeholder="Email" />
                    <input ref={password} type="password" id={styles["login-password-input"]} placeholder="Password" />
                    <button type='button'
                            onClick={() => sendCredentials()}
                    >Login</button>
                    <Link href={"/signup"}>Signup</Link>
                </form>
            </main>
        </>
    )
}