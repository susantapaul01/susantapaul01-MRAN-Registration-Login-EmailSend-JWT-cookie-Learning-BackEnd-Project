import mongoose from "mongoose";

const dataSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
            unique: true,
        },
        image: {
            type: String,
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)
const userModel = mongoose.model('users', dataSchema);
export default userModel;
