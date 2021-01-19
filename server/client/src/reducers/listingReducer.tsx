import { ActionTypes, ListingAction, ServerError } from "../actions";
import { Listing, FetchListingResponse, ListingDetail } from "../actions";
import _ from "lodash";

export interface ListingDataResponse {
    data?: FetchListingResponse | ListingDetail | ServerError;
}

const listingReducer = (
    state: ListingDataResponse = {},
    action: ListingAction
) => {
    switch (action.type) {
        case ActionTypes.CREATE_LISTING:
            return { ...state, data: action.payload };
        case ActionTypes.LISTING_ERROR:
            return { ...state, data: action.payload };
        case ActionTypes.FETCH_LISTINGS:
            return { ...state, data: action.payload };
        //    return { ...state, ..._.mapKeys(action.payload, "listing_id") };
        case ActionTypes.FETCH_LISTING_DETAIL:
            return { ...state, data: action.payload };
        case ActionTypes.EDIT_LISTING:
            return { ...state, data: action.payload };
        case ActionTypes.DELETE_LISTING:
            // return _.omit(state, action.payload);
            //Since we are re direcitng user that uses a different
            //reducer, it dosent matter what we return
            return { ...state, data: action.payload };
        default:
            return state;
    }
};

export default listingReducer;
