import { Request, Response, NextFunction, response } from "express";
import pool from "../databasePool";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const FORBIDDEN_STATUS = 403;
const INTERNAL_SERVER_ERROR_STATUS = 500;
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
    //Generates a new access token by using refresh token in header

    if (PRIVATE_KEY) {
        const refreshToken = req.headers["authorization"];

        if (refreshToken === null) return res.sendStatus(401);
        // Unauthorized access

        //Check if token is valid / has not expired

        //Using callback:
        // jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        //     if (err) return res.sendStatus(403)
        //   })
        //Using async await
        const user = await authenticateToken(refreshToken, PRIVATE_KEY);

        if (user === null) {
            return res.sendStatus(FORBIDDEN_STATUS);
        }

        //Check if token is in database (in the case the attacker forged their own refresh token)
        pool.query(
            `SELECT email, refresh_token FROM auth WHERE refresh_token = '${refreshToken}'`,
            (error, user) => {
                if (error) return res.send(INTERNAL_SERVER_ERROR_STATUS);
                if (user.rowCount === 0) {
                    return res.sendStatus(FORBIDDEN_STATUS);
                }

                //If the refresh token matches the one in our database
                //Generate a new access token for the user to use

                // For acces token,  flags should be "secure: true"
                //For refreshtoken "secure: true" and "httpOnly: true"

                //Note: cookies will not be shown in http://localhost dev tools because it has flags of secure
                //and http only; but POSTMAN will show your cookies
                const token = generateAccessToken(
                    user.rows[0].email,
                    PRIVATE_KEY
                );
                res.setHeader("set-cookie", [
                    `ACCESS_TOKEN=${token}; samesite=lax; secure`,
                ]);

                res.send({
                    token,
                });
            }
        );

        //Cookies, when used with the HttpOnly cookie flag, are not accessible through JavaScript, and are immune to XS
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

export const signOut = async (req: Request, res: Response) => {
    const refreshToken = req.headers["cookie"]
        ?.split(";")
        .map((item) => item.trim())
        .find((str) => str.startsWith(REFRESH_TOKEN))
        ?.split("=")
        .pop();
    console.log(refreshToken);
    // console.log(req.headers["cookie"]?.split(";").map(item =>item.trim()).find(str => str.startsWith(REFRESH_TOKEN));
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
        SET refresh_token = '${refreshToken}' WHERE email = '${req.user.email}'`,
            (error, response) => {
                if (error) return res.send(INTERNAL_SERVER_ERROR_STATUS);
                // For acces token,  flags should be "secure: true"
                //For refreshtoken "secure: true" and "httpOnly: true"

                //Note: cookies will not be shown in http://localhost dev tools because it has flags of secure
                //and http only; but POSTMAN will show your cookies

                //Send http only cookie to header, then we can read it in /token
                //Reason why we send it to header is because httponly cookies cannot be read by javascript
                //eg; we cannot use cookieService.getRefreshToken() and then pass it to /token req.body or header
                //Note: ORDER IS IMPORTANT, SEND setHeader FIRST EBFORE SENDING cookie!
                res.setHeader("set-cookie", [
                    `REFRESH_TOKEN=${refreshToken}; httponly; samesite=lax;`,
                ]);
                res.cookie(ACCESS_TOKEN, token);

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
