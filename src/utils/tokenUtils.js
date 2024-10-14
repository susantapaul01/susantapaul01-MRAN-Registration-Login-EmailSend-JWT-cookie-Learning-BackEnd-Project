import jwt from 'jsonwebtoken';
// import dotenv from 'dotenv';
import { JWT_EXPIRE_TIME, JWT_KEY } from '../config/config.js';
// dotenv.config();

export const TokenEncode = (email, user_id) => {
    let PAYLOAD = { email: email, user_id: user_id};
    let KEY = JWT_KEY
    let EXTIRE_TIME = { expiresIn: JWT_EXPIRE_TIME }
    let token = jwt.sign(PAYLOAD, KEY, EXTIRE_TIME);
    return token;
}


export const TokenDecode = (token) => {
    try {
        let decode = jwt.verify(token, JWT_KEY);
        // console.log(decode);
        return decode;
    }
    catch(error) {
        // console.log("catch decode ");
        return null;
    }
}