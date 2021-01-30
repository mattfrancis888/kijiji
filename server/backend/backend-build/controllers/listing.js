"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.validateListingAndUserRelationship = exports.deleteListing = exports.editListing = exports.getListingDetail = exports.sortByHelper = exports.getSortedListingCount = exports.getCategoryId = exports.deleteImage = exports.editImage = exports.uploadImage = exports.createListing = exports.categoriesForListing = void 0;
var databasePool_1 = __importDefault(require("../databasePool"));
var constants_1 = require("../constants");
var multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
var multer_1 = __importDefault(require("multer"));
var jwt_decode_1 = __importDefault(require("jwt-decode"));
var categoriesForListing = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        databasePool_1.default.query("SELECT category_name FROM category", function (error, category) {
            if (error)
                return res.sendStatus(constants_1.INTERNAL_SERVER_ERROR_STATUS);
            res.send(category.rows.map(function (category) { return category.category_name; }));
        });
        return [2 /*return*/];
    });
}); };
exports.categoriesForListing = categoriesForListing;
var createListing = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var listing_name, listing_description, category, listing_image, province, city, street, listing_price, email, categoryQuery, categoryId, response_1, userInfoResponse, user_id, listing_id, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                listing_name = req.body.title;
                listing_description = req.body.description;
                category = req.body.category;
                listing_image = req.body.cloudinaryImagePath;
                province = req.body.province;
                city = req.body.city;
                street = req.body.street;
                listing_price = req.body.price;
                email = req.body.subject;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 9, , 10]);
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
                        listing_name,
                        listing_price,
                        listing_description,
                        categoryId,
                        listing_image,
                        province,
                        city,
                        street,
                    ])];
            case 4:
                response_1 = _a.sent();
                return [4 /*yield*/, databasePool_1.default.query("SELECT user_id FROM  user_info WHERE email = $1", [email])];
            case 5:
                userInfoResponse = _a.sent();
                user_id = userInfoResponse.rows[0].user_id;
                listing_id = response_1.rows[0].listing_id;
                return [4 /*yield*/, databasePool_1.default.query("INSERT INTO lookup_listing_user(user_id, listing_id)VALUES($1, $2)", [user_id, listing_id])];
            case 6:
                _a.sent();
                //For our full-text-search; if user mispelt words in the search bar, we would still give them the intended word they
                //are trying to search
                //https://www.compose.com/articles/mastering-postgresql-tools-full-text-search-and-phrase-search/
                return [4 /*yield*/, databasePool_1.default.query("UPDATE listing d1  \n            SET name_tokens = to_tsvector(d1.listing_name)  \n            FROM listing d2 WHERE d1.listing_id = $1;", [listing_id])];
            case 7:
                //For our full-text-search; if user mispelt words in the search bar, we would still give them the intended word they
                //are trying to search
                //https://www.compose.com/articles/mastering-postgresql-tools-full-text-search-and-phrase-search/
                _a.sent();
                return [4 /*yield*/, databasePool_1.default.query("COMMIT")];
            case 8:
                _a.sent();
                res.send({
                    listing_id: listing_id,
                    listing_name: listing_name,
                    listing_description: listing_description,
                    category: category,
                    listing_image: listing_image,
                    province: province,
                    city: city,
                    street: street,
                    listing_price: listing_price,
                });
                return [3 /*break*/, 10];
            case 9:
                error_1 = _a.sent();
                databasePool_1.default.query("ROLLBACK");
                console.log("ROLLBACK TRIGGERED", error_1);
                return [2 /*return*/, res.sendStatus(constants_1.INTERNAL_SERVER_ERROR_STATUS)];
            case 10: return [2 /*return*/];
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
var uploadImage = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var storage, multerUploader, upload;
    return __generator(this, function (_a) {
        storage = new multer_storage_cloudinary_1.CloudinaryStorage({
            cloudinary: cloudinary,
            params: {
                folder: "kijiji",
                format: function (req, file) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/, "jpg"];
                }); }); },
            },
        });
        multerUploader = multer_1.default({ storage: storage });
        upload = multerUploader.single("image");
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
var editImage = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var storage, multerUploader, upload;
    return __generator(this, function (_a) {
        console.log("publicId", req.params.cloudinaryPublicId);
        storage = new multer_storage_cloudinary_1.CloudinaryStorage({
            cloudinary: cloudinary,
            params: {
                folder: "kijiji",
                format: function (req, file) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/, "jpg"];
                }); }); },
                public_id: function (req, file) { return req.params.cloudinaryPublicId; },
            },
        });
        multerUploader = multer_1.default({ storage: storage });
        upload = multerUploader.single("image");
        //Unable ot use async await with upload()
        //Wants 3 arguments
        upload(req, res, function (err) {
            if (err instanceof multer_1.default.MulterError) {
                console.log(err);
                return res.sendStatus(constants_1.INTERNAL_SERVER_ERROR_STATUS);
                // A Multer error occurred when uploading.
            }
            else if (err) {
                console.log(err);
                // An unknown error occurred when uploading.
                return res.sendStatus(constants_1.INTERNAL_SERVER_ERROR_STATUS);
            }
            return res.send({ cloudinaryImagePath: req.file.path });
            // Everything went fine and save document in DB here.
        });
        return [2 /*return*/];
    });
}); };
exports.editImage = editImage;
var deleteImage = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        cloudinary.uploader.destroy(
        // req.params.cloudinaryPublicId,
        "kijiji/" + req.params.cloudinaryPublicId, function (err, result) {
            if (err)
                return console.log(err);
            console.log(req.params.cloudinaryPublicId, " deleted");
            res.send(result);
        });
        return [2 /*return*/];
    });
}); };
exports.deleteImage = deleteImage;
var getCategoryId = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var category, categoryQueryResponse, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                category = req.query.category;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                if (!category) return [3 /*break*/, 3];
                return [4 /*yield*/, databasePool_1.default.query("SELECT category_id FROM category WHERE category_name = $1;", [category])];
            case 2:
                categoryQueryResponse = _a.sent();
                req.params.category_id = categoryQueryResponse.rows[0].category_id;
                _a.label = 3;
            case 3: return [3 /*break*/, 5];
            case 4:
                err_1 = _a.sent();
                console.log(err_1);
                return [2 /*return*/, res.sendStatus(constants_1.INTERNAL_SERVER_ERROR_STATUS)];
            case 5:
                next();
                return [2 /*return*/];
        }
    });
}); };
exports.getCategoryId = getCategoryId;
var getSortedListingCount = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var listing_name, category_id, province, city, countQuery, countValues, totalListingsResponse, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                listing_name = req.query.search || "";
                category_id = req.params.category_id;
                province = req.query.province || "";
                city = req.query.city || "";
                countValues = [];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                if (listing_name && category_id) {
                    //User enters filters and entered words on search bar, possibly has province and city filter
                    countQuery = "SELECT COUNT(listing_id) FROM listing WHERE name_tokens @@ plainto_tsquery($1)\n            AND category_id = $2 AND province LIKE $3 AND city LIKE $4";
                    countValues = [
                        listing_name,
                        category_id,
                        "%" + province + "%",
                        "%" + city + "%",
                    ];
                }
                else if (listing_name) {
                    //User only enters word on search bar, possibly has province and city filter
                    countQuery = "SELECT COUNT(*) FROM listing WHERE name_tokens @@ plainto_tsquery($1)\n            AND province LIKE $2 AND city LIKE $3 ";
                    countValues = [listing_name, "%" + province + "%", "%" + city + "%"];
                }
                else if (category_id) {
                    //User has category filter but enters nothing on search bar, possibly has province and city filter
                    countQuery = "SELECT COUNT(*) FROM listing WHERE category_id = $1\n            AND province LIKE $2 AND city LIKE $3";
                    countValues = [category_id, "%" + province + "%", "%" + city + "%"];
                }
                else {
                    //User has no category filter and enters nothing on search bar, possibly has province and city filter
                    countQuery = "SELECT COUNT(*) FROM listing WHERE province LIKE $1 AND city LIKE $2 ";
                    countValues = ["%" + province + "%", "%" + city + "%"];
                }
                return [4 /*yield*/, databasePool_1.default.query(countQuery, countValues)];
            case 2:
                totalListingsResponse = _a.sent();
                req.params.count = totalListingsResponse.rows[0].count;
                return [3 /*break*/, 4];
            case 3:
                err_2 = _a.sent();
                console.log(err_2);
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
var sortByHelper = function (columnName, order) {
    return function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var listing_name, category_id, province, city, page, limitPerPage, count, query, values, response_2, finalResponse, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("req.query", req.query);
                        console.log("req.params", req.params);
                        listing_name = req.query.search || "";
                        category_id = req.params.category_id;
                        province = req.query.province || "";
                        city = req.query.city || "";
                        page = parseInt(req.params.page);
                        limitPerPage = 3;
                        count = parseInt(req.params.count);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
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
                            query = "SELECT  * FROM listing WHERE name_tokens\n                @@ plainto_tsquery($1)\n                AND category_id = $2 AND province LIKE $3 AND city like $4 ORDER BY " + columnName + " " + order + "\n               LIMIT $5 OFFSET ($6 - 1) * $5";
                            values = [
                                listing_name,
                                category_id,
                                "%" + province + "%",
                                "%" + city + "%",
                                limitPerPage,
                                page,
                            ];
                        }
                        else if (listing_name) {
                            //User only enters word on search bar, possibly has province and city filter
                            // query = `SELECT * FROM listing WHERE name_tokens @@ plainto_tsquery($1) ORDER BY  ${columnName} ${order}
                            // LIMIT $2 OFFSET ($3 - 1) * $2`;
                            // values = [`%${listing_name}%`, limitPerPage, page];
                            query = "SELECT * FROM listing WHERE name_tokens @@ plainto_tsquery($1) \n                AND province LIKE $2 AND city LIKE $3 ORDER BY  " + columnName + " " + order + "\n                LIMIT $4 OFFSET ($5 - 1) * $4";
                            values = [
                                listing_name,
                                "%" + province + "%",
                                "%" + city + "%",
                                limitPerPage,
                                page,
                            ];
                        }
                        else if (category_id) {
                            //User has category filter but enters nothing on search bar, possibly has province and city filter
                            // query = `SELECT * FROM listing WHERE category_id = $1 ORDER BY  ${columnName} ${order}
                            // LIMIT $2 OFFSET ($3 - 1) * $2`;
                            // values = [category_id, limitPerPage, page];
                            query = "SELECT * FROM listing WHERE category_id = $1 AND province LIKE $2 \n                AND city LIKE $3 ORDER BY  " + columnName + " " + order + " \n                LIMIT $4 OFFSET ($5 - 1) * $4";
                            values = [
                                category_id,
                                "%" + province + "%",
                                "%" + city,
                                limitPerPage,
                                page,
                            ];
                        }
                        else {
                            //User has no category filter and enters nothing on search bar, possibly has province and city filter
                            // query = `SELECT * FROM listing ORDER BY ${columnName} ${order}
                            // LIMIT $1 OFFSET ($2 - 1) * $1`;
                            // values = [limitPerPage, page];
                            query = "SELECT * FROM listing WHERE province LIKE $1 \n                and city LIKE $2 ORDER BY " + columnName + " " + order + " \n                LIMIT $3 OFFSET ($4 - 1) * $3";
                            values = ["%" + province + "%", "%" + city, limitPerPage, page];
                        }
                        return [4 /*yield*/, databasePool_1.default.query(query, values)];
                    case 2:
                        response_2 = _a.sent();
                        finalResponse = createSortedByResponse(count, page, limitPerPage, response_2.rows);
                        res.send(finalResponse);
                        return [3 /*break*/, 4];
                    case 3:
                        err_3 = _a.sent();
                        console.log(err_3);
                        return [2 /*return*/, res.sendStatus(constants_1.INTERNAL_SERVER_ERROR_STATUS)];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
};
exports.sortByHelper = sortByHelper;
var getListingDetail = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var listingId, response_3, lookUpListingUserResponse, firstName, lastName, memberSince, email, sendObj, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                listingId = req.params.id;
                return [4 /*yield*/, databasePool_1.default.query("SELECT\n            listing_id,\n            listing_name,\n            listing_price,\n            listing_description,\n            category_name,\n            listing_image,\n            province,\n            city,\n            street,\n            listing_date\n            FROM listing NATURAL JOIN category  WHERE listing_id = $1", [listingId])];
            case 1:
                response_3 = _a.sent();
                return [4 /*yield*/, databasePool_1.default.query("SELECT * FROM lookup_listing_user NATURAL JOIN\n            user_info WHERE listing_id = $1", [listingId])];
            case 2:
                lookUpListingUserResponse = _a.sent();
                firstName = lookUpListingUserResponse.rows[0].first_name;
                lastName = lookUpListingUserResponse.rows[0].last_name;
                memberSince = lookUpListingUserResponse.rows[0].member_since;
                email = lookUpListingUserResponse.rows[0].email;
                sendObj = {};
                sendObj.first_name = firstName;
                sendObj.last_name = lastName;
                sendObj.member_since = memberSince;
                sendObj.email = email;
                res.send(__assign(__assign({}, sendObj), response_3.rows[0]));
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                console.log(error_2);
                return [2 /*return*/, res.sendStatus(constants_1.INTERNAL_SERVER_ERROR_STATUS)];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getListingDetail = getListingDetail;
var editListing = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var listing_id, listing_name, listing_description, category, listing_image, province, city, street, listing_price, categoryQuery, categoryId, response_4, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                listing_id = req.params.id;
                listing_name = req.body.title;
                listing_description = req.body.description;
                category = req.body.category;
                listing_image = req.body.cloudinaryImagePath;
                province = req.body.province;
                city = req.body.city;
                street = req.body.street;
                listing_price = req.body.price;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 7, , 8]);
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
                return [4 /*yield*/, databasePool_1.default.query(" UPDATE listing SET \n            listing_name = $1, \n            listing_price = $2, \n            listing_description = $3,\n            category_id = $4, \n            listing_image = $5, \n            province =$6,\n            city = $7, \n            street =$8\n            WHERE listing_id = $9 \n            RETURNING\n            listing_name,\n            listing_price,\n            listing_description,\n            category_id,\n            listing_image,\n            province,\n            city,\n            street;", [
                        listing_name,
                        listing_price,
                        listing_description,
                        categoryId,
                        listing_image,
                        province,
                        city,
                        street,
                        listing_id,
                    ])];
            case 4:
                response_4 = _a.sent();
                //For our full-text-search; if user mispelt words in the search bar, we would still give them the intended word they
                //are trying to search
                //https://www.compose.com/articles/mastering-postgresql-tools-full-text-search-and-phrase-search/
                return [4 /*yield*/, databasePool_1.default.query("UPDATE listing d1  \n            SET name_tokens = to_tsvector(d1.listing_name)  \n            FROM listing d2 WHERE d1.listing_id = $1;", [listing_id])];
            case 5:
                //For our full-text-search; if user mispelt words in the search bar, we would still give them the intended word they
                //are trying to search
                //https://www.compose.com/articles/mastering-postgresql-tools-full-text-search-and-phrase-search/
                _a.sent();
                return [4 /*yield*/, databasePool_1.default.query("COMMIT")];
            case 6:
                _a.sent();
                res.send(__assign({ listing_id: listing_id }, response_4.rows[0]));
                return [3 /*break*/, 8];
            case 7:
                error_3 = _a.sent();
                databasePool_1.default.query("ROLLBACK");
                console.log("ROLLBACK TRIGGERED", error_3);
                return [2 /*return*/, res.sendStatus(constants_1.INTERNAL_SERVER_ERROR_STATUS)];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.editListing = editListing;
var deleteListing = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var listing_id, response_5, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                listing_id = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 7]);
                return [4 /*yield*/, databasePool_1.default.query("BEGIN")];
            case 2:
                _a.sent();
                return [4 /*yield*/, databasePool_1.default.query("DELETE FROM lookup_listing_user WHERE listing_id = $1", [listing_id])];
            case 3:
                _a.sent();
                return [4 /*yield*/, databasePool_1.default.query("DELETE FROM listing WHERE listing_id = $1 RETURNING *", [listing_id])];
            case 4:
                response_5 = _a.sent();
                return [4 /*yield*/, databasePool_1.default.query("COMMIT")];
            case 5:
                _a.sent();
                console.log(response_5.rows[0]);
                res.send(__assign({}, response_5.rows[0]));
                return [3 /*break*/, 7];
            case 6:
                error_4 = _a.sent();
                databasePool_1.default.query("ROLLBACK");
                console.log("ROLLBACK TRIGGERED", error_4);
                return [2 /*return*/, res.sendStatus(constants_1.INTERNAL_SERVER_ERROR_STATUS)];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.deleteListing = deleteListing;
var validateListingAndUserRelationship = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var listing_id, decodedJwt, email, userResponse, response_6, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                listing_id = req.params.id;
                decodedJwt = jwt_decode_1.default(req.cookies.ACCESS_TOKEN);
                email = decodedJwt.subject;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, databasePool_1.default.query("SELECT user_id FROM user_info \n             WHERE email = $1", [email])];
            case 2:
                userResponse = _a.sent();
                return [4 /*yield*/, databasePool_1.default.query("SELECT * from lookup_listing_user\n             WHERE user_id = $1 AND listing_id = $2", [userResponse.rows[0].user_id, listing_id])];
            case 3:
                response_6 = _a.sent();
                if (!response_6.rows[0]) {
                    throw new Error("User does not own this listing");
                }
                next();
                return [3 /*break*/, 5];
            case 4:
                error_5 = _a.sent();
                console.log("ERROR", error_5);
                return [2 /*return*/, res.sendStatus(constants_1.INTERNAL_SERVER_ERROR_STATUS)];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.validateListingAndUserRelationship = validateListingAndUserRelationship;
