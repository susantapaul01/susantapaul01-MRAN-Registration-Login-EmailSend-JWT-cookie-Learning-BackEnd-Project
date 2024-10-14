import mongoose from "mongoose";

let dataSchema = new mongoose.Schema(
    {
        email: { type: String, required: true },
        otp: { type: Number, default: 0, required: true },
        status: { type: Number, default: 0 }
    },
    {
        timestamps: true,
        versionKey: false
    }
)
const OTPModel = mongoose.model("otps", dataSchema);
export default OTPModel;