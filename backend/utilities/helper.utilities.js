import jwt from "jsonwebtoken"


export const jsonRes = (success, message, data) => {
    return {
        success,
        message,
        data
    };
};


export const genJwtToken = (payload, secret, duration) => {
    return jwt.sign(payload, secret, {
        expiresIn: duration
    })
};

export const verifyToken = (token, secret) => {
    return jwt.verify(token, secret);
}
 
