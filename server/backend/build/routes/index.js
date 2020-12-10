"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var databasePool_1 = __importDefault(require("../databasePool"));
var authentication_1 = require("../controllers/authentication");
var passport_1 = require("../services/passport");
var passport_2 = __importDefault(require("passport"));
passport_2.default.use(passport_1.jwtLogin);
//authenticates if a user can log in / acess a specific resource
//We are not using cookie sessions, so we put in session: false
var requireAuth = passport_2.default.authenticate("jwt", { session: false });
//requireAuth uses the jwtLogin strategy
//const requireSignIn = passport.authenticate("local", { session: false });
//passport.use(localLogin);
var router = express_1.Router();
//We want to ensure that the user token can acess specific resources in the page
//To do so, we created the requireAuth middleware
//THis is also known as a "protected route"
//Example of using a strategy /Dummy Route:
router.get("/require-auth", requireAuth, function (req, res) {
    //If JWT token can be understood (only registered users have JWT tokens that are valid/can be read),
    // show this page
    res.send("hi");
});
router.get("/category", function (req, res) {
    databasePool_1.default.query("SELECT * from category", function (error, response) {
        if (error)
            return console.log(error);
        res.status(200).send(response.rows);
    });
});
// router.post("/signin", requireSignIn, signIn);
router.post("/signup", authentication_1.signUp);
exports.default = router;
