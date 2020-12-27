"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var listing_1 = require("../controllers/listing");
var authenticatedRouter = express_1.Router();
//Routes that are only accecible if users are signed in
authenticatedRouter.post("/post-ad");
authenticatedRouter.post("/create-listing", listing_1.createListing);
authenticatedRouter.get("/categories-for-listing", listing_1.categoriesForListing);
authenticatedRouter.post("/upload-image", 
// fileUpload.single("image"),
listing_1.uploadImage);
exports.default = authenticatedRouter;
