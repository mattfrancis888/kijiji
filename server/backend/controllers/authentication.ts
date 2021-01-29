import { Request, Response, NextFunction, response } from "express";
import pool from "../databasePool";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { FORBIDDEN_STATUS, INTERNAL_SERVER_ERROR_STATUS } from "../constants";

const PRIVATE_KEY = process.env.privateKey;

const ACCESS_TOKEN = "ACCESS_TOKEN";
const REFRESH_TOKEN = "REFRESH_TOKEN";

const generateAccessToken = (email: string, privateKey: string) => {
    //Generate a token by using user email  and 'secret key'
    //iat- issued at  property is implemented by default
    //create token with these properties below and privatekey
    //for example, if our email variable is super long, our token might be super long

    return jwt.sign({ subject: email }, privateKey, {
        expiresIn: "15s",
    });
};

const generateRefreshToken = (email: string, privateKey: string) => {
    return jwt.sign({ subject: email }, privateKey);
};

export const refreshToken = async (req: any, res: Response) => {
    //Generates a new access token by using refresh token

    //REFRESH_TOKEN cookie is automatically sent in POST request because we made an httponly cookie at /signin
    //and withCredentials:true sends the request and automatically includes the httponly cookie.
    //Cookies that don't have httponly will not be sent automatically.
    const refreshToken = req.headers["cookie"]
        ?.split(";")
        .map((item: any) => item.trim())
        .find((str: string) => str.startsWith(REFRESH_TOKEN))
        ?.split("=")
        .pop();

    if (PRIVATE_KEY && refreshToken) {
        //Validate token:
        jwt.verify(refreshToken, PRIVATE_KEY, (err: any, user: any) => {
            if (err) return res.sendStatus(FORBIDDEN_STATUS);
        });

        //Check if token is in database (in the case the attacker forged their own refresh token)
        pool.query(
            `SELECT email, refresh_token FROM auth WHERE refresh_token = $1`,
            [refreshToken],
            (error, user) => {
                if (error) {
                    return res.sendStatus(INTERNAL_SERVER_ERROR_STATUS);
                }
                if (user.rowCount === 0) {
                    return res.sendStatus(FORBIDDEN_STATUS);
                }

                //If the refresh token matches the one in our database
                //Generate a new access token for the user to use

                // For acces token,  flags should be "secure: true"
                //For refreshtoken "secure: true" and "httpOnly: true" sameSite="strict"

                //Note: cookies will not be shown in http://localhost dev tools because if it has flags of secure
                /// but POSTMAN will show your cookies
                ////Cookies, when used with the HttpOnly cookie flag, are not accessible through JavaScript, and are immune to XSS
                const token = generateAccessToken(
                    user.rows[0].email,
                    PRIVATE_KEY
                );
                // res.setHeader("set-cookie", [
                //     `ACCESS_TOKEN=${token}; samesite=lax;`,
                // ]);

                //Chrome's default settings for cookie is samesite=lax; to avoid CSRF attacks
                //We should leave it sameSite=Strict, but I'm having trouble deploying
                //the api and client at the same domain in Vercel via react's proxy, so I'm going to enable sameSite=none (which makes CSRF attacks possible)
                //because my life is too short :)
                res.cookie(ACCESS_TOKEN, token, {
                    secure: true, //needs secure tag when we have sameSite tag
                    sameSite: "strict",
                });

                //For development, we remove secure because it's on http:
                // res.cookie(ACCESS_TOKEN, token);
                res.send({
                    token,
                });
            }
        );
    } else {
        res.send(FORBIDDEN_STATUS);
    }
};

export const authenticateToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const token = req.headers["authorization"];
    if (PRIVATE_KEY && token) {
        try {
            //Check if token is valid / has not expired
            jwt.verify(token, PRIVATE_KEY);
            res.send({ token });
            // next();
        } catch (error) {
            console.log("authenticateTokenError", error);
            return res.sendStatus(FORBIDDEN_STATUS);
        }
    } else {
        res.sendStatus(FORBIDDEN_STATUS);
    }

    //     Note: To validate token, you could use authenticateToken above
    //or requireAuth (passport strategy, check routes/index.ts), both are valid approaches
    //     authenticateToken approach is based on:
    //     https://github.com/WebDevSimplified/JWT-Authentication/blob/master/authServer.js
    //     https://github.com/hnasr/javascript_playground/blob/master/jwt-course/jwt-final/jwtAuth.mjs

    //     requireAuth approach is based on:
    //     https://solidgeargroup.com/en/refresh-token-with-jwt-authentication-node-js/
};

export const signOut = async (req: Request, res: Response) => {
    const refreshToken = req.headers["cookie"]
        ?.split(";")
        .map((item: any) => item.trim())
        .find((str: string) => str.startsWith(REFRESH_TOKEN))
        ?.split("=")
        .pop();

    if (refreshToken) {
        pool.query(
            `UPDATE auth SET refresh_token = null WHERE refresh_token = '${refreshToken}'`,
            (error, user) => {
                if (error) return res.send(INTERNAL_SERVER_ERROR_STATUS);
                res.clearCookie(ACCESS_TOKEN);
                res.clearCookie(REFRESH_TOKEN);
                res.send({ token: "" });
            }
        );
    } else {
        res.sendStatus(FORBIDDEN_STATUS);
    }
};

export const signIn = (req: any, res: Response) => {
    if (PRIVATE_KEY) {
        //req.user exists because of the done(null, user) used in the Strategies at passport.ts
        // console.log("REQ.USER", req.user.email);
        const refreshToken = generateRefreshToken(req.user.email, PRIVATE_KEY);
        const token = generateAccessToken(req.user.email, PRIVATE_KEY);
        // Update Refresh token to database
        pool.query(
            `UPDATE auth
        SET refresh_token = $1 WHERE email = $2`,
            [refreshToken, req.user.email],
            (error, response) => {
                if (error) return res.send(FORBIDDEN_STATUS);
                // For acces token,  flags should be "secure: true"
                //For refreshtoken "secure: true" and "httpOnly: true"

                //Note: cookies will not be shown in http://localhost dev tools because it has flags of secure
                //and http only; but POSTMAN will show your cookies

                //Note: ORDER IS IMPORTANT, SEND setHeader FIRST EBFORE SENDING cookie!
                // res.setHeader("set-cookie", [
                //     `REFRESH_TOKEN=${refreshToken}; httponly;`,
                // ]);

                //Chrome's default settings for cookie is samesite=Strict (to avoid CSRF attacks) and Secure
                //We should leave it sameSite=Strict to avoid CSRF attacks, but I'm having trouble deploying
                //the api and client at the same domain in Vercel via react's proxy, so I'm going to enable sameSite=none (which makes CSRF attacks possible)
                //because my life is too short :)
                //GOOD PRACTICE (NOT EXPOSED TO CSRF ATTACKS):
                // res.cookie(REFRESH_TOKEN, refreshToken, {
                //     httpOnly: true,
                //     sameSite: true,
                // });

                res.cookie(REFRESH_TOKEN, refreshToken, {
                    sameSite: "strict",
                    secure: true,
                    httpOnly: true,
                });

                res.cookie(ACCESS_TOKEN, token, {
                    sameSite: "strict",
                    secure: true,
                });

                //For development, we remove secure because it's on http:
                // res.cookie(REFRESH_TOKEN, refreshToken, {
                //     httpOnly: true,
                // });

                // //For development, we remove secure because it's on http:
                // res.cookie(ACCESS_TOKEN, token);

                res.send({
                    token,
                    refreshToken,
                });
            }
        );
    } else {
        res.send(FORBIDDEN_STATUS);
    }
};
export const signUp = async (req: any, res: Response, next: NextFunction) => {
    if (PRIVATE_KEY) {
        //If user with given email exists
        const email = req.body.email;
        const password = req.body.password;
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;

        const UNPROCESSABLE_ENTITY_STATUS = 422;
        //Email or password not given
        if (!email || !password) {
            return res
                .status(UNPROCESSABLE_ENTITY_STATUS)
                .send({ error: "Email and password must be provided" });
        }

        try {
            //If a user with email does NOT exist
            const checkEmailResponse = await pool.query(
                `SELECT * from auth WHERE email = '${email}'`
            );

            //User already exist
            if (checkEmailResponse.rows.length > 0) {
                //422 is UNPROCESSABLE_ETITY; data user gave was "bad/unproceesssed"
                return res
                    .status(UNPROCESSABLE_ENTITY_STATUS)
                    .send({ error: "Email in use" });
            }

            const saltRounds = 10;
            const hash = await bcrypt.hash(password, saltRounds);
            /// Now we can store the password hash in db.
            //Override current text password with hash
            const hashedPassword = hash;
            try {
                //Using transactions with psql pool:
                //https://kb.objectrocket.com/postgresql/nodejs-and-the-postgres-transaction-968
                await pool.query("BEGIN");
                await pool.query(
                    ` INSERT INTO auth(email, password)VALUES($1, $2)`,
                    [email, hashedPassword]
                );
                await pool.query(
                    ` INSERT INTO user_info(first_name, last_name, email)VALUES($1, $2, $3);`,
                    [firstName, lastName, email]
                );
                pool.query("COMMIT");
                //Generate a token when user signs in, this token will be used so that they can access protected routes
                res.send({
                    token: generateAccessToken(email, PRIVATE_KEY),
                });
            } catch (error) {
                pool.query("ROLLBACK");
                console.log("ROLLBACK TRIGGERED");
                return res.sendStatus(INTERNAL_SERVER_ERROR_STATUS);
            }
        } catch (error) {
            //return next(error);
            return res.sendStatus(INTERNAL_SERVER_ERROR_STATUS);
        }

        // START TRANSACTION;
        //     INSERT INTO auth(email, password)VALUES($1, $2);
        //     INSERT INTO user_info(first_name, last_name, email)VALUES($3, $4, $5);
        // COMMIT
    } else {
        res.send(FORBIDDEN_STATUS);
    }
};
