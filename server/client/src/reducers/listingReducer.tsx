import { ActionTypes, ListingAction } from "../actions";
import { Listing } from "../actions";
import _ from "lodash";
const listingReducer = (state: Listing[] = [], action: ListingAction) => {
    switch (action.type) {
        case ActionTypes.CREATE_LISTING:
            return { ...state, [action.payload.listing_id]: action.payload };
        case ActionTypes.LISTING_ERROR:
            return action.payload;
        case ActionTypes.FETCH_LISTINGS:
            return { ...state, data: action.payload };
        //    return { ...state, ..._.mapKeys(action.payload, "listing_id") };
        default:
            return state;
    }
};

export default listingReducer;
