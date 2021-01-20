"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var listing_1 = require("../controllers/listing");
var listingRouter = express_1.Router();
listingRouter.post("/create-listing", listing_1.createListing);
listingRouter.get("/categories-for-listing", listing_1.categoriesForListing);
listingRouter.post("/upload-image", listing_1.uploadImage);
listingRouter.get("/listing-oldest-date/:page", listing_1.getCategoryId, listing_1.getSortedListingCount, listing_1.sortByHelper("listing_date", "ASC"));
listingRouter.get("/listing-newest-date/:page", listing_1.getCategoryId, listing_1.getSortedListingCount, listing_1.sortByHelper("listing_date", "DESC"));
listingRouter.get("/listing-lowest-price/:page", listing_1.getCategoryId, listing_1.getSortedListingCount, listing_1.sortByHelper("listing_price", "ASC"));
listingRouter.get("/listing-highest-price/:page", listing_1.getCategoryId, listing_1.getSortedListingCount, listing_1.sortByHelper("listing_price", "DESC"));
listingRouter.get("/listing/:id", listing_1.getListingDetail);
listingRouter.patch("/listing/:id/edit", listing_1.editListing);
listingRouter.put("/edit-image/:cloudinaryPublicId", listing_1.editImage);
listingRouter.delete("/delete-image/:cloudinaryPublicId", listing_1.deleteImage);
listingRouter.delete("/listing/:id/delete", listing_1.deleteListing);
//When user goes to edit list, we want to validate if it's the lister owner
//is valid and then we want to get the listing detail
listingRouter.get("/listing/:id/validate-user/edit", listing_1.validateListingAndUserRelationship, listing_1.getListingDetail);
exports.default = listingRouter;
