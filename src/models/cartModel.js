import mongoose from "mongoose";
const dataSchema = new mongoose.Schema(
    {
        user_email: { type: String, required: true },
        productId: { type: mongoose.Schema.Types.ObjectId, required: true },
        // ===
        color: { type: String, required: true },
        qty: { type: Number, required: true },
        size: { type: String, required: true }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

const cartModel = mongoose.model('carts', dataSchema);
export default cartModel;

