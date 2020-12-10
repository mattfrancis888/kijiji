import { Router, Request, Response } from "express";
import pool from "../databasePool";
import { signUp } from "../controllers/authentication";
// import { jwtLogin, localLogin } from "../services/passport";
import passport from "passport";

//passport.use(jwtLogin);
//authenticates if a user can log in / acess a specific resource
//We are not using cookie sessions, so we put in session: false
//const requireAuth = passport.authenticate("jwt", { session: false });
//requireAuth uses the jwtLogin strategy

//const requireSignIn = passport.authenticate("local", { session: false });
//passport.use(localLogin);

const router = Router();
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
