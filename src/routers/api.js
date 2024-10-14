import express from "express";
const router = express.Router();

import * as UserController from "../controllers/userController.js";
import * as ProductController from "../controllers/productController.js";
import * as userFileController from "../controllers/userFileController.js";
import authMiddleware from "../middlewarew/authMiddleware.js";

// === user ===
router.post('/registration', UserController.Registration);
router.post('/login', UserController.Login);
router.get('/profile', authMiddleware, UserController.ProfileRead);
router.post('/profile-update', authMiddleware, UserController.ProfileUpdate)
router.post('/logout', UserController.Logout);
router.post('/sendemail', UserController.SendEmail);
router.post('/verify_email/:email', UserController.VerifyEmail);
router.post('/verify_OTP/:email/:otp', UserController.VerifyOTP);
router.post('/ResetPassword/:email/:otp', UserController.ResetPassword);
router.post('/create-cart-list', authMiddleware, ProductController.createCart);                 // user Cart
router.post('/upload-single-file', authMiddleware, userFileController.uploadSingleFile);        // user single file Upload


// user multiple file Upload
router.post('/upload-multiple-file', userFileController.uploadMultipleFile);


// === Admin ===
router.post('/create-product', ProductController.createProduct);


export default router;

