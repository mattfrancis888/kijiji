import { ActionTypes, FetchCategoriesActions } from "../actions";

const categoryReducer = (
    state: string[] = [],
    action: FetchCategoriesActions
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

export default categoryReducer;
