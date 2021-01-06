import React from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { signOut } from "../actions";
import { StoreState } from "../reducers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSlidersH, faSearch } from "@fortawesome/free-solid-svg-icons";
// interface IHeader {
//     authStatus?: string | null;
//     signOut(): void;
// }

const Searchbar: React.FC<{}> = (props) => {
    const history = useHistory();
    return (
        <form className="searchBarForm">
            <FontAwesomeIcon className="searchBarIcons" icon={faSlidersH} />
            <input
                className="searchBarInput"
                type="search"
                placeholder="Search..."
                aria-label="Search"
                name="search"
                // ref={this.searchRef}
            />
            <FontAwesomeIcon className="searchBarIcons" icon={faSearch} />
        </form>
    );
};

// const mapStateToProps = (state: StoreState) => {
//     return {
//         authStatus: state.authStatus.authenticated,
//     };
// };

export default connect(null, { signOut })(Searchbar);
