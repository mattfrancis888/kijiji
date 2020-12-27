import {
    AuthUserAction,
    AuthErrorAction,
    FetchCategoriesForListingAction,
    FetchCategoriesForListingErrorAction,
} from "../actions";
export enum ActionTypes {
    AUTH_USER,
    AUTH_ERROR,
    FETCH_CATEGORIES_FOR_LISTING,
    FETCH_CATEGORIES_FOR_LISTING_ERROR,
}
export type AuthActions = AuthUserAction | AuthErrorAction;
export type FetchCategoriesActions =
    | FetchCategoriesForListingAction
    | FetchCategoriesForListingErrorAction;
