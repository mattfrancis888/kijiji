import React, { useState } from "react";
import { useHistory } from "react-router-dom";

interface PaginationProps {
    totalItems: number;
    itemLimit: number;
    currentPage: number;
    onClickCallback(pageNumber: number): void;
    query: string;
}

const Pagination: React.FC<PaginationProps> = (props) => {
    const history = useHistory();
    const [selectedPage, setSelectedPage] = useState(props.currentPage);

    const renderPageItems = (totalItems: number, itemLimit: number) => {
        let numberOfPageItems = Math.ceil(totalItems / itemLimit); //rounds up
        let pageItems = [];
        for (let i = 0; i < numberOfPageItems; i++) {
            pageItems.push(i + 1);
        }

        return (
            <ul className="pagination">
                {pageItems.map((pageNumber) => {
                    return (
                        <li
                            key={pageNumber}
                            onClick={() => {
                                setSelectedPage(pageNumber);
                                props.onClickCallback(pageNumber);
                                // history.push(`/listings/${pageNumber}`);
                                history.push({
                                    pathname: `/listings/${pageNumber}`,
                                    search: `${props.query}`,
                                });
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
        <React.Fragment>
            {renderPageItems(props.totalItems, props.itemLimit)}
        </React.Fragment>
    );
};

export default Pagination;
