import path from "path";
import { fileURLToPath } from "url";
import fs from 'fs';
import userModel from "../models/userModel.js";
import { uploadMultipleFileService } from "../services/userService.js";

// === Get __filename and __dirname ===
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === single file Upload ===
export const uploadSingleFile = async (req, res) => {
    if(!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ status: 'file', messege: "No file were uploaded." });
    }
    let uploadedFile = req.files.file;
    let uploadedFileName = Date.now()+"_"+uploadedFile.name;
    // console.log(req.files.file.name);
    // console.log(req.files.file.size);
    const uploadedPath = path.join(__dirname, "../../uploadedFile", uploadedFileName);
    // console.log(uploadedFile);
    // console.log(uploadedPath);
    if(uploadedFile.truncated) {
        return res.status(413).json({ status: 'fail', messege: "File is too large. Max size is 1 MB." });
    }
    // file upload at specific folder
    await uploadedFile.mv(uploadedPath, async (err) => {
        if(err) {
            return res.status(500).json({ status: 'error', messege: err.toString() });
        }
        let email = req.headers.email;
        try {
            // save file name at mongodb
            await userModel.updateOne({email}, { 'image': uploadedFileName });
            return res.status(201).json(
                { 
                    status: 'success', 
                    messege: "file upload successful", 
                    data: { 
                        name: uploadedFile.name, 
                        size: uploadedFile.size 
                    } 
                });
        }
        catch(e) {
            return res.status(401).json({ status: false, messege: e.toString() });
        }
    })
}




// === multiple file Upload ===
export const uploadMultipleFile = async (req, res) => {   
    let result = await uploadMultipleFileService(req, res);
    return result;
}


export const getUploadedFile = async (req, res) => {
    let email = req.headers.email;
    try {
        // let filename = req.params.fileName;
        let data = await userModel.findOne({ 'email': email });
        let filePath = path.join(__dirname, "../../uploadedFile", data.image);
        return res.sendFile(filePath);
    }
    catch(e) {
        return res.status(401).json({ status: false, messege: e.toString() });
    }
}


export const deleteSingleImage = async (req, res) => {
    let email = req.headers.email;
    try {
        let data = await userModel.findOne({ 'email': email });
        let filePath = path.join(__dirname, "../../uploadedFile", data.image);
        fs.unlink(filePath, (err) => {
            if(err) {
                res.status(500).send('Error Deleting File');
            }
        })
        await userModel.updateOne({ email }, { $set: { 'image': "" }});
        return res.status(201).json({ status: 'success', messege: "file delete successful" });
    }
    catch(e) {
        return res.status(401).json({ status: false, messege: e.toString() });
    }
}