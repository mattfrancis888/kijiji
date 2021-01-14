"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var dotenv_1 = __importDefault(require("dotenv"));
var cors_1 = __importDefault(require("cors"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var body_parser_1 = __importDefault(require("body-parser"));
if (process.env.NODE_ENV !== "production") {
    //We don't need dotenv when in production
    dotenv_1.default.config();
}
var routes_1 = __importDefault(require("./routes"));
var authenticated_1 = __importDefault(require("./routes/authenticated"));
var listing_1 = __importDefault(require("./routes/listing"));
var authentication_1 = require("./controllers/authentication");
var profile_1 = __importDefault(require("./routes/profile"));
var app = express_1.default();
// middleware for parsing bodies from URL
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use(cookie_parser_1.default());
app.use(cors_1.default({ origin: true, credentials: true }));
console.log("NODE ENV", process.env.NODE_ENV);
app.use("/", routes_1.default);
app.use("/", listing_1.default);
app.use("/", profile_1.default);
//NOTE: app.use below that uses authenticateToken MUST ALWAYS BE LAST of the routes. If we have an expired JWT, it will send an error
//and none of the routes afterwards will work. By putting it last, we could send an error and get a new access token with "/token"
app.use("/", authentication_1.authenticateToken, authenticated_1.default);
var port = 5000;
//app.use(errorHandler);
app.listen(port, function () {
    console.log("App running on port " + port + ".");
});
