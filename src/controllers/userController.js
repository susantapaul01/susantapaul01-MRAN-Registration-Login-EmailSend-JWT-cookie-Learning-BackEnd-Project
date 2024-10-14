import mongoose from "mongoose";
import userModel from "../models/userModel.js";
// import md5 from "md5";
import { TokenEncode } from "../utils/tokenUtils.js";
import { EmailSend } from "../utils/emailSend.js";
import OTPModel from "../models/otpModel.js";
import bcrypt from "bcrypt";
import { PASS_KEY } from "../config/config.js";
let ObjectID = mongoose.Types.ObjectId;
//=== Create User
export const Registration = async (req, res) => {
    try {
        let salt = 10
        let data = req.body;
        let email = data.email;
            // data.password = md5(req.body['password']);

        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        data.password = hashedPassword;
        let user = await userModel.find({ 'email': email });
        if(user.length> 0) {
            return res.status(400).json({ status: "error", messege: "already Registered"})
        }
        else {
            let result = await userModel.create(data)
            return res.status(201).json({ status: "success", messege: "Registration Successful", data: result });
        }
    }
    catch(e) {
        return res.json({ status: "success", messege: e.toString() })
    }
}


//=== User Login
export const Login = async (req, res) => {
    const { email, password } = req.body;
    try {
        let salt = 10
        // Find the user by email
        const user = await userModel.findOne({ "email": email });
        // console.log(user);
        if (!user) {
            return res.status(400).json({ status: "success", message: 'Invalid email or password' });
          }
        // data.password = md5(req.body.password);
        // === Compare the plain-text password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        let token = TokenEncode(user['email'], user['_id']);
            // cookie Setting
            let options = {
                maxAge: 5*24*60*60*1000,
                httpOnly: true,
                sameSite: "None",
                secure: true
            }
            res.cookie("Token", token, options);
            return res.status(200).json({ status: "success", messege: "Login Successful", data: user.email})
    }
    catch(e) {
        return res.status(404).json({ status: "success", messege: e.toString() })
    }
}


//=== Get User Profile
export const ProfileRead = async (req, res) => {
    try {
        let email = req.headers.email;
        let matchStage = { $match: { email } };
        let projection = { $project: {  "_id": 0, "password": 0, "createdAt": 0, "updatedAt": 0 }}
        let data = await userModel.aggregate([ matchStage, projection ]);
        return res.status(201).json({ status: "success", messege: "Profile Read Successful", data: data})
    }
    catch(e) {
        return res.status(401).json({ status: "fail", messege: e.toString() });
    }
}


export const ProfileUpdate = async (req, res) => {
    try {
        let reqBody = req.body;
        let email = req.headers.email;
        let matchStage = { "email": email };
        let projection = { $project: {  "_id": 0, "password": 0, "createdAt": 0, "updatedAt": 0 }};
        let profileUpdatedData = await userModel.updateOne(matchStage, reqBody, projection);
        return res.status(201).json({ status: "success", messege: "Profile Update successful", data: profileUpdatedData })
    }
    catch(e) {
        return res.status(401).json({ status: 'fail', messege: e.toString() });
    }
}


//=== User Logout
export const Logout = async (req, res) => {
    try {
        await res.clearCookie('Token');
        return res.status(200).json({ status: "success", messege: "Logout Successful"})
    }
    catch(e) {
        return res.status(404).json({ status: "success", messege: e.toString() })
    }
}


export const SendEmail = async (req, res) => {
    try {
        let reqBody = req.body;
        let emailTo = reqBody.email;
        let emailText = reqBody.emailText;
        let emailSubject = reqBody.emailSubject;

        let data = await EmailSend(emailTo, emailSubject, emailText);
        return res.status(200).json({ status: "success", data: data });
    }
    catch(e) {
        return res.json({ status: "success", messege: e.toString() })
    }
}


//=== Send OTP & VerifyEmail
export const VerifyEmail = async (req, res) => {
    let email = req.params.email;
    let otp =  Math.floor(100000 + Math.random() * 900000);
    try {
        let userCount = await userModel.aggregate([
            { $match: { 'email': email}},
            { $count: "total" }
        ])
        // console.log(userCount[0].total);
        if(userCount[0].total===1) {
            await OTPModel.updateOne(
                { 'email': email },
                { 
                    otp,
                    status: 0
                },
                { upsert: true, new: true}
            )
            let SendEmail = await EmailSend(email, "OTP Verification Code", otp);
            return res.status(200).json({ status: "success", messege: "Verify Email Successful", SendEmail: SendEmail })
        }
        else {
            return res.status(404).json({ status: "fail", messege: "No user found"})
        }
    }
    catch(e) {
        return res.json({ status: "fail", messege: e.toString() });
    }
}



export const VerifyOTP = async (req, res) => {
    try {
        let email = req.params.email;
        let otp = parseInt(req.params.otp);

        let OTPCount = await OTPModel.aggregate([
            { $match: { "email": email, "otp": otp, 'status': 0}},
            { $count: 'total'}
        ])
        // console.log(OTPCount);
        if(OTPCount[0].total===1) {
            let updateData = await OTPModel.updateOne(
                { email, otp, 'status': 0},
                { otp, status: 1}
            )
            return res.status(200).json({ status: "success", messege: "Verify OTP Email Successful", data: updateData })
        }
        else {
            return res.status(401).json({ status: "fail", messege: "Email or otp not matching" });
        }
    }
    catch(e) {
        return res.json({ status: "fail", messege: e.toString() });
    }
}


export const ResetPassword = async (req, res) => {
    try {
        let email = req.params.email;
        let otp = parseInt(req.params.otp);
        let { password } = req.body;

        let data = await OTPModel.aggregate([
            { $match: { email, otp, 'status': 1}},
            { $count: 'total'}
        ])
        // console.log(data)
        if(data[0].total===1) {
            let resetPassword = await userModel.updateOne({email}, {"password": password });
            await OTPModel.updateOne(
                { email},
                { otp: null, status: null}
            )
             return res.status(200).json({ status: "success", messege: "newPassword Successful", data: resetPassword })
        }
        else {
            return res.status(401).json({ status: "fail", messege: "Email or otp not matching" });
        }
    }
    catch(e) {
        return res.json({ status: "fail", messege: e.toString() });
    }
}