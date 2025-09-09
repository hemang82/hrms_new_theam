import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { pageSet, updatePageScroll } from '../Store/slices/MasterSlice';

const Pagination = ({ per_page, pageCount, onPageChange, page, lableName }) => {
    const dispatch = useDispatch()
    const [currentPage, setCurrentPage] = useState();
    const totalPages = Math.ceil(pageCount / per_page) || 4;

    useEffect(() => {
        setCurrentPage(page);
        dispatch(updatePageScroll(true))
    }, [page]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            onPageChange(newPage);
        }
    };

    const renderPageItems = () => {
        const pageItems = [];
        const maxVisiblePages = 3;
        let startPage = currentPage - Math.floor(maxVisiblePages / 2);
        startPage = Math.max(startPage, 1);
        const endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(endPage - maxVisiblePages + 1, 1);
        }

        for (let onepage = startPage; onepage <= endPage; onepage++) {

            const isDataAvailable = pageCount > 0;
            const isActive = currentPage === onepage;

            if (isDataAvailable) {

                const buttonClass = `page-link font_18 ${isActive ? `text-dark active-link-pagination` : 'text-muted'}`;
                const listItemClass = `page-item ${isActive ? 'text-dark ' : 'text-muted'}`;
                // const listItemStyle = isActive ? 'active-link-pagination' : '';

                pageItems?.push(
                    <li key={onepage} className={listItemClass}>
                        <button
                            className={buttonClass}
                            onClick={() => !isActive && handlePageChange(onepage)}
                            disabled={isActive}
                            style={{ color: 'black', backgroundColor: 'white' }}
                        >
                            {onepage}
                        </button>
                    </li>
                );
            }
        }
        return pageItems;
    };

    return (
        <>
            {per_page < pageCount ? (<>
                <div className="showing-results border-top ">
                    <nav aria-label="Page navigation example" className="pagination-container border-bottom mt-4 mb-0">
                        <ul className="pagination ">
                            {/* Always render the first page button but disable it on the first page */}
                            <li className={`page-item  ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button
                                    className="page-link text-dark"
                                    aria-label="First"
                                    onClick={() => handlePageChange(1)}

                                    disabled={currentPage === 1}
                                >
                                    <span aria-hidden="true">«</span>
                                </button>
                            </li>

                            {/* Always render the previous button but disable it on the first page */}
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button
                                    className="page-link text-dark"
                                    aria-label="Previous"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    <span aria-hidden="true">&lt;</span>
                                </button>
                            </li>

                            {/* Render page items */}
                            {renderPageItems()}

                            {/* Always render the next button but disable it on the last page */}
                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                <button
                                    className="page-link text-dark"
                                    aria-label="Next"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    <span aria-hidden="true">&gt;</span>
                                </button>
                            </li>

                            {/* Always render the last page button but disable it on the last page */}
                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                <button
                                    className="page-link text-dark"
                                    aria-label="Last"
                                    onClick={() => handlePageChange(totalPages)}
                                    disabled={currentPage === totalPages}
                                >
                                    <span aria-hidden="true">»</span>
                                </button>
                            </li>
                        </ul>
                        <p className="text-capitalize showing-text ms-1 ">

                            Showing {currentPage} to {Math.min(currentPage * per_page, pageCount) || 0} of {pageCount} entries
                            {/* Showing {Math.min(currentPage * per_page, pageCount) || 0} of {pageCount || 0} {lableName} */}
                        </p>
                    </nav>
                </div>
            </>) : null
            }
        </>);
};

export default Pagination;