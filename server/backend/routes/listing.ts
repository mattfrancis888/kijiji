import { Router, Request, Response } from "express";
import {
    createListing,
    uploadImage,
    categoriesForListing,
    getListingsSortedByOldestDate,
    getListingsSortedByNewestDate,
    getListingsSortedByLowestPrice,
    getListingsSortedByHighestPrice,
} from "../controllers/listing";
const listingRouter = Router();

listingRouter.post("/create-listing", createListing);
listingRouter.get("/categories-for-listing", categoriesForListing);
listingRouter.post("/upload-image", uploadImage);
listingRouter.get("/listing-oldest-date/:page", getListingsSortedByOldestDate);
listingRouter.get("/listing-newest-date", getListingsSortedByNewestDate);
listingRouter.get("/listing-lowest-price", getListingsSortedByLowestPrice);
listingRouter.get("/listing-highest-price", getListingsSortedByHighestPrice);
export default listingRouter;
