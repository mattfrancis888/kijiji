import { ActionTypes } from "./types";
import auth from "./axiosConfig";
import axios from "axios";
import { Dispatch } from "redux";
import history from "../browserHistory";
import CookieService from "../CookieService";

const cookieService = CookieService.getService();
export interface JWTType {
    token: string;
}
export interface AuthUserAction {
    type: ActionTypes.AUTH_USER;
    payload: JWTType;
}
export interface AuthErrorAction {
    type: ActionTypes.AUTH_ERROR;
    payload: string;
}

export interface RefetchingAccessTokenAction {
    type: ActionTypes.REFETCHING_ACCESS_TOKEN;
    payload: boolean;
}
export const signUp = (formValues: any) => async (dispatch: Dispatch) => {
    try {
        const response = await auth.post<JWTType>("/signup", formValues);
        dispatch<AuthUserAction>({
            type: ActionTypes.AUTH_USER,
            payload: response.data,
        });
        //Save token to local storage so that we could persist login state, keep user log in
        // localStorage.setItem("token", response.data.token);
        // history.push("/walkman");
    } catch (err) {
        dispatch<AuthErrorAction>({
            type: ActionTypes.AUTH_ERROR,
            payload: "- Email is in use",
        });
    }
};
export const signIn = (formValues: any) => async (dispatch: Dispatch) => {
    try {
        const response = await auth.post<JWTType>("/signin", formValues);
        dispatch<AuthUserAction>({
            type: ActionTypes.AUTH_USER,
            payload: response.data,
        });
        //Save token to local storage so that we could persist login state, keep user log in
        //localStorage.setItem("token", response.data.token);
        //history.push("/walkman");
    } catch (err) {
        // if (err.message === "Network Error") {
        //     console.log("check error", err);
        // }

        dispatch<AuthErrorAction>({
            type: ActionTypes.AUTH_ERROR,
            payload: "- Invalid login credentials",
        });
    }
};

export const signOut = () => async (dispatch: Dispatch) => {
    try {
        const response = await auth.post<JWTType>("/signout");
        dispatch<AuthUserAction>({
            type: ActionTypes.AUTH_USER,
            payload: response.data,
        });
        alert("Logged out succesfully");
    } catch (err) {
        alert("Log out failed, try again");
    }
};

export const validateToken = (path: string, retriedCalling: boolean) => async (
    dispatch: Dispatch
) => {
    try {
        const response = await auth.post<JWTType>(
            path,
            {}
            // { headers: { Authorization: cookieService.getAccessToken() } } //assigned in axios' interceptors.request
        );
        //Ensures that our current access token is the newest one; if a new access token is given,
        //we will update our current access token
        dispatch<AuthUserAction>({
            type: ActionTypes.AUTH_USER,
            payload: response.data,
        });
    } catch (err) {
        console.log("retriedCalling", retriedCalling);
        if (retriedCalling !== true) {
            //Invalid token, kick our users out from a certain resource only accecible to signed in users
            dispatch<AuthErrorAction>({
                type: ActionTypes.AUTH_ERROR,
                payload: "",
            });
        }
    }
};
