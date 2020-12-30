import React from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { signOut } from "../actions";
import { StoreState } from "../reducers";

interface IListings {
    authStatus?: string | null;
    signOut(): void;
}

const Listing: React.FC<IListings> = (props) => {
    const history = useHistory();
    return (
        <div>
            <h1>Ads </h1>
        </div>
    );
};

const mapStateToProps = (state: StoreState) => {
    return {};
};

export default connect(mapStateToProps, {})(Listing);
