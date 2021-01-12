import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import history from "../browserHistory";
import { connect } from "react-redux";
import { StoreState } from "../reducers";
import { Listing as ListingType } from "../actions";
import postAdListingImagePlaceHolder from "../img/postAdListingImagePlaceHolder.png";
const ListingDetail: React.FC<ListingType> = ({
    listing_id,
    listing_name,
    listing_image,
    listing_price,
    listing_description,
    listing_date,
    province,
    city,
    street,
}) => {
    const [showMore, setShowMore] = useState(false);

    return (
        <React.Fragment>
            <div className="listingDetailCategories">
                <h3>{`Ontario > Toronto`}</h3>
            </div>
            <div className="listingDetailAndContactContainer">
                <div className="listingDetailContainer">
                    <div className="listingDetailImageContainer">
                        <img
                            // src={postAdListingImagePlaceHolder}
                            src={
                                "https://res.cloudinary.com/du8n2aa4p/image/upload/v1609297822/kijiji/azmduhvc9aa0a7bmd8u1.jpg"
                            }
                            alt="listing"
                        />
                    </div>
                    <div className="listingDetailDescriptionContainer">
                        <div className="listingDescriptionTextWrap">
                            <h3 className="listingDetailPostedOn">
                                Posted On:{" "}
                            </h3>
                            <h3 className="locationOfPost">Toronto</h3>
                            <h3 className="listingDetailDescriptionTitle">
                                Description
                            </h3>

                            <p>Hello text</p>
                        </div>
                        <div
                            className={
                                showMore ? "" : "listingDetailDescriptionFade"
                            }
                        ></div>
                        <h3
                            className={
                                showMore
                                    ? "listingDetailShowMoreTextHide"
                                    : "listingDetailShowMoreText"
                            }
                            onClick={() => setShowMore(true)}
                        >
                            Show More
                        </h3>
                    </div>
                </div>
                <div className="listingDetailContactContainer">
                    <div className="listingDetailProfileImageAndNameWrap">
                        <img
                            src={
                                "https://res.cloudinary.com/du8n2aa4p/image/upload/v1609297822/kijiji/azmduhvc9aa0a7bmd8u1.jpg"
                            }
                            alt="profile"
                        />
                        <h3>Matt</h3>
                    </div>
                    <div className="contactAndMemberWrap">
                        <h3>Contact at: email@gmail.com</h3>
                        <h3>Member Since: </h3>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

const mapStateToProps = (state: StoreState) => {
    return {};
};

export default connect(mapStateToProps, {})(ListingDetail);
