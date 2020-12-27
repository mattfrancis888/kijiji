import { ActionTypes } from "./types";
import axios from "./axiosConfig";
import { Dispatch } from "redux";

export interface FetchCategoriesForListingAction {
    type: ActionTypes.FETCH_CATEGORIES_FOR_LISTING;
    payload: [];
}

export interface FetchCategoriesForListingErrorAction {
    type: ActionTypes.FETCH_CATEGORIES_FOR_LISTING;
    payload: [];
}

export const fetchCategoriesForListing = () => async (dispatch: Dispatch) => {
    try {
        const response = await axios.get<[]>("/categories-for-listing");
        dispatch<FetchCategoriesForListingAction>({
            type: ActionTypes.FETCH_CATEGORIES_FOR_LISTING,
            payload: response.data,
        });
    } catch (error) {
        dispatch<FetchCategoriesForListingErrorAction>({
            type: ActionTypes.FETCH_CATEGORIES_FOR_LISTING,
            payload: [],
        });
    }
};
