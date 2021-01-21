import { ActionTypes } from "./types";
import axios from "./axiosConfig";
import { Dispatch } from "redux";
import { SERVER_ERROR_MESSAGE } from "../constants";
import { ServerError } from "./listing";
export interface UserProfileListing {
    listing_id: number;
    listing_name: string;
    listing_price: string;
    listing_description: string;
    category_id: number;
    listing_image: string;
    province: string;
    city: string;
    street: string;
    listing_date: Date;
}

export interface UserProfile {
    user_id: number;
    first_name: string;
    last_name: string;
    member_since: string;
    listings: UserProfileListing[];
}

export interface FetchUserProfileAction {
    type: ActionTypes.FETCH_USER_PROFILE;
    payload: UserProfile;
}

export interface FetchUserProfileErrorAction {
    type: ActionTypes.FETCH_USER_PROFILE_ERROR;
    payload: ServerError;
}
export const fetchUserProfile = () => async (dispatch: Dispatch) => {
    try {
        const response = await axios.get<UserProfile>(`/profile`);
        dispatch<FetchUserProfileAction>({
            type: ActionTypes.FETCH_USER_PROFILE,
            payload: response.data,
        });
    } catch (error) {
        dispatch<FetchUserProfileErrorAction>({
            type: ActionTypes.FETCH_USER_PROFILE_ERROR,
            payload: { error: SERVER_ERROR_MESSAGE },
        });
    }
};
