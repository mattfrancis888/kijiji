import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import requireAuth from "./requireAuth";
import EditOrPostAdForm from "./EditOrPostAdForm";
import { connect } from "react-redux";
import { StoreState } from "../reducers";
import jwt_decode from "jwt-decode";
import CookieService from "../CookieService";
import { ListingDataResponse } from "../reducers/listingReducer";
import Loading from "./Loading";

import {
    ListingDetail as ListingDetailType,
    fetchListingDetail,
    ServerError,
} from "../actions";

export interface EditAdProps {
    fetchListingDetail(listingId: string): void;
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
            console.log(props.listingDetail);
            return (
                <div className="editAdPageContainer">
                    <h1>Edit Your Ad</h1>
                    <EditOrPostAdForm
                        onSubmit={onSubmitPostListing}
                        initialValues={{
                            title: listing_name,
                            description: listing_description,
                            category: category_name,
                            image: listing_image,
                            province,
                            city,
                            street,
                            price: listing_price,
                        }}
                    />
                </div>
            );
        }
    };

    useEffect(() => {
        props.fetchListingDetail(props.match.params.id);
    }, []);
    const onSubmitPostListing = async (formValues: any) => {
        //  props.createListing(formValues);
    };
    return renderContent();
};

const mapStateToProps = (state: StoreState) => {
    return {
        listingDetail: state.listingInfo.data,
    };
};

export default connect(mapStateToProps, { fetchListingDetail })(
    requireAuth(EditAd)
);
