import cartModel from "../models/cartModel.js";
import productModel from "../models/productModel.js";

// === Create Product
export const createProduct = async (req, res) => {
    try {
        let ReqBody = req.body;
        const data = await productModel.create(ReqBody);
        return res.status(201).json({ status: "success", data: data });
    }
    catch(e) {
        return res.status(404).json({ status: "fail", messege: e.toString() })
    }
}

// === Create Cart
export const createCart = async (req, res) => {
    try {
        let email = req.headers.email
        let reqBody = req.body;
            reqBody.user_email = email;
        // find existing cart
        let existingCart = await cartModel.findOne({
            "user_email": email,
            "productId": req.body.productId,
            "color": req.body.color,
            "size": req.body.size
        })
        console.log(existingCart);
        if(existingCart) {
            let qtyUpdate = parseInt(existingCart.qty) + parseInt(reqBody.qty);
            // Update cart
            let updateData = await cartModel.updateOne(
                {
                    "_id": existingCart._id
                },
                {
                    $set: { 'qty': qtyUpdate }
                }
            )
            return res.status(201).json({ status: "Updated Successful", Data: updateData });
        }
        else {
            // Create Cart
            let newCart = await cartModel.create(reqBody);
            return res.status(201).json({ status: "success", messege: "Cart create successful", data: newCart });
        }
    }
    catch(e) {
        return res.status(404).json({ status: "fail", messege: e.toString() })
    }
}

