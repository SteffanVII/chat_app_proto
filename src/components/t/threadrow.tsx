import { IthreadRowProps } from "@/interfaces";
import Link from "next/link";
import styles from "../../styles/ThreadRow.module.scss";
import { useContext, useEffect } from "react";
import { appContext } from "@/pages/_app";


export default function ThreadRow( { data } : IthreadRowProps ) {
    
    const ac = useContext(appContext);

    return (
        <>
            <Link className={`${styles["trow"]} ${ac?.thread.get().threadData._id === data.threadData._id ? styles["active"] : ""}`} href={`/t/${data.threadData._id}`}>
                <span className={styles["trow-tname"]}>{data.threadName}</span>
                <span className={styles["trow-tmessage"]} >{ data.threadData.latest && data.threadData.latest.message }</span>
            </Link>
        </>
    );
}