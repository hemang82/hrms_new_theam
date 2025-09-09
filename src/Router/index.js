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

const MangeAstrologer = Loadable(lazy(() => import("../pages_astro/ManageLone/index.js")));
const AddAstrologer = Loadable(lazy(() => import("../pages_astro/ManageLone/AddAstrologer.js")));
const ViewAstrologerDetials = Loadable(lazy(() => import("../pages_astro/ManageLone/ViewAstrologer.js")));


// const RequestAstrologer = Loadable(lazy(() => import("../pages_astro/ManageLone/RequestAstrologer.js")));

const MangeCustomer = Loadable(lazy(() => import("../pages_astro/ManageCustomer/index.js")));
const AddCustomer = Loadable(lazy(() => import("../pages_astro/ManageCustomer/AddCustomer.js")));
const ViewCustomerDetials = Loadable(lazy(() => import("../pages_astro/ManageCustomer/ViewCustomer.js")));

const ManageInterest = Loadable(lazy(() => import("../pages_astro/ManageSalary/index.js")));

const ManageProcessingFee = Loadable(lazy(() => import("../pages_astro/ManageProcessingFee")));
const AddProcessingFee = Loadable(lazy(() => import("../pages_astro/ManageProcessingFee/AddProcessingFee.js")));
const ViewProcessingFee = Loadable(lazy(() => import("../pages_astro/ManageProcessingFee/ViewProcessingFee.js")));

const ContactUs = Loadable(lazy(() => import("../pages_astro/ContectUs")));
const ManageFaq = Loadable(lazy(() => import("../pages_astro/ManageFaq")));
const ContectUsDetails = Loadable(lazy(() => import("../pages_astro/ContectUs/ContectDetials.js")));



const ManageEMIPaymentCharges = Loadable(lazy(() => import("../pages_astro/ManageEMIPaymentCharges")));

const ManageChatSettings = Loadable(lazy(() => import("../pages_astro/ManageChatSettings")));
const AddChatSetting = Loadable(lazy(() => import("../pages_astro/ManageChatSettings/AddChatSetting.js")));
const ApplyChats = Loadable(lazy(() => import("../pages_astro/ManageChatSettings/ApplyChats.js")));

const StaticContent = Loadable(lazy(() => import("../pages_astro/StaticContent")));

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
                {/* <Spinner isActive={isLoading} message={'Please Wait...'} /> */}
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/login" element={<Login />} />
                    {/* <Route path="/otp_verfication" element={<OtpVerification />} /> */}
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

                        <Route path="/astrologer_request_list/astrologer_details_request" element={<ViewAstrologerDetials />} />

                        <Route path="/loan_list" element={<MangeAstrologer />} />
                        <Route path="/loan_list/add_loan" element={<AddAstrologer />} />
                        <Route path="/loan_list/edit_loan" element={<AddAstrologer />} />
                        <Route path="/loan_list/loan_details" element={<ViewAstrologerDetials />} />

                        <Route path="/loan_disbursement_list/edit_loan_disbursement" element={<AddAstrologer />} />
                        <Route path="/loan_disbursement_list/loan_disbursement_details" element={<ViewAstrologerDetials />} />

                        <Route path="/user_list" element={<MangeCustomer />} />
                        <Route path="/user_list/add_user" element={<AddCustomer />} />
                        <Route path="/user_list/edit_user" element={<AddCustomer />} />
                        <Route path="/user_list/user_details" element={<ViewCustomerDetials />} />

                        <Route path="/interest_list" element={<ManageInterest />} />

                        <Route path={PATHS.HOLIDAYS_LIST} element={<HOLIDAYS />} />
                        <Route path={PATHS.LEAVE_LIST} element={<ManageLeave />} />
                        <Route path={PATHS.ADD_LEAVE} element={<AddLeave />} />

                        <Route path={PATHS.LEAVE_BALANCE_LIST} element={<ManageLeaveBalance />} />

                        <Route path={PATHS.ATTENDANCE_LIST} element={<ManageAttendance />} />
                        <Route path={PATHS.ADD_ATTENDANCE} element={<AddAttendance />} />
                        <Route path={PATHS.EDIT_ATTENDANCE} element={<AddAttendance />} />

                        <Route path={PATHS.SALARY_LIST} element={<ManageSalary />} />
                        <Route path={PATHS.BANK_DETAILS_LIST} element={<ManageBankDetails />} />

                        <Route path={PATHS.DEPARTNMENT_LIST} element={<ManageDepartnment />} />

                        <Route path={PATHS.SATERDAY_LIST} element={<ManageSaturday />} />



                        <Route path="/emi_payment_charges" element={<ManageEMIPaymentCharges />} />

                        <Route path="/processing_fee_list" element={<ManageProcessingFee />} />
                        <Route path="/processing_fee_list/add_processing_fee" element={<AddProcessingFee />} />
                        <Route path="/processing_fee_list/edit_processing_fee" element={<AddProcessingFee />} />
                        <Route path="/processing_fee_list/processing_fee_details" element={<ViewProcessingFee />} />

                        <Route path="/faq" element={<ManageFaq />} />

                        <Route path="/contact_us_list" element={<ContactUs />} />
                        <Route path="/contact_us_list/contact_details" element={<ContectUsDetails />} />

                        <Route path="/chat_setting_list" element={<ManageChatSettings />} />
                        <Route path="/chat_setting_list/add_chat_setting" element={<AddChatSetting />} />
                        <Route path="/chat_setting_list/edit_chat_setting" element={<AddChatSetting />} />
                        <Route path="/chat_setting_list/ApplyChats" element={<ApplyChats />} />

                        <Route path="/static_content" element={<StaticContent />} />
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
