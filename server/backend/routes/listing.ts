import { Router, Request, Response } from "express";
import {
    createListing,
    uploadImage,
    categoriesForListing,
    getSortedListingCount,
    getCategoryId,
    sortByHelper,
} from "../controllers/listing";
const listingRouter = Router();

listingRouter.post("/create-listing", createListing);
listingRouter.get("/categories-for-listing", categoriesForListing);
listingRouter.post("/upload-image", uploadImage);
listingRouter.get(
    "/listing-oldest-date/:page",
    getCategoryId,
    getSortedListingCount,
    sortByHelper("listing_date", "ASC")
);
listingRouter.get(
    "/listing-newest-date/:page",
    getCategoryId,
    getSortedListingCount,
    sortByHelper("listing_date", "DESC")
);

listingRouter.get(
    "/listing-lowest-price/:page",
    getCategoryId,
    getSortedListingCount,
    sortByHelper("listing_price", "ASC")
);
listingRouter.get(
    "/listing-highest-price/:page",
    getCategoryId,
    getSortedListingCount,
    sortByHelper("listing_price", "DESC")
);
export default listingRouter;
