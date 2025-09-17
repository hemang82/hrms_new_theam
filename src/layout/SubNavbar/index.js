import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Constatnt, { PUBLIC_URL } from '../../config/constant';
import { useDispatch, useSelector } from 'react-redux';
import { updateSlidebarToggle } from '../../Store/slices/MasterSlice';
import { PATHS } from '../../Router/PATHS';

export default function SubNavbar({ title, header, subHeader, subHeaderOnlyView }) {

    const { slidebarToggle } = useSelector((state) => state.masterslice);
    // const { userDetails: { data: userDetails }, } = useSelector((state) => state.masterslice);

    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const path = location?.pathname
    let splitPath = path?.split('/');

    var userDetails = JSON.parse(localStorage.getItem(Constatnt.AUTH_KEY));

    const btnClick = () => {
        const body = document.querySelector("body");
        if (body) {
            body.setAttribute("data-sidebartype", slidebarToggle ? "mini-sidebar" : "full");
        }
        const screenWidth = window.innerWidth;
        if (screenWidth <= 992) {
            const leftSideMenu = document.getElementById("left_side_menu_id");
            if (leftSideMenu) {
                leftSideMenu.style.display = slidebarToggle ? "none" : "block";
            }
        }
    };

    console.log('userDetailsuserDetails', userDetails);

    return (
        <>
            {/* </header> */}
            <div className="card bg-light-info shadow-none border-0 position-relative overflow-hidden make-header">
                <div className="card-body px-4 py-3">
                    <div className="row align-items-center">

                        <div className="col-12 col-md-9 d-flex align-items-center gap-3 mb-3 mb-md-0">
                            <button
                                type="button"
                                className="btn btn-light d-flex align-items-center justify-content-center p-2 shadow-sm rounded-circle"
                                onClick={() => {
                                    dispatch(updateSlidebarToggle(!slidebarToggle));
                                    btnClick();
                                }}
                            >
                                <i className="ti ti-menu-2 fs-5 text-custom-theam"></i>
                            </button>

                            {/* Breadcrumb */}
                            <nav aria-label="breadcrumb" className="ms-2">
                                <ol className="breadcrumb mb-0">
                                    <li className="breadcrumb-item">
                                        <Link to="/dashboard" className="text-decoration-none">Dashboard</Link>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <Link to={`/${splitPath?.[1]}`} className="text-decoration-none">
                                            {header}
                                        </Link>
                                    </li>
                                    {subHeader && (
                                        <li className="breadcrumb-item">
                                            <Link to={path} className="text-decoration-none">{subHeader}</Link>
                                        </li>
                                    )}
                                    {subHeaderOnlyView && (
                                        <li className="breadcrumb-item active" aria-current="page">
                                            {subHeaderOnlyView}
                                        </li>
                                    )}
                                </ol>
                            </nav>
                        </div>

                        <div
                            className="col-12 col-md-3 d-flex justify-content-md-end justify-content-center "
                        // onClick={() => navigate(PATHS?.MY_PROFILE)} // 🔗 Navigate to profile page
                        // style={{ cursor: "pointer" }}
                        >
                            <img
                                // src={`${process.env.PUBLIC_URL}/dist/images/logos/hrms_icon.png`}
                                src={userDetails?.profile_image || Constatnt?.DEFAULT_IMAGE}
                                alt="User Avatar"
                                className="rounded-circle me-2 d-none d-sm-block"
                                style={{ width: "40px", height: "40px", objectFit: "cover" }}
                            />
                            <div className="d-none d-sm-block text-end">
                                {userDetails?.email && (
                                    <div
                                        className="fw-semibold mb-0 "
                                        style={{ fontSize: "0.9rem" }}
                                    >
                                        {userDetails?.email}
                                    </div>
                                )}
                                {userDetails?.role && (
                                    <div
                                        className="fw-semibold mb-0 text-capitalize text-custom-theam"
                                        style={{ fontSize: "0.9rem" }}
                                    >
                                        {userDetails?.role == 1 ? 'Admin' : 'Sub Admin'}
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div >
        </>
    )
}
