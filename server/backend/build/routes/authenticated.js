"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var listing_1 = require("../controllers/listing");
var authenticatedRouter = express_1.Router();
//Routes that are only accecible if users are signed in
authenticatedRouter.post("/post-ad");
authenticatedRouter.post("/create-listing", listing_1.createListing);
exports.default = authenticatedRouter;
