import { useEffect, useState } from "react";
import styles from "../../styles/RequestsTab.module.scss";
import ContactRequest from "./contactrequest";
import { getMyRequests } from "@/backend/contacts";
import { IcontactRequest } from "@/interfaces";

export default function RequestsTab() {

    const [ results, setResults ] = useState<{results : IcontactRequest[]}>({results : []});
    const [ loading, setLoading ] = useState(true);

    async function requests() {
        let response = await getMyRequests();
        setLoading(false);
        setResults(response);
    }

    useEffect(() => {
        requests();
    }, []);

    return (
        <>
            <div id={styles["requests-tab"]} >
                {
                    loading ?
                    <span>Loading</span>
                    :
                    results?.results.length ?
                    results.results.map( r => <ContactRequest key={`${r.id}-${r.sender._id}`} data={r.sender} /> )
                    :
                    <span>No request</span>
                }
            </div>
        </>
    );

}