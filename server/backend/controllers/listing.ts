import { Request, Response, NextFunction, response } from "express";
import pool from "../databasePool";
import { FORBIDDEN_STATUS, INTERNAL_SERVER_ERROR_STATUS } from "../constants";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

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

export const getListingsSortedByOldestDate = async (
    req: any,
    res: Response
) => {
    const listing_name = req.body.listing_name || "";
    const category_id = req.body.category_id;
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    console.log(page);

    let query;
    let values;

    if (category_id) {
        query = `SELECT  * FROM listing WHERE listing_name LIKE $1 AND category_id = $2 ORDER BY LISTING_DATE ASC`;
        values = [`%${listing_name}%`, category_id];
    } else {
        query = `SELECT * FROM listing WHERE listing_name LIKE $1 AND category_id = category_id ORDER BY LISTING_DATE ASC 
        LIMIT $2 OFFSET ($3 - 1) * $2`;
        values = [`%${listing_name}%`, limit, page];
    }
    pool.query(query, values, (error, listing) => {
        if (error) {
            console.log(error);
            return res.sendStatus(INTERNAL_SERVER_ERROR_STATUS);
        }

        res.send(listing.rows);
    });
};

export const getListingsSortedByNewestDate = async (
    req: Request,
    res: Response
) => {
    const listing_name = req.body.listing_name || "";
    const category_id = req.body.category_id;
    let query;
    let values;

    if (category_id) {
        query = `SELECT * FROM listing WHERE listing_name LIKE $1 AND category_id = $2 ORDER BY LISTING_DATE DESC`;
        values = [`%${listing_name}%`, category_id];
    } else {
        query = `SELECT * FROM listing WHERE listing_name LIKE $1 AND category_id = category_id ORDER BY LISTING_DATE DESC`;
        values = [`%${listing_name}%`];
    }
    pool.query(query, values, (error, listing) => {
        if (error) {
            return res.sendStatus(INTERNAL_SERVER_ERROR_STATUS);
        }

        res.send(listing.rows);
    });
};

export const getListingsSortedByLowestPrice = async (
    req: Request,
    res: Response
) => {
    const listing_name = req.body.listing_name || "";
    const category_id = req.body.category_id;
    let query;
    let values;

    if (category_id) {
        query = `SELECT * FROM listing WHERE listing_name LIKE $1 AND category_id = $2 ORDER BY listing_price ASC`;
        values = [`%${listing_name}%`, category_id];
    } else {
        query = `SELECT * FROM listing WHERE listing_name LIKE $1 AND category_id = category_id ORDER BY listing_price ASC`;
        values = [`%${listing_name}%`];
    }
    pool.query(query, values, (error, listing) => {
        if (error) {
            return res.sendStatus(INTERNAL_SERVER_ERROR_STATUS);
        }

        res.send(listing.rows);
    });
};

export const getListingsSortedByHighestPrice = async (
    req: Request,
    res: Response
) => {
    const listing_name = req.body.listing_name || "";
    const category_id = req.body.category_id;
    let query;
    let values;

    if (category_id) {
        query = `SELECT * FROM listing WHERE listing_name LIKE $1 AND category_id = $2 ORDER BY listing_price DESC`;
        values = [`%${listing_name}%`, category_id];
    } else {
        query = `SELECT * FROM listing WHERE listing_name LIKE $1 AND category_id = category_id ORDER BY listing_price DESC`;
        values = [`%${listing_name}%`];
    }
    pool.query(query, values, (error, listing) => {
        if (error) {
            return res.sendStatus(INTERNAL_SERVER_ERROR_STATUS);
        }

        res.send(listing.rows);
    });
};

export const paginatedResults = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};
};
