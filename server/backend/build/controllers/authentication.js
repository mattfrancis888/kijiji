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
exports.signUp = exports.signIn = exports.refreshToken = void 0;
var databasePool_1 = __importDefault(require("../databasePool"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var bcrypt_1 = __importDefault(require("bcrypt"));
var generateAccessToken = function (email) {
    if (process.env.privateKey) {
        var timeStamp = new Date().getTime();
        //Generate a token by using user email  and 'secret key'
        //iat- issued at  property is implemented by default
        //create token with these properties below and privatekey
        //for example, if our email variable is super long, our token might be super long
        return jsonwebtoken_1.default.sign({ subject: email }, process.env.privateKey, {
            expiresIn: "15s",
        });
    }
};
var generateRefreshToken = function (email) {
    if (process.env.privateKey) {
        var timeStamp = new Date().getTime();
        //Generate a refresh token by using user email and 'secret key'
        return jsonwebtoken_1.default.sign({ subject: email }, process.env.privateKey);
    }
};
var refreshToken = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var FORBIDDEN_STATUS, refreshToken_1, user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                FORBIDDEN_STATUS = 403;
                if (!process.env.privateKey) return [3 /*break*/, 2];
                refreshToken_1 = req.headers["authorization"];
                if (refreshToken_1 === null)
                    return [2 /*return*/, res.sendStatus(401)];
                return [4 /*yield*/, authenticateToken(refreshToken_1, process.env.privateKey)];
            case 1:
                user = _a.sent();
                if (user === null) {
                    return [2 /*return*/, res.sendStatus(FORBIDDEN_STATUS)];
                }
                //Check if token is in database
                databasePool_1.default.query("SELECT email, refresh_token FROM auth WHERE refresh_token = '" + refreshToken_1 + "'", function (error, user) {
                    if (error)
                        return console.log(error);
                    if (user.rowCount === 0) {
                        return res.sendStatus(FORBIDDEN_STATUS);
                    }
                    //If the refresh token matches the one in our database
                    //Generate a new acces token for the user to use
                    res.send({ token: generateAccessToken(user.rows[0].email) });
                });
                return [3 /*break*/, 3];
            case 2:
                res.send(FORBIDDEN_STATUS);
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.refreshToken = refreshToken;
var authenticateToken = function (token, secret) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        //Checks if token is still valid / has not expired
        try {
            result = jsonwebtoken_1.default.verify(token, secret);
            return [2 /*return*/, { email: result.email }];
        }
        catch (_b) {
            return [2 /*return*/, null];
        }
        return [2 /*return*/];
    });
}); };
var signIn = function (req, res) {
    //req.user exists because of the done(null, user) used in the Strategies at passport.ts
    // console.log("REQ.USER", req.user.email);
    var refreshToken = generateRefreshToken(req.user.email);
    // Update Refresh token to database
    databasePool_1.default.query("UPDATE auth\n        SET refresh_token = '" + refreshToken + "' WHERE email = '" + req.user.email + "'", function (error, response) {
        if (error)
            return console.log(error);
        res.send({
            token: generateAccessToken(req.user.email),
            refreshToken: refreshToken,
        });
    });
};
exports.signIn = signIn;
var signUp = function (req, res, next) {
    //If user with given email exists
    var email = req.body.email;
    var password = req.body.password;
    var UNPROCESSABLE_ENTITY_STATUS = 422;
    //Email or password not given
    if (!email || !password) {
        return res
            .status(UNPROCESSABLE_ENTITY_STATUS)
            .send({ error: "Email and password must be provided" });
    }
    //If email already exist, return an error
    databasePool_1.default.query("SELECT * from auth WHERE email = '" + email + "'", function (error, response) {
        if (error)
            return console.log(error);
        //User already exist
        if (response.rows.length > 0) {
            //422 is UNPROCESSABLE_ETITY; data user gave was "bad/unproceesssed"
            return res
                .status(UNPROCESSABLE_ENTITY_STATUS)
                .send({ error: "Email in use" });
        }
        //If a user with email does NOT exist
        var saltRounds = 10;
        bcrypt_1.default.hash(password, saltRounds, function (err, hash) {
            // Now we can store the password hash in db.
            if (err) {
                return next(err);
            }
            console.log(hash);
            //Override current text password with hash
            var hashedPassword = hash;
            databasePool_1.default.query("INSERT INTO auth(email, password, refresh_token)VALUES('" + email + "', '" + hashedPassword + "', 'abcdefg')", function (error, response) {
                if (error)
                    return next(error);
                //Generate a token when user signs in, this token will be used so that they can access protected routes
                res.send({ token: generateAccessToken(email) });
                //Respond to request indicating user was created
            });
        });
    });
};
exports.signUp = signUp;
