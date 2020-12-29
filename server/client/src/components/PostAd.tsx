import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import requireAuth from "./requireAuth";
import PostAdForm from "./PostAdForm";
import { connect } from "react-redux";
import { StoreState } from "../reducers";
import { createListing, Listing } from "../actions/listing";
import jwt_decode from "jwt-decode";
import CookieService from "../CookieService";

export interface PostAdFormProps {
    onSubmit(formValues: any): void;
    fetchCategoriesForListing(): void;
    provinceValue: string;
    categories: [];
}

export interface PostAdProps {
    createListing(formValues: any): void;
    listings: Listing[];
}

const PostAd: React.FC<PostAdProps> = (props) => {
    useEffect(() => {
        const cookieService = CookieService.getService();
        console.log("JWT DECODE", jwt_decode(cookieService.getAccessToken()));
    }, []);
    const onSubmitPostListing = async (formValues: any) => {
        props.createListing(formValues);
    };

    return (
        <div className="postAdPageContainer">
            <h1>Post Your Ad, it's fast and easy</h1>
            <PostAdForm onSubmit={onSubmitPostListing} />
        </div>
    );
};

const mapStateToProps = (state: StoreState) => {
    return {
        listings: state.listings,
    };
};

export default connect(mapStateToProps, { createListing })(requireAuth(PostAd));
