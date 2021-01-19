import React, { useRef, useEffect, useState } from "react";
import {
    Field,
    reduxForm,
    reset,
    change,
    FormErrors,
    InjectedFormProps,
} from "redux-form";
//compose is used to make it easier to "organize" mapStateToProps and redux form
import { StoreState } from "../reducers";
import { connect } from "react-redux";
import { PostAdFormProps } from "./PostAd";
import postAdListingImagePlaceHolder from "../img/postAdListingImagePlaceHolder.png";
import { CANADIAN_PROVINCES, CANADIAN_PROVINCE_AND_CITIES } from "../constants";
import { formValueSelector } from "redux-form";
import { fetchCategoriesForListing } from "../actions";
import Loading from "./Loading";
import { SERVER_ERROR_MESSAGE } from "../constants";
import { initial } from "lodash";
import { useLocation } from "react-router-dom";

export interface EditOrPostAdFormValues {
    title: string;
    description: string;
    category: string;
    image: any;
    province: string;
    city: string;
    street: string;
    price: number;
}

const renderError = ({ error, touched }: any) => {
    if (touched && error) {
        //Touched (for input) will be false at first
        //When clicked and then clicked otuside of the input, it will be true
        return <div className="errorText">{error}</div>;
    }
};

const renderAutoFocusTextInput = ({ input, label, meta, placeHolder }: any) => {
    //I think there's a bug with the librrary
    //If we have initialValues set for the form and then we don't have an autofocs on for a field
    //refs such as openFileExplorer will not be generated until a text is actualy focused.
    //If we remove the initialValues, refs will be rendered.
    return (
        <div>
            {/* <label>{label}</label> */}
            <input
                className="createPostAdInputs"
                {...input}
                autoComplete="off"
                autoFocus
            />
            {renderError(meta)}
        </div>
    );
};

const renderTextInput = ({ input, label, meta, placeHolder }: any) => {
    //"component" property automatically passes props to argument, it has {input properties and meta properties}
    //"label" automatically passes props to arguments
    return (
        <div>
            {/* <label>{label}</label> */}
            <input
                className="createPostAdInputs"
                {...input}
                autoComplete="off"
            />
            {renderError(meta)}
        </div>
    );
    //{..input} is shortcut for redux-form; where you take all the input from "component's" props and pass it as
    //props to <input>
};

const renderTextArea = ({ input, label, meta, placeHolder }: any) => {
    return (
        <div className="postAdTextAreaWrap">
            {/* <label>{label}</label> */}
            <textarea
                className="createPostAdTextArea"
                {...input}
                autoComplete="off"
            />
            {renderError(meta)}
        </div>
    );
};

const renderDropDown = ({
    input,
    label,
    meta,
    placeHolder,
    optionValues,
}: any) => {
    return (
        <div>
            {/* <label>{label}</label> */}
            <select
                className="createPostAdDropDown"
                {...input}
                autoComplete="off"
            >
                <option></option>
                {optionValues.map((val) => (
                    <option key={val} value={val}>
                        {val}
                    </option>
                ))}
            </select>

            {renderError(meta)}
        </div>
    );
};

const formatAmount = (input) => {
    //For price input, from: https://blog.harveydelaney.com/redux-form-lifecycle-example/
    if (!input) return;
    if (isNaN(parseInt(input[input.length - 1], 10))) {
        return input.slice(0, -1);
    }
    return input.replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const normalizeAmount = (val) => {
    //For price input, from: https://blog.harveydelaney.com/redux-form-lifecycle-example/
    return val.replace(/,/g, "");
};

const renderFieldSectionLayout = (title: string, children: JSX.Element) => {
    return (
        <div className="postAdFieldSection">
            <div className="postAdFieldTitleWrap">
                <h1>{title}</h1>
            </div>
            {children}
        </div>
    );
};
const PostAdForm: React.FC<
    PostAdFormProps & InjectedFormProps<{}, PostAdFormProps>
> = (props) => {
    const location = useLocation();
    const openFileExplorer = useRef(null);
    const [listingImage, setListingImage] = useState(null);
    const [cloudinaryImage, setCloudinaryImage] = useState(null);
    useEffect(() => {
        props.fetchCategoriesForListing();
        if (props.cloudinaryImage) setCloudinaryImage(props.cloudinaryImage);
        //  props.dispatch(change("postAdForm", "price", props.listingPrice));
        // props.dispatch(change("postAdForm", "description", "hi"));
    }, []);

    const onSubmit = (formValues: any, dispatch: any) => {
        props.onSubmit(formValues);
    };

    const renderImageUpload = ({
        input,
        label,
        meta,
        placeHolder,
        optionValues,
    }: any) => {
        //We cannot pass in {...input} (so that the input is submited when onSubmit button is clicked) like our other renders because <input> has type="file"
        //Must do this instead: https://github.com/redux-form/redux-form/issues/3686
        //We do not have a name in <input> so that redux won't complain with validate (thus making this input optional)

        return (
            <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                ref={openFileExplorer}
                onChange={(...args) => {
                    //The input's text dosen't change but the input is actually inserted (do formValues.image below)
                    //  let event = args.map((val) => val.nativeEvent)[0];
                    input.onChange(...args);
                    //@ts-ignore
                    // setListingImage(URL.createObjectURL(event.target.files[0]));
                    //chagne also dosen't change the textbox input
                    // props.dispatch(
                    //     change("postAdForm", "image", event.target.files[0])
                    // );
                }}
            />
        );
    };

    const renderImage = () => {
        if (cloudinaryImage) {
            return {
                backgroundImage: `url(${cloudinaryImage})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundColor: "white",
            };
        } else if (!cloudinaryImage && listingImage) {
            return {
                backgroundImage: `url(${listingImage})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundColor: "white",
            };
        } else {
            return {
                backgroundImage: `url(${postAdListingImagePlaceHolder})`,
            };
        }
    };

    const renderFields = (): JSX.Element => {
        if (props.categories.length === 0) {
            return (
                <div className="loadingCenter">
                    <Loading />
                </div>
            );
        } else if (props.categories[0] === SERVER_ERROR_MESSAGE) {
            return (
                <div className="serverErrorContainer">
                    <h3 className="serverErrorText">{props.categories[0]}</h3>
                </div>
            );
        } else {
            return (
                <form
                    className="postAdForm"
                    onSubmit={props.handleSubmit(onSubmit)}
                >
                    {renderFieldSectionLayout(
                        "Ad Title",
                        <Field
                            name="title"
                            type="text"
                            // label="Ad Title"

                            component={renderAutoFocusTextInput}
                        />
                    )}
                    {renderFieldSectionLayout(
                        "Description",
                        <Field
                            name="description"
                            type="text"
                            component={renderTextArea}
                        />
                    )}
                    {renderFieldSectionLayout(
                        "Category",
                        <Field
                            name="category"
                            component={renderDropDown}
                            optionValues={props.categories}
                        ></Field>
                    )}

                    {renderFieldSectionLayout(
                        "Add a photo for your ad",
                        <React.Fragment>
                            <Field
                                name="image"
                                type="file"
                                component={renderImageUpload}
                                value={listingImage}
                                ref={openFileExplorer}
                                withRef
                                onChange={(event) => {
                                    //For some reason,
                                    //The input's text dosen't change but the input is actually inserted (do formValues.image below)
                                    setCloudinaryImage(null);
                                    setListingImage(
                                        URL.createObjectURL(
                                            event.target.files[0]
                                        )
                                    );

                                    // console.log(
                                    //     `Selected file - ${event.target.files[0].name}`
                                    // );
                                    //https://medium.com/@650egor/react-30-day-challenge-day-2-image-upload-preview-2d534f8eaaa
                                }}
                            />
                            <div className="imageUploadWrapper">
                                <input
                                    type="button"
                                    value={
                                        listingImage || cloudinaryImage
                                            ? ""
                                            : "Choose Files!"
                                    }
                                    className="postAdChooseListingImage"
                                    onClick={() => {
                                        openFileExplorer.current.click();
                                    }}
                                    style={renderImage()}
                                />

                                {(listingImage || props.cloudinaryImage) && (
                                    <h3
                                        className="removeUploadedImage"
                                        onClick={() => {
                                            setListingImage(null);
                                            setCloudinaryImage(null);
                                            props.dispatch(
                                                change(
                                                    "postAdForm",
                                                    "image",
                                                    null
                                                )
                                            );
                                        }}
                                    >
                                        Remove
                                    </h3>
                                )}
                            </div>
                        </React.Fragment>
                    )}
                    {renderFieldSectionLayout(
                        "Province",
                        <Field
                            name="province"
                            type="text"
                            component={renderDropDown}
                            optionValues={CANADIAN_PROVINCES.map((province) => {
                                return province.name;
                            })}
                        />
                    )}
                    {renderFieldSectionLayout(
                        "City",
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
                    )}
                    {renderFieldSectionLayout(
                        "Street",
                        <Field
                            name="street"
                            type="text"
                            component={renderTextInput}
                        />
                    )}

                    {renderFieldSectionLayout(
                        "Price ($ CAD)",
                        <Field
                            name="price"
                            type="text"
                            component={renderTextInput}
                            format={formatAmount}
                            normalize={normalizeAmount}
                        />
                    )}

                    <button className="postAdFormSubmit">
                        {location.pathname === "/post-ad"
                            ? "Post Your Ad"
                            : "Edit Your Ad"}
                    </button>
                    {location.pathname === "/post-ad" ? (
                        ""
                    ) : (
                        <button
                            className="deleteAd"
                            type="button"
                            onClick={props.onDelete}
                        >
                            Delete Ad
                        </button>
                    )}
                </form>
            );
        }
    };

    return <React.Fragment>{renderFields()}</React.Fragment>;
};

const validate = (
    formValues: EditOrPostAdFormValues
): FormErrors<EditOrPostAdFormValues> => {
    //MUST BE NAMED VALIDATE! Other names would be ignored by reduxForm(..)
    const errors: FormErrors<EditOrPostAdFormValues> = {};
    //If you return an empty object, redux form will assume everything is ok
    // console.log("FILE UPLOAD VALUE", formValues.image);
    if (!formValues.title) {
        //user did not enter title, so undefined
        errors.title = "You must enter a title";
        //Must be the same name as field name! The "error" property in {meta} would receive this
    }

    if (!formValues.description) {
        errors.description = "You must enter a description";
    }

    if (!formValues.category) {
        errors.category = "You must enter a category";
    }

    if (!formValues.province) {
        errors.province = "You must enter a province";
    }

    if (!formValues.city) {
        errors.city = "You must enter a city";
    }

    if (!formValues.street) {
        errors.street = "You must enter a street";
    }
    if (!formValues.price) {
        errors.price = "You must enter a price";
    }

    return errors;
    //Erors is going to be passed to renderInput's meta
};
const selector = formValueSelector("postAdForm");
//get form values with formvalueSelector
//https://redux-form.com/6.6.0/docs/api/formvalueselector.md/
const mapStateToProps = (state: StoreState) => {
    return {
        categories: state.categories,
        provinceValue: selector(state, "province"),
    };
};

export default connect(mapStateToProps, { fetchCategoriesForListing })(
    reduxForm<{}, EditOrPostAdFormValues>({
        form: "postAdForm",
        validate,
    })(PostAdForm)
);
