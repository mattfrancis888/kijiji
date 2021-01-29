import { Request, Response, NextFunction, response } from "express";
import pool from "../databasePool";
import { FORBIDDEN_STATUS, INTERNAL_SERVER_ERROR_STATUS } from "../constants";
import jwt_decode from "jwt-decode";
import { decode } from "jsonwebtoken";

export const getUserProfile = async (req: Request, res: Response) => {
    try {
        const decodedJwt = jwt_decode(req.cookies.ACCESS_TOKEN);
        //@ts-ignore
        const email = decodedJwt.subject;

        const userInfoResponse = await pool.query(
            `SELECT * from user_info WHERE email = $1`,
            [email]
        );

        const userId = userInfoResponse.rows[0].user_id;
        const firstName = userInfoResponse.rows[0].first_name;
        const lastName = userInfoResponse.rows[0].last_name;
        const memberSince = userInfoResponse.rows[0].member_since;

        //triple join (downside is, user_id first name, lastname, membersince is repeated in every row):
        // select * from user_info NATURAL JOIN
        // lookup_listing_user
        // NATURAL JOIN listing b
        // WHERE email = 'h@gmail.com'

        const lookUpListingUserResponse = await pool.query(
            `SELECT 
            listing_id, 
            listing_name,
            listing_price, 
            listing_description, 
            category_id,
            listing_image,
            province,
            city,
            street,
            listing_date
            FROM lookup_listing_user  NATURAL JOIN listing 
            WHERE user_id = $1`,
            [userId]
        );
        let sendObj: any = {};
        sendObj.user_id = userId;
        sendObj.first_name = firstName;
        sendObj.last_name = lastName;
        sendObj.member_since = memberSince;
        sendObj.listings = lookUpListingUserResponse.rows;

        res.send(sendObj);
    } catch (error) {
        console.log(error);
        return res.sendStatus(INTERNAL_SERVER_ERROR_STATUS);
    }
};
