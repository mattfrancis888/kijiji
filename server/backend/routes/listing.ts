import { Router, Request, Response } from "express";
import {
    createListing,
    uploadImage,
    categoriesForListing,
} from "../controllers/listing";
const listingRouter = Router();
//Routes that are only accecible if users are signed in
listingRouter.post("/create-listing", createListing);
listingRouter.get("/categories-for-listing", categoriesForListing);
listingRouter.post("/upload-image", uploadImage);
export default listingRouter;
