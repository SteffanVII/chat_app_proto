export default function parseCookie () {

    let cookies : { [key : string] : string } = {};

    document.cookie.split("; ").forEach( c => {
        cookies[c.split("=")[0]] = c.split("=")[1];
    } );

    return cookies;

}