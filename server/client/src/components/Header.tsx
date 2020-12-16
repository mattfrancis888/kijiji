import React from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

const Header: React.FC<{}> = () => {
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
                    <h1 className="register">Register</h1>
                    <h1 className="signIn">Sign in</h1>
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

export default Header;
