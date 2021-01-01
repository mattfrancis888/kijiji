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
            <div className="listingsContainer">
                <h1 className="yourAdsTitle">Your Ads:</h1>
                <Listing />
            </div>
            <div className="listingsContainer">
                <div className="showingAdsTitleAndDropdownWrap">
                    <h1 className="showingAdsTitle">
                        Showing 1 out of x ads:{" "}
                    </h1>
                    <div className="dropdownWrap">
                        <h3>Sort by</h3>
                        <select className="sortByDropdown">
                            <option value="Posted: oldest first">
                                Posted: oldest first
                            </option>
                            <option value="Posted: newest first">
                                Posted: newest first
                            </option>
                            <option value="Price: lowest first">
                                Price: lowest first
                            </option>
                            <option value="Price: highest first">
                                Price: highest first
                            </option>
                        </select>
                    </div>
                </div>
                <Listing />
            </div>
        </div>
    );
};

const mapStateToProps = (state: StoreState) => {
    return {};
};

export default connect(mapStateToProps, {})(Listings);
