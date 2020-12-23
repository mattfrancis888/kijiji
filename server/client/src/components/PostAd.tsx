import React from "react";
import { Link } from "react-router-dom";
import requireAuth from "./requireAuth";
import PostAdForm from "./PostAdForm";
export interface PostAdFormProps {
    onSubmit(formValues: any): void;
    //authStatus?: string | null;
}

const PostAd: React.FC<{}> = () => {
    return (
        <div className="postAdPageContainer">
            <h1>Post Your Ad, it's fast and easy</h1>
            <PostAdForm />
        </div>
    );
};

export default requireAuth(PostAd);
