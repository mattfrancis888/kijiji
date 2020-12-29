import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

if (process.env.NODE_ENV !== "production") {
    //We don't need dotenv when in production
    dotenv.config();
}
import route from "./routes";
import authenticatedRouter from "./routes/authenticated";
import listingRouter from "./routes/listing";
import { authenticateToken } from "./controllers/authentication";
const app = express();
// middleware for parsing bodies from URL
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));
console.log("NODE ENV", process.env.NODE_ENV);
app.use("/", route);
app.use("/", listingRouter);
//NOTE: app.use below that uses authenticateToken MUST ALWAYS BE LAST of the routes. If we have an expired JWT, it will send an error
//and none of the routes afterwards will work. By putting it last, we could send an error and get a new access token with "/token"
app.use("/", authenticateToken, authenticatedRouter);

const port = 5000;
//app.use(errorHandler);
app.listen(port, () => {
    console.log(`App running on port ${port}.`);
});
