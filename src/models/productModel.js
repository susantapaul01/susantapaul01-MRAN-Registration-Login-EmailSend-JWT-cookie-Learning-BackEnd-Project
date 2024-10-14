import mongoose from "mongoose";
const dataSchema = mongoose.Schema(
    {
        title: { type: String, required: true },
        brand: { type: String, required: true },
        shortDes: { type: String, required: true },
        price: { type: String, required: true },
        discount: { type: String, required: true },
        discountPrice: { type: String, required: true },
        img1: { type: String, required: true },
        img2: { type: String },
        img3: { type: String },
        img4: { type: String },
        img5: { type: String },
        img6: { type: String },
        img7: { type: String },
        img8: { type: String },
        stock: { type: Boolean, required: true },
        remark: { type: String, required: true },
        des: { type: String, required: true },
        color: { type: String, required: true },
        size: { type: String, required: true }
    },
    {
        timestamps: true,
        versionKey: false,
    }
)
const productModel = mongoose.model('products', dataSchema);
export default productModel;