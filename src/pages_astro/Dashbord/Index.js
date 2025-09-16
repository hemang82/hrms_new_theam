

import React, { useEffect, useState } from 'react'
import * as API from '../../utils/api.services';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import CountUp from 'react-countup';
import { Codes, PUBLIC_URL } from '../../config/constant';
import { PATHS } from '../../Router/PATHS';
import SubNavbar from '../../layout/SubNavbar';

const Index = () => {

    const [dashboard, setDashboard] = useState({});
    const fetchDashboardData = async () => {
        try {
            const res = await API.DashboardCount({});
            if (res?.code == Codes.SUCCESS) {
                setDashboard(res?.data);
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

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
            </div>
        </>
    );
}

export default Index;
