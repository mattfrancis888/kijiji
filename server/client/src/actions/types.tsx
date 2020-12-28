import {
    AuthUserAction,
    AuthErrorAction,
    FetchCategoriesForListingAction,
    FetchCategoriesForListingErrorAction,
    UploadImageToCloudinaryAction,
    CreateListingAction,
    ListingErrorAction,
} from "../actions";
export enum ActionTypes {
    AUTH_USER,
    AUTH_ERROR,
    FETCH_CATEGORIES_FOR_LISTING,
    FETCH_CATEGORIES_FOR_LISTING_ERROR,
    UPLOAD_IMAGE_TO_CLOUDINARY,
    CREATE_LISTING,
    LISTING_ERROR,
}
export type AuthActions = AuthUserAction | AuthErrorAction;
export type FetchCategoriesActions =
    | FetchCategoriesForListingAction
    | FetchCategoriesForListingErrorAction;
export type ListingAction =
    // | UploadImageToCloudinaryAction
    CreateListingAction | ListingErrorAction;
