import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import history from "../browserHistory";
import { connect } from "react-redux";
import { StoreState } from "../reducers";
import { ListingDetail as ListingDetailType } from "../actions";
import postAdListingImagePlaceHolder from "../img/postAdListingImagePlaceHolder.png";
import defaultProfilePic from "../img/defaultProfilePic.jpg";
import Loading from "./Loading";
import moment from "moment";
import emptyBox from "../img/emptyBox.svg";

// interface ListingDetailProps {
//     fetchListingDetail(listingId: string): void;
//     listingDetail: ListingDetailType;
//     match: any;
// }
const Profile: React.FC<{}> = (props) => {
    // useEffect(() => {
    //     props.fetchListingDetail(props.match.params.id);
    // }, []);

    // const renderListingDetail = () => {
    //     if (!props.listingDetail) {
    //         return (
    //             <div className="loadingCenter">
    //                 <Loading />
    //             </div>
    //         );
    //     } else {
    //         const {
    //             listingId,
    //             title,
    //             description,
    //             category,
    //             image,
    //             province,
    //             city,
    //             street,
    //             price,
    //             listingDate,
    //             firstName,
    //             lastName,
    //             memberSince,
    //             email,
    //         } = props.listingDetail;

    //         return <React.Fragment></React.Fragment>;
    //     }
    //};
    return (
        <React.Fragment>
            <div className="profileInfoAndListingContainer">
                <div className="profileInfoContainer">
                    <div className="profileBannerContainer">
                        <div className="purpleBanner"></div>
                        <img src={defaultProfilePic} alt="profie"></img>
                        <div className="whiteBanner"></div>
                    </div>
                    <h3>First Name Last </h3>
                    <h3>Member Since: 2021/01/12</h3>
                </div>

                <div className="userListingContainer">
                    <h3 className="userListingText">0 listings</h3>

                    <img className="emptyBox" src={emptyBox} alt="empty box" />
                </div>
            </div>
        </React.Fragment>
    );
};

const mapStateToProps = (state: StoreState) => {
    return { listingDetail: state.listingInfo.data };
};

export default connect(mapStateToProps, {})(Profile);
