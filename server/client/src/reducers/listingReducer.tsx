import { ActionTypes, ListingAction } from "../actions";
import { Listing, FetchListingResponse, ListingDetail } from "../actions";
import _ from "lodash";

export interface DataResponse {
    data?: FetchListingResponse | ListingDetail;
}

const listingReducer = (state: DataResponse = {}, action: ListingAction) => {
    switch (action.type) {
        case ActionTypes.CREATE_LISTING:
            return { ...state, data: action.payload };
        case ActionTypes.LISTING_ERROR:
            return action.payload;
        case ActionTypes.FETCH_LISTINGS:
            return { ...state, data: action.payload };
        //    return { ...state, ..._.mapKeys(action.payload, "listing_id") };
        case ActionTypes.FETCH_LISTING_DETAIL:
            return { ...state, data: action.payload };
        default:
            return state;
    }
};

export default listingReducer;
