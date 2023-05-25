import Head from "next/head";
import styles from "../../styles/User.module.scss";

export default function User() {

    return (
        <>
            <Head>
                <title>{`${process.env.NEXT_PUBLIC_APP_NAME}`}</title>
            </Head>
            <div id="main" >
                <aside id="container" >
                    <h2>User Settings</h2>
                </aside>
            </div>
        </>
    );

}