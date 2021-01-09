import React, { ComponentType, useEffect } from "react";
import {
    Field,
    reduxForm,
    InjectedFormProps,
    formValueSelector,
} from "redux-form";
//compose is used to make it easier to "organize" mapStateToProps and redux form
import { StoreState } from "../reducers";
import { connect } from "react-redux";
import { SearchFilterFormProps } from "./Searchbar";
import { fetchCategoriesForListing } from "../actions";
import LoadingDots from "./LoadingDots";
import { CANADIAN_PROVINCES, CANADIAN_PROVINCE_AND_CITIES } from "../constants";
//Typescriptand redux form:
//https://levelup.gitconnected.com/react-js-typescript-redux-redux-form-jest-e522995ebe36

//Need to hoist render methods up or else it will give error where it will unfocus after first characther is typed
//https://stackoverflow.com/questions/39839051/using-redux-form-im-losing-focus-after-typing-the-first-character

export interface SearchFilterFormValues {
    category?: string;
    province?: string;
    city?: string;
    street?: string;
}

const renderError = ({ error, touched }: any) => {
    if (touched && error) {
        //Touched (for input) will be false at first
        //When clicked and then clicked otuside of the input, it will be true
        return <div className="errorText">{error}</div>;
    }
};

const renderDropDown = ({
    input,
    label,
    meta,
    placeHolder,
    optionValues,
}: any) => {
    return (
        <select
            className="modalFilterCategoriesDropdown"
            autoComplete="off"
            {...input}
        >
            <option value=""></option>
            {optionValues.map((val) => (
                <option key={val} value={val}>
                    {val}
                </option>
            ))}
        </select>
    );
};

const SearchFilterForm: React.FC<
    SearchFilterFormProps & InjectedFormProps<{}, SearchFilterFormProps>
> = (props) => {
    const onSubmit = (formValues: any, dispatch: any) => {
        props.onSubmit(formValues);
    };

    useEffect(() => {
        props.fetchCategoriesForListing();
    }, []);

    const renderFields = () => {
        if (props.categories.length === 0) {
            return (
                <div className="centerLoadingForModal">
                    <LoadingDots />
                </div>
            );
        } else {
            return (
                <form onSubmit={props.handleSubmit(onSubmit)}>
                    <h3>Categories</h3>
                    <Field
                        name="category"
                        component={renderDropDown}
                        optionValues={props.categories}
                    />
                    <div className="modalFilterLocationWrap">
                        <div className="modalLocationDropdownWrap">
                            <h3>Province</h3>
                            <Field
                                name="province"
                                type="text"
                                component={renderDropDown}
                                optionValues={CANADIAN_PROVINCES.map(
                                    (province) => {
                                        return province.name;
                                    }
                                )}
                            />
                        </div>
                        <div className="modalLocationDropdownWrap">
                            <h3>City</h3>
                            <Field
                                name="city"
                                type="text"
                                component={renderDropDown}
                                optionValues={
                                    !props.provinceValue
                                        ? []
                                        : CANADIAN_PROVINCE_AND_CITIES.filter(
                                              (provinceAndCity) =>
                                                  provinceAndCity.province ===
                                                  props.provinceValue
                                          )[0].cities
                                }
                            />
                        </div>
                    </div>
                    <button className="modalAcceptButton">Accept</button>
                    {/* https://stackoverflow.com/questions/41590766/redux-form-always-validates-even-on-a-normal-button-press */}
                    {/* By adding type="button" the button will not be a "submit" button */}
                    <button
                        type="button"
                        className="modalCancelButton"
                        onClick={props.onCancel}
                    >
                        Cancel
                    </button>
                </form>
            );
        }
    };
    return <React.Fragment>{renderFields()}</React.Fragment>;
};

const selector = formValueSelector("searchFilterForm");
const mapStateToProps = (state: StoreState) => {
    return {
        categories: state.categories,
        provinceValue: selector(state, "province"),
    };
};

export default connect(mapStateToProps, { fetchCategoriesForListing })(
    reduxForm<{}, SearchFilterFormProps>({
        form: "searchFilterForm",
    })(SearchFilterForm)
);
