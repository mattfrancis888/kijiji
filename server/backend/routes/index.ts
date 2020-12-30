import { Router, Request, Response } from "express";
import pool from "../databasePool";
import {
    signUp,
    signIn,
    refreshToken,
    signOut,
    authenticateToken,
} from "../controllers/authentication";
import { jwtLogin, localLogin } from "../services/passport";
import passport from "passport";
import jwt from "jsonwebtoken";

passport.use(jwtLogin);
//authenticates if a user can log in / acess a specific resource
//We are not using cookie sessions, so we put in session: false
const requireAuth = passport.authenticate("jwt", { session: false });
//requireAuth uses the jwtLogin strategy

const requireSignIn = passport.authenticate("local", { session: false });
//requireSignin uses the locallogin strategy
passport.use(localLogin);

const router = Router();
//We want to ensure that the user token can acess specific resources in the page
//To do so, we created the requireAuth middleware
//THis is also known as a "protected route"
//Example of using a strategy /Dummy Route:
// router.get("/", requireAuth, (req, res) => {
//     // If JWT token can be understood (only registered users have JWT tokens that are valid/can be read),
//     //  show this page

//     //     Note: To validate token, you could use authenticateToken(used in authentication.ts)
//     //      or requireAuth (passport strategy), both are valid approaches
//     //     authenticateToken approach is based on:
//     //     https://github.com/WebDevSimplified/JWT-Authentication/blob/master/authServer.js
//     //     https://github.com/hnasr/javascript_playground/blob/master/jwt-course/jwt-final/jwtAuth.mjs

//     //     requireAuth approach is based on:
//     //     https://solidgeargroup.com/en/refresh-token-with-jwt-authentication-node-js/

//     res.send("hi");
// });

router.get("/category", (req: Request, res: Response) => {
    pool.query("SELECT * from category", (error, response) => {
        if (error) return console.log(error);
        res.status(200).send(response.rows);
    });
});
//Go through passsport strategy middleware first, if succesfull, will be continuted to signIn middleware
router.post("/signin", requireSignIn, signIn);
router.post("/signup", signUp);
router.post("/token", refreshToken);
router.post("/signout", signOut);
// router.post("/post-ad", authenticateToken);

export default router;
