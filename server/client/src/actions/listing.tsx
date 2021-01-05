import { ActionTypes } from "./types";
import axios from "./axiosConfig";
import { Dispatch } from "redux";
import jwt_decode from "jwt-decode";
import CookieService from "../CookieService";

export interface FetchCategoriesForListingAction {
    type: ActionTypes.FETCH_CATEGORIES_FOR_LISTING;
    payload: [];
}

export interface FetchCategoriesForListingErrorAction {
    type: ActionTypes.FETCH_CATEGORIES_FOR_LISTING_ERROR;
    payload: [];
}

export interface CloudinaryImagePath {
    cloudinaryImagePath: string;
}
export interface UploadImageToCloudinaryAction {
    type: ActionTypes.UPLOAD_IMAGE_TO_CLOUDINARY;
    payload: CloudinaryImagePath;
}
export interface Listing {
    listing_id: number;
    listing_name: string;
    listing_description: string;
    category_id: number;
    listing_image: string;
    province: string;
    city: string;
    street: string;
    listing_price: string;
    listing_date: Date;
}

export interface FetchListingResponse {
    totalListings?: number;
    page?: number;
    limitPerPage?: number;
    listings?: Listing[];
}

export interface CreateListingAction {
    type: ActionTypes.CREATE_LISTING;
    payload: Listing;
}

export interface ListingErrorAction {
    type: ActionTypes.LISTING_ERROR;
    payload: {};
}

export interface FetchListingsAction {
    type: ActionTypes.FETCH_LISTINGS;
    payload: FetchListingResponse;
}

export const fetchCategoriesForListing = () => async (dispatch: Dispatch) => {
    try {
        const response = await axios.get<[]>("/categories-for-listing");
        dispatch<FetchCategoriesForListingAction>({
            type: ActionTypes.FETCH_CATEGORIES_FOR_LISTING,
            payload: response.data,
        });
    } catch (error) {
        dispatch<FetchCategoriesForListingErrorAction>({
            type: ActionTypes.FETCH_CATEGORIES_FOR_LISTING_ERROR,
            payload: [],
        });
    }
};

export const createListing = (formValues: any) => async (
    dispatch: Dispatch
) => {
    try {
        //Distributed transaction takes place here, if an error occurs in uploading to one of the storage systems,
        // we haven't handle it (i.e an image may be uploaded, but the data failed to be inserted; the image wouldn't be deleted)

        //Form data is used to POST a file (image in our case)
        //https://stackoverflow.com/questions/43013858/how-to-post-a-file-from-a-form-with-axios

        //We could get the cookie and decode it in node, but doing it in client looks nicer
        const cookieService = CookieService.getService();
        const jwtInfo: Object = jwt_decode(cookieService.getAccessToken());

        let cloudinaryImagePath = {};
        if (formValues.image) {
            let formData = new FormData();
            formData.append("image", formValues.image[0]);

            const imagePathResponse = await axios.post<CloudinaryImagePath>(
                "/upload-image",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            dispatch<UploadImageToCloudinaryAction>({
                type: ActionTypes.UPLOAD_IMAGE_TO_CLOUDINARY,
                payload: imagePathResponse.data,
            });

            cloudinaryImagePath = imagePathResponse.data;
        }

        const listingResponse = await axios.post<Listing>("/create-listing", {
            ...cloudinaryImagePath,
            ...formValues,
            ...jwtInfo,
        });

        dispatch<CreateListingAction>({
            type: ActionTypes.CREATE_LISTING,
            payload: listingResponse.data,
        });
    } catch (error) {
        dispatch<ListingErrorAction>({
            type: ActionTypes.LISTING_ERROR,
            payload: {},
        });
    }
};

export const fetchListingsByOldestDate = (pageNumber: number) => async (
    dispatch: Dispatch
) => {
    try {
        const response = await axios.get<FetchListingResponse>(
            `/listing-oldest-date/${pageNumber}`
        );
        dispatch<FetchListingsAction>({
            type: ActionTypes.FETCH_LISTINGS,
            payload: response.data,
        });
    } catch (error) {
        dispatch<ListingErrorAction>({
            type: ActionTypes.LISTING_ERROR,
            payload: {},
        });
    }
};

export const fetchListingsByNewestDate = (pageNumber: number) => async (
    dispatch: Dispatch
) => {
    try {
        const response = await axios.get<FetchListingResponse>(
            `/listing-newest-date/${pageNumber}`
        );
        dispatch<FetchListingsAction>({
            type: ActionTypes.FETCH_LISTINGS,
            payload: response.data,
        });
    } catch (error) {
        dispatch<ListingErrorAction>({
            type: ActionTypes.LISTING_ERROR,
            payload: {},
        });
    }
};

export const fetchListingsByLowestPrice = (pageNumber: number) => async (
    dispatch: Dispatch
) => {
    try {
        const response = await axios.get<FetchListingResponse>(
            `/listing-lowest-price/${pageNumber}`
        );
        dispatch<FetchListingsAction>({
            type: ActionTypes.FETCH_LISTINGS,
            payload: response.data,
        });
    } catch (error) {
        dispatch<ListingErrorAction>({
            type: ActionTypes.LISTING_ERROR,
            payload: {},
        });
    }
};

export const fetchListingsByHighestPrice = (pageNumber: number) => async (
    dispatch: Dispatch
) => {
    try {
        const response = await axios.get<FetchListingResponse>(
            `/listing-highest-price/${pageNumber}`
        );
        dispatch<FetchListingsAction>({
            type: ActionTypes.FETCH_LISTINGS,
            payload: response.data,
        });
    } catch (error) {
        dispatch<ListingErrorAction>({
            type: ActionTypes.LISTING_ERROR,
            payload: {},
        });
    }
};
