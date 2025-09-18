import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logoutRedirection, openModel, closeModel, formatDateDyjs } from '../../config/commonFunction';
import Constatnt, { PUBLIC_URL } from '../../config/constant';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";
import Model from '../../component/Model';
import { LogoutComponent } from '../../pages/CommonPages/CommonComponent';
import { DateFormat, EMPLOYEE_STATUS, ModelName } from '../../config/commonVariable';

// /dist/images/logos/lone_logo.png
import { getCustomerListThunk, getEmpLeaveBalanceListThunk, getHolidayListThunk, getlistAttendanceThunk, getListBankDetailsThunk, getListDepartnmentThunk, getlistLeavesThunk, getSalaryListThunk, getSaturdayListThunk, setLoader, updatePageScroll, updateSlidebarToggle } from '../../Store/slices/MasterSlice';
import dayjs from 'dayjs';

const Header = ({ page_name }) => {

    const { customModel } = useSelector((state) => state.masterslice);
    const { slidebarToggle } = useSelector((state) => state.masterslice);


    const navigate = useNavigate();
    const location = useLocation();
    var userData = JSON.parse(localStorage.getItem(Constatnt.AUTH_KEY));

    const dispatch = useDispatch()
    // const [slidebarToggle, setIs_toggle] = useState(true);
    const [logoutModel, setLogoutModel] = useState(false);

    const handleLogout = (is_true) => {
        if (is_true) {
            // logout().then((response) => {
            // if (response?.code === Codes?.SUCCESS) {
            closeModel(dispatch)
            logoutRedirection();
            navigate('/')
            // }
            // })
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            dispatch(setLoader(true));
            try {
                const request = {
                    emp_leave_company: EMPLOYEE_STATUS[0]?.key
                };
                await Promise.all([
                    dispatch(getCustomerListThunk(request)),
                    dispatch(getListDepartnmentThunk({})),
                    dispatch(getListBankDetailsThunk(request)),
                    dispatch(getlistLeavesThunk(request)),
                    dispatch(getEmpLeaveBalanceListThunk(request)),
                    dispatch(getSaturdayListThunk({ year: formatDateDyjs(dayjs(), 'YYYY') })),
                    dispatch(getHolidayListThunk({ year: formatDateDyjs(dayjs(), DateFormat?.DATE_WEEK_NAME_FORMAT_YEAR) })),
                    dispatch(getSalaryListThunk({
                        month: formatDateDyjs(dayjs().subtract(1, 'month'), 'MM') || null,
                        year: formatDateDyjs(dayjs().subtract(1, 'month'), 'YYYY') || null,
                        emp_leave_company: "0"
                    }))
                ]);
            } finally {
                dispatch(setLoader(false)); // ✅ stops loader only after all are done
            }
        };
        fetchData();
    }, [dispatch]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    const btnClick = () => {
        console.log('button CLicked');
        console.log('slidebarToggle', slidebarToggle);
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

    useEffect(() => {
        dispatch(updatePageScroll(false))
    }, [location?.pathname])

    return (
        <>
            {/* <header className="app-header">
                <nav className="navbar navbar-expand-lg navbar-light">

                    <ul className="navbar-nav">
                        <li className="nav-item cursor_pointer" onClick={() => { dispatch(updateSlidebarToggle(!slidebarToggle)); btnClick(); }}>
                            <a className="nav-link sidebartoggler nav-icon-hover ms-n3" id="headerCollapse" >
                                <i className="ti ti-menu-2" />
                            </a>
                        </li>
                    </ul>
                    <div className="collapse navbar-collapse justify-content-end" id="">
                        <div className="d-flex align-items-center justify-content-between">
                            <a className="nav-link d-flex d-lg-none align-items-center justify-content-center" type="button" data-bs-toggle="offcanvas" data-bs-target="#mobilenavbar" aria-controls="offcanvasWithBothOptions">
                                <i className="ti ti-align-justified fs-7" />
                            </a>
                            <ul className="navbar-nav flex-row ms-auto align-items-center justify-content-center">

                                <li className="nav-item dropdown">
                                    <a className="nav-link pe-0 cursor_pointer " id="drop2" data-bs-toggle="dropdown" aria-expanded="false">
                                        <div className="d-flex align-items-center">
                                            <div className="user-profile-img">
                                                <img src={Constatnt?.Lone_LOGO} className="rounded-circle" width={40} height={40} alt="User Profile" />
                                            </div>
                                        </div>
                                    </a>

                                    <div className="dropdown-menu content-dd dropdown-menu-end dropdown-menu-animate-up" aria-labelledby="drop2">
                                        <div className="profile-dropdown position-relative" >
                                            <div className="py-3 px-7 pb-0">
                                                <h5 className="mb-0 fs-5 fw-semibold">User Profile</h5>
                                            </div>

                                            <div className="d-flex align-items-center py-9 mx-7 border-bottom">
                                                <img src={Constatnt?.Lone_LOGO} className="rounded-circle" width={60} height={40} alt="User Profile" />
                                                <div className="ms-3">
                                                    <h5 className="mb-1 fs-3">{'Admin'}</h5>
                                                    <p className="mb-0 d-flex text-dark align-items-center gap-2">
                                                        <i className="ti ti-mail fs-4" />{'admin@gmail.com'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="message-body">
                                                <Link to="/my_profile" className="py-8 px-7 mt-8 d-flex align-items-center">
                                                    <span className="d-flex align-items-center justify-content-center bg-light rounded-1 p-6">
                                                        <img src={PUBLIC_URL + "/dist/images/svgs/icon-account.svg"} alt="Account Icon" width={24} height={24} />
                                                    </span>
                                                    <div className="w-75 d-inline-block v-middle ps-3">
                                                        <h6 className="mb-1 bg-hover-primary fw-semibold">
                                                            My Profile
                                                        </h6>
                                                        <span className="d-block text-dark">Account Settings</span>
                                                    </div>
                                                </Link>
                                            </div>
                                            <div className="d-grid py-4 px-7 pt-8">
                                                <button onClick={() => { openModel(dispatch, ModelName.LOGOUT_MODEL) }} className="btn btn-primary w-100 py-8 mb-4 rounded-2">Log Out</button>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </header> */}

            <div className={`modal custom-modal modal-sm ${logoutModel ? "fade show " : "d-none"
                }`} id="al-danger-alert" tabIndex={-1} aria-labelledby="vertical-center-modal" aria-hidden="true">
                <div className="modal-dialog modal-sm">
                    <div className="modal-content modal-filled bg-light-danger">

                        <div className="modal-body p-4">
                            <div className="text-center text-danger">
                                <i class="ti ti-logout fs-9"></i>

                                <h3 className="mt-4  mb-4">Are you sure logout ?</h3>

                                <button type="button" className="btn btn-info m-2 align-items-center" onClick={() => { handleLogout() }} >
                                    Yes logout!
                                </button>
                                <button type="button" className="btn btn-light my-2 border shdow-sm" onClick={() => { setLogoutModel(false) }}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {
                logoutModel && (
                    <div className="modal-backdrop fade show"></div>
                )
            }

            {
                customModel.isOpen && customModel?.modalType === ModelName.LOGOUT_MODEL && (
                    <Model>
                        <LogoutComponent onConfirm={handleLogout} />
                    </Model >
                )
            }

        </>
    )

}

export default Header



