import React from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { StoreState } from "../reducers";

interface iListing {
    // authStatus?: string | null;
    // signOut(): void;
}

const Listing: React.FC<iListing> = (props) => {
    return (
        <div>
            <div className="listingPreviewContainer">
                <div className="listingPreviewImageContainer">
                    <img src="" alt="listing" />
                </div>
                <div className="listingPreviewInfoWrap">
                    <div className="titleAndPriceWrap">
                        <h1 className="title">Title of Listing</h1>
                        <h1 className="price">Price</h1>
                    </div>
                    <div className="locationAndDateWrap">
                        <h3 className="location">Location</h3>

                        <p className="date">2020/12/30</p>
                    </div>
                    <p className="listingDescription">Description</p>
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = (state: StoreState) => {
    return {};
};

export default connect(mapStateToProps, {})(Listing);
