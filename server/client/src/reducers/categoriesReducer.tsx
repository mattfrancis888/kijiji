import { ActionTypes, FetchCategoriesForListing } from "../actions";

const categoriesReducer = (
    state: [] = [],
    action: FetchCategoriesForListing
) => {
    switch (action.type) {
        case ActionTypes.FETCH_CATEGORIES_FOR_LISTING:
            return action.payload;
        case ActionTypes.FETCH_CATEGORIES_FOR_LISTING_ERROR:
            return action.payload;
        default:
            return state;
    }
};

export default categoriesReducer;
