import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSlidersH, faSearch } from "@fortawesome/free-solid-svg-icons";
import Modal from "./Modal";
import SearchFilterForm, { SearchFilterFormValues } from "./SearchFilterForm";

import queryString from "query-string";
import { useLocation } from "react-router-dom";

export interface SearchFilterFormProps {
    handleSubmit(formValues: SearchFilterFormValues): void;
    onCancel(): void;
    categories: [];
    onDropdownChange(): void;
}

const Searchbar: React.FC<{}> = () => {
    const history = useHistory();
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [filterQueries, setFilterQueries] = useState(null);
    const [searchValue, setSearchValue] = useState(null);

    const onSubmitFilter = async (formValues: SearchFilterFormValues) => {
        console.log("onsubmitfilter", formValues);

        if (!formValues.category) {
            setFilterCategory(formValues.category);
        } else if (!formValues.province) {
            setFilterProvince(formValues.province);
        } else if (!formValues.city) {
            setFilterCity(formValues.city);
        }

        const keyNames = Object.keys(formValues);
        let filterQuery = "";
        keyNames.map((name) => {
            if (formValues[name] != "") {
                //if(!formValues[name]) does not work due to syntax
                filterQuery += `${name}=${formValues[name]}&`;
            }
        });
        const editedFilterQuery = filterQuery.slice(0, -1); //remove last &
        setFilterQueries(editedFilterQuery);

        setShowFilterModal(false);
    };
    const onCancelFilter = () => {
        setShowFilterModal(false);
    };

    const renderModalContent = () => {
        return (
            <SearchFilterForm
                onSubmit={onSubmitFilter}
                onCancel={onCancelFilter}
                initialValues={renderInitialValuesForFilter()}
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
                    onDismiss={onCancelFilter}
                />
            );
        }
    };

    const [filterCategory, setFilterCategory] = useState(null);
    const [filterProvince, setFilterProvince] = useState(null);
    const [filterCity, setFilterCity] = useState(null);

    //For Query Strings:
    const { search } = useLocation();
    const queryValues: SearchFilterFormValues = queryString.parse(search);

    useEffect(() => {
        setFilterCategory(queryValues.category);
        setFilterProvince(queryValues.province);
        setFilterCity(queryValues.city);
    }, [search]);

    const renderInitialValuesForFilter = () => {
        const initialValues: any = {};
        console.log("QueryVal", queryValues);
        Object.keys(queryValues).map((val) => {
            if (val === "category") {
                initialValues.category = filterCategory;
            } else if (val === "province") {
                initialValues.province = filterProvince;
            } else if (val === "city") {
                initialValues.city = filterCity;
            }
        });
        return initialValues;
    };

    const directToListingsPage = () => {
        if (filterQueries && searchValue) {
            history.push(`/listings/1?search=${searchValue}&${filterQueries}`);
        } else if (filterQueries) {
            history.push(`/listings/1?${filterQueries}`);
        } else if (searchValue) {
            history.push(`/listings/1?search=${searchValue}`);
        } else {
            history.push(`/listings/1`);
        }
    };

    const handleKeyDown = (event) => {
        //https://stackoverflow.com/questions/31272207/to-call-onchange-event-after-pressing-enter-key
        if (event.key === "Enter") {
            event.preventDefault(); //so ?search= won't automatically be inserted in the query when enter is clicked
            directToListingsPage();
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
                // aria-label="Search"
                name="search"
                onChange={(event) => setSearchValue(event.target.value.trim())}
                onKeyDown={handleKeyDown}
            />
            <FontAwesomeIcon
                className="searchBarIcons"
                icon={faSearch}
                onClick={() => {
                    directToListingsPage();
                }}
            />
            {renderModal()}
        </form>
    );
};

export default Searchbar;
