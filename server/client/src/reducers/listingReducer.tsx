import { ActionTypes, ListingAction } from "../actions";
import { Listing } from "../actions";
const listingReducer = (state: Listing[] = [], action: ListingAction) => {
    switch (action.type) {
        case ActionTypes.CREATE_LISTING:
            return { ...state, [action.payload.id]: action.payload };
        case ActionTypes.LISTING_ERROR:
            return action.payload;
        default:
            return state;
    }
};

export default listingReducer;
