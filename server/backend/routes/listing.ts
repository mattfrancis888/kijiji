import { Router, Request, Response } from "express";
import {
    createListing,
    uploadImage,
    categoriesForListing,
    getSortedListingCount,
    getListingsSortedByOldestDate,
    getListingsSortedByNewestDate,
    getListingsSortedByLowestPrice,
    getListingsSortedByHighestPrice,
} from "../controllers/listing";
const listingRouter = Router();

listingRouter.post("/create-listing", createListing);
listingRouter.get("/categories-for-listing", categoriesForListing);
listingRouter.post("/upload-image", uploadImage);
listingRouter.get(
    "/listing-oldest-date/:page",
    getSortedListingCount,
    getListingsSortedByOldestDate
);
listingRouter.get(
    "/listing-newest-date/:page",
    getSortedListingCount,
    getListingsSortedByNewestDate
);
listingRouter.get(
    "/listing-lowest-price/:page",
    getSortedListingCount,
    getListingsSortedByLowestPrice
);
listingRouter.get(
    "/listing-highest-price/:page",
    getSortedListingCount,
    getListingsSortedByHighestPrice
);
export default listingRouter;
