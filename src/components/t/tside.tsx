import { useRouter } from "next/router";
import styles from "../../styles/T.module.scss";
import { useEffect } from "react";
import { IthreadListComponentProps } from "@/interfaces";
import ThreadRow from "./threadrow";

export default function TSide( props : IthreadListComponentProps | null ) {

    const router = useRouter();

    useEffect(() => {
        
    }, []);

    return (
        <>
            <aside id="main">
                <div id="container" >
                    <div id={styles["container-head"]}>
                        <h2>Chat</h2>
                    </div>
                    <div id={styles["threads-container"]} >
                        { props?.list && props.list.map( d => <ThreadRow key={`trow-${d.threadData._id}`} data={d}/> ) }
                    </div>
                </div>
            </aside>
        </>
    );

}