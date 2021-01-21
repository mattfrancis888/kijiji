import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import history from "../browserHistory";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSlidersH, faSearch } from "@fortawesome/free-solid-svg-icons";
import Modal from "./Modal";
import SearchFilterForm, { SearchFilterFormValues } from "./SearchFilterForm";

import queryString from "query-string";
import { useLocation } from "react-router-dom";
import { filter, initial } from "lodash";

export interface SearchFilterFormProps {
    onSubmit(formValues: SearchFilterFormValues): void;
    onCancel(): void;
    categories: string[];
    fetchCategoriesForListing(): void;
    initialValues?: any;
}

export interface ModalProps {
    onDismiss(): void;
    title: string;
    content: JSX.Element;
    actions?: JSX.Element;
}

const Searchbar: React.FC<{}> = () => {
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [filterQueries, setFilterQueries] = useState<string | null>(null);
    const [searchValue, setSearchValue] = useState("");
    const [initialLoad, setInitialLoad] = useState(true);

    const onSubmitFilter = async (formValues: SearchFilterFormValues) => {
        console.log("onsubmitfilter", formValues);
        //If we didn't fill out the city field:
        //{category: "Sportings Goods", province: "Manitoba"}

        //If we entered the city field, but then change it back to an empty field
        //{category: "Sportings Goods", province: "Alberta", city: ""}

        if (formValues.category || formValues.category === "") {
            setFilterCategory(formValues.category);
        }
        if (formValues.province || formValues.province === "") {
            setFilterProvince(formValues.province);
        }
        if (formValues.city || formValues.city === "") {
            setFilterCity(formValues.city);
        }

        const keyNames = Object.keys(formValues);
        let filterQuery = "";
        keyNames.map((name) => {
            //@ts-ignore for formValues[name] dont worry, the ts solution is a bit nasty
            if (formValues[name] !== "") {
                //@ts-ignore for formValues[name] dont worry, the ts solution is a bit nasty
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

    const [filterCategory, setFilterCategory] = useState<string | null>(null);
    const [filterProvince, setFilterProvince] = useState<string | null>(null);
    const [filterCity, setFilterCity] = useState<string | null>(null);

    //For Query Strings:
    const { search } = useLocation();
    const queryValues: SearchFilterFormValues = queryString.parse(search);

    useEffect(() => {
        if (queryValues.category) setFilterCategory(queryValues.category);
        if (queryValues.province) setFilterProvince(queryValues.province);
        if (queryValues.city) setFilterCity(queryValues.city);
        if (queryValues.search) setSearchValue(queryValues.search);
    }, []);

    const renderInitialValuesForFilter = () => {
        console.log("renderInitialVal", filterProvince);
        const initialValues: any = {};
        if (initialLoad) {
            Object.keys(queryValues).map((val) => {
                if (val === "category") {
                    initialValues.category = filterCategory;
                } else if (val === "province") {
                    initialValues.province = filterProvince;
                } else if (val === "city") {
                    initialValues.city = filterCity;
                }
            });
            setInitialLoad(false);
        } else {
            if (filterCategory || filterCategory === "") {
                initialValues.category = filterCategory;
            }
            if (filterProvince || filterProvince === "") {
                initialValues.province = filterProvince;
            }
            if (filterCity || filterCity === "") {
                initialValues.city = filterCity;
            }
        }
        return initialValues;
    };

    const directToListingsPage = () => {
        if (filterQueries && searchValue !== "") {
            // history.push(`/listings/1?search=${searchValue}&${filterQueries}`);
            history.push({
                pathname: "/listings/1",
                search: `?search=${searchValue}&${filterQueries}`,
            });
        } else if (filterQueries) {
            // history.push(`/listings/1?${filterQueries}`);
            history.push({
                pathname: "/listings/1",
                search: `?${filterQueries}`,
            });
        } else if (searchValue) {
            //history.push(`/listings/1?search=${searchValue}`);
            history.push({
                pathname: "/listings/1",
                search: `?search=${searchValue}`,
            });
        } else {
            history.push(`/listings/1`);
        }
    };

    const handleKeyDown = (event: any) => {
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
                value={searchValue}
                name="search"
                onChange={(event) => setSearchValue(event.target.value.trim())}
                onKeyDown={handleKeyDown}
                autoComplete="off"
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
