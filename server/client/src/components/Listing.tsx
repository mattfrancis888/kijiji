import React from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { StoreState } from "../reducers";
import { Listing as ListingType } from "../actions";

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
    return (
        <div key={listing_id} className="listingPreviewContainer">
            <div className="listingPreviewImageContainer">
                <img src={listing_image} alt="listing" />
            </div>
            <div className="listingPreviewInfoWrap">
                <div className="titleAndPriceWrap">
                    <h1 className="title">{listing_name}</h1>
                    <h1 className="price">${listing_price}</h1>
                </div>
                <div className="locationAndDateWrap">
                    <h3 className="location">{`${city}, ${province} at ${street} `}</h3>

                    <h3 className="date">{listing_date}</h3>
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
