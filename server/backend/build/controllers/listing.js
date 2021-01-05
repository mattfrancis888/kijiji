"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getListingsSortedByHighestPrice = exports.getListingsSortedByLowestPrice = exports.getListingsSortedByNewestDate = exports.getListingsSortedByOldestDate = exports.getSortedListingCount = exports.uploadImage = exports.createListing = exports.categoriesForListing = void 0;
var databasePool_1 = __importDefault(require("../databasePool"));
var constants_1 = require("../constants");
var multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
var multer_1 = __importDefault(require("multer"));
var categoriesForListing = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        databasePool_1.default.query("SELECT category_name FROM category", function (error, category) {
            if (error)
                return res.send(constants_1.INTERNAL_SERVER_ERROR_STATUS);
            res.send(category.rows.map(function (category) { return category.category_name; }));
        });
        return [2 /*return*/];
    });
}); };
exports.categoriesForListing = categoriesForListing;
var createListing = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var title, description, category, image, province, city, street, price, email, categoryQuery, categoryId, response_1, userInfoResponse, userId, listingId, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                title = req.body.title;
                description = req.body.description;
                category = req.body.category;
                image = req.body.cloudinaryImagePath;
                province = req.body.province;
                city = req.body.city;
                street = req.body.street;
                price = req.body.price;
                email = req.body.subject;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 8, , 9]);
                //Using transactions with psql pool:
                //https://kb.objectrocket.com/postgresql/nodejs-and-the-postgres-transaction-968
                return [4 /*yield*/, databasePool_1.default.query("BEGIN")];
            case 2:
                //Using transactions with psql pool:
                //https://kb.objectrocket.com/postgresql/nodejs-and-the-postgres-transaction-968
                _a.sent();
                return [4 /*yield*/, databasePool_1.default.query("SELECT category_id FROM category WHERE category_name = $1;", [category])];
            case 3:
                categoryQuery = _a.sent();
                categoryId = categoryQuery.rows[0].category_id;
                return [4 /*yield*/, databasePool_1.default.query(" INSERT INTO listing(listing_name, listing_price, listing_description, \n                category_id, listing_image, province, city, street)VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;", [
                        title,
                        price,
                        description,
                        categoryId,
                        image,
                        province,
                        city,
                        street,
                    ])];
            case 4:
                response_1 = _a.sent();
                return [4 /*yield*/, databasePool_1.default.query("SELECT user_id FROM  user_info WHERE email = $1", [email])];
            case 5:
                userInfoResponse = _a.sent();
                userId = userInfoResponse.rows[0].user_id;
                listingId = response_1.rows[0].listing_id;
                return [4 /*yield*/, databasePool_1.default.query("INSERT INTO lookup_listing_user(user_id, listing_id)VALUES($1, $2)", [userId, listingId])];
            case 6:
                _a.sent();
                return [4 /*yield*/, databasePool_1.default.query("COMMIT")];
            case 7:
                _a.sent();
                res.send({
                    id: listingId,
                    title: title,
                    description: description,
                    category: category,
                    image: image,
                    province: province,
                    city: city,
                    street: street,
                    price: price,
                });
                return [3 /*break*/, 9];
            case 8:
                error_1 = _a.sent();
                databasePool_1.default.query("ROLLBACK");
                console.log("ROLLBACK TRIGGERED", error_1);
                return [2 /*return*/, res.sendStatus(constants_1.INTERNAL_SERVER_ERROR_STATUS)];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.createListing = createListing;
//Guide on uploading image with cloudinary and multer
//https:medium.com/@lola.omolambe/image-upload-using-cloudinary-node-and-mongoose-2f6f0723c745
var cloudinary = require("cloudinary").v2;
cloudinary.config({
    cloud_name: process.env.cloudinary_cloud_name,
    api_key: process.env.cloudinary_api_key,
    api_secret: process.env.cloudinary_secret,
});
var storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "kijiji",
        format: function (req, file) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, "jpg"];
        }); }); },
    },
});
var multerUploader = multer_1.default({ storage: storage });
var upload = multerUploader.single("image");
var uploadImage = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        //Unable ot use async await with upload()
        //Wants 3 arguments
        upload(req, res, function (err) {
            if (err instanceof multer_1.default.MulterError) {
                return res.sendStatus(constants_1.INTERNAL_SERVER_ERROR_STATUS);
                // A Multer error occurred when uploading.
            }
            else if (err) {
                // An unknown error occurred when uploading.
                return res.sendStatus(constants_1.INTERNAL_SERVER_ERROR_STATUS);
            }
            return res.send({ cloudinaryImagePath: req.file.path });
            // Everything went fine and save document in DB here.
        });
        return [2 /*return*/];
    });
}); };
exports.uploadImage = uploadImage;
var getSortedListingCount = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var listing_name, category_id, countQuery, countValues, totalListingsResponse, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                listing_name = req.body.listing_name || "";
                category_id = req.body.category_id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                if (category_id) {
                    countQuery = "SELECT COUNT(listing_id) FROM listing WHERE listing_name LIKE $1 AND category_id = $2";
                    countValues = ["%" + listing_name + "%", category_id];
                }
                else {
                    countQuery = "SELECT COUNT(*) FROM listing WHERE listing_name LIKE $1";
                    countValues = ["%" + listing_name + "%"];
                }
                return [4 /*yield*/, databasePool_1.default.query(countQuery, countValues)];
            case 2:
                totalListingsResponse = _a.sent();
                req.params.count = totalListingsResponse.rows[0].count;
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                console.log(err_1);
                return [2 /*return*/, res.sendStatus(constants_1.INTERNAL_SERVER_ERROR_STATUS)];
            case 4:
                next();
                return [2 /*return*/];
        }
    });
}); };
exports.getSortedListingCount = getSortedListingCount;
var createSortedByResponse = function (count, page, limitPerPage, listings) {
    var results = {};
    results.totalListings = count;
    results.page = page;
    results.limitPerPage = limitPerPage;
    results.listings = listings;
    return results;
};
var getListingsSortedByOldestDate = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var listing_name, category_id, page, limitPerPage, count, query, values, response_2, finalResponse, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                listing_name = req.body.listing_name || "";
                category_id = req.body.category_id;
                page = parseInt(req.params.page);
                limitPerPage = 3;
                count = parseInt(req.params.count);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                if (category_id) {
                    query = "SELECT  * FROM listing WHERE listing_name LIKE $1 AND category_id = $2 ORDER BY LISTING_DATE ASC\n            LIMIT $3 OFFSET ($4 - 1) * $3";
                    values = ["%" + listing_name + "%", category_id, limitPerPage, page];
                }
                else {
                    query = "SELECT * FROM listing WHERE listing_name LIKE $1 ORDER BY LISTING_DATE ASC \n            LIMIT $2 OFFSET ($3 - 1) * $2";
                    values = ["%" + listing_name + "%", limitPerPage, page];
                }
                return [4 /*yield*/, databasePool_1.default.query(query, values)];
            case 2:
                response_2 = _a.sent();
                finalResponse = createSortedByResponse(count, page, limitPerPage, response_2.rows);
                res.send(finalResponse);
                return [3 /*break*/, 4];
            case 3:
                err_2 = _a.sent();
                console.log(err_2);
                return [2 /*return*/, res.sendStatus(constants_1.INTERNAL_SERVER_ERROR_STATUS)];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getListingsSortedByOldestDate = getListingsSortedByOldestDate;
var getListingsSortedByNewestDate = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var listing_name, category_id, page, limitPerPage, count, query, values, response_3, finalResponse, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                listing_name = req.body.listing_name || "";
                category_id = req.body.category_id;
                page = parseInt(req.params.page);
                limitPerPage = 3;
                count = parseInt(req.params.count);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                if (category_id) {
                    query = "SELECT * FROM listing WHERE listing_name LIKE $1 AND category_id = $2 ORDER BY LISTING_DATE DESC\n            LIMIT $3 OFFSET ($4 - 1) * $3";
                    values = ["%" + listing_name + "%", category_id, limitPerPage, page];
                }
                else {
                    query = "SELECT * FROM listing WHERE listing_name LIKE $1 AND category_id = category_id ORDER BY LISTING_DATE DESC\n            LIMIT $2 OFFSET ($3 - 1) * $2";
                    values = ["%" + listing_name + "%", limitPerPage, page];
                }
                return [4 /*yield*/, databasePool_1.default.query(query, values)];
            case 2:
                response_3 = _a.sent();
                finalResponse = createSortedByResponse(count, page, limitPerPage, response_3.rows);
                res.send(finalResponse);
                return [3 /*break*/, 4];
            case 3:
                err_3 = _a.sent();
                console.log(err_3);
                return [2 /*return*/, res.sendStatus(constants_1.INTERNAL_SERVER_ERROR_STATUS)];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getListingsSortedByNewestDate = getListingsSortedByNewestDate;
var getListingsSortedByLowestPrice = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var listing_name, category_id, page, limitPerPage, count, query, values, response_4, finalResponse, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                listing_name = req.body.listing_name || "";
                category_id = req.body.category_id;
                page = parseInt(req.params.page);
                limitPerPage = 3;
                count = parseInt(req.params.count);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                if (category_id) {
                    query = "SELECT * FROM listing WHERE listing_name LIKE $1 AND category_id = $2 ORDER BY listing_price ASC\n            LIMIT $3 OFFSET ($4 - 1) * $3";
                    values = ["%" + listing_name + "%", category_id, limitPerPage, page];
                }
                else {
                    query = "SELECT * FROM listing WHERE listing_name LIKE $1 AND category_id = category_id ORDER BY listing_price ASC\n            LIMIT $2 OFFSET ($3 - 1) * $2";
                    values = ["%" + listing_name + "%", limitPerPage, page];
                }
                return [4 /*yield*/, databasePool_1.default.query(query, values)];
            case 2:
                response_4 = _a.sent();
                finalResponse = createSortedByResponse(count, page, limitPerPage, response_4.rows);
                res.send(finalResponse);
                return [3 /*break*/, 4];
            case 3:
                err_4 = _a.sent();
                console.log(err_4);
                return [2 /*return*/, res.sendStatus(constants_1.INTERNAL_SERVER_ERROR_STATUS)];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getListingsSortedByLowestPrice = getListingsSortedByLowestPrice;
var getListingsSortedByHighestPrice = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var listing_name, category_id, page, limitPerPage, count, query, values, response_5, finalResponse, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                listing_name = req.body.listing_name || "";
                category_id = req.body.category_id;
                page = parseInt(req.params.page);
                limitPerPage = 3;
                count = parseInt(req.params.count);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                if (category_id) {
                    query = "SELECT * FROM listing WHERE listing_name LIKE $1 AND category_id = $2 ORDER BY listing_price DESC\n            LIMIT $3 OFFSET ($4 - 1) * $3";
                    values = ["%" + listing_name + "%", category_id, limitPerPage, page];
                }
                else {
                    query = "SELECT * FROM listing WHERE listing_name LIKE $1 AND category_id = category_id ORDER BY listing_price DESC\n            LIMIT $2 OFFSET ($3 - 1) * $2";
                    values = ["%" + listing_name + "%", limitPerPage, page];
                }
                return [4 /*yield*/, databasePool_1.default.query(query, values)];
            case 2:
                response_5 = _a.sent();
                finalResponse = createSortedByResponse(count, page, limitPerPage, response_5.rows);
                res.send(finalResponse);
                return [3 /*break*/, 4];
            case 3:
                err_5 = _a.sent();
                console.log(err_5);
                return [2 /*return*/, res.sendStatus(constants_1.INTERNAL_SERVER_ERROR_STATUS)];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getListingsSortedByHighestPrice = getListingsSortedByHighestPrice;
// export const paginatedResults = async (
//     req: any,
//     res: Response,
//     next: NextFunction
// ) => {
//     const page = parseInt(req.query.page);
//     const limit = parseInt(req.query.limit);
//     const startIndex = (page - 1) * limit;
//     const endIndex = page * limit;
//     const results = {};
// };
