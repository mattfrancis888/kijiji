import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { fetchCategoriesForListing } from "../actions";
import { StoreState } from "../reducers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSlidersH, faSearch } from "@fortawesome/free-solid-svg-icons";
import Modal from "./Modal";
import Loading from "./Loading";
import LoadingDots from "./LoadingDots";
interface ISearchBar {
    categories?: [];
    fetchCategoriesForListing(): void;
}

const Searchbar: React.FC<ISearchBar> = (props) => {
    const history = useHistory();
    useEffect(() => {
        props.fetchCategoriesForListing();
    }, []);

    const renderModalActions = () => {
        if (props.categories.length === 0) {
        } else {
            return (
                <React.Fragment>
                    <button className="modalAcceptButton">
                        <h5>Accept</h5>
                    </button>

                    <button className="modalCancelButton">
                        <h5>Cancel</h5>
                    </button>
                </React.Fragment>
            );
        }
    };

    const renderModalContent = () => {
        if (props.categories.length === 0) {
            return (
                <div className="centerLoadingForModal">
                    <LoadingDots />
                </div>
            );
        } else {
            return (
                <div>
                    <h3>Categories</h3>
                    <select
                        className="modalFilterCategoriesDropdown"
                        autoComplete="off"
                    >
                        <option value="" selected></option>
                        {props.categories.map((val) => (
                            <option key={val} value={val}>
                                {val}
                            </option>
                        ))}
                    </select>
                    <div className="modalFilterLocationWrap">
                        <div className="modalLocationInputWrap">
                            <h3>Province</h3>
                            <input
                                name="province"
                                className="modalFilterInput"
                                placeholder="Any"
                                autoComplete="off"
                            />
                        </div>
                        <div className="modalLocationInputWrap">
                            <h3>City</h3>
                            <input
                                name="city"
                                className="modalFilterInput"
                                placeholder="Any"
                                autoComplete="off"
                            />
                        </div>
                        <div className="modalLocationInputWrap">
                            <h3>Street</h3>
                            <input
                                name="street"
                                className="modalFilterInput"
                                placeholder="Any"
                                autoComplete="off"
                            />
                        </div>
                    </div>
                </div>
            );
        }
    };
    return (
        <form className="searchBarForm">
            <FontAwesomeIcon className="searchBarIcons" icon={faSlidersH} />
            <input
                className="searchBarInput"
                type="search"
                placeholder="Search..."
                aria-label="Search"
                name="search"
            />
            <FontAwesomeIcon className="searchBarIcons" icon={faSearch} />

            <Modal
                title="Filter Your Results"
                content={renderModalContent()}
                actions={renderModalActions()}
                // onDismiss={() => setShowDeleteModal(null)}
            />
        </form>
    );
};

const mapStateToProps = (state: StoreState) => {
    return {
        categories: state.categories,
    };
};

export default connect(mapStateToProps, { fetchCategoriesForListing })(
    Searchbar
);
