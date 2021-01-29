import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import path from "path";
if (process.env.NODE_ENV !== "production") {
    //We don't need dotenv when in production
    dotenv.config();
}
import route from "./routes";
import authenticatedRouter from "./routes/authenticated";
import listingRouter from "./routes/listing";
import { authenticateToken } from "./controllers/authentication";
import profileRouter from "./routes/profile";
const app = express();
// middleware for parsing bodies from URL
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));
//with the credentials config above for cors:
//we don't need
// "Access-Control-Allow-Origin": "*",
//in now.json headers
//https://stackoverflow.com/questions/19743396/cors-cannot-use-wildcard-in-access-control-allow-origin-when-credentials-flag-i

console.log("NODE ENV", process.env.NODE_ENV);
//Serve react app in express server
//https://www.youtube.com/watch?v=QBXWZPy1Zfs&t=294s&ab_channel=FullstackDevelopment

app.use("/api/test", (req, res) => {
    res.send("hi");
});

app.use("/api", route);
app.use("/api", listingRouter);
app.use("/api", profileRouter);
//the authenticatedRouter below is essentially useless, just created to demonstrate our HOC
app.use("/api", authenticatedRouter);
//NOTE: app.use below that uses authenticateToken MUST ALWAYS BE LAST of the routes.
// At every "/" , if we have an expired JWT, it will send an error
//and none of the routes afterwards will work. By putting it last, we could send an error and get a new access token with "/token"
app.use("/api", authenticateToken);

//All other roues will be handled by
app.use(express.static(path.join(__dirname, "build")));
app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "build", "index.html"));
});
// const root = require("path").join(__dirname, "build");
// app.use(express.static(root));
// app.get("*", (req, res) => {
//     res.sendFile("index.html", { root });
// });

const port = 5000;
//app.use(errorHandler);

app.listen(port, () => {
    console.log(`App running on port ${port}.`);
});
