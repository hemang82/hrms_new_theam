import React, { useState, useEffect, useRef } from 'react'
import Swal from 'sweetalert2'
import { useLocation, useNavigate } from 'react-router-dom'
import { Controller, useForm } from 'react-hook-form';
import Header from '../../layout/Header';
import Slidebar from '../../layout/Slidebar';
import Footer from '../../layout/Footer';
import { Language, TOAST_ERROR, TOAST_SUCCESS, allowLettersAndSpaces } from '../../config/common';
import { CustomerDetails, EditUser } from '../../utils/api.services';
import SubNavbar from '../../layout/SubNavbar';
import categoryImage from '../../assets/Images/Group 48096953.png'
import { uploadImageOnAWS } from '../../utils/aws.service';
import Constatnt, { AwsFolder, Codes } from '../../config/constant';
import { SketchPicker } from 'react-color';
import { formatDate, getDocumentStatusObject, selectOption, textInputValidation, textValidation } from '../../config/commonFunction';
import { AstroInputTypesEnum, DateFormat, InputTypesEnum } from '../../config/commonVariable';
import { useDispatch, useSelector } from 'react-redux';
import { setLoader } from '../../Store/slices/MasterSlice';
import { LazyLoadImage } from "react-lazy-load-image-component";
import CountryMobileNumber from '../../pages/CommonPages/CountryMobileNumber';
import pdfThmbnail from "../../assets/ProfileImage/PDF_Thmbnail.png";
import Spinner from '../../component/Spinner';
import { MdOutlineFileDownload, MdOutlineRemoveRedEye } from 'react-icons/md';

export default function DetailsCustomer() {
    const navigation = useNavigate();
    const dispatch = useDispatch();

    const location = useLocation();
    const { isLoading } = useSelector((state) => state.masterslice);

    const [shoWcategoryImage, setShowCategoryImage] = useState(null);
    const [userDetails, setUserDetails] = useState({});
    const [is_loding, setIs_loading] = useState(false);


    var userData = location?.state;
    // const userDetails  = ""
    const {
        register,
        handleSubmit,
        setValue,
        clearErrors,
        reset,
        watch,
        control,
        formState: { errors },
    } = useForm();

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

    var onChangeMobileNumber = (mobileNumber) => {
        setValue('mobile_number', mobileNumber)
        clearErrors('mobile_number', '')
    }

    var onChangeCountryCode = (countryCode) => {
        setValue('country_code', countryCode?.country_code)
        clearErrors('country_code', '')
    }

    const STATUS_CLASSES = {
        PENDING: "bg-warning text-white",
        UNDER_REVIEW: "bg-info text-white",
        ON_HOLD: "bg-warning text-dark",
        APPROVED: "bg-success text-white",
        REJECTED: "bg-danger text-white",
        DISBURSED: "bg-primary text-white",
        CLOSED: "bg-secondary text-white",
        CANCELLED: "bg-danger text-white"
    };

    console.log('', userDetails);

    return (
        <>
            {<Spinner isActive={is_loding} message={'Please Wait'} />}
            <div className="container-fluid mw-100">
                <SubNavbar title={userData ? 'Employee Details' : 'Add User'} header={'Employee List'} subHeaderOnlyView={userData ? 'Employee Details' : 'Add Employee'} />
                <div className="justify-content-center">
                    <div className='row justify-content-center '>
                        <div className="card overflow-hidden chat-application ">

                            <div className="p-md-4 p-4 row_2">

                                <div className="p-8 py-3 border-bottom chat-meta-user d-flex align-items-center justify-content-between mb-4">
                                    <h5 className="text-secondary mb-0 fw-semibold fs-6">Employee Details</h5>
                                </div>

                                <div className="row">
                                    {[
                                        { label: "Image", value: userDetails?.name },
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
                                {/* </div> */}
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
                                            { label: "Ifsc Code Address", value: userDetails?.ifsc_code },
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
