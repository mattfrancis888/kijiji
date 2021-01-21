import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import history from "../browserHistory";
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
import { useLocation, useParams } from "react-router-dom";
const ORDER_BY_OLDEST_DATE = "Posted: oldest first";
const ORDER_BY_NEWEST_DATE = "Posted: newest first";
const ORDER_BY_LOWEST_PRICE = " Price: lowest first";
const ORDER_BY_HIGHEST_PRICE = "Price: highest first";

interface IListings {
    fetchListingsByOldestDate(pageNumber: number, queryPath: string): void;
    fetchListingsByNewestDate(pageNumber: number, queryPath: string): void;
    fetchListingsByLowestPrice(pageNumber: number, queryPath: string): void;
    fetchListingsByHighestPrice(pageNumber: number, queryPath: string): void;
    listingInfo: any;
    match: any;
}

const Listings: React.FC<IListings> = (props) => {
    const [currentPage, setCurrentPage] = useState(props.match.params.page);
    const [selectedSort, setSelectedSort] = useState(ORDER_BY_OLDEST_DATE);
    //For Query Strings:
    const { search } = useLocation();

    const renderShowingText = () => {
        if (props.listingInfo.totalListings < props.listingInfo.limitPerPage) {
            return props.listingInfo.totalListings;
        } else if (
            props.listingInfo.limitPerPage * props.listingInfo.page >
            props.listingInfo.totalListings
        ) {
            return props.listingInfo.totalListings;
        } else {
            return props.listingInfo.limitPerPage * props.listingInfo.page;
        }
    };

    const handleDropdownChange = (event: any) => {
        let valueOfSelectedOption = event.target.value;
        if (valueOfSelectedOption === ORDER_BY_OLDEST_DATE) {
            setSelectedSort(ORDER_BY_OLDEST_DATE);
            props.fetchListingsByOldestDate(currentPage, search);
        } else if (valueOfSelectedOption === ORDER_BY_NEWEST_DATE) {
            setSelectedSort(ORDER_BY_NEWEST_DATE);
            props.fetchListingsByNewestDate(currentPage, search);
        } else if (valueOfSelectedOption === ORDER_BY_LOWEST_PRICE) {
            setSelectedSort(ORDER_BY_LOWEST_PRICE);
            props.fetchListingsByLowestPrice(currentPage, search);
        } else if (valueOfSelectedOption === ORDER_BY_HIGHEST_PRICE) {
            setSelectedSort(ORDER_BY_HIGHEST_PRICE);
            props.fetchListingsByHighestPrice(currentPage, search);
        }
    };
    const pageNumberClicked = (pageNumber: number) => {
        //We don't use currentPage becaause oru useEffect does not has [currentPage]
        //setting it to currentPage causes rendering issues where the page is not updating properly

        if (selectedSort === ORDER_BY_OLDEST_DATE) {
            props.fetchListingsByOldestDate(pageNumber, search);
        } else if (selectedSort === ORDER_BY_NEWEST_DATE) {
            props.fetchListingsByNewestDate(pageNumber, search);
        } else if (selectedSort === ORDER_BY_LOWEST_PRICE) {
            props.fetchListingsByLowestPrice(pageNumber, search);
        } else if (selectedSort === ORDER_BY_HIGHEST_PRICE) {
            props.fetchListingsByHighestPrice(pageNumber, search);
        }
    };

    const renderListings = () => {
        if (!props.listingInfo) {
            return (
                <div className="loadingCenter">
                    <Loading />
                </div>
            );
        } else if (props.listingInfo.error) {
            return (
                <div className="serverErrorContainer">
                    <h3 className="serverErrorText">
                        {props.listingInfo.error}
                    </h3>
                </div>
            );
        } else if (!props.listingInfo.listings) {
            //Important: we use .listings here because listingInfo change it's state
            //if user clicks the listing (<ListingDetail> is triggered); there is no .listings
            //when it's triggered, so it will cause an undefined error at the else statement if we click back button
            return (
                <div className="loadingCenter">
                    <Loading />
                </div>
            );
        } else {
            if (props.listingInfo.listings.length === 0) {
                //When users enter an invalid page number in the url
                return (
                    <h2 className="nothingToShow">
                        There seems to be nothing to show here...
                    </h2>
                );
            }

            return (
                <React.Fragment>
                    <div className="listingsContainer">
                        <div className="showingAdsTitleAndDropdownWrap">
                            <h1 className="showingAdsTitle">{`Showing ${renderShowingText()} out of ${
                                props.listingInfo.totalListings
                            } ads:`}</h1>
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
                        {props.listingInfo.listings.map(
                            (listing: ListingType) => (
                                <Listing
                                    key={listing.listing_id}
                                    {...listing}
                                />
                            )
                        )}
                        <Pagination
                            totalItems={props.listingInfo.totalListings}
                            itemLimit={props.listingInfo.limitPerPage}
                            currentPage={currentPage}
                            onClickCallback={pageNumberClicked}
                            query={search}
                        />
                    </div>
                </React.Fragment>
            );
        }
    };

    useEffect(() => {
        //When we click the back button, fetchListing does not get rendered
        //So we intercept the back button and forward button with:
        let backAndForwardButtonClicked = false;
        window.onpopstate = (e: Event) => {
            backAndForwardButtonClicked = true;
            console.log("back button", selectedSort);
            if (selectedSort === ORDER_BY_OLDEST_DATE) {
                props.fetchListingsByOldestDate(currentPage, search);
            } else if (selectedSort === ORDER_BY_NEWEST_DATE) {
                props.fetchListingsByNewestDate(currentPage, search);
            } else if (selectedSort === ORDER_BY_LOWEST_PRICE) {
                props.fetchListingsByLowestPrice(currentPage, search);
            } else if (selectedSort === ORDER_BY_HIGHEST_PRICE) {
                props.fetchListingsByHighestPrice(currentPage, search);
            }
        };
        if (backAndForwardButtonClicked === false) {
            if (selectedSort === ORDER_BY_OLDEST_DATE) {
                props.fetchListingsByOldestDate(
                    props.match.params.page,
                    search
                );
            } else if (selectedSort === ORDER_BY_NEWEST_DATE) {
                props.fetchListingsByNewestDate(
                    props.match.params.page,
                    search
                );
            } else if (selectedSort === ORDER_BY_LOWEST_PRICE) {
                props.fetchListingsByLowestPrice(
                    props.match.params.page,
                    search
                );
            } else if (selectedSort === ORDER_BY_HIGHEST_PRICE) {
                props.fetchListingsByHighestPrice(
                    props.match.params.page,
                    search
                );
            }
        }
        setCurrentPage(props.match.params.page); //hook renders after everything in useffect is executed
    }, [props.match.params.page, search]);

    return <React.Fragment>{renderListings()}</React.Fragment>;
};

const mapStateToProps = (state: StoreState) => {
    // return { listings: Object.values(state.listings) };
    return { listingInfo: state.listingInfo.data };
};

export default connect(mapStateToProps, {
    fetchListingsByOldestDate,
    fetchListingsByNewestDate,
    fetchListingsByLowestPrice,
    fetchListingsByHighestPrice,
})(Listings);
