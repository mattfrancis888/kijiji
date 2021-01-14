"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var profile_1 = require("../controllers/profile");
var profileRouter = express_1.Router();
profileRouter.get("/profile", profile_1.getUserProfile);
exports.default = profileRouter;
