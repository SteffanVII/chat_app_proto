import { ItyperProps } from "@/interfaces";
import styles from "../styles/Typer.module.scss";

export default function Typer( { callback } : ItyperProps ) {

    return (
        <>
            <div id={styles["typer"]}>
                <textarea rows={1} id={styles["message-textbox"]} placeholder="Aa"
                    onKeyDown={ ( e ) => {
                        if ( e.key === "Enter" && e.currentTarget.value !== "" ) {
                            e.preventDefault();
                            let value = e.currentTarget.value;
                            e.currentTarget.value = "";
                            callback( value );
                        }
                    } }
                ></textarea>
            </div>
        </>
    );

}