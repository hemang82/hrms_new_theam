import React from 'react'

export const NoDataFound = () => {
    return (
        <>
            <div className="d-flex flex-column align-items-center justify-content-center text-muted py-5 border rounded-2 bg-light">
                <i className="bi bi-calendar-x fs-1 mb-3"></i>
                <h5 className="fw-semibold">No Data Found</h5>
            </div>

        </>
    )
}
