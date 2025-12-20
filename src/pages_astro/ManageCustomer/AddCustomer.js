import React, { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form';
import { Language, TOAST_ERROR, TOAST_SUCCESS, allowLettersAndSpaces } from '../../config/common';
import { AddUser, CustomerDetails, departnmentList, EditUser, } from '../../utils/api.services';
import SubNavbar from '../../layout/SubNavbar';
import { Codes } from '../../config/constant';
import { formatDateDyjs, handelInputText, textInputValidation, textValidation } from '../../config/commonFunction';
import { AstroInputTypesEnum, DateFormat, InputRegex, InputTypesEnum } from '../../config/commonVariable';
import { useDispatch } from 'react-redux';
import { getCustomerListThunk, setLoader } from '../../Store/slices/MasterSlice';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { PATHS } from '../../Router/PATHS';

export default function AddCustomer() {
    const navigation = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    var userData = location?.state;

    const [selectedBirthDate, setSelectedBirthDate] = useState(dayjs()); // Default to today
    const [selectedJoiningDate, setSelectedJoiningDate] = useState(dayjs()); // Default to today
    const [departnmentlistArray, setDepartnmentlistArray] = useState([]);

    const {
        register,
        handleSubmit,
        setValue,
        clearErrors,
        trigger,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        departnmentList().then((response) => {
            if (response?.code == Codes.SUCCESS) {
                setDepartnmentlistArray(response?.data)
            }
        })
    }, [userData])

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
                    setSelectedBirthDate(responseDetails?.birth_date ? dayjs(responseDetails.birth_date) : null);
                    setValue(AstroInputTypesEnum?.PASSWORD, responseDetails?.password);
                    setValue(AstroInputTypesEnum?.MONTHLY_SALARY, responseDetails?.salary_monthly);
                    setValue(AstroInputTypesEnum?.SENIOR_NAME, responseDetails?.senior_name);
                    setValue(AstroInputTypesEnum?.DESIGNATION, responseDetails?.designation);
                    setSelectedJoiningDate(responseDetails?.joining_date ? dayjs(responseDetails.joining_date) : null)
                    dispatch(setLoader(false))
                }
            })
        }
        // departnmentList().then((response) => {
        //     if (response?.code == Codes.SUCCESS) {
        //         setDepartnmentlistArray(response?.data)
        //         if (userData) {
        //             const departmentId = response?.data?.find((dept) => dept.id == userData.department)?.id;
        //             if (departmentId) {
        //                 // setValue(AstroInputTypesEnum?.DEPARTMENT, departmentId.toString());
        //                 setValue(AstroInputTypesEnum?.DEPARTMENT , departmentId);
        //             }
        //         }
        //     }
        // })
    }, [userData, setValue]);

    useEffect(() => {
        if (userData) {
            if (departnmentlistArray?.length > 0) {
                setValue(AstroInputTypesEnum?.DEPARTMENT, userData?.department?.toString());
            }
        }
    }, [departnmentlistArray])

    const onSubmitData = async (data) => {
        try {
            dispatch(setLoader(true))
            let request = {
                name: data[AstroInputTypesEnum.NAME],
                email: data[AstroInputTypesEnum.EMAIL],
                phone_number: data[AstroInputTypesEnum.MOBILE],
                location: data[AstroInputTypesEnum.CURRENT_ADDRESH],
                birth_date: formatDateDyjs(selectedBirthDate, DateFormat?.DATE_DASH_TIME_FORMAT),
                gender: data[AstroInputTypesEnum.GENDER],
                password: data[AstroInputTypesEnum.PASSWORD],
                salary_monthly: data[AstroInputTypesEnum.MONTHLY_SALARY],
                designation: data[AstroInputTypesEnum.DESIGNATION],
                senior_name: data[AstroInputTypesEnum.SENIOR_NAME],
                department: data[AstroInputTypesEnum.DEPARTMENT],
                joining_date: formatDateDyjs(selectedJoiningDate, DateFormat?.DATE_DASH_TIME_FORMAT),
                profile_photo: 'test.jpg',
            }
            if (userData) {
                request.employee_id = userData?.id?.toString();
                request.action = "admin";
                EditUser(request).then((response) => {
                    if (response?.code == Codes.SUCCESS) {
                        TOAST_SUCCESS(response?.message)
                        navigation(PATHS?.EMPLOYEE_LIST)
                        dispatch(setLoader(false))
                        dispatch(getCustomerListThunk(request));
                    } else {
                        TOAST_ERROR(response.message)
                        dispatch(setLoader(false))
                    }
                })
            } else {
                AddUser(request).then((response) => {
                    if (response?.code == Codes.SUCCESS) {
                        TOAST_SUCCESS(response?.message)
                        navigation(PATHS?.EMPLOYEE_LIST)
                        dispatch(setLoader(false))
                        dispatch(getCustomerListThunk({ emp_leave_company: '1' }));
                    } else {
                        TOAST_ERROR(response.message)
                        dispatch(setLoader(false))
                    }
                })
            }
        } catch (error) {
            TOAST_ERROR('Somthing went wrong')
        }
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
            {/* {<Spinner isActive={is_loding} message={'Please Wait'} />}  */}
            <div className="container-fluid mw-100">
                <SubNavbar title={userData ? 'Edit Employee' : 'Add Employee'} header={'Employee List'} subHeaderOnlyView={userData ? 'Edit Employee' : 'Add Employee'} />
                <div className="row m-2">
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

                                        <div className='row col-12 '>
                                            <div className='col-md-6 '>
                                                <div className="mb-4">
                                                    <label htmlFor="lastname" className="form-label fw-semibold">
                                                        Name <span className="text-danger ms-1">*</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <input
                                                            type="text"
                                                            className="form-control ps-2"
                                                            placeholder="Enter Full Name"
                                                            onKeyPress={allowLettersAndSpaces}
                                                            autoComplete='nope'
                                                            {...register(AstroInputTypesEnum.NAME, textInputValidation(AstroInputTypesEnum.NAME, Language('Enter full name')))}
                                                        />
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.NAME]?.message}
                                                    </label>
                                                </div>

                                                <div className="mb-4">
                                                    <label htmlFor="lastname" className="form-label fw-semibold">
                                                        Mobile Number <span className="text-danger ms-1">*</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <input
                                                            name={AstroInputTypesEnum.MOBILE}
                                                            type="text"
                                                            className="form-control ps-2"
                                                            placeholder="Enter Mobile Number"
                                                            autoComplete='nope'
                                                            {...register(AstroInputTypesEnum.MOBILE, textInputValidation(AstroInputTypesEnum.MOBILE, Language('Enter mobile number')))}
                                                            onChange={(e) => handleInputChange(AstroInputTypesEnum.MOBILE, e.target.value)}
                                                            maxLength={10}
                                                        />
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.MOBILE]?.message}
                                                    </label>
                                                </div>

                                                <div className="mb-4">
                                                    <label htmlFor="lastname" className="form-label fw-semibold">
                                                        Gender <span className="text-danger ms-1">*</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <select
                                                            className="form-control ps-2"
                                                            autoComplete="nope"
                                                            {...register(AstroInputTypesEnum.GENDER, {
                                                                required: "Please Enter Gender",
                                                            })}
                                                        >
                                                            <option value="">Select Gender</option>
                                                            <option value="M">Male</option>
                                                            <option value="F">Female</option>
                                                        </select>
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.GENDER]?.message}
                                                    </label>
                                                </div>

                                                <div className="mb-4">
                                                    <label htmlFor="lastname" className="form-label fw-semibold">
                                                        Designation <span className="text-danger ms-1">*</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <input
                                                            type="text"
                                                            className="form-control ps-2"
                                                            placeholder="Enter Designation"
                                                            autoComplete='nope'
                                                            {...register(AstroInputTypesEnum.DESIGNATION, textInputValidation(AstroInputTypesEnum.DESIGNATION, Language('Enter Designation')))}
                                                        />
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.DESIGNATION]?.message}
                                                    </label>
                                                </div>

                                                <div className="mb-4">
                                                    <label htmlFor="lastname" className="form-label fw-semibold">
                                                        Monthly Salary <span className="text-danger ms-1">*</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <input
                                                            name={AstroInputTypesEnum.MONTHLY_SALARY}
                                                            type="text"
                                                            className="form-control ps-2"
                                                            placeholder="Enter Monthly Salary"
                                                            autoComplete='nope'
                                                            {...register(AstroInputTypesEnum.MONTHLY_SALARY, textInputValidation(AstroInputTypesEnum.MONTHLY_SALARY, Language('Enter Monthly Salary')))}
                                                            onChange={(e) => handleInputChange(AstroInputTypesEnum.MONTHLY_SALARY, e.target.value)}
                                                            maxLength={10}
                                                        />
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.MONTHLY_SALARY]?.message}
                                                    </label>
                                                </div>
                                            </div>

                                            <div className='col-md-6'>
                                                <div className="mb-4 ">
                                                    <label htmlFor="lastname" className="form-label fw-semibold">
                                                        Password<span className="text-danger ms-1">*</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <input type={"text"} className="form-control ps-2" id="inputPassword" placeholder="Enter password" onChange={handelInputText} {...register(AstroInputTypesEnum.PASSWORD, textValidation(InputTypesEnum.PASSWORD))} />

                                                    </div>
                                                    <label className="errorc pt-1">{errors[AstroInputTypesEnum.PASSWORD]?.message}
                                                    </label>
                                                </div>

                                                <div className="mb-4">
                                                    <label htmlFor="lastname" className="form-label fw-semibold">
                                                        Email Address<span className="text-danger ms-1">*</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <input
                                                            name={AstroInputTypesEnum.EMAIL}
                                                            type="text"
                                                            className="form-control ps-2"
                                                            placeholder="Enter Email Address"
                                                            autoComplete='nope'
                                                            {...register(AstroInputTypesEnum.EMAIL, textValidation(AstroInputTypesEnum.EMAIL, Language('Enter email address')))}
                                                            onChange={(e) => handleInputChange(AstroInputTypesEnum.EMAIL, e.target.value)}
                                                        />
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.EMAIL]?.message}
                                                    </label>
                                                </div>

                                                <div className="mb-4">
                                                    <label htmlFor="gender1" className="form-label fw-semibold">
                                                        Department<span className="text-danger ms-1">*</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <select
                                                            id="gender1"
                                                            className="form-control ps-2 p-2"
                                                            autoComplete="nope"
                                                            // value={userData?.department || ""}
                                                            // defaultValue={userData?.department || ""}
                                                            {...register(AstroInputTypesEnum.DEPARTMENT, {
                                                                required: "Select department",
                                                            })}
                                                        >
                                                            <option value="">Select department</option>
                                                            {/* {departnmentlistArray?.length > 0 && */}
                                                            {departnmentlistArray?.map((dept, index) => (
                                                                <option key={index} value={dept?.id}>
                                                                    {dept?.dept_name}
                                                                </option>
                                                            ))}
                                                            {/* } */}
                                                        </select>
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.DEPARTMENT]?.message}
                                                    </label>
                                                </div>


                                                <div className="row mb-4 g-3">
                                                    <div className="col-12 col-md-6">
                                                        <label htmlFor="dob1" className="form-label fw-semibold">
                                                            Date of Birth <span className="text-danger ms-1">*</span>
                                                        </label>
                                                        <DatePicker
                                                            id="dob1"
                                                            className="form-control custom-datepicker w-100"
                                                            format={DateFormat?.DATE_FORMAT}
                                                            value={selectedBirthDate}
                                                            onChange={(date) => setSelectedBirthDate(date)}
                                                            allowClear={false}
                                                            picker="date"
                                                        />
                                                    </div>

                                                    <div className="col-12 col-md-6">
                                                        <label htmlFor="dob2" className="form-label fw-semibold">
                                                            Joining Date <span className="text-danger ms-1">*</span>
                                                        </label>
                                                        <DatePicker
                                                            id="dob2"
                                                            className="form-control custom-datepicker w-100"
                                                            format={DateFormat?.DATE_FORMAT}
                                                            value={selectedJoiningDate}
                                                            onChange={(date) => setSelectedJoiningDate(date)}
                                                            allowClear={false}
                                                            picker="date"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="mb-4">
                                                    <label htmlFor="lastname" className="form-label fw-semibold">
                                                        Senior Name <span className="text-danger ms-1">*</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <input
                                                            type="text"
                                                            className="form-control ps-2"
                                                            placeholder="Enter senior name"
                                                            // onKeyPress={allowLettersAndSpaces}
                                                            autoComplete='nope'
                                                            {...register(AstroInputTypesEnum.SENIOR_NAME, textInputValidation(AstroInputTypesEnum.SENIOR_NAME, Language('Enter senior name')))}
                                                        />
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.SENIOR_NAME]?.message}
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <label htmlFor="product_name" className="form-label fw-semibold">
                                                    Address <span className="text-danger ms-1">*</span>
                                                </label>
                                                <div className="input-group border rounded-1">
                                                    <textarea
                                                        className="form-control ps-2"
                                                        placeholder="Enter Address"
                                                        autoComplete="off"
                                                        {...register(
                                                            AstroInputTypesEnum.CURRENT_ADDRESH,
                                                            textInputValidation(
                                                                AstroInputTypesEnum.CURRENT_ADDRESH,
                                                                Language('Enter address')
                                                            )
                                                        )}
                                                    />
                                                </div>
                                                <label className="errorc ps-1 pt-1">
                                                    {errors[AstroInputTypesEnum.CURRENT_ADDRESH]?.message}
                                                </label>
                                            </div>
                                            <div className="modal-footer justify-content-center mb-3">
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
