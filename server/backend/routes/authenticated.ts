import { Router, Request, Response } from "express";
import pool from "../databasePool";
import {
    createListing,
    uploadImage,
    categoriesForListing,
} from "../controllers/listing";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const authenticatedRouter = Router();
//Routes that are only accecible if users are signed in
authenticatedRouter.post("/post-ad");
authenticatedRouter.post("/create-listing", createListing);
authenticatedRouter.get("/categories-for-listing", categoriesForListing);
authenticatedRouter.post(
    "/upload-image",
    // fileUpload.single("image"),
    uploadImage
);
export default authenticatedRouter;
