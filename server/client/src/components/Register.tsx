import React, { useEffect } from "react";
import RegisterForm, { RegisterFormValues } from "./RegisterForm";
import { StoreState } from "../reducers";
import { signUp } from "../actions";
import { connect } from "react-redux";
import history from "../browserHistory";

export interface RegisterFormProps {
    onSubmit(formValues: any): void;
    authStatus?: string | null;
}

export interface RegisterProps {
    signUp(formValues: any): void;
    authStatus?: string | null;
}

const Register: React.FC<RegisterProps> = (props) => {
    //const history = useHistory();
    const onSubmitRegister = async (formValues: RegisterFormValues) => {
        props.signUp(formValues);
    };

    useEffect(() => {
        //If user is already logged in, they should be unable to visit this page
        if (props.authStatus) {
            history.push("/listings/1");
        }
    }, []);

    return (
        <div className="registerContainer">
            <div className="registerFormWrap">
                <RegisterForm
                    onSubmit={(formValues: any) => onSubmitRegister(formValues)}
                />
            </div>
            <div className="registerMiscWrap">
                <div className="alreadyRegisteredContainer">
                    <h1>Already Registered?</h1>
                    <p>Sign in to post your ad</p>
                    <button className="alreadyRegisteredButton">Sign in</button>
                </div>
                <div className="whyRegisterContainer">
                    <h1>Why Register?</h1>
                    <p>
                        To enhance your Kijiji experience and help you stay safe
                        and secure, you now need to register to:
                    </p>
                    <ul>
                        <li>Post, edit and manage ads</li>
                        <li>
                            Access saved ads in your Favourites from all of your
                            devices
                        </li>
                        <li>
                            Easily promote multiple ads to gain more visibility
                            and view order history
                        </li>
                        <li>Reserve your own nickname</li>
                        <li>And much more!</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = (state: StoreState) => {
    return {
        authStatus: state.authStatus.authenticated,
    };
};
export default connect(mapStateToProps, { signUp })(Register);
