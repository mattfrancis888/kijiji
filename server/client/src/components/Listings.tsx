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
import Pagination from "./Pagination";
import queryString from "query-string";
import { useLocation } from "react-router-dom";
const ORDER_BY_OLDEST_DATE = "Posted: oldest first";
const ORDER_BY_NEWEST_DATE = "Posted: newest first";
const ORDER_BY_LOWEST_PRICE = " Price: lowest first";
const ORDER_BY_HIGHEST_PRICE = "Price: highest first";

//
interface IListings {
    fetchListingsByOldestDate(pageNumber: number): void;
    fetchListingsByNewestDate(): void;
    fetchListingsByLowestPrice(): void;
    fetchListingsByHighestPrice(): void;
    listingInfo: any;
    match: any;
}

const Listings: React.FC<IListings> = (props) => {
    //https://ui.dev/react-router-v5-query-strings/
    const { search } = useLocation();
    const values = queryString.parse(search);
    // const currentPage = values;
    const currentPage = parseInt(props.match.params.page);

    const handleDropdownChange = (event) => {
        let valueOfSelectedOption = event.target.value;
        if (valueOfSelectedOption === ORDER_BY_OLDEST_DATE) {
            props.fetchListingsByOldestDate(1);
        } else if (valueOfSelectedOption === ORDER_BY_NEWEST_DATE) {
            props.fetchListingsByNewestDate();
        } else if (valueOfSelectedOption === ORDER_BY_LOWEST_PRICE) {
            props.fetchListingsByLowestPrice();
        } else if (valueOfSelectedOption === ORDER_BY_HIGHEST_PRICE) {
            props.fetchListingsByHighestPrice();
        }
    };
    const pageNumberClicked = (pageNumber: number) => {
        console.log("Callback clicked", pageNumber);
        props.fetchListingsByOldestDate(pageNumber);
    };

    const renderListings = () => {
        if (!props.listingInfo) {
            return (
                <div className="loadingCenter">
                    <Loading />
                </div>
            );
        } else {
            return (
                <React.Fragment>
                    <Pagination
                        totalItems={props.listingInfo.totalListings}
                        itemLimit={props.listingInfo.limitPerPage}
                        currentPage={currentPage}
                        onClickCallback={pageNumberClicked}
                    />
                    <div className="showingAdsTitleAndDropdownWrap">
                        <h1 className="showingAdsTitle">{`Showing 1 out of ${props.listingInfo.totalListingsunt} ads:`}</h1>
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
                    {props.listingInfo.listings.map((listing: ListingType) => (
                        <Listing key={listing.listing_id} {...listing} />
                    ))}
                </React.Fragment>
            );
        }
    };
    useEffect(() => {
        props.fetchListingsByOldestDate(1);
    }, []);
    console.log("LISTINGS VALUE", props.listingInfo);
    return (
        <React.Fragment>
            <div className="listingsContainer">{renderListings()}</div>
        </React.Fragment>
    );
};

const mapStateToProps = (state: StoreState) => {
    //@ts-ignore
    // return { listings: Object.values(state.listings) };
    return { listingInfo: state.listingInfo.data };
};

export default connect(mapStateToProps, {
    fetchListingsByOldestDate,
    fetchListingsByNewestDate,
    fetchListingsByLowestPrice,
    fetchListingsByHighestPrice,
})(Listings);
