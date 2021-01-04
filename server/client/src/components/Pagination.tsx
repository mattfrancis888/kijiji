import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { signOut } from "../actions";
import { StoreState } from "../reducers";

interface PaginationProps {
    totalItems: number;
    itemLimit: number;
    currentPage: number;
    onClickCallback(pageNumber: number): void;
}

const Pagination: React.FC<PaginationProps> = (props) => {
    const [selectedPage, setSelectedPage] = useState(props.currentPage);

    const renderPageItems = (totalItems: number, itemLimit: number) => {
        let numberOfPageItems = Math.ceil(totalItems / itemLimit); //rounds up
        let pageItems = [];
        for (let i = 0; i < numberOfPageItems; i++) {
            pageItems.push(i + 1);
        }
        console.log("PAGEITEMS LIST", pageItems);
        return (
            <ul className="pagination">
                {pageItems.map((pageNumber) => {
                    return (
                        <li
                            onClick={() => {
                                setSelectedPage(pageNumber);
                                props.onClickCallback(pageNumber);
                            }}
                            className={
                                selectedPage === pageNumber
                                    ? "pageItemSelected"
                                    : "pageItem"
                            }
                        >
                            {pageNumber}
                        </li>
                    );
                })}
            </ul>
        );
    };
    return (
        <div className="paginationWrap">
            {renderPageItems(props.totalItems, props.itemLimit)}
        </div>
    );
};

// const mapStateToProps = (state: StoreState) => {
//     return {
//         authStatus: state.authStatus.authenticated,
//     };
// };

export default connect(null, {})(Pagination);
