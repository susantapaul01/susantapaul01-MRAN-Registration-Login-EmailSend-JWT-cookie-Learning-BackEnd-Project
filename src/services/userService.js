import userModel from "../models/userModel.js";

export const RegistrationService = async (req, res) => {
    try {
        let data = req.body;
        let email = data.email;
            data.password = md5(req.body['password']);
        let user = await userModel.find({ 'email': email });
        if(user.length> 0) {
            return res.status(409).json({ status: "error", messege: "already Registered"})
        }
        else {
            let result = await userModel.create(data)
            return res.status(200).json({ status: "success", messege: "Registration Successful", data: result });
        }
    }
    catch(e) {
        return res.json({ status: "success", messege: e.toString() })
    }
}