import axios from "axios";
import { refreshToken } from "../../../backend/build/controllers/authentication";
//Used for onine JSON-store database

import CookieService from "../CookieService";

const auth = axios.create({
    // .. where we make our configurations
    withCredentials: true, //Without it cookies will not be sent! Also, needs to be first in axios.create(..)!!
    //As mentioned in:
    //https://stackoverflow.com/questions/43002444/make-axios-send-cookies-in-its-requests-automatically
    baseURL: "http://localhost:5000/",
});

const cookieService = CookieService.getService();

// //Contains the info of your request data
// auth.interceptors.request.use(
//     (config) => {
//         console.log("INTERCEPTOR REQ", config);

//         // const token = cookieService.getAccessToken();
//         config.headers["Authorization"] = "hello matt";
//         // if (token) {
//         //     config.headers["Authorization"] = token;
//         // }
//         //config.headers["Content-Type"] = "application/json";
//         return config;
//     },
//     (error) => {
//         console.log("INTERCEPTOR REQ  - ERROR", error);
//         Promise.reject(error);
//     }
// );

//Axios calls response interceptors after it sends the request and receives a response.
auth.interceptors.response.use(
    //If we have a response from our recent http call
    (response) => {
        console.log("INTERCEPTOR RES - RESPONSE", response);
        console.log("REF TOKEN", response.data.refreshToken);
        return response;
    },
    (error) => {
        //Catches 403 error rom our axios request
        console.log("INTERCEPTOR RES - ERROR", error);
        // throw error; //Throw error to action creator so it can be caught

        // if (error.response.status === 403 && !originalRequest._retry) {
        //     originalRequest._retry = true;
        //     return axios
        //         .post(
        //             "/token",
        //             {},
        //             {
        //                 headers: {
        //                     Authorization: cookieService.getRefreshToken(),
        //                 },
        //             }
        //         )
        //         .then((res) => {
        //             if (res.status === 201) {
        //                 // 1) put token to cookies
        //                 cookieService.setToken(res.data);

        //                 // 2) Change Authorization header to access token
        //                 axios.defaults.headers.common[
        //                     "Authorization"
        //                 ] = cookieService.getAccessToken();

        //                 // 3) return originalRequest object with Axios.
        //                 return axios(originalRequest);
        //             }
        //         });
        // }
    }
);

export default auth;
