import { Request, Response, NextFunction, response } from "express";
import pool from "../databasePool";
import { FORBIDDEN_STATUS, INTERNAL_SERVER_ERROR_STATUS } from "../constants";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

export const categoriesForListing = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    pool.query(`SELECT category_name FROM category`, (error, category) => {
        if (error) return res.send(INTERNAL_SERVER_ERROR_STATUS);

        res.send(category.rows.map((category) => category.category_name));
    });
};
export const createListing = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    const title = req.body.title;
    const description = req.body.description;
    const category = req.body.category;
    const image = req.body.cloudinaryImagePath;
    const province = req.body.province;
    const city = req.body.city;
    const street = req.body.street;
    const price = req.body.price;

    try {
        //Using transactions with psql pool:
        //https://kb.objectrocket.com/postgresql/nodejs-and-the-postgres-transaction-968
        await pool.query("BEGIN");
        await pool.query(
            `INSERT INTO location(province, city, street)values($1, $2, $3)`,
            [province, city, street]
        );
        let categoryQuery = await pool.query(
            `SELECT category_id FROM category WHERE category_name = $1;`,
            [category]
        );
        let categoryId = console.log(
            "CATEGORY_ID",
            categoryQuery.rows[0].category_id
        );
        await pool.query(
            ` INSERT INTO listing(listing_name, listing_price, listing_description, 
                category_id, listing_image, province, city)VALUES($1, $2, $3, $4, $5, $6,$7);`,
            [title, price, description, categoryId, image, province, city]
        );
        pool.query("COMMIT");
        //Don't think it matters if we have await at COMMIT because the turotiral
        //above does not include it and our code works fine
        res.sendStatus(200);
    } catch (error) {
        pool.query("ROLLBACK");
        console.log("ROLLBACK TRIGGERED", error);
        return res.sendStatus(INTERNAL_SERVER_ERROR_STATUS);
    }

    //     START TRANSACTION;
    // insert into location(province, city, street)values
    // ('Alberta', 'Calgary', '1 Avenue North-east');
    // 	insert into listing(listing_name, listing_price, listing_description
    // , category_id, province, city)values
    // ('Samsung S20 5G Grey', 650.00, 'Brand new, unopened', 11, 'Alberta', 'Calgary');
    // COMMIT;
};

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
export const uploadImage = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    //Unable ot use async await with upload()
    //Wants 3 arguments
    upload(req, res, (err: any) => {
        if (err instanceof multer.MulterError) {
            res.sendStatus(INTERNAL_SERVER_ERROR_STATUS);
            // A Multer error occurred when uploading.
        } else if (err) {
            // An unknown error occurred when uploading.
            res.sendStatus(INTERNAL_SERVER_ERROR_STATUS);
        }
        res.send({ cloudinaryImagePath: req.file.path });

        // Everything went fine and save document in DB here.
    });
};
