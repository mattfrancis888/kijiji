import {
    AuthUserAction,
    AuthErrorAction,
    FetchCategoriesForListingAction,
    FetchCategoriesForListingErrorAction,
    UploadImageToCloudinaryAction,
    CreateListingAction,
    ListingErrorAction,
    FetchListingsAction,
    FetchListingDetailAction,
} from "../actions";
import { EditListingAction } from "./listing";
import { FetchUserProfileAction, FetchUserProfileErrorAction } from "./profile";
export enum ActionTypes {
    AUTH_USER,
    AUTH_ERROR,
    FETCH_CATEGORIES_FOR_LISTING,
    FETCH_CATEGORIES_FOR_LISTING_ERROR,
    UPLOAD_IMAGE_TO_CLOUDINARY,
    CREATE_LISTING,
    LISTING_ERROR,
    FETCH_LISTINGS,
    FETCH_LISTING_DETAIL,
    FETCH_USER_PROFILE,
    FETCH_USER_PROFILE_ERROR,
    EDIT_LISTING,
    DELETE_LISTING,
}
export type AuthActions = AuthUserAction | AuthErrorAction;
export type FetchCategoriesActions =
    | FetchCategoriesForListingAction
    | FetchCategoriesForListingErrorAction;
export type ListingAction =
    // | UploadImageToCloudinaryAction
    | CreateListingAction
    | ListingErrorAction
    | FetchListingsAction
    | FetchListingDetailAction
    | EditListingAction
    | DeleteListingAction;

export type UserProfileAction =
    | FetchUserProfileAction
    | FetchUserProfileErrorAction;
