import { ActionTypes } from "./types";
import axios from "./axiosConfig";
import { Dispatch } from "redux";
import jwt_decode from "jwt-decode";
import CookieService from "../CookieService";
import { SERVER_ERROR_MESSAGE } from "../constants";
import history from "../browserHistory";
export interface FetchCategoriesForListingAction {
    type: ActionTypes.FETCH_CATEGORIES_FOR_LISTING;
    payload: [];
}

export interface FetchCategoriesForListingErrorAction {
    type: ActionTypes.FETCH_CATEGORIES_FOR_LISTING_ERROR;
    payload: [string];
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

export interface DeletedListing {
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
    name_tokens: string;
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
    payload: { error: string };
}

export interface FetchListingsAction {
    type: ActionTypes.FETCH_LISTINGS;
    payload: FetchListingResponse;
}

export interface ListingDetail {
    first_name: string;
    last_name: string;
    member_since: Date;
    email: string;
    listing_id: string;
    listing_name: string;
    listing_price: number;
    listing_description: string;
    category_name: string;
    listing_image: string;
    province: string;
    city: string;
    street: string;
    listing_date: Date;
}

export interface FetchListingDetailAction {
    type: ActionTypes.FETCH_LISTING_DETAIL;
    payload: ListingDetail;
}

export interface EditListingAction {
    type: ActionTypes.EDIT_LISTING;
    payload: Listing;
}

export interface CloudinaryImageDelete {
    result: string;
}

export interface DeleteListingAction {
    type: ActionTypes.DELETE_LISTING;
    payload: DeletedListing;
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
            payload: [SERVER_ERROR_MESSAGE],
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
            //Youd ont need to dispatch again
            //But I included it in case we handle errors when failing to
            //upload to cloudinary or the database so we 'backtrack'

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
        history.push("/profile");
    } catch (error) {
        alert(SERVER_ERROR_MESSAGE);
        dispatch<ListingErrorAction>({
            type: ActionTypes.LISTING_ERROR,
            payload: { error: SERVER_ERROR_MESSAGE },
        });
    }
};

export const fetchListingsByOldestDate = (
    pageNumber: number,
    queryPath: string
) => async (dispatch: Dispatch) => {
    try {
        const response = await axios.get<FetchListingResponse>(
            `/listing-oldest-date/${pageNumber}${queryPath}`
        );
        dispatch<FetchListingsAction>({
            type: ActionTypes.FETCH_LISTINGS,
            payload: response.data,
        });
    } catch (error) {
        dispatch<ListingErrorAction>({
            type: ActionTypes.LISTING_ERROR,
            payload: { error: SERVER_ERROR_MESSAGE },
        });
    }
};

export const fetchListingsByNewestDate = (
    pageNumber: number,
    queryPath: string
) => async (dispatch: Dispatch) => {
    try {
        const response = await axios.get<FetchListingResponse>(
            `/listing-newest-date/${pageNumber}${queryPath}`
        );
        dispatch<FetchListingsAction>({
            type: ActionTypes.FETCH_LISTINGS,
            payload: response.data,
        });
    } catch (error) {
        dispatch<ListingErrorAction>({
            type: ActionTypes.LISTING_ERROR,
            payload: { error: SERVER_ERROR_MESSAGE },
        });
    }
};

export const fetchListingsByLowestPrice = (
    pageNumber: number,
    queryPath: string
) => async (dispatch: Dispatch) => {
    try {
        const response = await axios.get<FetchListingResponse>(
            `/listing-lowest-price/${pageNumber}${queryPath}`
        );
        dispatch<FetchListingsAction>({
            type: ActionTypes.FETCH_LISTINGS,
            payload: response.data,
        });
    } catch (error) {
        dispatch<ListingErrorAction>({
            type: ActionTypes.LISTING_ERROR,
            payload: { error: SERVER_ERROR_MESSAGE },
        });
    }
};

export const fetchListingsByHighestPrice = (
    pageNumber: number,
    queryPath: string
) => async (dispatch: Dispatch) => {
    try {
        const response = await axios.get<FetchListingResponse>(
            `/listing-highest-price/${pageNumber}${queryPath}`
        );
        dispatch<FetchListingsAction>({
            type: ActionTypes.FETCH_LISTINGS,
            payload: response.data,
        });
    } catch (error) {
        dispatch<ListingErrorAction>({
            type: ActionTypes.LISTING_ERROR,
            payload: { error: SERVER_ERROR_MESSAGE },
        });
    }
};

export const fetchListingDetail = (listingId: string) => async (
    dispatch: Dispatch
) => {
    try {
        const response = await axios.get<ListingDetail>(
            `/listing/${listingId}`
        );
        dispatch<FetchListingDetailAction>({
            type: ActionTypes.FETCH_LISTING_DETAIL,
            payload: response.data,
        });
    } catch (error) {
        dispatch<ListingErrorAction>({
            type: ActionTypes.LISTING_ERROR,
            payload: { error: SERVER_ERROR_MESSAGE },
        });
    }
};

export const editListing = (
    formValues: any,
    listingId: string,
    cloudinaryPublicId: string | null
) => async (dispatch: Dispatch) => {
    try {
        //Distributed transaction takes place here, if an error occurs in uploading to one of the storage systems,
        // we haven't handle it (i.e an image may be uploaded, but the data failed to be inserted; the image wouldn't be deleted)

        //Form data is used to POST a file (image in our case)
        //https://stackoverflow.com/questions/43013858/how-to-post-a-file-from-a-form-with-axios

        let cloudinaryImagePath = {};
        if (
            formValues.image instanceof FileList &&
            cloudinaryPublicId != null
        ) {
            //A cloudinary image already exists, ovveride current cloudinary image
            let formData = new FormData();
            formData.append("image", formValues.image[0]);
            //overrides current image with the current publicid
            const imagePathResponse = await axios.put<CloudinaryImagePath>(
                `/edit-image/${cloudinaryPublicId}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            cloudinaryImagePath = imagePathResponse.data;
        } else if (
            formValues.image instanceof FileList &&
            cloudinaryPublicId === null
        ) {
            //cloudinary image does not exist because user did not create a listing with an image or
            //has removed an image in their lisitng

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

            cloudinaryImagePath = imagePathResponse.data;
        } else if (formValues.image === null) {
            //User wants to remove image
            await axios.delete<CloudinaryImageDelete>(
                `/delete-image/${cloudinaryPublicId}`
            );
        }

        const listingResponse = await axios.patch<Listing>(
            `/listing/${listingId}/edit`,
            {
                ...cloudinaryImagePath,
                ...formValues,
            }
        );

        dispatch<EditListingAction>({
            type: ActionTypes.EDIT_LISTING,
            payload: listingResponse.data,
        });
        //history.push(`/listing/${listingId}`);
    } catch (error) {
        alert(SERVER_ERROR_MESSAGE);
        dispatch<ListingErrorAction>({
            type: ActionTypes.LISTING_ERROR,
            payload: { error: SERVER_ERROR_MESSAGE },
        });
    }
};

export const deleteListing = (
    listingId: string,
    cloudinaryPublicId: string | null
) => async (dispatch: Dispatch) => {
    try {
        //Delete data from database:
        const response = await axios.delete<DeletedListing>(
            `/listing/${listingId}/delete`
        );
        dispatch<DeleteListingAction>({
            type: ActionTypes.DELETE_LISTING,
            payload: response.data,
        });
        if (cloudinaryPublicId) {
            await axios.delete<CloudinaryImageDelete>(
                `/delete-image/${cloudinaryPublicId}`
            );
        }

        history.push("/profile");
    } catch (error) {
        dispatch<ListingErrorAction>({
            type: ActionTypes.LISTING_ERROR,
            payload: { error: SERVER_ERROR_MESSAGE },
        });
    }
};
