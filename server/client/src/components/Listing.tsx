import React from "react";
import { Link } from "react-router-dom";
import history from "../browserHistory";
import { connect } from "react-redux";
import { StoreState } from "../reducers";
import { Listing as ListingType } from "../actions";
import moment from "moment";
import postAdListingImagePlaceHolder from "../img/postAdListingImagePlaceHolder.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";

import { useLocation } from "react-router-dom";

const Listing: React.FC<ListingType> = ({
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
    const location = useLocation();
    return (
        <div
            className="listingPreviewContainer"
            onClick={() => {
                history.push(`/listing/${listing_id}`);
            }}
        >
            {location.pathname === "/profile" ? (
                <FontAwesomeIcon
                    className="pencilIcon"
                    icon={faPencilAlt}
                    onClick={(event) => {
                        event.stopPropagation(); //stops bubbling for history.push
                        history.push(`/listing/${listing_id}/edit`);
                    }}
                />
            ) : (
                ""
            )}
            <div className="listingPreviewImageContainer">
                <img
                    src={
                        !listing_image
                            ? postAdListingImagePlaceHolder
                            : listing_image
                    }
                    //If image that we get from cloudinary is no longer valid / broken for some reason, resort to default image
                    onError={(e: any) => {
                        e.target.src = postAdListingImagePlaceHolder; // some replacement image
                        // e.target.style = 'padding: 8px; margin: 16px' // inline styles in html format
                    }}
                    alt="listing"
                />
            </div>
            <div className="listingPreviewInfoWrap">
                <div className="titleAndPriceWrap">
                    <h1 className="title">{listing_name}</h1>
                    <h1 className="price">${listing_price}</h1>
                </div>
                <div className="locationAndDateWrap">
                    <h3 className="location">{`${city}, ${province} at ${street} `}</h3>

                    <h3 className="date">
                        {moment(listing_date).format("YYYY/MM/DD")}
                    </h3>
                </div>
                <p className="listingDescription">{listing_description}</p>
            </div>
        </div>
    );
};

const mapStateToProps = (state: StoreState) => {
    return {};
};

export default connect(mapStateToProps, {})(Listing);
