import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { TOAST_ERROR, TOAST_WARNING, TOAST_INFO, TOAST_SUCCESS, SWIT_SUCCESS, SWIT_DELETE, SWIT_DELETE_SUCCESS, SWIT_LOGOUT, logoutRedirection, Language, openModel, closeModel } from '../../config/commonFunction';
import Constatnt, { PUBLIC_URL } from '../../config/constant';
import * as API from '../../utils/api.services';
import Header from '../Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import { GiKnightBanner } from "react-icons/gi";
import { FaRegCalendarAlt, FaRegNewspaper, FaStackExchange, FaUsers } from "react-icons/fa";
import { TbBuildingBank, TbCoinRupee, TbDashboardFilled, TbMoneybag } from "react-icons/tb";
import { GrBlog, GrMoney, GrSettingsOption } from "react-icons/gr";
import { RiCoupon3Line, RiScalesLine } from "react-icons/ri";
import { PiFlagBannerFoldThin } from "react-icons/pi";
import { FiUsers } from "react-icons/fi";
import { TfiDashboard } from "react-icons/tfi";
import { FaNimblr } from "react-icons/fa";
import { BiCategory } from "react-icons/bi";
import { RiSecurePaymentLine } from "react-icons/ri";
import { MdOutlineContactMail, MdOutlineContactPhone, MdOutlineContentPaste, MdOutlineCoPresent, MdOutlineDateRange } from "react-icons/md";
import { BsCalendarDate, BsCardHeading } from "react-icons/bs";
import { ModelName } from '../../config/commonVariable';
import { FaMoneyBillTransfer } from "react-icons/fa6";
import Model from '../../component/Model';
import { LogoutComponent } from '../../pages/CommonPages/CommonComponent';
import { IoCalendarOutline, IoLogOutOutline } from "react-icons/io5";
import { LuCalendarSync, LuHandCoins } from "react-icons/lu";
import { updateSlidebarToggle } from '../../Store/slices/MasterSlice';
import { PATHS } from '../../Router/PATHS';
import { FcLeave } from "react-icons/fc";
import { CiCalendarDate } from "react-icons/ci";
import { CgList } from "react-icons/cg";

const Slidebar = () => {

    let navigate = useNavigate();
    let dispatch = useDispatch();
    let location = useLocation();

    let path = '/' + location?.pathname?.split('/')?.[1]
    const { customModel } = useSelector((state) => state.masterslice);
    const { slidebarToggle } = useSelector((state) => state.masterslice);

    // const logouthandle = async () => {
    //     SWIT_LOGOUT().then(async (result) => {
    //         if (result.isConfirmed) {
    //             let { code, message } = await API.logout();
    //             if (code === '1') {
    //                 TOAST_SUCCESS(message);
    //                 logoutRedirection();
    //                 navigate('/login');
    //             }
    //         }
    //     });
    // }

    const [hideSpans, setHideSpans] = useState(true);
    var AdminData = JSON.parse(localStorage.getItem(Constatnt.AUTH_KEY));
    console.log('AdminData', AdminData?.role);
    const [isActive, setIsActive] = useState(false);

    const handleClick = () => {
        setIsActive(!isActive);
    }

    const [expanded, setExpanded] = useState(false);
    // const [slidebarToggle, setIs_toggle] = useState(true);
    const [toggletype, setTogalType] = useState("full");

    const toggleMenu = (menuName) => {
        setExpanded((prev) => ({
            ...prev,
            [menuName]: !prev[menuName],
        }));
    };

    // useEffect(() => {
    //     if (location.pathname !== '/category_list' && location.pathname !== '/filter_category_list') {
    //         setExpanded(false);
    //     } else {
    //         setExpanded(true);
    //     }
    // }, [location.pathname]);
    // const { userPermition: { data: adminPermitions }, } = useSelector((state) => state.userPermition);

    const handleLogout = (is_true) => {
        if (is_true) {
            // logout().then((response) => {
            // if (response?.code === Codes?.SUCCESS) {
            closeModel(dispatch)
            logoutRedirection();
            navigate('/login')
            // }
            // })
        }
    };

    // const btnClick = (newToggleState) => {
    //     const body = document.querySelector("body");
    //     if (body) {
    //         body.setAttribute("data-sidebartype", newToggleState ? "mini-sidebar" : "full");
    //     }
    //     const screenWidth = window.innerWidth;
    //     if (screenWidth <= 992) {
    //         const leftSideMenu = document.getElementById("left_side_menu_id");
    //         if (leftSideMenu) {
    //             leftSideMenu.style.display = newToggleState ? "none" : "block";
    //         }
    //     }
    // };

    // const sidebarType = document.body.getAttribute("data-sidebartype");

    // useEffect(() => {
    //     console.log('sidebarTypesidebarType', sidebarType);
    //     if (sidebarType == 'full') {
    //         updateSlidebarToggle(false)
    //     } else {
    //         updateSlidebarToggle(true)
    //     }
    // }, [sidebarType])

    return (
        <>
            {/* <div className="page-wrapper" id="main-wrapper" data-layout="vertical" data-navbarbg="skin6" data-sidebartype="full" data-sidebar-position="fixed" data-header-position="fixed"> */}
            {/* Sidebar Start */}
            <aside className="left-sidebar">
                {/* Sidebar scroll*/}
                <div>
                    <div className="brand-logo d-flex align-items-center justify-content-between mb-2">

                        {/* {
                            !slidebarToggle ?
                                <> <img
                                    src={PUBLIC_URL + "/dist/images/logos/true_pay_icon.png"}
                                    className="dark-logo ms-4 noLogoShowing2"
                                    width={50}
                                    height={40}
                                    alt="Mini Logo"
                                />
                                    <Link to={'/'} className="text-nowrap logo-img text-center d-flex ms-0 m-2 noLogoShowing">
                                        <img src={Constatnt?.APP_LOGO} className="dark-logo m-2" width={140} height={40} alt />
                                    </Link>
                                </> :
                                <Link to={'/'} className="text-nowrap logo-img text-center d-flex m-2 ms-5">
                                    <img src={Constatnt?.APP_LOGO} className="dark-logo m-2" width={140} height={40} alt />
                                </Link>
                        } */}

                        <Link to={'/'} className="text-nowrap logo-img text-center d-flex m-2 ms-3">
                            <img src={Constatnt?.APP_LOGO} className="dark-logo m-2" width={200} height={60} alt />
                        </Link>

                        {/* <img src={PUBLIC_URL + "/dist/images/Group 25.png"} className="dark-logo p-2 m-2 " width={200} alt /> */}
                        {/* <img src={PUBLIC_URL + "/dist/images/logos/light-logo.svg"} className="light-logo" width={180} alt /> */}
                        {/* </Link> */}
                        {/* <Link to={'/'} className="text-nowrap logo-img text-center d-flex header_logo">
                            <img src={PUBLIC_URL + "/dist/images/logo.svg"} className="dark-logo p-2 m-2 " width={60} alt />
                        </Link> */}

                        {/* <div className="close-btn d-lg-none d-block sidebartoggler cursor-pointer" id="sidebarCollapse"
                            onClick={() => {
                                const newToggle = !is_toggle;
                                btnClick(newToggle);
                                setIs_toggle(newToggle);
                            }}>
                            <i className="ti ti-x fs-8 text-muted" />
                        </div> */}

                        <div
                            className="close-btn d-lg-none d-block sidebartoggler cursor-pointer"
                            id="sidebarCollapse"
                            onClick={() => {
                                // const newToggle = !slidebarToggle;
                                // btnClick(newToggle);
                                // setIs_toggle(newToggle);
                                // btnClick(!slidebarToggle);
                                updateSlidebarToggle(!slidebarToggle)
                            }}
                        >
                            <i className="ti ti-x fs-8 text-muted me-3" />
                        </div>
                    </div>

                    {/* Sidebar navigation*/}
                    <nav className="sidebar-nav scroll-sidebar" data-simplebar>
                        <ul id="sidebarnav">

                            <li className={`sidebar-item ${path === "/dashboard" || path === "/" ? "selected" : ""}`}>
                                <Link to={'/dashboard'} className={`sidebar-link ${path === "/dashboard" || path === "/" ? "active" : ""}`} aria-expanded="false">
                                    <span>
                                        <TfiDashboard style={{ fontSize: '1.2rem' }} />
                                    </span>
                                    <span className="hide-menu">Dashboard</span>
                                </Link>
                            </li>

                            <li className={`sidebar-item ${path === "/user_list" ? "selected" : ""}`}>
                                <Link to={'/user_list'} className={`sidebar-link ${path === "/user_list" ? "active" : ""}`} aria-expanded="false">
                                    <span>
                                        <FiUsers style={{ fontSize: '1.2rem' }} />
                                    </span>
                                    <span className="hide-menu">Employee</span>
                                </Link>
                            </li>

                            {/* 
                            <li className={`sidebar-item ${path === "/loan_list" ? "selected" : ""}`}>
                                <Link to={'/loan_list'} className={`sidebar-link ${path === "/loan_list" ? "active" : ""}`} aria-expanded="false">
                                    <span>
                                        <LuHandCoins style={{ fontSize: '1.2rem' }} />
                                    </span>
                                    <span className="hide-menu">Loan</span>
                                </Link>
                            </li> */}



                            {/* <li className={`sidebar-item ${path === "/interest_list" ? "selected" : ""}`}>
                                <Link to={'/interest_list'} className={`sidebar-link ${path === "/interest_list" ? "active" : ""}`} aria-expanded="false">
                                    <span>
                                        <TbMoneybag style={{ fontSize: '1.2rem' }} />
                                    </span>
                                    <span className="hide-menu">Interest Rate</span>
                                </Link>
                            </li> */}

                            {/* <li className={`sidebar-item ${path === "/processing_fee_list" ? "selected" : ""}`}>
                                <Link to={'/processing_fee_list'} className={`sidebar-link ${path === "/processing_fee_list" ? "active" : ""}`} aria-expanded="false">
                                 
                                    <span>
                                        <TbCoinRupee style={{ fontSize: '1.2rem' }} />
                                    </span>
                                    <span className="hide-menu">Processing Fee</span>
                                </Link>
                            </li> */}


                            <li className={`sidebar-item ${path === PATHS.ATTENDANCE_LIST ? "selected" : ""}`}>
                                <Link to={PATHS.ATTENDANCE_LIST} className={`sidebar-link ${path === PATHS.ATTENDANCE_LIST ? "active" : ""}`} aria-expanded="false">
                                    <span>
                                        <LuCalendarSync  style={{ fontSize: '1.2rem' }} />
                                    </span>
                                    <span className="hide-menu">Attendance</span>
                                </Link>
                            </li>
                            
                            <li className={`sidebar-item ${path === PATHS.LEAVE_LIST ? "selected" : ""}`}>
                                <Link to={PATHS.LEAVE_LIST} className={`sidebar-link ${path === PATHS.LEAVE_LIST ? "active" : ""}`} aria-expanded="false">
                                    <span>
                                        <MdOutlineCoPresent style={{ fontSize: '1.2rem' }} />
                                    </span>
                                    <span className="hide-menu">Leave</span>
                                </Link>
                            </li>
                            <li className={`sidebar-item ${path === PATHS.LEAVE_BALANCE_LIST ? "selected" : ""}`}>
                                <Link to={PATHS.LEAVE_BALANCE_LIST} className={`sidebar-link ${path === PATHS.LEAVE_BALANCE_LIST ? "active" : ""}`} aria-expanded="false">
                                    <span>
                                        <RiScalesLine  style={{ fontSize: '1.2rem' }} />
                                    </span>
                                    <span className="hide-menu">Leave Balance</span>
                                </Link>
                            </li>

                            <li className={`sidebar-item ${path === PATHS.SALARY_LIST ? "selected" : ""}`}>
                                <Link to={PATHS.SALARY_LIST} className={`sidebar-link ${path === PATHS.SALARY_LIST ? "active" : ""}`} aria-expanded="false">
                                    <span>
                                        <GrMoney style={{ fontSize: '1.2rem' }} />
                                    </span>
                                    <span className="hide-menu">Salary</span>
                                </Link>
                            </li>


                            <li className={`sidebar-item ${path === PATHS?.HOLIDAYS_LIST ? "selected" : ""}`}>
                                <Link to={PATHS?.HOLIDAYS_LIST} className={`sidebar-link ${path === PATHS?.HOLIDAYS_LIST ? "active" : ""}`} aria-expanded="false">
                                    <span>
                                        <IoCalendarOutline style={{ fontSize: '1.2rem' }} />
                                    </span>
                                    <span className="hide-menu">Holidays</span>
                                </Link>
                            </li>



                            <li className={`sidebar-item ${path === PATHS.SATERDAY_LIST ? "selected" : ""}`}>
                                <Link to={PATHS.SATERDAY_LIST} className={`sidebar-link ${path === PATHS.SATERDAY_LIST ? "active" : ""}`} aria-expanded="false">
                                    <span>
                                        <MdOutlineDateRange style={{ fontSize: '1.2rem' }} />
                                    </span>
                                    <span className="hide-menu">Saturday</span>
                                </Link>
                            </li>

                            <li className={`sidebar-item ${path === PATHS.BANK_DETAILS_LIST ? "selected" : ""}`}>
                                <Link to={PATHS.BANK_DETAILS_LIST} className={`sidebar-link ${path === PATHS.BANK_DETAILS_LIST ? "active" : ""}`} aria-expanded="false">
                                    <span>
                                        <TbBuildingBank style={{ fontSize: '1.2rem' }} />
                                    </span>
                                    <span className="hide-menu">Bank Details</span>
                                </Link>
                            </li>

                            <li className={`sidebar-item ${path === PATHS.DEPARTNMENT_LIST ? "selected" : ""}`}>
                                <Link to={PATHS.DEPARTNMENT_LIST} className={`sidebar-link ${path === PATHS.DEPARTNMENT_LIST ? "active" : ""}`} aria-expanded="false">
                                    <span>
                                        <CgList style={{ fontSize: '1.2rem' }} />
                                    </span>
                                    <span className="hide-menu">Department</span>
                                </Link>
                            </li>

                            {/* <li className={`sidebar-item ${path === "/contact_us_list" ? "selected" : ""}`}>
                                <Link to={'/contact_us_list'} className={`sidebar-link ${path === "/contact_us_list" ? "active" : ""}`} aria-expanded="false">
                                    <span>
                                        <MdOutlineContactPhone style={{ fontSize: '1.2rem' }} />
                                    </span>
                                    <span className="hide-menu">Contact Us</span>
                                </Link>
                            </li> */}

                            <li className={`sidebar-item  `} onClick={() => { openModel(dispatch, ModelName.LOGOUT_MODEL) }} style={{ cursor: 'pointer' }}>
                                <Link className={`sidebar-link`} aria-expanded="false" >
                                    <span>
                                        <IoLogOutOutline style={{ fontSize: '1.2rem' }} />
                                    </span>
                                    <span className="hide-menu">Logout</span>
                                </Link>
                            </li>


                        </ul>
                    </nav>

                    <div className="fixed-profile p-3 bg-light-secondary rounded sidebar-ad mt-3">
                        <div className="hstack gap-3">
                            <div className="john-img">
                                <img src="../../dist/images/profile/user-1.jpg" className="rounded-circle" width={40} height={40} alt />
                            </div>
                            <div className="john-title">
                                <h6 className="mb-0 fs-4 fw-semibold">Mathew</h6>
                                <span className="fs-2 text-dark">Designer</span>
                            </div>
                            <button className="border-0 bg-transparent text-primary ms-auto" tabIndex={0} type="button" aria-label="logout" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="logout">
                                <i className="ti ti-power fs-6" />
                            </button>
                        </div>
                    </div>

                </div>
            </aside>

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

export default Slidebar
