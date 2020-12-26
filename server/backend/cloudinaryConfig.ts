//import cloudinary from "cloudinary"; //Import statements are not supported?
//If we import cloudinaryConfig, we will get an error of upload_stream not defined
//when uploading our images; i don't think es6 imports are supported as of 2020-12-26
//DO NOT USE
var cloudinary = require("cloudinary").v2;
export const cloudinaryConfig = cloudinary.config({
    cloud_name: process.env.cloudinary_cloud_name,
    api_key: process.env.cloudinary_api_key,
    api_secret: process.env.cloudinary_secret,
});
