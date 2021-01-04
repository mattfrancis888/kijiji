import React from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { signOut } from "../actions";
import { StoreState } from "../reducers";

const Pagination: React.FC<{}> = (props) => {
    return (
        <div className="paginationWrap">
            <ul className="pagination">
                <li className="pageItemSelected">1</li>
                <li className="pageItem">2</li>
                <li className="pageItem">3</li>
            </ul>
        </div>
    );
};

// const mapStateToProps = (state: StoreState) => {
//     return {
//         authStatus: state.authStatus.authenticated,
//     };
// };

export default connect(null, {})(Pagination);
