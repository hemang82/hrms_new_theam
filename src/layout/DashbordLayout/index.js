import React, { useEffect, useRef } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Slidebar from '../Slidebar';
import Header from '../Header';
import Constatnt from '../../config/constant';
import { updatePageScroll } from '../../Store/slices/MasterSlice';
import { useDispatch, useSelector } from 'react-redux';

export const DashboardLayout = ({ children }) => {

    const dispatch = useDispatch();
    let scrolltoTopRef = useRef();

    const pageScroll = useSelector((state) => state.masterslice.pageScroll);

    const islogin = localStorage.getItem(Constatnt.LOGIN_KEY);
    const token = localStorage.getItem(Constatnt.ACCESS_TOKEN_KEY);
    const auth = localStorage.getItem(Constatnt.AUTH_KEY);

    const navigate = useNavigate()
    const location = useLocation();

    const currentPath = location.pathname;
    const path = '/' + location?.pathname?.split('/')?.[1]

    console.log('pageScroll', pageScroll);
    console.log('pageScroll', location?.pathname);

    useEffect(() => {
        if (!islogin || !token || !auth) {
            navigate('/login');
        }
    }, [islogin, token, auth]);

    const scrollView = () => {
        if (scrolltoTopRef.current) {
            scrolltoTopRef.current.scrollIntoView({
                behavior: 'smooth'
            });
            dispatch(updatePageScroll(false))
        }
    };

    useEffect(() => {
        scrollView()
    }, [location?.pathname, pageScroll]);

    return (<>
        {/* <Slidebar />
        <div className="body-wrapper">
            <Header />
            {children}
            <Outlet />
        </div> */}

        <main className="main-content">
            {/* <div className="left-sidebar"> */}
            <Slidebar />
            {/* </div> */}
            {/* <div className="main-wrapper"> */}
            <div ref={scrolltoTopRef}>
                <div className="body-wrapper">

                    <header className={`header-dashboard`}>
                        <Header />
                    </header>

                    {children}
                    <Outlet />
                    {/* </div> */}
                </div>
            </div>
        </main >

    </>)
}

export default DashboardLayout;
