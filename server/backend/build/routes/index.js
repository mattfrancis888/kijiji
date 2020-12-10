"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var databasePool_1 = __importDefault(require("../databasePool"));
var authentication_1 = require("../controllers/authentication");
//passport.use(jwtLogin);
//authenticates if a user can log in / acess a specific resource
//We are not using cookie sessions, so we put in session: false
//const requireAuth = passport.authenticate("jwt", { session: false });
//requireAuth uses the jwtLogin strategy
//const requireSignIn = passport.authenticate("local", { session: false });
//passport.use(localLogin);
var router = express_1.Router();
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
