import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import requireAuth from "./requireAuth";
import EditOrPostAdForm, { CHOOSE_FILES } from "./EditOrPostAdForm";
import { connect } from "react-redux";
import { StoreState } from "../reducers";
import { createListing, Listing } from "../actions/listing";
import jwt_decode from "jwt-decode";
import CookieService from "../CookieService";
import { ListingDataResponse } from "../reducers/listingReducer";
import Loading from "./Loading";

export interface EditOrPostAdFormProps {
    onSubmit(formValues: any): void;
    onDelete?(formValues: any): void;
    fetchCategoriesForListing(): void;
    initialValues?: any;
    provinceValue?: string;
    categories: string[];
    dispatch?: any;
    postAdForm?: boolean;
    listingDetail?: any;
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
                postAdForm={true}
                //Price was not being removed because of formatAmount, so we force it here
                initialValues={{
                    price: "",
                }}
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
