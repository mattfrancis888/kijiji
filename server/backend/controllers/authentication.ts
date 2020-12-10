import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import pool from "../databasePool";
import jwt from "jsonwebtoken";

const tokenForUser = (email: string) => {
    //Generate a token by using user id and 'secret key'
    if (process.env.privateKey) {
        //iat- issued at  property is implemented by default
        return jwt.sign({ subject: email}, process.env.privateKey);
    }
};

// export const signIn = (req: any, res: Response) => {
//     //req.user exists because of the done(null, user) used in the Strategies at passport.ts
//     res.send({ token: tokenForUser(req.user) });
// };
export const signUp = (req: Request, res: Response, next: NextFunction) => {
    //If user with given email exists
    const email = req.body.email;
    const password = req.body.password;
    
    const UNPROCESSABLE_ENTITY_STATUS = 422;
    //Email or password not given
    if (!email || !password) {
        return res
            .status(UNPROCESSABLE_ENTITY_STATUS)
            .send({ error: "Email and password must be provided" });
    }

    //If email already exist, return an error
    pool.query(
        `SELECT * from auth WHERE email = '${email}'`,
        (error, response) => {
            if (error) return console.log(error);
           
            //User already exist
            if (response.rows.length > 0) {
                //422 is UNPROCESSABLE_ETITY; data user gave was "bad/unproceesssed"
                return res
                    .status(UNPROCESSABLE_ENTITY_STATUS)
                    .send({ error: "Email in use" });
            }

            //If a user with email does NOT exist
          
             pool.query(`INSERT INTO auth(email, password, refresh_token)VALUES('${email}', '${password}', 'abcdefg')`,
             (error, response) => {
                if (error) return next(error);
                //Generate a token when user signs in, this token will be used so that they can access protected routes
                res.send({ token: tokenForUser(email) });
                //Respond to request indicating user was created
             });;
        }
    );
      
};
