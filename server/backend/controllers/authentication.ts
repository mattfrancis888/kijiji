import { Request, Response, NextFunction, response } from "express";
import pool from "../databasePool";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const generateAccessToken = (email: string) => {
    if (process.env.privateKey) {
        const timeStamp = new Date().getTime();
        //Generate a token by using user email  and 'secret key'
        //iat- issued at  property is implemented by default
        //create token with these properties below and privatekey
        //for example, if our email variable is super long, our token might be super long

        return jwt.sign({ subject: email }, process.env.privateKey, {
            expiresIn: "15s",
        });
    }
};

const generateRefreshToken = (email: string) => {
    if (process.env.privateKey) {
        const timeStamp = new Date().getTime();
        //Generate a refresh token by using user email and 'secret key'
        return jwt.sign({ subject: email }, process.env.privateKey);
    }
};

export const refreshToken = async (req: any, res: Response) => {
    //Generates a new access token by using refresh token in header
    const FORBIDDEN_STATUS = 403;
    if (process.env.privateKey) {
        const refreshToken = req.headers["authorization"];

        if (refreshToken === null) return res.sendStatus(401);
        // Unauthorized access

        //Check if token is valid / has not expired

        //Using callback:
        // jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        //     if (err) return res.sendStatus(403)
        //   })
        //Using async await
        const user = await authenticateToken(
            refreshToken,
            process.env.privateKey
        );

        if (user === null) {
            return res.sendStatus(FORBIDDEN_STATUS);
        }

        //Check if token is in database
        pool.query(
            `SELECT email, refresh_token FROM auth WHERE refresh_token = '${refreshToken}'`,
            (error, user) => {
                if (error) return console.log(error);
                if (user.rowCount === 0) {
                    return res.sendStatus(FORBIDDEN_STATUS);
                }
                //If the refresh token matches the one in our database
                //Generate a new acces token for the user to use
                res.send({ token: generateAccessToken(user.rows[0].email) });
            }
        );
    } else {
        res.send(FORBIDDEN_STATUS);
    }
};

const authenticateToken = async (token: string, secret: string) => {
    //Checks if token is still valid / has not expired
    try {
        const result: any = jwt.verify(token, secret);
        return { email: result.email };
    } catch {
        return null;
    }

    //     Note: To validate token, you could use authenticateToken above
    //or requireAuth (passport strategy, check routes/index.ts), both are valid approaches
    //     authenticateToken approach is based on:
    //     https://github.com/WebDevSimplified/JWT-Authentication/blob/master/authServer.js
    //     https://github.com/hnasr/javascript_playground/blob/master/jwt-course/jwt-final/jwtAuth.mjs

    //     requireAuth approach is based on:
    //     https://solidgeargroup.com/en/refresh-token-with-jwt-authentication-node-js/
};

export const signIn = (req: any, res: Response) => {
    //req.user exists because of the done(null, user) used in the Strategies at passport.ts
    // console.log("REQ.USER", req.user.email);
    const refreshToken = generateRefreshToken(req.user.email);
    // Update Refresh token to database
    pool.query(
        `UPDATE auth
        SET refresh_token = '${refreshToken}' WHERE email = '${req.user.email}'`,
        (error, response) => {
            if (error) return console.log(error);
            res.send({
                token: generateAccessToken(req.user.email),
                refreshToken,
            });
        }
    );
};
export const signUp = (req: any, res: Response, next: NextFunction) => {
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
            const saltRounds = 10;
            bcrypt.hash(password, saltRounds, (err, hash) => {
                // Now we can store the password hash in db.
                if (err) {
                    return next(err);
                }
                console.log(hash);
                //Override current text password with hash
                const hashedPassword = hash;
                pool.query(
                    `INSERT INTO auth(email, password, refresh_token)VALUES('${email}', '${hashedPassword}', 'abcdefg')`,
                    (error, response) => {
                        if (error) return next(error);
                        //Generate a token when user signs in, this token will be used so that they can access protected routes

                        res.send({ token: generateAccessToken(email) });
                        //Respond to request indicating user was created
                    }
                );
            });
        }
    );
};
