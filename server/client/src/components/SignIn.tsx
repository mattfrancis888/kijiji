import React, { useEffect } from "react";
import SignInForm, { SignInFormValues } from "./SignInForm";
import { signIn } from "../actions";
import { StoreState } from "../reducers";
import { connect } from "react-redux";
import history from "../browserHistory";
export interface SignInFormProps {
    onSubmit(formValues: any): void;
    authStatus?: string | null;
}

export interface SignInProps {
    signIn(formValues: any): void;
    authStatus?: string | null;
}

const SignIn: React.FC<SignInProps> = (props) => {
    //const history = useHistory();
    const onSubmitSignIn = async (formValues: SignInFormValues) => {
        props.signIn(formValues);
    };

    useEffect(() => {
        //If user is already logged in, they should be unable to visit this page
        if (props.authStatus) {
            history.push("/listings/1");
        }
    }, []);

    return (
        <div className="signInContainer">
            <div className="signInFormWrap">
                <SignInForm onSubmit={() => onSubmitSignIn} />
            </div>
            <div className="signInMiscWrap">
                <div className="registerNowContainer">
                    <h1>Not registered yet?</h1>
                    <p>
                        Register now to post, edit, and manage ads. It’s quick,
                        easy, and free!
                    </p>
                    <button className="registerNowButton">Register Now</button>
                </div>
                <div>
                    <h1>Protect Your Account</h1>
                    <p>
                        Ensure that whenever you sign in to Kijiji, the web
                        address in your browser starts with
                        https://www.kijiji.ca/
                    </p>
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

export default connect(mapStateToProps, { signIn })(SignIn);
