"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var listing_1 = require("../controllers/listing");
var listingRouter = express_1.Router();
//Routes that are only accecible if users are signed in
listingRouter.post("/create-listing", listing_1.createListing);
listingRouter.get("/categories-for-listing", listing_1.categoriesForListing);
listingRouter.post("/upload-image", listing_1.uploadImage);
exports.default = listingRouter;
