import { Request, Response, NextFunction, response } from "express";
import pool from "../databasePool";
import { FORBIDDEN_STATUS, INTERNAL_SERVER_ERROR_STATUS } from "../constants";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

//TODO:
//1. Post ad token for text search
//2. Fix back button and pagination
//3. Province and city filter
export const categoriesForListing = async (req: Request, res: Response) => {
    pool.query(`SELECT category_name FROM category`, (error, category) => {
        if (error) return res.send(INTERNAL_SERVER_ERROR_STATUS);

        res.send(category.rows.map((category) => category.category_name));
    });
};
export const createListing = async (req: Request, res: Response) => {
    // console.log(req.body);
    const title = req.body.title;
    const description = req.body.description;
    const category = req.body.category;
    const image = req.body.cloudinaryImagePath; //can be null if cloduinaryImagePath is not given
    const province = req.body.province;
    const city = req.body.city;
    const street = req.body.street;
    const price = req.body.price;
    const email = req.body.subject;

    try {
        //Using transactions with psql pool:
        //https://kb.objectrocket.com/postgresql/nodejs-and-the-postgres-transaction-968
        await pool.query("BEGIN");

        let categoryQuery = await pool.query(
            `SELECT category_id FROM category WHERE category_name = $1;`,
            [category]
        );
        let categoryId = categoryQuery.rows[0].category_id;

        const response = await pool.query(
            ` INSERT INTO listing(listing_name, listing_price, listing_description, 
                category_id, listing_image, province, city, street)VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;`,
            [
                title,
                price,
                description,
                categoryId,
                image,
                province,
                city,
                street,
            ]
        );

        const userInfoResponse = await pool.query(
            `SELECT user_id FROM  user_info WHERE email = $1`,
            [email]
        );
        const userId = userInfoResponse.rows[0].user_id;

        const listingId = response.rows[0].listing_id;

        await pool.query(
            `INSERT INTO lookup_listing_user(user_id, listing_id)VALUES($1, $2)`,
            [userId, listingId]
        );

        await pool.query("COMMIT");
        res.send({
            id: listingId,
            title,
            description,
            category,
            image,
            province,
            city,
            street,
            price,
        });
    } catch (error) {
        pool.query("ROLLBACK");
        console.log("ROLLBACK TRIGGERED", error);
        return res.sendStatus(INTERNAL_SERVER_ERROR_STATUS);
    }

    //     START TRANSACTION;
    // insert into location(province, city, street)values
    // ('Alberta', 'Calgary', '1 Avenue North-east');
    // 	insert into listing(listing_name, listing_price, listing_description
    // , category_id, province, city, street)values
    // ('Samsung S20 5G Grey', 650.00, 'Brand new, unopened', 11, 'Alberta', 'Calgary', "hi");
    // COMMIT;
};

//Guide on uploading image with cloudinary and multer
//https:medium.com/@lola.omolambe/image-upload-using-cloudinary-node-and-mongoose-2f6f0723c745
var cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.cloudinary_cloud_name,
    api_key: process.env.cloudinary_api_key,
    api_secret: process.env.cloudinary_secret,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "kijiji",
        format: async (req, file) => "jpg",
    },
});
const multerUploader = multer({ storage });
const upload = multerUploader.single("image");
export const uploadImage = async (req: any, res: Response) => {
    //Unable ot use async await with upload()
    //Wants 3 arguments
    upload(req, res, (err: any) => {
        if (err instanceof multer.MulterError) {
            return res.sendStatus(INTERNAL_SERVER_ERROR_STATUS);
            // A Multer error occurred when uploading.
        } else if (err) {
            // An unknown error occurred when uploading.
            return res.sendStatus(INTERNAL_SERVER_ERROR_STATUS);
        }
        return res.send({ cloudinaryImagePath: req.file.path });

        // Everything went fine and save document in DB here.
    });
};

export const getCategoryId = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    const category = req.query.category;
    let categoryQueryResponse;
    try {
        if (category) {
            categoryQueryResponse = await pool.query(
                `SELECT category_id FROM category WHERE category_name = $1;`,
                [category]
            );
            req.params.category_id = categoryQueryResponse.rows[0].category_id;
        }
    } catch (err) {
        console.log(err);
        return res.sendStatus(INTERNAL_SERVER_ERROR_STATUS);
    }

    next();
};

export const getSortedListingCount = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    const listing_name = req.query.search || "";
    const category_id = req.params.category_id;
    let countQuery;
    let countValues: any[] = [];
    try {
        if (listing_name && category_id) {
            countQuery = `SELECT COUNT(listing_id) FROM listing WHERE name_tokens @@ to_tsquery($1)
            AND category_id = $2`;
            countValues = [listing_name, category_id];
        } else if (listing_name) {
            countQuery = `SELECT COUNT(*) FROM listing WHERE name_tokens @@ to_tsquery($1)`;
            countValues = [listing_name];
        } else if (category_id) {
            countQuery = `SELECT COUNT(*) FROM listing WHERE category_id = $1`;
            countValues = [category_id];
        } else {
            countQuery = `SELECT COUNT(*) FROM listing`;
        }
        const totalListingsResponse = await pool.query(countQuery, countValues);
        req.params.count = totalListingsResponse.rows[0].count;
    } catch (err) {
        console.log(err);
        return res.sendStatus(INTERNAL_SERVER_ERROR_STATUS);
    }

    next();
};

interface sortedByType {
    totalListings?: number;
    page?: number;
    limitPerPage?: number;
    listings?: any[];
}

const createSortedByResponse = (
    count: number,
    page: number,
    limitPerPage: number,
    listings: any[]
) => {
    let results: sortedByType = {};
    results.totalListings = count;
    results.page = page;
    results.limitPerPage = limitPerPage;
    results.listings = listings;
    return results;
};

export const sortByHelper = (columnName: string, order: string) => {
    return async function (req: any, res: any) {
        console.log("req.query", req.query);
        console.log("req.params", req.params);
        const listing_name = req.query.search || "";
        const category_id = req.params.category_id;
        const province = req.query.province || "";
        const city = req.query.city || "";

        const page = parseInt(req.params.page);
        const limitPerPage = 3;
        //From getSortedListingCount middleware:
        const count = parseInt(req.params.count);

        let query;
        let values;
        try {
            if (listing_name && category_id) {
                //User enters filters and entered words on search bar
                query = `SELECT  * FROM listing WHERE name_tokens @@ to_tsquery($1)
                 AND category_id = $2 ORDER BY ${columnName} ${order}
                LIMIT $3 OFFSET ($4 - 1) * $3`;
                values = [`%${listing_name}%`, category_id, limitPerPage, page];
            } else if (listing_name) {
                //User only enters word on search bar
                query = `SELECT * FROM listing WHERE name_tokens @@ to_tsquery($1) ORDER BY  ${columnName} ${order}
                LIMIT $2 OFFSET ($3 - 1) * $2`;
                values = [`%${listing_name}%`, limitPerPage, page];
            } else if (category_id) {
                //User has category filter but enters nothing on search bar
                query = `SELECT * FROM listing WHERE category_id = $1 ORDER BY  ${columnName} ${order} 
                LIMIT $2 OFFSET ($3 - 1) * $2`;
                values = [category_id, limitPerPage, page];
            } else {
                //User has no category filter and enters nothing on search bar
                query = `SELECT * FROM listing ORDER BY ${columnName} ${order} 
                LIMIT $1 OFFSET ($2 - 1) * $1`;
                values = [limitPerPage, page];
            }

            const response = await pool.query(query, values);
            const finalResponse = createSortedByResponse(
                count,
                page,
                limitPerPage,
                response.rows
            );
            res.send(finalResponse);
        } catch (err) {
            console.log(err);
            return res.sendStatus(INTERNAL_SERVER_ERROR_STATUS);
        }
    };
};
