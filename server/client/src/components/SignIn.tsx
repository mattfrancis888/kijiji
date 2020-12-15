import React from "react";
import SignInForm from "./SignInForm";

export interface SignInFormProps {
    onSubmit(formValues: any): void;
}

export interface SignInProps {
    signUp(formValues: any): void;
}

const SignIn: React.FC<SignInProps> = (props) => {
    //const history = useHistory();
    const onSubmitSignIn = async (formValues: any) => {
        // props.signUp(formValues);
        console.log(formValues);
    };

    return (
        <div className="signInContainer">
            <div className="signInFormWrap">
                <SignInForm onSubmit={onSubmitSignIn} />
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

export default SignIn;
