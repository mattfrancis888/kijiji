import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import requireAuth from "./requireAuth";
import EditOrPostAdForm, { EditOrPostAdFormValues } from "./EditOrPostAdForm";
import { connect } from "react-redux";
import { StoreState } from "../reducers";
import jwt_decode from "jwt-decode";
import CookieService from "../CookieService";
import { editListing } from "../actions/listing";
import { ListingDataResponse } from "../reducers/listingReducer";
import Loading from "./Loading";

import {
    ListingDetail as ListingDetailType,
    fetchListingDetail,
    ServerError,
} from "../actions";

export interface EditAdProps {
    fetchListingDetail(listingId: string): void;
    editListing(
        formValues: any,
        listingId: string,
        cloudinaryPublicId: string
    ): void;
    match: any;
    listingDetail: ListingDetailType;
}

const EditAd: React.FC<EditAdProps> = (props) => {
    const renderContent = () => {
        if (!props.listingDetail) {
            return (
                <div className="loadingCenter">
                    <Loading />
                </div>
            );
            // //too lazy to fix ts error, but I get the idea
        } else if (props.listingDetail.error) {
            return (
                <div className="serverErrorContainer">
                    <h3 className="serverErrorText">
                        {props.listingDetail.error}
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

            return (
                <div className="editAdPageContainer">
                    <h1>Edit Your Ad</h1>
                    <EditOrPostAdForm
                        onSubmit={onEditListing}
                        initialValues={{
                            title: listing_name,
                            description: listing_description,
                            category: category_name,
                            province,
                            city,
                            street,
                            price: listing_price,
                        }}
                        cloudinaryImage={listing_image}
                    />
                </div>
            );
        }
    };

    useEffect(() => {
        props.fetchListingDetail(props.match.params.id);
    }, []);

    const onEditListing = async (formValues: EditOrPostAdFormValues) => {
        console.log("editAds", formValues);
        //TODO:
        //1. User wants to remove listing image
        //2. Database will return null value if user removes lsting image, handle error here
        if (props.listingDetail.listing_image && formValues.image) {
            let cloudinaryPaths = props.listingDetail.listing_image.split("/");
            let cloudinaryLastPath = cloudinaryPaths.pop();
            let cloudinaryPublicId = cloudinaryLastPath.split(".")[0];
            console.log("cloudinaryPublicId", cloudinaryPublicId);
            props.editListing(
                formValues,
                props.match.params.id,
                cloudinaryPublicId
            );
        } else {
            //If listing does not have initial cloudinary image link (because they made a listing without a picture beforehand
            //or they removed their picture and want to edit their listing picture again)
            //Upload cloudinary image
            props.editListing(formValues, props.match.params.id, null);
        }
    };
    return renderContent();
};

const mapStateToProps = (state: StoreState) => {
    return {
        listingDetail: state.listingInfo.data,
    };
};

export default connect(mapStateToProps, { editListing, fetchListingDetail })(
    EditAd
);
