import { ActionTypes } from "./types";
import axios from "./axiosConfig";
import { Dispatch } from "redux";

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
    id: number;
    title: string;
    description: string;
    category: string;
    image: string;
    province: string;
    city: string;
    street: string;
    price: string;
}

export interface CreateListingAction {
    type: ActionTypes.CREATE_LISTING;
    payload: Listing;
}

export interface ListingErrorAction {
    type: ActionTypes.LISTING_ERROR;
    payload: [];
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

        //https://stackoverflow.com/questions/43013858/how-to-post-a-file-from-a-form-with-axios
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

        let cloudinaryImagePath = imagePathResponse.data;

        const listingResponse = await axios.post<Listing>("/create-listing", {
            ...cloudinaryImagePath,
            ...formValues,
        });
        dispatch<CreateListingAction>({
            type: ActionTypes.CREATE_LISTING,
            payload: listingResponse.data,
        });
    } catch (error) {
        dispatch<ListingErrorAction>({
            type: ActionTypes.LISTING_ERROR,
            payload: [],
        });
    }
};
