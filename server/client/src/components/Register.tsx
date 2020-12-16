import React from "react";
import RegisterForm from "./RegisterForm";
import { StoreState } from "../reducers";
import { signUp } from "../actions";
import { connect } from "react-redux";
export interface RegisterFormProps {
    onSubmit(formValues: any): void;
}

export interface RegisterProps {
    signUp(formValues: any): void;
}

const Register: React.FC<RegisterProps> = (props) => {
    //const history = useHistory();
    const onSubmitRegister = async (formValues: any) => {
        props.signUp(formValues);
        console.log(formValues);
    };

    return (
        <div className="registerContainer">
            <div className="registerFormWrap">
                <RegisterForm onSubmit={onSubmitRegister} />
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
