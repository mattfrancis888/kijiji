import { Router, Request, Response } from "express";
import pool from "../databasePool";
import { signUp } from "../controllers/authentication";
import { jwtLogin } from "../services/passport";
import passport from "passport";

passport.use(jwtLogin);
//authenticates if a user can log in / acess a specific resource
//We are not using cookie sessions, so we put in session: false
const requireAuth = passport.authenticate("jwt", { session: false });
//requireAuth uses the jwtLogin strategy

//const requireSignIn = passport.authenticate("local", { session: false });
//passport.use(localLogin);

const router = Router();
//We want to ensure that the user token can acess specific resources in the page
//To do so, we created the requireAuth middleware
//THis is also known as a "protected route"
//Example of using a strategy /Dummy Route:
router.get("/require-auth", requireAuth, (req, res) => {
    //If JWT token can be understood (only registered users have JWT tokens that are valid/can be read),
    // show this page
    res.send("hi");
});

router.get("/category", (req: Request, res: Response) => {
    pool.query(
        "SELECT * from category",
        (error, response) => {
            if (error) return console.log(error);
            res.status(200).send(response.rows);
        }
    );
});

// router.post("/signin", requireSignIn, signIn);
router.post("/signup", signUp);
export default router;
