"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var listing_1 = require("../controllers/listing");
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
var authenticatedRouter = express_1.Router();
//Routes that are only accecible if users are signed in
authenticatedRouter.post("/post-ad");
authenticatedRouter.post("/create-listing", listing_1.createListing);
authenticatedRouter.post("/upload-image", 
// fileUpload.single("image"),
listing_1.uploadImage);
exports.default = authenticatedRouter;
