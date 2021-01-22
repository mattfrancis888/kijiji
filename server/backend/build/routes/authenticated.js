"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var authenticatedRouter = express_1.Router();
//Routes that are only accecible if users are signed in
//but this does not  matter because we have requierAuth HOC
//that kicks the user out if they are not authenticated
authenticatedRouter.post("/post-ad");
exports.default = authenticatedRouter;
