import path from "path";
import { fileURLToPath } from "url";
import userModel from "../models/userModel.js";

// === Get __filename and __dirname ===
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === single file Upload ===
export const uploadSingleFile = async (req, res) => {
    if(!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ status: 'file', messege: "No file were uploaded." });
    }
    let uploadedFile = req.files.file;
    let uploadedFileName = uploadedFile.name;
    // console.log(req.files.file.name);
    // console.log(req.files.file.size);
    const uploadedPath = path.join(__dirname, "../../uploadedFile", Date.now()+"_"+uploadedFileName);
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
    // console.log(typeof req.files.file);
    // console.log(Object.keys(req.files))
    // console.log(req.files.file.length);
    // console.log(req.files.file);
    // console.log(Object.keys(req.files).length)
    // console.log(req.files.file)
    
    try {
        if(!req.files || Object.keys(req.files).length === 0) {
            console.log("0")
            return res.status(400).json({ status: 'file', messege: "No file were uploaded." });
        }
        if(Object.keys(req.files).length === 1) {
            console.log("1")
            return res.status(400).json({ status: 'file', messege: "At least 2 file are required." })
        }        
        console.log("2")
        let selectMultipleFile = req.files.file;
        for(let i=0; i<selectMultipleFile.length; i++) {
            // let uploadedMultipleFile = Date.now()+"_"+selectMultipleFile;
            const multipleFilePath = path.join(__dirname, "../../uploadedFile", Date.now()+"_"+selectMultipleFile[i].name);
            await selectMultipleFile[i].mv(multipleFilePath, async (err) => {
                if(err) {
                    return res.status(500).json({ status: "error", messege: err.toString()});
                }
            })
        }
        return res.status(201).json({ status: true, messege: "Multiple File uploaded successfully!"});
    }
    catch(e) {
        return res.status(401).json({ status: false, messege: e.toString() });
    }
}