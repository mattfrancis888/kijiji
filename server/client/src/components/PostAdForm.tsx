import React, { ComponentType, useEffect } from "react";
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
//Re-usable component
export interface RegisterFormValues {
    title: string;
    description: string;
}

const renderError = ({ error, touched }: any) => {
    if (touched && error) {
        //Touched (for input) will be false at first
        //When clicked and then clicked otuside of the input, it will be true
        return <div className="errorText">{error}</div>;
    }
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
                {optionValues.map((hi) => (
                    <option value="#00ff00">{hi}</option>
                ))}
            </select>

            {renderError(meta)}
        </div>
    );
    //{..input} is shortcut for redux-form; where you take all the input from "component's" props and pass it as
    //props to <input>
};
const PostAdForm: React.FC<
    PostAdFormProps & InjectedFormProps<{}, PostAdFormProps>
> = (props) => {
    const onSubmit = (formValues: any, dispatch: any) => {
        //onSubmit's default param is any
        //event.preventDefault() is automatically called with handleSubmit, a redux-form property
        //form values are the values from the fields that redux-form automatiacally passes
        //after clicking the submit button
        //dispatch(reset("registerForm"));
        props.onSubmit(formValues);

        //dispatch(change("registerForm", "password", ""));
    };

    return (
        <React.Fragment>
            <form
                className="postAdForm"
                onSubmit={props.handleSubmit(onSubmit)}
            >
                <div className="postAdFieldSection">
                    <div className="postAdFieldTitleWrap">
                        <h1>Ad Title</h1>
                        <h3 className="authFormFieldTitleEmailInUse">
                            {props.authStatus}
                        </h3>
                    </div>
                    <Field
                        name="title"
                        type="text"
                        // label="Ad Title"
                        component={renderTextInput}
                    />
                </div>
                <div className="postAdFieldSection">
                    <div className="postAdFieldTitleWrap">
                        <h1>Description</h1>
                        <h3 className="authFormFieldTitleEmailInUse">
                            {props.authStatus}
                        </h3>
                    </div>
                    <Field
                        name="description"
                        type="text"
                        component={renderTextArea}
                    />
                </div>
                <div className="postAdFieldSection">
                    <div className="postAdFieldTitleWrap">
                        <h1>Category</h1>
                        <h3 className="authFormFieldTitleEmailInUse">
                            {props.authStatus}
                        </h3>
                    </div>
                    <Field
                        name="categoryOfAd"
                        component={renderDropDown}
                        optionValues={["black"]}
                    ></Field>
                </div>

                <button className="postAdFormSubmit">Post Your Ad</button>
            </form>
        </React.Fragment>
    );
};

const validate = (
    formValues: RegisterFormValues
): FormErrors<RegisterFormValues> => {
    //MUST BE NAMED VALIDATE! Other names would be ignored by reduxForm(..)
    const errors: FormErrors<RegisterFormValues> = {};
    //If you return an empty object, redux form will assume everything is ok
    if (!formValues.title) {
        //user did not enter title, so undefined
        errors.title = "You must enter a title";
        //Must be the same name as field name! The "error" property in {meta} would receive this
    }

    if (!formValues.description) {
        errors.description = "You must enter a description";
    }

    return errors;
    //Erors is going to be passed to renderInput's meta
};

// const mapStateToProps = (state: StoreState) => {
//     return {
//         authStatus: state.authStatus.errorMessage,
//     };
// };

export default connect()(
    reduxForm<{}, PostAdFormProps>({
        form: "postAdForm",
        validate,
    })(PostAdForm)
);
