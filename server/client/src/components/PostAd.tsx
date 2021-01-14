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
    initialValues: Object;
    provinceValue: string;
    categories: [];
    dispatch: any;
}

export interface PostAdProps {
    createListing(formValues: any): void;
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
            <PostAdForm
                onSubmit={onSubmitPostListing}
                // initialValues={{
                //     title: "bye",
                //     image: "",
                // }}
            />
        </div>
    );
};

export default connect(null, { createListing })(requireAuth(PostAd));
