

import React, { useEffect, useState } from 'react'
import Header from '../../layout/Header'
import * as API from '../../utils/api.services';
import { useDispatch, useSelector } from 'react-redux';
import { setLoader } from '../../Store/slices/MasterSlice';
import { Link } from 'react-router-dom';
import CountUp from 'react-countup';
import OwlCarousel from 'react-owl-carousel';
import { Codes, PUBLIC_URL } from '../../config/constant';
import { PATHS } from '../../Router/PATHS';
import SubNavbar from '../../layout/SubNavbar';

const Index = () => {

    let dispatch = useDispatch();
    const { listAllLoan: { data: loanList }, } = useSelector((state) => state.masterslice);
    const { customerList: { data: customerList }, } = useSelector((state) => state.masterslice);

    const [dashboard, setDashboard] = useState({});

    const fetchDashboardData = async () => {
        try {
            // dispatch(setLoader(true));
            const res = await API.DashboardCount({});
            if (res?.code == Codes.SUCCESS) {
                setDashboard(res?.data);
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            // dispatch(setLoader(false));
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    // Sample data for astrologer ratings and consultations

    const astrologerData = [
        ['John Doe', 5, 'Astrologer', 320, '2019-12-01'],
        ['Jane Smith', 4, 'Astrologer', 240, '2020-12-05'],
        ['Mike Johnson', 3, 'Astrologer', 200, '2021-12-15'],
        ['Emma White', 5, 'Astrologer', 410, '2021-12-20'],
        ['Sophia Brown', 4, 'Astrologer', 310, '2021-12-22'],
    ];

    // Process the data for astrologer ratings and consultations
    const preprocessAstrologerData = (data) => {
        const aggregatedData = {};

        data.forEach(([name, rating, profession, sessions, date]) => {
            if (sessions === '-') sessions = 0; // Handle missing sessions
            const [year, month] = date.split('-').slice(0, 2);

            const key = `${year}-${month}`;
            if (!aggregatedData[key]) {
                aggregatedData[key] = { sessions: 0, rating: 0 };
            }

            aggregatedData[key].sessions += parseInt(sessions);
            aggregatedData[key].rating += parseInt(rating);
        });

        return Object.entries(aggregatedData).map(([key, { sessions, rating }]) => ({
            date: key,
            sessions,
            rating: (rating / 5).toFixed(1), // Average rating for the month
        }));
    };

    const astrologerStats = preprocessAstrologerData(astrologerData);

    // AstroTalk consultation chart (Line Chart)

    const dashboardCards = [
        {
            title: "Total Employee",
            icon: "/dist/images/svgs/tabler-icon-users.svg",
            value: dashboard?.total_employee_count,
            link: PATHS?.EMPLOYEE_LIST
        },
        {
            title: "Total Present",
            icon: "/dist/images/svgs/tabler-icon-users.svg",
            value: dashboard?.present_count,
            link: PATHS?.ATTENDANCE_LIST
        },
        {
            title: "Total Absent",
            icon: "/dist/images/svgs/tabler-icon-users.svg",
            value: dashboard?.absent_count,
            link: PATHS?.ATTENDANCE_LIST
        },
        // {
        //     title: "Total Reject Loan",
        //     icon: "/dist/images/svgs/iconimg.svg",
        //     value: dashboard?.REJECTED,
        //     link: "/loan_list"
        // },
    ];

    return (
        <>
            <div className="container-fluid mw-100">
                <SubNavbar />
                {/* <OwlCarousel className="owl-theme"
                    margin={10}
                    nav
                    autoplay
                    autoplayTimeout={1000}
                    autoplayHoverPause
                    key={dashboard?.total_loans && dashboard?.total_users ? "123" : "145"}
                >
                   

                    <div className="item">
                        <div className="card border-1  zoom-in them-light shadow-sm">
                            <div className="card-body">
                                <Link to={'/user_list'} className="text-center">
                                    <img src={PUBLIC_URL + "/dist/images/svgs/tabler-icon-users.svg"} width={50} height={50} className="mb-3" alt="Consultation Icon" />
                                    <p className="fw-semibold fs-3 text-dark mb-1">Total User Count</p>
                                    <h5 className="fw-semibold text-dark mb-0">
                                        {<CountUp start={0} end={dashboard?.total_users} duration={3} separator="," />}
                                    </h5>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="item">
                        <div className="card border-1 zoom-in shadow-sm them-light">
                            <div className="card-body">
                                <Link to={'/loan_list'} className="text-center">
                                    <img src={PUBLIC_URL + "/dist/images/svgs/iconimg.svg"} width={50} height={50} className="mb-3" alt="User Icon" />
                                    <p className="fw-semibold fs-3 text-dark mb-1">Loans Request Loan</p>
                                    <h5 className="fw-semibold text-dark mb-0">{<CountUp start={0} end={dashboard?.total_loans} duration={3} separator="," />}</h5>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="item">
                        <div className="card border-1  zoom-in them-light shadow-sm">
                            <div className="card-body">
                                <Link to={'/loan_list'} className="text-center">
                                    <img src={PUBLIC_URL + "/dist/images/svgs/iconimg.svg"} width={50} height={50} className="mb-3" alt="User Icon" />
                                    <p className="fw-semibold fs-3 text-dark mb-1">Total Approve Loan</p>
                                    <h5 className="fw-semibold text-dark mb-0">
                                        {<CountUp start={0} end={dashboard?.total_approved_loans} duration={3} separator="," />}
                                    </h5>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="item">
                        <div className="card border-1  zoom-in them-light shadow-sm">
                            <div className="card-body">
                                <Link to={'/loan_list'} className="text-center">
                                    <img src={PUBLIC_URL + "/dist/images/svgs/iconimg.svg"} width={50} height={50} className="mb-3" alt="User Icon" />
                                    <p className="fw-semibold fs-3 text-dark mb-1">Total Cancel Loan</p>
                                    <h5 className="fw-semibold text-dark mb-0">
                                        {<CountUp start={0} end={dashboard?.total_cancelled_loans} duration={3} separator="," />}
                                    </h5>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="item">
                        <div className="card border-1  zoom-in them-light shadow-sm">
                            <div className="card-body">
                                <Link to={'/loan_list'} className="text-center">
                                    <img src={PUBLIC_URL + "/dist/images/svgs/iconimg.svg"} width={50} height={50} className="mb-3" alt="User Icon" />
                                    <p className="fw-semibold fs-3 text-dark mb-1">Total Reject Loan</p>
                                    <h5 className="fw-semibold text-dark mb-0">
                                        {<CountUp start={0} end={dashboard?.total_rejected_loans} duration={3} separator="," />}
                                    </h5>
                                </Link>
                            </div>
                        </div>
                    </div>

                   
                </OwlCarousel> */}

                <div className="row">
                    {dashboardCards?.map((card, index) => (
                        <div className="col-12 col-sm-6 col-md-2 col-lg-3 " key={index}>
                            <div className="card border-1 zoom-in them-light shadow-sm">
                                <div className="card-body text-center">
                                    <Link to={card.link}>
                                        <img src={PUBLIC_URL + card.icon} width={35} height={35} className="mb-3" alt="Icon" />
                                        <p className="fw-semibold fs-5 text-dark mb-1">{card.title}</p>
                                        <h4 className="fw-semibold  text-dark mb-0">
                                            <CountUp start={0} end={card?.value || 0} duration={3} separator="," />
                                        </h4>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Row 2: Astrologer Ratings and Consultation Data */}
                {/* <div className="row mt-3">
                    <div className="col-lg-6">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h4 className="header-title mb-3">Astrologer Ratings</h4>
                                <div>
                                    <ReactECharts
                                        option={ratingOption}
                                        notMerge={true}
                                        lazyUpdate={true}
                                        theme={'light'}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-6">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h4 className="header-title mb-3">Consultations Over Time</h4>
                                <div>
                                    <ReactECharts
                                        option={consultationOption}
                                        notMerge={true}
                                        lazyUpdate={true}
                                        theme={'light'}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}
            </div>
        </>
    );
}

export default Index;
