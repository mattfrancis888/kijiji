import { ActionTypes } from "./types";
import axios from "./axiosConfig";
import { Dispatch } from "redux";

export interface FetchCategoriesForListing {
    type: ActionTypes.FETCH_CATEGORIES_FOR_LISTING;
    payload: [];
}

export const fetchCategoriesForListing = () => async (dispatch: Dispatch) => {
    const response = await axios.get<[]>("/categories-for-listing");
    dispatch<FetchCategoriesForListing>({
        type: ActionTypes.FETCH_CATEGORIES_FOR_LISTING,
        payload: response.data,
    });
};
