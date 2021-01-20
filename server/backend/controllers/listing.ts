import { Request, Response, NextFunction, response } from "express";
import pool from "../databasePool";
import { FORBIDDEN_STATUS, INTERNAL_SERVER_ERROR_STATUS } from "../constants";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import jwt_decode from "jwt-decode";

export const categoriesForListing = async (req: Request, res: Response) => {
    pool.query(`SELECT category_name FROM category`, (error, category) => {
        if (error) return res.sendStatus(INTERNAL_SERVER_ERROR_STATUS);

        res.send(category.rows.map((category) => category.category_name));
    });
};
export const createListing = async (req: Request, res: Response) => {
    // console.log(req.body);

    const listing_name = req.body.title;
    const listing_description = req.body.description;
    const category = req.body.category;
    const listing_image = req.body.cloudinaryImagePath; //can be null if cloduinaryImagePath is not given
    const province = req.body.province;
    const city = req.body.city;
    const street = req.body.street;
    const listing_price = req.body.price;
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
                listing_name,
                listing_price,
                listing_description,
                categoryId,
                listing_image,
                province,
                city,
                street,
            ]
        );

        const userInfoResponse = await pool.query(
            `SELECT user_id FROM  user_info WHERE email = $1`,
            [email]
        );
        const user_id = userInfoResponse.rows[0].user_id;

        const listing_id = response.rows[0].listing_id;

        await pool.query(
            `INSERT INTO lookup_listing_user(user_id, listing_id)VALUES($1, $2)`,
            [user_id, listing_id]
        );
        //For our full-text-search; if user mispelt words in the search bar, we would still give them the intended word they
        //are trying to search
        //https://www.compose.com/articles/mastering-postgresql-tools-full-text-search-and-phrase-search/
        await pool.query(
            `UPDATE listing d1  
            SET name_tokens = to_tsvector(d1.listing_name)  
            FROM listing d2 WHERE d1.listing_id = $1;`,
            [listing_id]
        );

        await pool.query("COMMIT");
        res.send({
            listing_id,
            listing_name,
            listing_description,
            category,
            listing_image,
            province,
            city,
            street,
            listing_price,
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

export const uploadImage = async (req: any, res: Response) => {
    //Unable ot use async await with upload()
    //Wants 3 arguments
    const storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
            folder: "kijiji",
            format: async (req, file) => "jpg",
        },
    });
    const multerUploader = multer({ storage });
    const upload = multerUploader.single("image");

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

export const editImage = async (req: any, res: Response) => {
    console.log("publicId", req.params.cloudinaryPublicId);
    const storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
            folder: "kijiji",
            format: async (req, file) => "jpg",
            public_id: (req, file) => req.params.cloudinaryPublicId,
        },
    });
    const multerUploader = multer({ storage });
    const upload = multerUploader.single("image");
    //Unable ot use async await with upload()
    //Wants 3 arguments
    upload(req, res, (err: any) => {
        if (err instanceof multer.MulterError) {
            console.log(err);
            return res.sendStatus(INTERNAL_SERVER_ERROR_STATUS);
            // A Multer error occurred when uploading.
        } else if (err) {
            console.log(err);
            // An unknown error occurred when uploading.
            return res.sendStatus(INTERNAL_SERVER_ERROR_STATUS);
        }
        return res.send({ cloudinaryImagePath: req.file.path });

        // Everything went fine and save document in DB here.
    });
};

export const deleteImage = async (req: any, res: Response) => {
    cloudinary.uploader.destroy(
        // req.params.cloudinaryPublicId,
        `kijiji/${req.params.cloudinaryPublicId}`,
        (err, result) => {
            if (err) return console.log(err);
            console.log(req.params.cloudinaryPublicId, " deleted");
            res.send(result);
        }
    );
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
    const province = req.query.province || "";
    const city = req.query.city || "";
    let countQuery;
    let countValues: any[] = [];
    try {
        if (listing_name && category_id) {
            //User enters filters and entered words on search bar, possibly has province and city filter

            countQuery = `SELECT COUNT(listing_id) FROM listing WHERE name_tokens @@ plainto_tsquery($1)
            AND category_id = $2 AND province LIKE $3 AND city LIKE $4`;
            countValues = [
                listing_name,
                category_id,
                `%${province}%`,
                `%${city}%`,
            ];
        } else if (listing_name) {
            //User only enters word on search bar, possibly has province and city filter
            countQuery = `SELECT COUNT(*) FROM listing WHERE name_tokens @@ plainto_tsquery($1)
            AND province LIKE $2 AND city LIKE $3 `;
            countValues = [listing_name, `%${province}%`, `%${city}%`];
        } else if (category_id) {
            //User has category filter but enters nothing on search bar, possibly has province and city filter
            countQuery = `SELECT COUNT(*) FROM listing WHERE category_id = $1
            AND province LIKE $2 AND city LIKE $3`;
            countValues = [category_id, `%${province}%`, `%${city}%`];
        } else {
            //User has no category filter and enters nothing on search bar, possibly has province and city filter
            countQuery = `SELECT COUNT(*) FROM listing WHERE province LIKE $1 AND city LIKE $2 `;
            countValues = [`%${province}%`, `%${city}%`];
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
            //@to_tsquery is
            //for our full-text-search; if user mispelt words in the search bar, we would still give them the intended word they
            //are trying to search
            //https://www.compose.com/articles/mastering-postgresql-tools-full-text-search-and-phrase-search/
            if (listing_name && category_id) {
                //User enters filters and entered words on search bar, possibly has province and city filter

                // query = `SELECT  * FROM listing WHERE name_tokens @@ plainto_tsquery($1)
                //  AND category_id = $2 ORDER BY ${columnName} ${order}
                // LIMIT $3 OFFSET ($4 - 1) * $3`;
                // values = [`%${listing_name}%`, category_id, limitPerPage, page];
                query = `SELECT  * FROM listing WHERE name_tokens
                @@ plainto_tsquery($1)
                AND category_id = $2 AND province LIKE $3 AND city like $4 ORDER BY ${columnName} ${order}
               LIMIT $5 OFFSET ($6 - 1) * $5`;

                values = [
                    listing_name,
                    category_id,
                    `%${province}%`,
                    `%${city}%`,
                    limitPerPage,
                    page,
                ];
            } else if (listing_name) {
                //User only enters word on search bar, possibly has province and city filter

                // query = `SELECT * FROM listing WHERE name_tokens @@ plainto_tsquery($1) ORDER BY  ${columnName} ${order}
                // LIMIT $2 OFFSET ($3 - 1) * $2`;
                // values = [`%${listing_name}%`, limitPerPage, page];

                query = `SELECT * FROM listing WHERE name_tokens @@ plainto_tsquery($1) 
                AND province LIKE $2 AND city LIKE $3 ORDER BY  ${columnName} ${order}
                LIMIT $4 OFFSET ($5 - 1) * $4`;
                values = [
                    listing_name,
                    `%${province}%`,
                    `%${city}%`,
                    limitPerPage,
                    page,
                ];
            } else if (category_id) {
                //User has category filter but enters nothing on search bar, possibly has province and city filter

                // query = `SELECT * FROM listing WHERE category_id = $1 ORDER BY  ${columnName} ${order}
                // LIMIT $2 OFFSET ($3 - 1) * $2`;
                // values = [category_id, limitPerPage, page];
                query = `SELECT * FROM listing WHERE category_id = $1 AND province LIKE $2 
                AND city LIKE $3 ORDER BY  ${columnName} ${order} 
                LIMIT $4 OFFSET ($5 - 1) * $4`;
                values = [
                    category_id,
                    `%${province}%`,
                    `%${city}`,
                    limitPerPage,
                    page,
                ];
            } else {
                //User has no category filter and enters nothing on search bar, possibly has province and city filter

                // query = `SELECT * FROM listing ORDER BY ${columnName} ${order}
                // LIMIT $1 OFFSET ($2 - 1) * $1`;
                // values = [limitPerPage, page];
                query = `SELECT * FROM listing WHERE province LIKE $1 
                and city LIKE $2 ORDER BY ${columnName} ${order} 
                LIMIT $3 OFFSET ($4 - 1) * $3`;
                values = [`%${province}%`, `%${city}`, limitPerPage, page];
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

export const getListingDetail = async (req: Request, res: Response) => {
    try {
        const listingId = req.params.id;

        const response = await pool.query(
            `SELECT
            listing_id,
            listing_name,
            listing_price,
            listing_description,
            category_name,
            listing_image,
            province,
            city,
            street,
            listing_date
            FROM listing NATURAL JOIN category  WHERE listing_id = $1`,
            [listingId]
        );

        const lookUpListingUserResponse = await pool.query(
            `SELECT * FROM lookup_listing_user NATURAL JOIN
            user_info WHERE listing_id = $1`,
            [listingId]
        );

        const firstName = lookUpListingUserResponse.rows[0].first_name;
        const lastName = lookUpListingUserResponse.rows[0].last_name;
        const memberSince = lookUpListingUserResponse.rows[0].member_since;
        const email = lookUpListingUserResponse.rows[0].email;
        let sendObj: any = {};
        sendObj.first_name = firstName;
        sendObj.last_name = lastName;
        sendObj.member_since = memberSince;
        sendObj.email = email;

        res.send({ ...sendObj, ...response.rows[0] });
    } catch (error) {
        console.log(error);
        return res.sendStatus(INTERNAL_SERVER_ERROR_STATUS);
    }
};

export const editListing = async (req: Request, res: Response) => {
    const listing_id = req.params.id;
    const listing_name = req.body.title;
    const listing_description = req.body.description;
    const category = req.body.category;
    const listing_image = req.body.cloudinaryImagePath; //can be null if cloduinaryImagePath is not given
    const province = req.body.province;
    const city = req.body.city;
    const street = req.body.street;
    const listing_price = req.body.price;

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
            ` UPDATE listing SET 
            listing_name = $1, 
            listing_price = $2, 
            listing_description = $3,
            category_id = $4, 
            listing_image = $5, 
            province =$6,
            city = $7, 
            street =$8
            WHERE listing_id = $9 
            RETURNING
            listing_name,
            listing_price,
            listing_description,
            category_id,
            listing_image,
            province,
            city,
            street;`,
            [
                listing_name,
                listing_price,
                listing_description,
                categoryId,
                listing_image,
                province,
                city,
                street,
                listing_id,
            ]
        );

        //For our full-text-search; if user mispelt words in the search bar, we would still give them the intended word they
        //are trying to search
        //https://www.compose.com/articles/mastering-postgresql-tools-full-text-search-and-phrase-search/
        await pool.query(
            `UPDATE listing d1  
            SET name_tokens = to_tsvector(d1.listing_name)  
            FROM listing d2 WHERE d1.listing_id = $1;`,
            [listing_id]
        );

        await pool.query("COMMIT");

        res.send({
            listing_id,
            ...response.rows[0],
        });
    } catch (error) {
        pool.query("ROLLBACK");
        console.log("ROLLBACK TRIGGERED", error);
        return res.sendStatus(INTERNAL_SERVER_ERROR_STATUS);
    }
};

export const deleteListing = async (req: any, res: Response) => {
    const listing_id = req.params.id;
    try {
        await pool.query("BEGIN");

        await pool.query(
            `DELETE FROM lookup_listing_user WHERE listing_id = $1`,
            [listing_id]
        );
        const response = await pool.query(
            `DELETE FROM listing WHERE listing_id = $1 RETURNING *`,
            [listing_id]
        );

        await pool.query("COMMIT");
        console.log(response.rows[0]);
        res.send({
            ...response.rows[0],
        });
    } catch (error) {
        pool.query("ROLLBACK");
        console.log("ROLLBACK TRIGGERED", error);
        return res.sendStatus(INTERNAL_SERVER_ERROR_STATUS);
    }
};

export const validateListingAndUserRelationship = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    const listing_id = req.params.id;

    const decodedJwt = jwt_decode(req.cookies.ACCESS_TOKEN);
    const email = decodedJwt.subject;
    //const email = "h@gmail.com";
    //console.log("EMAIL", email);

    try {
        const userResponse = await pool.query(
            `SELECT user_id FROM user_info 
             WHERE email = $1`,
            [email]
        );

        const response = await pool.query(
            `SELECT * from lookup_listing_user
             WHERE user_id = $1 AND listing_id = $2`,
            [userResponse.rows[0].user_id, listing_id]
        );
        if (!response.rows[0]) {
            throw new Error("User does not own this listing");
        }
        next();
    } catch (error) {
        console.log("ERROR", error);
        return res.sendStatus(INTERNAL_SERVER_ERROR_STATUS);
    }
};
