"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUp = exports.signIn = void 0;
var databasePool_1 = __importDefault(require("../databasePool"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var bcrypt_1 = __importDefault(require("bcrypt"));
var tokenForUser = function (email) {
    var timeStamp = new Date().getTime();
    //Generate a token by using user id and 'secret key'
    if (process.env.privateKey) {
        //iat- issued at  property is implemented by default
        //create token with these properties below and privatekey
        //for example, if our email variable is super long, our token might be super long
        return jsonwebtoken_1.default.sign({ subject: email, iat: timeStamp }, process.env.privateKey);
    }
};
var signIn = function (req, res) {
    //req.user exists because of the done(null, user) used in the Strategies at passport.ts
    // console.log("REQ.USER", req.user.email);
    res.send({ token: tokenForUser(req.user.email) });
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
                res.send({ token: tokenForUser(email) });
                //Respond to request indicating user was created
            });
        });
    });
};
exports.signUp = signUp;
