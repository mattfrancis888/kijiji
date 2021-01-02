import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { fetchListingsByOldestDate } from "../actions";
import { StoreState } from "../reducers";
import Listing from "./Listing";
import Loading from "./Loading";

interface IListings {
    fetchListingsByOldestDate(): void;
    listings: any;
}

const Listings: React.FC<IListings> = (props) => {
    const renderListings = () => {
        if (props.listings.length === 0) {
            return (
                <div className="loadingCenter">
                    <Loading />
                </div>
            );
        } else {
            return props.listings.map((listing) => <Listing {...listing} />);
        }
    };
    useEffect(() => {
        props.fetchListingsByOldestDate();
    }, []);
    console.log(props.listings);
    return (
        <React.Fragment>
            <div className="listingsContainer">
                <h1 className="yourAdsTitle">Your Ads:</h1>
                <Listing />
            </div>
            <div className="listingsContainer">
                <div className="showingAdsTitleAndDropdownWrap">
                    <h1 className="showingAdsTitle">`Showing 1 out of ads:</h1>
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
                {renderListings()}
            </div>
        </React.Fragment>
    );
};

const mapStateToProps = (state: StoreState) => {
    //@ts-ignore
    return { listings: Object.values(state.listings) };
};

export default connect(mapStateToProps, { fetchListingsByOldestDate })(
    Listings
);
