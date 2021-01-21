import React from "react";
import { Link } from "react-router-dom";
import history from "../browserHistory";
import { connect } from "react-redux";
import { signOut } from "../actions";
import { StoreState } from "../reducers";
import Searchbar from "./Searchbar";
import useWindowDimensions from "../windowDimensions";
import { MED_SCREEN_SIZE } from "../constants";
import kijijiLogo from "../img/kijijiLogo.png";

interface IHeader {
    authStatus?: string | null;
    signOut(): void;
}

const Header: React.FC<IHeader> = (props) => {
    const { width } = useWindowDimensions();

    return (
        <nav>
            <div className="headerInfoWrap">
                <img
                    className="logo"
                    src={kijijiLogo}
                    alt="logo"
                    data-testid="kijijiLogo"
                    onClick={() => history.push("/listings/1")}
                />

                <div
                    className={
                        width > MED_SCREEN_SIZE
                            ? "displaySearchbar"
                            : "hideSearchbar"
                    }
                >
                    <Searchbar />
                </div>
                {/* {width > MED_SCREEN_SIZE ? <Searchbar /> : null} */}

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
                    <h1
                        className={
                            props.authStatus
                                ? "profileText"
                                : "navAuthStatusHide"
                        }
                        onClick={() => {
                            history.push("/profile");
                        }}
                    >
                        Profile
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

                <div
                    className={
                        width < MED_SCREEN_SIZE
                            ? "displaySearchbar"
                            : "hideSearchbar"
                    }
                >
                    <Searchbar />
                </div>

                {/* {width < MED_SCREEN_SIZE ? <Searchbar /> : null} */}
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
