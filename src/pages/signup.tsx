import { auth, signupUser } from "@/backend/user";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef } from "react";
import styles from "../styles/Signup.module.scss";

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
        isAuth : isAuth.err ? false : true
      }
    }
}

export default function Signup() {

    const firstname = useRef<HTMLInputElement>(null);
    const lastname = useRef<HTMLInputElement>(null);
    const username = useRef<HTMLInputElement>(null);
    const email = useRef<HTMLInputElement>(null);
    const reemail = useRef<HTMLInputElement>(null);
    const password = useRef<HTMLInputElement>(null);
    const repassword = useRef<HTMLInputElement>(null);
    
    const router = useRouter();

    async function sendCredentials() {
        if ( email.current?.value == undefined && password.current?.value == undefined ) return;

        const response = await signupUser( {
            email : email.current?.value!,
            password : password.current?.value!,
            username : username.current?.value!,
            first : firstname.current?.value!,
            last : lastname.current?.value!
        } );

        if ( response.err ) {
            console.log(response.err);
        } else {
            if ( response.message === "Ok" ) {
                router.push("/login");
            } else {
                alert(response.message);
            }
        }
    }

    return (
        <>
            <Head>
                <title>{`${process.env.NEXT_PUBLIC_APP_NAME} | SignUp`}</title>
            </Head>
            <main id={styles["main"]}>
                <form id={styles["signup-form"]}>
                    <h1>Signup</h1>
                    <input ref={firstname} type="text" id={styles["signup-firstname-input"]} placeholder="Firstname" required />
                    <input ref={lastname} type="text" id={styles["signup-lastname-input"]} placeholder="Lastname" required />
                    <input ref={username} type="text" id={styles["signup-username-input"]} placeholder="Username" required />
                    <input ref={email} type="email" id={styles["signup-email-input"]} placeholder="Email" required />
                    <input ref={reemail} type="email" id={styles["signup-reemail-input"]} placeholder="Re-enter Email" required />
                    <input ref={password} type="password" id={styles["signup-password-input"]} placeholder="Password" required />
                    <input ref={repassword} type="password" id={styles["signup-repassword-input"]} placeholder="Password" required />
                    <button type='button'
                            onClick={() => sendCredentials()}
                    >Signup</button>
                    <Link href={"/login"}>Login</Link>
                </form>
            </main>
        </>
    );

}