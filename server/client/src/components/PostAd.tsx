import React from "react";
import { Link } from "react-router-dom";
import requireAuth from "./requireAuth";

const PostAd: React.FC<{}> = () => {
    //const history = useHistory();
    return (
        <div>
            <h1>Post Ad Page</h1>
        </div>
    );
};

export default requireAuth(PostAd);
