import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import React, { lazy, Suspense, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Constatnt from '../config/constant';
import { PATHS } from './PATHS.js';

export const Loadable = (Component) => (props) => {
    return (
        <Suspense>
            <Component {...props} />
        </Suspense>
    );
};

const Spinner = Loadable(lazy(() => import("../component/Spinner")));
const Login = Loadable(lazy(() => import("../pages/auth/Login")));
const PageNotFound = Loadable(lazy(() => import("./PageNotFound")));
const MyProfile = Loadable(lazy(() => import("../pages_astro/MyProfile/index.js")));
const ChangePassword = Loadable(lazy(() => import("../pages_astro/MyProfile/ChangePassword.js")));

const DashboardLayout = Loadable(lazy(() => import("../layout/DashbordLayout")));

const Dashboard = Loadable(lazy(() => import("../pages_astro/Dashbord/Index.js")));

const MangeCustomer = Loadable(lazy(() => import("../pages_astro/ManageCustomer/index.js")));
const AddCustomer = Loadable(lazy(() => import("../pages_astro/ManageCustomer/AddCustomer.js")));
const ViewCustomerDetials = Loadable(lazy(() => import("../pages_astro/ManageCustomer/ViewCustomer.js")));

const ContactUs = Loadable(lazy(() => import("../pages_astro/ContectUs")));
const ManageFaq = Loadable(lazy(() => import("../pages_astro/ManageFaq")));
const ContectUsDetails = Loadable(lazy(() => import("../pages_astro/ContectUs/ContectDetials.js")));
const ManageLeaveRequest = Loadable(lazy(() => import("../pages_astro/ManageLeave/ManageLeaveRequest/index.js")));



const ApplicationContent = Loadable(lazy(() => import("../pages_astro/ApplicationContent")));

const HOLIDAYS = Loadable(lazy(() => import("../pages_astro/Holidays/index.js")));
const ManageLeave = Loadable(lazy(() => import("../pages_astro/ManageLeave/index.js")));

const ManageLeaveBalance = Loadable(lazy(() => import("../pages_astro/ManageLeaveBalance/index.js")));

const AddLeave = Loadable(lazy(() => import("../pages_astro/ManageLeave/AddLeave.js")));

const ManageAttendance = Loadable(lazy(() => import("../pages_astro/ManageAttendance/index.js")));
const AddAttendance = Loadable(lazy(() => import("../pages_astro/ManageAttendance/AddAttendance.js")));

const ManageSalary = Loadable(lazy(() => import("../pages_astro/ManageSalary/index.js")));

const ManageBankDetails = Loadable(lazy(() => import("../pages_astro/ManageBankDetails/index.js")));
const ManageDepartnment = Loadable(lazy(() => import("../pages_astro/ManageDepartnment/index.js")));

const ManageSaturday = Loadable(lazy(() => import("../pages_astro/ManageSaturday/index.js")));

const ManageWorkUpdate = Loadable(lazy(() => import("../pages_astro/ManageWorkUpdate/index.js")));

const ManageBirthday = Loadable(lazy(() => import("../pages_astro/ManageBirthday/index.js")));

const ManageProject = Loadable(lazy(() => import("../pages_astro/ManageProject/index.js")));
const AddProject = Loadable(lazy(() => import("../pages_astro/ManageProject/AddProject.js")));

const AssignTaskList = Loadable(lazy(() => import("../pages_astro/ManageProject/AssignTaskList.js")));
const AddAssignTask = Loadable(lazy(() => import("../pages_astro/ManageProject/AddAssignTask.js")));

const TicketList = Loadable(lazy(() => import("../pages_astro/ManageProject/TicketList.js")));
const AddTicket = Loadable(lazy(() => import("../pages_astro/ManageProject/AddTicket.js")));

const ManageAdminLogs = Loadable(lazy(() => import("../pages_astro/ManageAdminLogs/index.js")));

// const ManageSubAdmin = Loadable(lazy(() => import("../pages/ManageSubAdmin/index.js")));

const Router = () => {
    
    const navigate = useNavigate();
    const location = useLocation();

    const { isLoading } = useSelector((state) => state.masterslice);
    let islogin = localStorage.getItem(Constatnt.LOGIN_KEY);
    const token = localStorage.getItem(Constatnt.ACCESS_TOKEN_KEY);

    console.log('isLoading router', isLoading);

    useEffect(() => {
        if (!islogin) {
            navigate('/');
        } else if (islogin && (location?.pathname == '/dashboard' || location?.pathname == '/')) {
            navigate('/');
        }
    }, [islogin, token]);

    if (!islogin) {
        return (
            <>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="*" element={<PageNotFound />} />

                </Routes>
            </>)
    } else {
        return (
            <>
                {isLoading && <Spinner isActive={isLoading} message={'Please Wait...'} />}

                <Routes>
                    <Route element={<DashboardLayout />}>

                        <Route path="/" element={<Dashboard />} />
                        <Route path="/dashboard" element={<Dashboard />} />

                        {/* <Route path="/astrologer_list/request_astrologer" element={<RequestAstrologer />} /> */}

                        <Route path="/user_list" element={<MangeCustomer />} />
                        <Route path="/user_list/add_user" element={<AddCustomer />} />
                        <Route path="/user_list/edit_user" element={<AddCustomer />} />
                        <Route path="/user_list/user_details" element={<ViewCustomerDetials />} />

                        <Route path={PATHS.HOLIDAYS_LIST} element={<HOLIDAYS />} />
                        <Route path={PATHS.LEAVE_LIST} element={<ManageLeave />} />
                        <Route path={PATHS.ADD_LEAVE} element={<AddLeave />} />

                        <Route path={PATHS.LEAVE_REQUEST_LIST} element={<ManageLeaveRequest />} />

                        <Route path={PATHS.LEAVE_BALANCE_LIST} element={<ManageLeaveBalance />} />

                        <Route path={PATHS.ATTENDANCE_LIST} element={<ManageAttendance />} />
                        <Route path={PATHS.ADD_ATTENDANCE} element={<AddAttendance />} />
                        <Route path={PATHS.EDIT_ATTENDANCE} element={<AddAttendance />} />

                        <Route path={PATHS.SALARY_LIST} element={<ManageSalary />} />
                        <Route path={PATHS.BANK_DETAILS_LIST} element={<ManageBankDetails />} />

                        <Route path={PATHS.DEPARTNMENT_LIST} element={<ManageDepartnment />} />

                        <Route path={PATHS.SATERDAY_LIST} element={<ManageSaturday />} />

                        <Route path={PATHS.LIST_DAILY_WORK_UPDATE} element={<ManageWorkUpdate />} />

                        <Route path={PATHS.LIST_BIRTHDAY} element={<ManageBirthday />} />

                        <Route path={PATHS.LIST_PROJECT} element={<ManageProject />} />
                        <Route path={PATHS.ADD_PROJECT} element={<AddProject />} />
                        <Route path={PATHS.EDIT_PROJECT} element={<AddProject />} />

                        <Route path={PATHS.LIST_ASSIGN_TASK} element={<AssignTaskList />} />
                        <Route path={PATHS.ADD_ASSIGN_TASK} element={<AddAssignTask />} />
                        <Route path={PATHS.EDIT_ASSIGN_TASK} element={<AddAssignTask />} />

                        <Route path={PATHS.LIST_TICKET} element={<TicketList />} />
                        <Route path={PATHS.ADD_TICKET} element={<AddTicket />} />
                        <Route path={PATHS.EDIT_TICKET} element={<AddTicket />} />

                        <Route path={PATHS.ADMIN_LOG} element={<ManageAdminLogs />} />



                        <Route path="/faq" element={<ManageFaq />} />

                        <Route path="/contact_us_list" element={<ContactUs />} />
                        <Route path="/contact_us_list/contact_details" element={<ContectUsDetails />} />

                        <Route path="/application_content" element={<ApplicationContent />} />
                        <Route path="/my_profile" element={<MyProfile />} />
                        <Route path="/change_password" element={<ChangePassword />} />

                        <Route path="*" element={<PageNotFound />} />

                    </Route>
                </Routes>
            </>
        )
    }
}

export default Router;
