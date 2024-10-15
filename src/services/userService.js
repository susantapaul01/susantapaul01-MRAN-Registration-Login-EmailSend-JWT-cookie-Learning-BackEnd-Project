import path from "path";
import { fileURLToPath } from "url";

// === Get __filename and __dirname ===
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const uploadMultipleFileService = async (req, res) => {
    try {
        if(!req.files || Object.keys(req.files).length === 0) {
            // console.log("Empty file.")
            return res.status(400).json({ status: 'file', messege: "Empty file." });
        }
        let selectMultipleFile = req.files.file;
        if(selectMultipleFile.length === undefined) {
            console.log("At least 2 file are required.");
            return res.status(400).json({ status: 'file', messege: "At least 2 file are required." });
        }
        for(let i=0; i<selectMultipleFile.length; i++) {
            const multipleFilePath = path.join(__dirname, "../../uploadedFile", Date.now()+"_"+selectMultipleFile[i].name);
            // console.log(multipleFilePath)
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