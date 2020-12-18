import axios from "axios";
//Used for onine JSON-store database

import CookieService from "../CookieService";

const auth = axios.create({
    // .. where we make our configurations
    withCredentials: true, //Without it cookies will not be sent! Also, needs to be first in axios.create(..)!!
    //As mentioned in:
    //https://stackoverflow.com/questions/43002444/make-axios-send-cookies-in-its-requests-automatically
    baseURL: "http://localhost:5000/",
});

// const cookieService = CookieService.getService();

// //Contains the info of your request data
// auth.interceptors.request.use(
//     (config) => {
//         console.log("INTERCEPTOR REQ");
//         const token = cookieService.getAccessToken();
//         if (token) {
//             config.headers["Authorization"] = token;
//         }
//         //config.headers["Content-Type"] = "application/json";
//         return config;
//     },
//     (error) => {
//         console.log("INTERCEPTOR REQ  - ERROR", error);
//         Promise.reject(error);
//     }
// );

// auth.interceptors.response.use(
//     //If we have a response from our recent http call
//     (response) => {
//         console.log("INTERCEPTOR RES - RESPONSE", response);
//         return response;
//     },
//     (error) => {
//         console.log("INTERCEPTOR RES - ERROR", error);
//         const originalRequest = error.config;
//         if (error.response.status === 403 && !originalRequest._retry) {
//             originalRequest._retry = true;
//             return axios
//                 .post(
//                     "/token",
//                     {},
//                     {
//                         headers: {
//                             Authorization: cookieService.getRefreshToken(),
//                         },
//                     }
//                 )
//                 .then((res) => {
//                     if (res.status === 201) {
//                         // 1) put token to cookies
//                         cookieService.setToken(res.data);

//                         // 2) Change Authorization header to access token
//                         axios.defaults.headers.common[
//                             "Authorization"
//                         ] = cookieService.getAccessToken();

//                         // 3) return originalRequest object with Axios.
//                         return axios(originalRequest);
//                     }
//                 });
//         }
//     }
// );

export default auth;
