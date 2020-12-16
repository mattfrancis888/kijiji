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
const app = express();
// middleware for parsing bodies from URL
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));

console.log("NODE ENV", process.env.NODE_ENV);
app.use("/", route);
app.get("/", (req, res) => {
    res.send("hi");
});

const port = 5000;
//app.use(errorHandler);
app.listen(port, () => {
    console.log(`App running on port ${port}.`);
});
