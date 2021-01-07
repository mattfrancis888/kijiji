import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import {
    fetchCategoriesForListing,
    fetchListingsByOldestDate,
} from "../actions";
import { StoreState } from "../reducers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSlidersH, faSearch } from "@fortawesome/free-solid-svg-icons";
import Modal from "./Modal";
import LoadingDots from "./LoadingDots";
import SearchFilterForm from "./SearchFilterForm";
interface ISearchBar {
    categories?: [];
    fetchCategoriesForListing(): void;
    fetchListingsByOldestDate(): void;
}

export interface SearchFilterFormProps {
    handleSubmit(formValues: any): void;
    onCancel(): void;
    categories: [];
}

const Searchbar: React.FC<ISearchBar> = (props) => {
    const history = useHistory();
    const [showFilterModal, setShowFilterModal] = useState(null);
    const onSubmitFilter = async (formValues: any) => {
        console.log("onsubmitfilter", formValues);
    };
    const onCancelFilter = () => {
        setShowFilterModal(false);
    };

    // const renderModalActions = () => {
    //     if (props.categories.length === 0) {
    //     } else {
    //         return (
    //             <React.Fragment>
    //                 <button
    //                     className="modalAcceptButton"
    //                     onClick={() => {
    //                         // props.fetchListingsByOldestDate();
    //                         history.push("/listings/1");
    //                         setShowFilterModal(false);
    //                     }}
    //                 >
    //                     <h5>Accept</h5>
    //                 </button>

    //                 <button
    //                     className="modalCancelButton"
    //                     onClick={() => setShowFilterModal(false)}
    //                 >
    //                     <h5>Cancel</h5>
    //                 </button>
    //             </React.Fragment>
    //         );
    //     }
    // };
    const renderModalContent = () => {
        return (
            <SearchFilterForm
                onSubmit={onSubmitFilter}
                onCancel={onCancelFilter}
            />
        );
    };

    const renderModal = () => {
        if (!showFilterModal) return null;
        else {
            return (
                <Modal
                    title="Filter Your Results"
                    content={renderModalContent()}
                    // actions={renderModalActions()}
                    onDismiss={() => onCancelFilter}
                />
            );
        }
    };

    return (
        <form className="searchBarForm">
            <FontAwesomeIcon
                className="searchBarIcons"
                icon={faSlidersH}
                onClick={() => setShowFilterModal(true)}
            />
            <input
                className="searchBarInput"
                type="search"
                placeholder="Search..."
                aria-label="Search"
                name="search"
            />
            <FontAwesomeIcon className="searchBarIcons" icon={faSearch} />
            {renderModal()}
        </form>
    );
};

export default Searchbar;
