export const _headers = ( cookie : string | undefined = "" ) => {
    const h = {
        "Content-Type" : "application/json",
    }

    const hc = {
        "Content-Type" : "application/json",
        "Cookie" : cookie
    }
    
    if ( cookie !== null ) {
        return hc
    }

    return h;
}