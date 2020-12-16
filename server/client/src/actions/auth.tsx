import { ActionTypes } from "./types";
import auth from "./axiosConfig";
import axios from "axios";
import { Dispatch } from "redux";
import history from "../browserHistory";
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
