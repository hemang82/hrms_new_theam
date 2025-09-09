import React, { useState, useEffect, useRef } from 'react'
import Swal from 'sweetalert2'
import { useLocation, useNavigate } from 'react-router-dom'
import { Controller, useForm } from 'react-hook-form';
import Header from '../../layout/Header';
import Slidebar from '../../layout/Slidebar';
import Footer from '../../layout/Footer';
import { Language, TOAST_ERROR, TOAST_SUCCESS, allowLettersAndSpaces } from '../../config/common';
import { AddUser, CustomerDetails, departnmentList, EditUser, } from '../../utils/api.services';
import SubNavbar from '../../layout/SubNavbar';
import categoryImage from '../../assets/Images/Group 48096953.png'
import { uploadImageOnAWS } from '../../utils/aws.service';
import { AwsFolder, Codes } from '../../config/constant';
import { SketchPicker } from 'react-color';
import { formatDate, formatDateDyjs, getCommaSeparatedNames, getFileNameFromUrl, handelInputText, selectOption, textInputValidation, textValidation } from '../../config/commonFunction';
import { AstroInputTypesEnum, DateFormat, InputRegex, InputTypesEnum } from '../../config/commonVariable';
import { useDispatch } from 'react-redux';
import { setLoader } from '../../Store/slices/MasterSlice';
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
    const [showPanCardImage, setShowPanCardImage] = useState(null);
    const [panCardFileName, setPanCardFileName] = useState('');
    const [showadhaarCardImage, setShowadhaarCardImage] = useState(null);
    const [adhaarCardFileName, setAdhaarCardFileName] = useState('');
    const [is_loding, setIs_loading] = useState(false);
    const [newPassVisible, setNewPassVisible] = useState(false);
    const [selectedBirthDate, setSelectedBirthDate] = useState(dayjs()); // Default to today
    const [selectedJoiningDate, setSelectedJoiningDate] = useState(dayjs()); // Default to today
    const [departnmentlistArray, setDepartnmentlistArray] = useState([]);

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
        if (userData) {
            dispatch(setLoader(true))

            CustomerDetails({ employee_id: userData?.id.toString() }).then((response) => {
                if (response?.code == Codes.SUCCESS) {
                    let responseDetails = response?.data;
                    console.log('responseDetailsresponseDetails', responseDetails);

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
                    // profile_photo
                    dispatch(setLoader(false))
                    // if (departnmentlistArray.length > 0) {
                    // }
                }
            })
        }
        departnmentList().then((response) => {
            if (response?.code == Codes.SUCCESS) {
                setDepartnmentlistArray(response?.data)
                if (userData) {
                    console.log('response?.data?.find((dept) => dept.id == userData?.department)?.dept_name', response?.data?.find((dept) => dept.id == userData?.department)?.id);
                    const departmentId = response?.data?.find((dept) => dept.id == userData.department)?.id;
                    if (departmentId) {
                        setValue(AstroInputTypesEnum?.DEPARTMENT, departmentId.toString());
                    }
                }
            }
        })
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

            // let adhaarImage = showadhaarCardImage;
            // if (adhaarImage instanceof Blob) adhaarImage = await uploadImageOnAWS(adhaarImage, AwsFolder?.ADHAR_IMAGE);

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
        clearErrors(key);               // Clear error message (if any)
        await trigger(key);
    };

    return (
        <>
            {/* {<Spinner isActive={is_loding} message={'Please Wait'} />} */}
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

                                        <div className='row col-12 col-md-10 '>

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
                                                            // {...register('category_en', { required: "Enter category" })}
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
                                                            // onKeyPress={allowLettersAndSpaces}
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

                                                {/* <div className="mb-4"> */}
                                                {/* <label htmlFor="exampleInputPassword1" className="form-label fw-semibold">Phone no<spna className="text-danger"> *</spna></label>
                                                    <CountryMobileNumber onChangeMobileNumber={onChangeMobileNumber} onChangeCountryCode={onChangeCountryCode} setDefaultData={customerData} imageIcon={false} />
                                                    <input type='hidden' {...register(AstroInputTypesEnum?.MOBILE, { required: "Please Enter Phone number" })} />
                                                    <input type='hidden' {...register(AstroInputTypesEnum?.COUNTRYCODE)} />
                                                    <label className="errorc ps-1 pt-1" >{errors.mobile_number?.message}</label> */}
                                                {/* </div> */}

                                                {/* <div className="mb-4">
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
                                                            <option value="O">Other</option>
                                                        </select>
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.GENDER]?.message}
                                                    </label>
                                                </div> */}

                                                {/* <div className="mb-4">
                                                    <label htmlFor="product_name" className="form-label fw-semibold">
                                                        City <span className="text-danger ms-1">*</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <input
                                                            type="text"
                                                            className="form-control ps-2"
                                                            placeholder="Enter city"
                                                            autoComplete='nope'
                                                            // {...register('category_ara', { required: "Enter category arabic" })}
                                                            {...register(AstroInputTypesEnum.CITY, textInputValidation(AstroInputTypesEnum.CITY, Language('Please enter city')))}
                                                        />
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.CITY]?.message}
                                                    </label>
                                                </div> */}



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
                                                            {...register(AstroInputTypesEnum.DEPARTMENT, {
                                                                required: "Select department",
                                                            })}
                                                            value={userData?.department || ""}
                                                        >
                                                            <option value="">Select department</option>
                                                            {departnmentlistArray?.length > 0 &&
                                                                departnmentlistArray?.map((dept, index) => (
                                                                    <option key={index} value={dept?.id}>
                                                                        {dept?.dept_name}
                                                                    </option>
                                                                ))
                                                            }
                                                        </select>
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.DEPARTMENT]?.message}
                                                    </label>
                                                </div>
                                                <div className="row mb-4 g-3"> {/* ✅ Bootstrap row with spacing */}
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

                                                {/* <div className="mb-4">
                                                    <label htmlFor="lastname" className="form-label fw-semibold">
                                                        Profile Image<span className="text-danger ms-1"></span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <input
                                                            className="form-control ps-2"
                                                            type="file"
                                                            id="formFileMultiple"
                                                            accept=".pdf, image/jpeg, image/png"
                                                            {...register(AstroInputTypesEnum.PROFILE_IMAGE)}
                                                            onChange={handleAdhaarImageChange}
                                                        />
                                                    </div>

                                                    {adhaarCardFileName && (
                                                        <small className="text-muted mt-1 d-block">
                                                            Selected file: {adhaarCardFileName}
                                                        </small>
                                                    )}
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.PROFILE_IMAGE]?.message}
                                                    </label>
                                                </div> */}
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
                                                {
                                                    userData ?
                                                        <button type='button' className="btn btn-danger m-2" onClick={() => { navigation('/user_list') }}>Cancel</button>
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
                {/* </div > */}
            </div >

        </>
    )
}
