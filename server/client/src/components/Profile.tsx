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
import { fetchUserProfile } from "../actions";
import Listing from "./Listing";
import { Listing as ListingType } from "../actions";
import requireAuth from "./requireAuth";
interface ProfileProps {
    fetchUserProfile(): void;
    profileInfo: any;
}
const Profile: React.FC<ProfileProps> = (props) => {
    useEffect(() => {
        props.fetchUserProfile();
    }, []);

    const renderListings = (listings: ListingType[]) => {
        if (listings.length === 0) {
            return (
                <div className="userListingContainerEmpty">
                    <h3 className="userListingText">0 listings</h3>

                    <img className="emptyBox" src={emptyBox} alt="empty box" />
                </div>
            );
        } else {
            return (
                <div className="userListingContainerFilled">
                    <h3>Your Listings :</h3>
                    {listings.map((listing: ListingType) => {
                        return (
                            <Listing key={listing.listing_id} {...listing} />
                        );
                    })}
                </div>
            );
        }
    };
    const renderListingDetail = () => {
        if (!props.profileInfo) {
            return (
                <div className="loadingCenter">
                    <Loading />
                </div>
            );
        } else if (props.profileInfo.error) {
            return (
                <div className="serverErrorContainer">
                    <h3 className="serverErrorText">
                        {props.profileInfo.error}
                    </h3>
                </div>
            );
        } else {
            const {
                first_name,
                last_name,
                member_since,
                listings,
            } = props.profileInfo;

            return (
                <React.Fragment>
                    <div className="profileInfoAndListingContainer">
                        <div className="profileInfoContainer">
                            <div className="profileBannerContainer">
                                <div className="purpleBanner"></div>
                                <img src={defaultProfilePic} alt="profie"></img>
                                <div className="whiteBanner"></div>
                            </div>
                            <h3>{` ${first_name} ${last_name}`}</h3>
                            <h3>
                                {`Member Since: ${moment(member_since).format(
                                    "YYYY/MM/DD"
                                )}`}
                            </h3>
                        </div>
                        {renderListings(listings)}
                    </div>
                </React.Fragment>
            );
        }
    };
    return <React.Fragment>{renderListingDetail()}</React.Fragment>;
};

const mapStateToProps = (state: StoreState) => {
    return { profileInfo: state.profileInfo.data };
};

export default connect(mapStateToProps, { fetchUserProfile })(
    requireAuth(Profile)
);
