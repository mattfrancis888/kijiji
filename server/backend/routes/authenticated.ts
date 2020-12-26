import { Router, Request, Response } from "express";
import pool from "../databasePool";
import { createListing, uploadImage } from "../controllers/listing";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// var cloudinary = require("cloudinary").v2;

// cloudinary.config({
//     cloud_name: process.env.cloudinary_cloud_name,
//     api_key: process.env.cloudinary_api_key,
//     api_secret: process.env.cloudinary_secret,
// });

// const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//         folder: "kijiji",
//         format: async (req, file) => "jpg",
//         // public_id: (req, file) => "computed-filename-using-request",
//         // transformation: async (req, file) => [
//         //     {
//         //         width: 500,
//         //         height: 500,
//         //         crop: "limit",
//         //     },
//         // ],
//     },
// });
// const fileUpload = multer({ storage });
const authenticatedRouter = Router();
//Routes that are only accecible if users are signed in
authenticatedRouter.post("/post-ad");
authenticatedRouter.post("/create-listing", createListing);
authenticatedRouter.post(
    "/upload-image",
    // fileUpload.single("image"),
    uploadImage
);
export default authenticatedRouter;
