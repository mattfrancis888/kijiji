import { Request, Response, NextFunction, response } from "express";
import pool from "../databasePool";
import { FORBIDDEN_STATUS, INTERNAL_SERVER_ERROR_STATUS } from "../constants";

export const createListing = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    // title: string;
    // description: string;
    // category: string;
    // province: string;
    // city: string;
    // street: string;
    // price: number;

    const title = req.body.title;
    const description = req.body.description;
    const category = req.body.category;
    const image = req.body.image;
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
                category_id, province, city)VALUES($1, $2, $3, $4, $5, $6);`,
            [title, price, description, categoryId, province, city]
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
