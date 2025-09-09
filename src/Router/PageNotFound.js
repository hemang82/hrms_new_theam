import React from 'react';
import { Link } from 'react-router-dom';
import { PUBLIC_URL } from '../config/constant';
// import 'bootstrap/dist/css/bootstrap.css';

const PageNotFound = () => {
    return (
        <>
            <div className="position-relative overflow-hidden min-vh-100 d-flex align-items-center justify-content-center">
                <div className="d-flex align-items-center justify-content-center w-100">
                    <div className="row justify-content-center w-100">
                        <div className="col-lg-4">
                            <div className="text-center">
                                <img src={PUBLIC_URL + "/dist/images/backgrounds/errorimg.svg"} alt className="img-fluid" width={500} />
                                <h1 className="fw-semibold mb-7 fs-9">Opps!!!</h1>
                                <h4 className="fw-semibold mb-7">This page you are looking for could not be found.</h4>
                                <Link className="btn btn-primary" to={'/'} role="button">Go to Back</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PageNotFound;
