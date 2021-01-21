import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import requireAuth from "./requireAuth";
import EditOrPostAdForm from "./EditOrPostAdForm";
import { connect } from "react-redux";
import { StoreState } from "../reducers";
import { createListing, Listing } from "../actions/listing";
import jwt_decode from "jwt-decode";
import CookieService from "../CookieService";
import { ListingDataResponse } from "../reducers/listingReducer";
import Loading from "./Loading";

export interface EditOrPostAdFormProps {
    onSubmit(formValues: any): void;
    onDelete(formValues: any): void;
    fetchCategoriesForListing(): void;
    initialValues: Object;
    provinceValue: string;
    categories: string[];
    dispatch: any;
    cloudinaryImage: string;
}

export interface PostAdProps {
    createListing(formValues: any): void;
    listingInfo: ListingDataResponse;
}

const PostAd: React.FC<PostAdProps> = (props) => {
    // useEffect(() => {
    //     const cookieService = CookieService.getService();
    //     console.log("JWT DECODE", jwt_decode(cookieService.getAccessToken()));
    // }, []);
    const onSubmitPostListing = async (formValues: any) => {
        props.createListing(formValues);
    };
    return (
        <div className="postAdPageContainer">
            <h1>Post Your Ad, it's fast and easy</h1>
            <EditOrPostAdForm
                onSubmit={onSubmitPostListing}
                // initialValues={{
                //     title: "bye",
                //     image: "",
                // }}
            />
        </div>
    );
};

const mapStateToProps = (state: StoreState) => {
    return {
        listingInfo: state.listingInfo,
    };
};

export default connect(mapStateToProps, { createListing })(requireAuth(PostAd));
