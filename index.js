import express from "express";
import mongoose from "mongoose";
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import dotenv from 'dotenv';
dotenv.config();

const app = express();
import { DATABASE, MAX_JSON_SIZE, REQUEST_NUMBER, REQUEST_TIME_LIMIT, URL_INCODE, WEB_CASH } from "./src/config/config.js";
import router from "./src/routers/api.js";

// cors setting for cookei passing
const corsOptions = {
    credentials: true,
    origin: process.env.ORIGIN_HOST_SIDE
}
app.use(cors(corsOptions));

// Request limiter
const limiter = rateLimit({
    windowMs: REQUEST_TIME_LIMIT,
    max: REQUEST_NUMBER
})
app.use(limiter);

// app use dependensis
app.use(helmet());
app.use(express.json({limit: MAX_JSON_SIZE}));
app.use(express.urlencoded({ extended: URL_INCODE}));
app.set('etag', WEB_CASH);
app.use(cookieParser());
app.use(fileUpload({limits: { fileSize: 1 * 1024 * 1024 }}));
// Router middleware connection
app.use('/v1', router);
// Database Connection
mongoose.connect(DATABASE, {
    autoIndex: true
}).then(() => {
    console.log("Successfully connected to MongoDB")
}).catch((error) => {
    console.log(error);
})
// Start the server
app.listen(process.env.PORT, (req, res) => {
    console.log(`Server port ${process.env.PORT} has running successful`);
})

