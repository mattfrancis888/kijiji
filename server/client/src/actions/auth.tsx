import { ActionTypes } from "./types";
import auth from "./axiosConfig";
import { Dispatch } from "redux";
import history from "../browserHistory";
import CookieService from "../CookieService";

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

export const signUp = (formValues: any) => async (dispatch: Dispatch) => {
    try {
        const response = await auth.post<JWTType>("/signup", formValues);
        dispatch<AuthUserAction>({
            type: ActionTypes.AUTH_USER,
            payload: response.data,
        });
        history.push("/listings/1");
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
        history.push("/listings/1");
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
        history.push("/");
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

        //requireAuth HOC relies on the dispatch below
        dispatch<AuthUserAction>({
            type: ActionTypes.AUTH_USER,
            payload: response.data,
        });
    } catch (err) {
        if (retriedCalling === true) {
            // If it fails again with the new access token (might be a forged token)
            // Invalid token, kick our users out from a certain resource only accecible to signed in users
            // dispatch<AuthErrorAction>({
            //     type: ActionTypes.AUTH_ERROR,
            //     payload: "",
            // });

            //Log them out
            dispatch(signOut() as any);
        }
    }
};
