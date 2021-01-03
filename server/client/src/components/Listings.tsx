import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import {
    fetchListingsByOldestDate,
    fetchListingsByNewestDate,
    fetchListingsByLowestPrice,
    fetchListingsByHighestPrice,
    Listing as ListingType,
} from "../actions";
import { StoreState } from "../reducers";
import Listing from "./Listing";
import Loading from "./Loading";
const ORDER_BY_OLDEST_DATE = "Posted: oldest first";
const ORDER_BY_NEWEST_DATE = "Posted: newest first";
const ORDER_BY_LOWEST_PRICE = " Price: lowest first";
const ORDER_BY_HIGHEST_PRICE = "Price: highest first";
interface IListings {
    fetchListingsByOldestDate(): void;
    fetchListingsByNewestDate(): void;
    fetchListingsByLowestPrice(): void;
    fetchListingsByHighestPrice(): void;
    listings: any;
}

const Listings: React.FC<IListings> = (props) => {
    const handleDropdownChange = (event) => {
        let valueOfSelectedOption = event.target.value;
        if (valueOfSelectedOption === ORDER_BY_OLDEST_DATE) {
            props.fetchListingsByOldestDate();
        } else if (valueOfSelectedOption === ORDER_BY_NEWEST_DATE) {
            props.fetchListingsByNewestDate();
        } else if (valueOfSelectedOption === ORDER_BY_LOWEST_PRICE) {
            props.fetchListingsByLowestPrice();
        } else if (valueOfSelectedOption === ORDER_BY_HIGHEST_PRICE) {
            props.fetchListingsByHighestPrice();
        }
    };
    const renderListings = () => {
        if (props.listings.length === 0) {
            return (
                <div className="loadingCenter">
                    <Loading />
                </div>
            );
        } else {
            return props.listings.data.map((listing: ListingType) => (
                <Listing key={listing.listing_id} {...listing} />
            ));
        }
    };
    useEffect(() => {
        props.fetchListingsByOldestDate();
    }, []);
    console.log("LISTINGS VALUE", props.listings);
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
                        <select
                            className="sortByDropdown"
                            onChange={handleDropdownChange}
                        >
                            <option value={ORDER_BY_OLDEST_DATE}>
                                {ORDER_BY_OLDEST_DATE}
                            </option>
                            <option value={ORDER_BY_NEWEST_DATE}>
                                {ORDER_BY_NEWEST_DATE}
                            </option>
                            <option value={ORDER_BY_LOWEST_PRICE}>
                                {ORDER_BY_LOWEST_PRICE}
                            </option>
                            <option value={ORDER_BY_HIGHEST_PRICE}>
                                {ORDER_BY_HIGHEST_PRICE}
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
    // return { listings: Object.values(state.listings) };
    return { listings: state.listings };
};

export default connect(mapStateToProps, {
    fetchListingsByOldestDate,
    fetchListingsByNewestDate,
    fetchListingsByLowestPrice,
    fetchListingsByHighestPrice,
})(Listings);
