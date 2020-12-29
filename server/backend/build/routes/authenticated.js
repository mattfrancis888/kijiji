"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var authenticatedRouter = express_1.Router();
//Routes that are only accecible if users are signed in
authenticatedRouter.post("/post-ad");
exports.default = authenticatedRouter;
