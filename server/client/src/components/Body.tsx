import React from "react";
import RegisterForm from "./RegisterForm";

export interface RegisterFormProps {
    onSubmit(formValues: any): void;
}

export interface BodyProps {
    signUp(formValues: any): void;
}

const Body: React.FC<BodyProps> = (props) => {
    //const history = useHistory();
    const onSubmitRegister = async (formValues: any) => {
        // props.signUp(formValues);
        console.log(formValues);
    };

    return (
        <div>
            <RegisterForm onSubmit={onSubmitRegister} hi="Hi" />
        </div>
    );
};

export default Body;
