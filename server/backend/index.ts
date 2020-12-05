import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
// import route from "./routes";
import bodyParser from "body-parser";


if (process.env.NODE_ENV !== "production") {
    //We don't need dotenv when in production
    dotenv.config();
}
if (process.env.mongoURI) {
    mongoose.connect(
        process.env.mongoURI,
        { useNewUrlParser: true, useUnifiedTopology: true },
        () => {
            console.log("connected to mongodb database (mongodb atlas)");
        }
    );
}
const app = express();
// middleware for parsing bodies from URL
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// route(app);
app.get("/", (req, res) => {
    res.send("hi");
});

const port = 5000;
//app.use(errorHandler);
app.listen(port, () => {
    console.log(`App running on port ${port}.`);
});
