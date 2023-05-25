import jwt from "jsonwebtoken";

export function generateToken( payload : any ) : Promise<string> {

    try {
        const token = jwt.sign( payload, process.env.JWT_TOKEN!, {
            expiresIn : "60min"
        } )
        return new Promise(( resolve, reject ) => {
            resolve( token );
        });
    } catch ( err ) {
        return new Promise(( resolve, reject ) => {
            reject( err );
        });
    }
    
}