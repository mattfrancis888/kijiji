import React from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { signOut } from "../actions";
import { StoreState } from "../reducers";
import Listing from "./Listing";
interface IListings {
    authStatus?: string | null;
    signOut(): void;
}

const Listings: React.FC<IListings> = (props) => {
    const history = useHistory();
    return (
        <div>
            <h1>Ads </h1>

            <div className="listingsContainer">
                <h1>Your Ads:</h1>
                <Listing />
            </div>
            <div className="listingsContainer"></div>
        </div>
    );
};

const mapStateToProps = (state: StoreState) => {
    return {};
};

export default connect(mapStateToProps, {})(Listings);
