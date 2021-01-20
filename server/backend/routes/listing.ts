import { Router, Request, Response } from "express";
import {
    createListing,
    uploadImage,
    categoriesForListing,
    getSortedListingCount,
    getCategoryId,
    sortByHelper,
    getListingDetail,
    editListing,
    editImage,
    deleteImage,
    deleteListing,
    validateListingAndUserRelationship,
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

listingRouter.get("/listing/:id", getListingDetail);
listingRouter.patch("/listing/:id/edit", editListing);
listingRouter.put("/edit-image/:cloudinaryPublicId", editImage);
listingRouter.delete("/delete-image/:cloudinaryPublicId", deleteImage);
listingRouter.delete("/listing/:id/delete", deleteListing);

//When user goes to edit list, we want to validate if it's the lister owner
//is valid and then we want to get the listing detail
listingRouter.get(
    "/listing/:id/validate-user/edit",
    validateListingAndUserRelationship,
    getListingDetail
);
export default listingRouter;
