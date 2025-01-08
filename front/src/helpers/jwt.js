import { jwtDecode } from "jwt-decode";

export const decodeJWT = (jwtToken, defaultValue=null) => {
    try {
        return jwtDecode(jwtToken);
    } catch (ex) {
        console.error('error decoding jwt', ex);
        return defaultValue;
    }
}

export const getUserPayloadFromJwt = (jwt) => {
    const jwtPayload = decodeJWT(jwt);
    if (!jwtPayload) {
        throw Error('Invalid jwt');
    }
    return {
        id: jwtPayload.user_id,
        email: jwtPayload.user_email,
        name: jwtPayload.user_name,
        token: jwt,
    };
};