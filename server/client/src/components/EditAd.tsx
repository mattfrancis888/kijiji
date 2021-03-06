import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import requireAuth from "./requireAuth";
import EditOrPostAdForm, {
    CHOOSE_FILES,
    EditOrPostAdFormValues,
} from "./EditOrPostAdForm";
import { connect } from "react-redux";
import { StoreState } from "../reducers";
import jwt_decode from "jwt-decode";
import CookieService from "../CookieService";
import {
    deleteListing,
    editListing,
    validateUserAndGetListingDetail,
} from "../actions/listing";
import { ListingDataResponse } from "../reducers/listingReducer";
import Loading from "./Loading";

import { ListingDetail as ListingDetailType } from "../actions";

export interface EditAdProps {
    fetchListingDetail(listingId: string): void;
    editListing(
        formValues: any,
        listingId: string,
        cloudinaryPublicId: string | null,
        existingCloudinaryImagePath: string | null
    ): void;
    deleteListing(listingId: string, cloudinaryPublicId: string | null): void;
    validateUserAndGetListingDetail(listingId: string): void;
    match: any;
    listingDetail: ListingDetailType;
}

const EditAd: React.FC<EditAdProps> = (props) => {
    useEffect(() => {
        //We should validate if the listing actualy belongs to the user
        props.validateUserAndGetListingDetail(props.match.params.id);
    }, []);

    const renderContent = () => {
        if (!props.listingDetail) {
            return (
                <div className="loadingCenter">
                    <Loading />
                </div>
            );
        }
        // //too lazy to fix ts error, but I get the idea
        //@ts-ignore
        else if (props.listingDetail.error) {
            return (
                <div className="serverErrorContainer">
                    <h3 className="serverErrorText">
                        {
                            //@ts-ignore
                            props.listingDetail.error
                        }
                    </h3>
                </div>
            );
        } else {
            const {
                listing_name,
                listing_description,
                category_name,
                listing_image,
                province,
                city,
                street,
                listing_price,
            } = props.listingDetail;
            let previewImageVal = listing_image ? null : CHOOSE_FILES;
            return (
                <div className="editAdPageContainer">
                    <h1>Edit Your Ad</h1>
                    <EditOrPostAdForm
                        onSubmit={(formValues: any) =>
                            onEditListing(formValues)
                        }
                        onDelete={onDeleteListing}
                        initialValues={{
                            title: listing_name,
                            description: listing_description,
                            category: category_name,
                            province,
                            city,
                            street,
                            price: listing_price,
                            imagePreview: previewImageVal,
                        }}
                        postAdForm={false}
                    />
                </div>
            );
        }
    };

    const onEditListing = async (formValues: EditOrPostAdFormValues) => {
        console.log("editAds", formValues);

        if (props.listingDetail.listing_image) {
            let cloudinaryPaths = props.listingDetail.listing_image.split("/");
            let cloudinaryLastPath = cloudinaryPaths.pop();
            //@ts-ignore, catch block will catch it at editListing, dont worry
            let cloudinaryPublicId = cloudinaryLastPath.split(".")[0];

            if (formValues.image) {
                //Replace existing picture with new picture
                props.editListing(
                    formValues,
                    props.match.params.id,
                    cloudinaryPublicId,
                    null
                );
            } else {
                if (formValues.imagePreview === CHOOSE_FILES) {
                    //user removed picture.
                    //Replace existing picture with nothing
                    props.editListing(
                        formValues,
                        props.match.params.id,
                        cloudinaryPublicId,
                        null
                    );
                } else {
                    //If user has an existing image already, but they did not modify  <input type="file"/>
                    //formValue.image will be empty. So we are going to prevent the user from
                    //updating an the list with an empty image by using the cloudinary image link

                    //props.istingDetail.listing_image represents the  cloudinary image link
                    props.editListing(
                        formValues,
                        props.match.params.id,
                        cloudinaryPublicId,
                        props.listingDetail.listing_image
                    );
                }
            }
        } else {
            //If listing does not have initial cloudinary image link (because they made a listing without a picture beforehand
            //or they removed their picture and want to edit their listing picture again)
            //Upload cloudinary image

            props.editListing(formValues, props.match.params.id, null, null);
        }
    };

    const onDeleteListing = () => {
        if (props.listingDetail.listing_image) {
            let cloudinaryPaths = props.listingDetail.listing_image.split("/");
            let cloudinaryLastPath = cloudinaryPaths.pop();
            //@ts-ignore
            let cloudinaryPublicId = cloudinaryLastPath.split(".")[0];
            props.deleteListing(props.match.params.id, cloudinaryPublicId);
        } else {
            props.deleteListing(props.match.params.id, null);
        }
    };

    return renderContent();
};

const mapStateToProps = (state: StoreState) => {
    return {
        listingDetail: state.listingInfo.data,
    };
};

export default connect(mapStateToProps, {
    validateUserAndGetListingDetail,
    deleteListing,
    editListing,
})(requireAuth(EditAd));
