import { useEffect, useState } from "react";

export default function useUpdateEffect( callback : Function, dependencies : any[] ) {

    const [init, setInit] = useState(true);

    useEffect( () => {
        if ( init ) {
            setInit(true)
        } else {
            callback();
        }
    }, dependencies )

}