import React, { useState, useEffect, useRef } from 'react'
import Swal from 'sweetalert2'
import { useLocation, useNavigate } from 'react-router-dom'
import { Controller, useForm } from 'react-hook-form';
import Header from '../../layout/Header';
import Slidebar from '../../layout/Slidebar';
import Footer from '../../layout/Footer';
import { Language, TOAST_ERROR, TOAST_SUCCESS, allowLettersAndSpaces } from '../../config/common';
import { addEmployeeLeaves, AddUser, CustomerDetails, departnmentList, EditUser, } from '../../utils/api.services';
import SubNavbar from '../../layout/SubNavbar';
import categoryImage from '../../assets/Images/Group 48096953.png'
import { uploadImageOnAWS } from '../../utils/aws.service';
import Constatnt, { AwsFolder, Codes } from '../../config/constant';
import { SketchPicker } from 'react-color';
import { formatDate, formatDateDyjs, getCommaSeparatedNames, getFileNameFromUrl, handelInputText, selectOption, selectOptionCustomer, textInputValidation, textValidation } from '../../config/commonFunction';
import { AstroInputTypesEnum, DateFormat, HALF_DAY_TYPE, InputRegex, InputTypesEnum, LEAVE_DAY, LEAVE_TYPE_LIST } from '../../config/commonVariable';
import { useDispatch, useSelector } from 'react-redux';
import { getCustomerListThunk, setLoader } from '../../Store/slices/MasterSlice';
import { LazyLoadImage } from "react-lazy-load-image-component";
import CountryMobileNumber from '../../pages/CommonPages/CountryMobileNumber';
import Spinner from '../../component/Spinner';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { PATHS } from '../../Router/PATHS';

export default function AddCustomer() {
    const navigation = useNavigate();
    const dispatch = useDispatch();

    const location = useLocation();

    const { customerList: { data: customerList }, } = useSelector((state) => state.masterslice);

    const [showPanCardImage, setShowPanCardImage] = useState(null);
    const [panCardFileName, setPanCardFileName] = useState('');
    const [showadhaarCardImage, setShowadhaarCardImage] = useState(null);
    const [adhaarCardFileName, setAdhaarCardFileName] = useState('');
    const [is_loding, setIs_loading] = useState(false);
    const [newPassVisible, setNewPassVisible] = useState(false);
    const [selectedStartDate, setSelectedStartDate] = useState(dayjs()); // Default to today
    const [selectedEndDate, setSelectedEndDate] = useState(dayjs()); // Default to today
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    var userData = location?.state;

    const {
        register,
        handleSubmit,
        setValue,
        clearErrors,
        reset,
        watch,
        control,
        trigger,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        if (customerList?.length === 0) {
            dispatch(getCustomerListThunk({}));
        }
    }, [])

    useEffect(() => {
        if (userData) {
            dispatch(setLoader(true))
            CustomerDetails({ employee_id: userData?.id.toString() }).then((response) => {
                if (response?.code == Codes.SUCCESS) {
                    let responseDetails = response?.data;
                    setValue(AstroInputTypesEnum?.NAME, responseDetails?.name);
                    setValue(AstroInputTypesEnum?.EMAIL, responseDetails?.email);
                    setValue(AstroInputTypesEnum?.MOBILE, responseDetails?.phone_number);
                    setValue(AstroInputTypesEnum?.CURRENT_ADDRESH, responseDetails?.location);
                    setValue(AstroInputTypesEnum?.GENDER, responseDetails?.gender || 'M');
                    setSelectedStartDate(responseDetails?.birth_date ? dayjs(responseDetails.birth_date) : null);

                    setValue(AstroInputTypesEnum?.PASSWORD, responseDetails?.password);
                    setValue(AstroInputTypesEnum?.MONTHLY_SALARY, responseDetails?.salary_monthly);
                    setValue(AstroInputTypesEnum?.SENIOR_NAME, responseDetails?.senior_name);
                    setValue(AstroInputTypesEnum?.DESIGNATION, responseDetails?.designation);
                    setSelectedEndDate(responseDetails?.joining_date ? dayjs(responseDetails.joining_date) : null)
                    // profile_photo
                    dispatch(setLoader(false))
                    // if (departnmentlistArray.length > 0) {
                    // }
                }
            })
        }
        console.log('userData?.departmentuserData?.department', userData?.department);
    }, [userData]);

    var onChangeMobileNumber = (mobileNumber) => {
        setValue('mobile_number', mobileNumber)
        clearErrors('mobile_number', '')
    }

    var onChangeCountryCode = (countryCode) => {
        setValue('country_code', countryCode?.country_code)
        clearErrors('country_code', '')
    }

    const onSubmitData = async (data) => {
        try {
            dispatch(setLoader(true))
            //             {
            //     "employee_id": "69",
            //     "leave_type": "compoff",
            //     "leave_day": "full",
            //     "start_date": "2025-08-29",
            //     "end_date": "2025-08-30",
            //     "reason": "For Testing ",
            //     "half_leave_type": "0"
            // }
            let request = {
                employee_id: selectedEmployee?.id,
                leave_type: data[AstroInputTypesEnum.LEAVE_TYPE],
                leave_day: data[AstroInputTypesEnum.LEAVE_DAY],
                start_date: formatDateDyjs(selectedStartDate, DateFormat?.DATE_LOCAL_DASH_TIME_FORMAT),
                end_date: formatDateDyjs(selectedEndDate, DateFormat?.DATE_LOCAL_DASH_TIME_FORMAT),
                half_leave_type: data[AstroInputTypesEnum.HALF_DAY_TYPE] ? data[AstroInputTypesEnum.HALF_DAY_TYPE] : 0,
                reason: data[AstroInputTypesEnum.REASON] || ""
            }
            if (userData) {
                // request.employee_id = userData?.id?.toString();
                // EditUser(request).then((response) => {
                //     if (response?.code == Codes.SUCCESS) {
                //         TOAST_SUCCESS(response?.message)
                //         navigation(PATHS?.LEAVE_LIST)
                //     } else {
                //         TOAST_ERROR(response.message)
                //     }
                // })
            } else {
                addEmployeeLeaves(request).then((response) => {
                    if (response?.code == Codes.SUCCESS) {
                        TOAST_SUCCESS(response?.message)
                        navigation(PATHS?.LEAVE_LIST)
                        dispatch(setLoader(false))
                    } else {
                        dispatch(setLoader(false))
                        TOAST_ERROR(response.message)
                    }
                })
            }

        } catch (error) {
            TOAST_ERROR('Somthing went wrong')
        }
    }

    const handlePanImageChange = (e) => {
        // const file = info?.file?.originFileObj
        const image = e.target.files[0]
        // setValue(AstroInputTypesEnum.PANCARD_FILE, image);
        setShowPanCardImage(image)
        setPanCardFileName(image?.name)
        clearErrors(AstroInputTypesEnum.PANCARD_FILE);
    };

    const handleAdhaarImageChange = async (e) => {
        const image = e.target.files?.[0];
        // setValue(AstroInputTypesEnum?.PROFILE_IMAGE, image);
        setShowadhaarCardImage(image)
        setAdhaarCardFileName(image.name)
        clearErrors(AstroInputTypesEnum?.PROFILE_IMAGE);
    }

    const handleInputChange = async (key, value) => {
        let filteredValue = value;
        if (key === AstroInputTypesEnum.PANCARD) {
            filteredValue = value.replace(InputRegex.ONCHANGE_PANNUMBER_REGEX, '');
        } else if (key === AstroInputTypesEnum.ADHARCARD) {
            filteredValue = value.replace(InputRegex.ONCHANGE_AADHAR_REGEX, '');
        } else if (key === AstroInputTypesEnum.MOBILE || key === AstroInputTypesEnum.MONTHLY_SALARY) {
            filteredValue = value.replace(InputRegex.ONCHANGE_MOBILE_REGEX, '');
        }
        setValue(key, filteredValue)
        clearErrors(key);
        await trigger(key);
    };

    return (
        <>
            {<Spinner isActive={is_loding} message={'Please Wait'} />}
            <div className="container-fluid mw-100">
                <SubNavbar title={userData ? 'Edit Employee' : 'Add Employee'} header={'Employee List'} subHeaderOnlyView={userData ? 'Edit Employee' : 'Add Employee'} />
                <div className="row">
                    {
                        selectedEmployee &&
                        <div className="col-12 justify-content-center">
                            <div className="card  ">
                                <div className="p-3 row_2">

                                    <div className="py-3 border-bottom chat-meta-user d-flex align-items-center justify-content-between mb-4">
                                        <h5 className="text-secondary mb-0 fw-semibold fs-4">Employee Leave Details</h5>
                                    </div>

                                    <div className="row">
                                        {[
                                            // { label: "Employee Id", value: selectedEmployee?.employee_id },
                                            // { label: "Name", value: selectedEmployee?.name },
                                            // { label: "Gender", value: selectedEmployee?.gender == "M" ? "Male" : selectedEmployee?.gender == "F" ? "Female" : "Other" },
                                            { label: "Casual Leave", value: selectedEmployee?.casual },
                                            { label: "Compoff Leave", value: selectedEmployee?.compoff },
                                            {
                                                label: "Total Leave",
                                                value:
                                                    (Number(selectedEmployee?.casual) || 0) +
                                                    (Number(selectedEmployee?.compoff) || 0)
                                            }
                                        ].map((item, index) => (
                                            <div className='col-12 col-sm-6 col-md-3 col-lg-4 '>
                                                <div key={index} className="card border-1 zoom-in them-light shadow-sm">
                                                    <div className="p-2 text-center">
                                                        <p className="fw-semibold fs-5 text-dark ">{item.label}</p>
                                                        <h5 className="fw-semibold text-dark mb-0 fs-5">
                                                            {item.value || '-'}
                                                        </h5>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {/* </div> */}
                                </div>
                            </div>
                        </div>
                    }

                    <div className="col-12 justify-content-center">
                        <div className='row justify-content-center '>
                            <form onSubmit={handleSubmit(onSubmitData)}>
                                <div className="card" >
                                    <div className="card-body">

                                        <div className="row justify-content-center">
                                            <div className="col-auto">
                                                <div className="card shadow-sm custom-card">

                                                </div>
                                            </div>
                                        </div>

                                        <div className='row col-12 col-md-10 '>

                                            <div className='col-md-6 '>
                                                <div className="mb-4">
                                                    <label htmlFor="gender1" className="form-label fw-semibold">
                                                        Select Employee<span className="text-danger ms-1">*</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <select
                                                            id="gender1"
                                                            className="form-control ps-2 p-2"
                                                            autoComplete="nope"
                                                            {...register(AstroInputTypesEnum.EMPLOYEE, {
                                                                required: "Select employee",
                                                            })}
                                                            onChange={(e) => {
                                                                const selectedId = e.target.value;
                                                                const selectedObj = customerList.find((c) => String(c.id) === String(selectedId));
                                                                setSelectedEmployee(selectedObj || null);
                                                                setValue(AstroInputTypesEnum?.EMPLOYEE_ID, selectedObj.employee_id)
                                                            }}
                                                        >
                                                            <option value="">Select employee</option>
                                                            {selectOptionCustomer(customerList)}
                                                        </select>
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.EMPLOYEE]?.message}
                                                    </label>
                                                </div>

                                                <div className="mb-4">
                                                    <label htmlFor="payment_status" className="form-label fw-semibold">
                                                        Leave Type<span className="text-danger ms-1">*</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <select
                                                            id="payment_status"
                                                            className="form-control ps-2"
                                                            autoComplete="off"
                                                            style={{ fontWeight: '600' }}
                                                            {...register(AstroInputTypesEnum.LEAVE_TYPE, {
                                                                required: "Select leave type",
                                                                // onChange: (e) => changeStatusFunction(e.target.value),
                                                            })}
                                                        >
                                                            {selectOption(LEAVE_TYPE_LIST)}
                                                        </select>
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.LEAVE_TYPE]?.message}
                                                    </label>
                                                </div>

                                                <div className="mb-4">
                                                    <label htmlFor="payment_status" className="form-label fw-semibold">
                                                        Leave Day<span className="text-danger ms-1">*</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <select
                                                            id="payment_status"
                                                            className="form-control ps-2"
                                                            autoComplete="off"
                                                            style={{ fontWeight: '600' }}
                                                            {...register(AstroInputTypesEnum.LEAVE_DAY, {
                                                                required: "Select leave day",
                                                                // onChange: (e) => changeStatusFunction(e.target.value),
                                                            })}
                                                        >
                                                            {selectOption(LEAVE_DAY)}
                                                        </select>
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.LEAVE_DAY]?.message}
                                                    </label>
                                                </div>
                                                {
                                                    watch(AstroInputTypesEnum.LEAVE_DAY) === "half" &&
                                                    <div className="mb-4">
                                                        <label htmlFor="payment_status" className="form-label fw-semibold">
                                                            Half Day Type<span className="text-danger ms-1">*</span>
                                                        </label>
                                                        <div className="input-group border rounded-1">
                                                            <select
                                                                id="payment_status"
                                                                className="form-control ps-2"
                                                                autoComplete="off"
                                                                style={{ fontWeight: '600' }}
                                                                {...register(AstroInputTypesEnum.HALF_DAY_TYPE, {
                                                                    required: "Select leave day",
                                                                    // onChange: (e) => changeStatusFunction(e.target.value),
                                                                })}
                                                            >
                                                                {selectOption(HALF_DAY_TYPE)}
                                                            </select>
                                                        </div>
                                                        <label className="errorc ps-1 pt-1">
                                                            {errors[AstroInputTypesEnum.HALF_DAY_TYPE]?.message}
                                                        </label>
                                                    </div>
                                                }

                                            </div>

                                            <div className='col-md-6'>

                                                <div className="mb-4">
                                                    <label htmlFor="lastname" className="form-label fw-semibold">
                                                        Employee Id<span className="text-danger ms-1"></span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <input
                                                            name={AstroInputTypesEnum.EMPLOYEE_ID}
                                                            type="text"
                                                            className="form-control ps-2"
                                                            placeholder="Enter employee id"
                                                            autoComplete='nope'
                                                            disabled
                                                            {...register(AstroInputTypesEnum.EMPLOYEE_ID, {
                                                                required: "Enter employee id",
                                                            })}
                                                            onChange={(e) => handleInputChange(AstroInputTypesEnum.EMPLOYEE_ID, e.target.value)}
                                                        />
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.EMPLOYEE_ID]?.message}
                                                    </label>
                                                </div>


                                                <div className="row mb-4 g-3"> {/* ✅ Bootstrap row with spacing */}
                                                    <div className="col-12 col-md-6">
                                                        <label htmlFor="dob1" className="form-label fw-semibold">
                                                            Start Date <span className="text-danger ms-1">*</span>
                                                        </label>
                                                        <DatePicker
                                                            id="dob1"
                                                            className="form-control custom-datepicker w-100"
                                                            format={DateFormat?.DATE_FORMAT}
                                                            value={selectedStartDate}
                                                            onChange={(date) => setSelectedStartDate(date)}
                                                            allowClear={false}
                                                            picker="date"
                                                        />
                                                    </div>

                                                    <div className="col-12 col-md-6">
                                                        <label htmlFor="dob2" className="form-label fw-semibold">
                                                            End Date <span className="text-danger ms-1">*</span>
                                                        </label>
                                                        <DatePicker
                                                            id="dob2"
                                                            className="form-control custom-datepicker w-100"
                                                            format={DateFormat?.DATE_FORMAT}
                                                            value={selectedEndDate}
                                                            onChange={(date) => setSelectedEndDate(date)}
                                                            allowClear={false}
                                                            picker="date"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="mb-4">
                                                    <label htmlFor="product_name" className="form-label fw-semibold">
                                                        Reason <span className="text-danger ms-1">*</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <textarea
                                                            className="form-control ps-2"
                                                            placeholder="Enter reason"
                                                            autoComplete="off"
                                                            {...register(
                                                                AstroInputTypesEnum.REASON,
                                                                textInputValidation(
                                                                    AstroInputTypesEnum.REASON,
                                                                    Language('Enter reason')
                                                                )
                                                            )}
                                                        />
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.REASON]?.message}
                                                    </label>
                                                </div>

                                            </div>

                                            <div className="modal-footer justify-content-center mb-3">
                                                {
                                                    userData ?
                                                        <button type='button' className="btn btn-danger m-2" onClick={() => { navigation(PATHS.LEAVE_LIST) }}>Cancel</button>
                                                        : <button type='button' className="btn btn-danger m-2" onClick={() => { reset(); setShowadhaarCardImage(""); setAdhaarCardFileName(""); setPanCardFileName(""); setShowPanCardImage("") }}>Reset</button>
                                                }
                                                <button type='submit' className="btn btn-primary" >Submit</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>

                        </div>


                    </div>


                </div>
            </div >
        </>
    )
}
