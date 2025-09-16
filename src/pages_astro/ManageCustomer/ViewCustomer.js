import React, { useState, useEffect, useRef } from 'react'
import { useLocation} from 'react-router-dom'
import { CustomerDetails, EditUser } from '../../utils/api.services';
import SubNavbar from '../../layout/SubNavbar';
import Constatnt, {Codes } from '../../config/constant';
import { formatDate } from '../../config/commonFunction';
import {  DateFormat } from '../../config/commonVariable';
import { LazyLoadImage } from "react-lazy-load-image-component";
import Spinner from '../../component/Spinner';

export default function DetailsCustomer() {

    const location = useLocation();
    const [userDetails, setUserDetails] = useState({});
    const [is_loding, setIs_loading] = useState(false);

    var userData = location?.state;

    useEffect(() => {
        if (userData) {
            setIs_loading(true)
            CustomerDetails({ employee_id: userData?.id }).then((response) => {
                if (response?.code == Codes.SUCCESS) {
                    setUserDetails(response?.data)
                    setIs_loading(false)
                } else {
                    setIs_loading(false)

                }
            }).catch(error => {
                setIs_loading(false)

            });
        }
    }, [userData]);

    return (
        <>
            {<Spinner isActive={is_loding} message={'Please Wait'} />}

            <div className="container-fluid mw-100">
                <SubNavbar title={userData ? 'Employee Details' : 'Add Employee'} header={'Employee List'} subHeaderOnlyView={userData ? 'Employee Details' : 'Add Employee'} />
                <div className="justify-content-center">

                    <div className='row justify-content-center '>
                        <div className="card overflow-hidden chat-application ">

                            <div className="p-md-4 p-4 row_2">

                                <div className="p-8 py-3 border-bottom chat-meta-user d-flex align-items-center justify-content-between mb-4">
                                    <h5 className="text-secondary mb-0 fw-semibold fs-6">Employee Details</h5>
                                </div>

                                <div className="row">
                                    {[
                                        { label: "Employee Id", value: userDetails?.employee_id },
                                        { label: "Joining Date", value: formatDate(userDetails?.joining_date, DateFormat?.DATE_FORMAT) },
                                        { label: "Name", value: userDetails?.name },
                                        { label: "Gender", value: userDetails?.gender == "M" ? "Male" : userDetails?.gender == "F" ? "Female" : "Other" },
                                        { label: "Email Address", value: userDetails?.email },
                                        { label: "Mobile Number", value: `+91 ${userDetails?.phone_number}` },
                                        { label: "Date Of Birth", value: formatDate(userDetails?.birth_date, DateFormat?.DATE_FORMAT) },
                                        { label: "Password", value: userDetails?.password },
                                        { label: "Designation", value: userDetails?.designation },
                                        { label: "Department", value: userDetails?.dept_name },
                                        { label: "Monthly Salary", value: userDetails?.salary_monthly },
                                        { label: "Senior Name", value: userDetails?.senior_name },
                                        { label: "Create Employee", value: formatDate(userDetails?.created_at, DateFormat?.DATE_FORMAT) },
                                        { label: "Address", value: userDetails?.location },
                                        { label: "Employee Leave Date", value: userDetails?.emp_leave_company == '1' ? userDetails?.emp_leave_date : null },
                                        { label: "Employee Leave Reason", value: userDetails?.emp_leave_company == '1' ? userDetails?.emp_leave_reason : null },
                                    ].map((item, index) => (

                                        <div key={index} className="col-md-4 mb-4">
                                            {
                                                item.label === "Image" ? (
                                                    <LazyLoadImage
                                                        src={userDetails?.profile_image || Constatnt?.DEFAULT_IMAGE}
                                                        alt="User Profile"
                                                        width={50}
                                                        height={50}
                                                        className="rounded-circle object-cover border"
                                                        style={{ objectFit: 'cover' }}
                                                    />
                                                ) : <>
                                                    <p className="mb-1 fs-4">{item.label}</p>
                                                    <h6 className="fw-semibold mb-0 fs-5 text-capitalize">{item.value || 'N/A'}</h6>
                                                </>
                                            }
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {
                    userDetails?.account_no &&
                    <div className="justify-content-center">
                        <div className='row justify-content-center '>
                            <div className="card overflow-hidden chat-application ">

                                <div className="p-md-4 p-4 row_2">

                                    <div className="p-8 py-3 border-bottom chat-meta-user d-flex align-items-center justify-content-between mb-4">
                                        <h5 className="text-secondary mb-0 fw-semibold fs-6">Bank Details</h5>
                                    </div>

                                    <div className="row">
                                        {[
                                            { label: "Account Name", value: userDetails?.account_holder_name },
                                            { label: "Bank Name", value: userDetails?.bank_name },
                                            { label: "Account Number", value: userDetails?.account_no },
                                            { label: "IFSC Code Address", value: userDetails?.ifsc_code },
                                            { label: "Bank Branch", value: userDetails?.branch },

                                        ].map((item, index) => (

                                            <div key={index} className="col-md-4 mb-4">
                                                {
                                                    item.label === "Image" ? (
                                                        <LazyLoadImage
                                                            src={userDetails?.profile_image || Constatnt?.DEFAULT_IMAGE}
                                                            alt="User Profile"
                                                            width={50}
                                                            height={50}
                                                            className="rounded-circle object-cover border"
                                                            style={{ objectFit: 'cover' }}
                                                        />
                                                    ) : <>
                                                        <p className="mb-1 fs-4">{item.label}</p>
                                                        <h6 className="fw-semibold mb-0 fs-5 text-capitalize">{item.value || 'N/A'}</h6>
                                                    </>

                                                }
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }

            </div >
        </>
    )
}
