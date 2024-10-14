import { TokenDecode } from "../utils/tokenUtils.js";

export default (req, res, next) => {
    let token = req.cookies["Token"];
    let decodedToken = TokenDecode(token);
    // console.log(decodedToken)

    if(decodedToken === null) {
        return res.status(401).json({ status: 401, message: "Invalid Token",})
    }
    else {
        let email = decodedToken['email'];
        req.headers['email'] = email;
        next();
    }
}