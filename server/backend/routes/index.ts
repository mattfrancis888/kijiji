import { Router, Request, Response } from "express";
import pool from "../databasePool";

const router = Router();
router.get("/category", async (req: Request, res: Response) => {
    pool.query(
        "SELECT * from category",
        (error, response) => {
            if (error) return console.log(error);
            res.status(200).send(response.rows);
        }
    );
});
export default router;
