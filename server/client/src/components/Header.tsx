import React from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { signOut } from "../actions";
import { StoreState } from "../reducers";
import CookieService from "../CookieService";

interface IHeader {
    authStatus?: string | null;
    signOut(): void;
}

const Header: React.FC<IHeader> = (props) => {
    const history = useHistory();
    return (
        <nav>
            <div className="headerInfoWrap">
                <Link to="/">
                    <img
                        className="logo"
                        src="https://i.gyazo.com/0a31f614433ad0e8d1ee0f13893d9f41.png"
                        alt="logo"
                    />
                </Link>
                <div className="headerProfileAndPostWrap">
                    <h1
                        className={
                            props.authStatus
                                ? "navAuthStatusHide"
                                : "navAuthStatus"
                        }
                        onClick={() => {
                            history.push("/signup");
                        }}
                    >
                        Register
                    </h1>
                    <h1
                        className={
                            props.authStatus
                                ? "navAuthStatusHide"
                                : "navAuthStatus"
                        }
                        onClick={() => {
                            history.push("/signin");
                        }}
                    >
                        Sign in
                    </h1>
                    <h1
                        className={
                            props.authStatus
                                ? "navAuthStatus"
                                : "navAuthStatusHide"
                        }
                        onClick={() => {
                            props.signOut();
                        }}
                    >
                        Sign Out
                    </h1>

                    <button
                        onClick={() => {
                            history.push("/post-ad");
                        }}
                        className="postAdButton"
                    >
                        Post Ad
                    </button>
                </div>
            </div>
        </nav>
    );
};

const mapStateToProps = (state: StoreState) => {
    return {
        authStatus: state.authStatus.authenticated,
    };
};

export default connect(mapStateToProps, { signOut })(Header);