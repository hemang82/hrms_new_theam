import React, { useState, useEffect, useRef } from 'react'
import Swal from 'sweetalert2'
import { useLocation, useNavigate } from 'react-router-dom'
import { Controller, useForm } from 'react-hook-form';
import Header from '../../layout/Header';
import Slidebar from '../../layout/Slidebar';
import Footer from '../../layout/Footer';
import { Language, TOAST_ERROR, TOAST_SUCCESS, allowLettersAndSpaces } from '../../config/common';
import { addEmployeeLeaves, addEmployeeLeavesNew, AddUser, availableLeaveBalanceList, CustomerDetails, departnmentList, EditUser, } from '../../utils/api.services';
import SubNavbar from '../../layout/SubNavbar';
import categoryImage from '../../assets/Images/Group 48096953.png'
import { uploadImageOnAWS } from '../../utils/aws.service';
import Constatnt, { AwsFolder, Codes } from '../../config/constant';
import { SketchPicker } from 'react-color';
import { formatDate, formatDateDyjs, getCommaSeparatedNames, getFileNameFromUrl, handelInputText, selectOption, selectOptionCustomer, textInputValidation, textValidation } from '../../config/commonFunction';
import { AstroInputTypesEnum, DateFormat, EMPLOYEE_STATUS, HALF_DAY_TYPE, InputRegex, InputTypesEnum, LEAVE_DAY, LEAVE_TYPE_LIST, LEAVE_TYPE_LIST_AVAILABLE } from '../../config/commonVariable';
import { useDispatch, useSelector } from 'react-redux';
import { getCustomerListThunk, getlistLeavesThunk, setLoader } from '../../Store/slices/MasterSlice';
import { LazyLoadImage } from "react-lazy-load-image-component";
import CountryMobileNumber from '../../pages/CommonPages/CountryMobileNumber';
import Spinner from '../../component/Spinner';
import { DatePicker, Select, Space } from 'antd';
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
    const [leaveBalanceList, setLeaveBalanceList] = useState([]);

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
        getValues,
        resetField,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        const request = {
            emp_leave_company: EMPLOYEE_STATUS[0]?.key,
        };
        if (customerList?.length === 0) {
            dispatch(getCustomerListThunk(request));
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

    useEffect(() => {
        if (selectedEmployee?.emp_id && (watch(AstroInputTypesEnum.LEAVE_TYPE) == "casual" || watch(AstroInputTypesEnum.LEAVE_TYPE) == "compoff")) {
            availableLeaveBalanceList({
                action: 'admin',
                employee_id: selectedEmployee?.emp_id?.toString() || "",
                leave_type: watch(AstroInputTypesEnum.LEAVE_TYPE)
            }).then((response) => {
                if (response?.code == Codes.SUCCESS) {
                    let responseDetails = response?.data;
                    setLeaveBalanceList(responseDetails || []);
                }
            });
        }
    }, [selectedEmployee, watch(AstroInputTypesEnum.LEAVE_TYPE)]);

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
            const formattedDates = leaveBalanceList.filter(leave => data[AstroInputTypesEnum.SELECTED_LEAVE_DATES]?.includes(leave.id)).map(leave => formatDate(leave.created_at, DateFormat?.DATE_DASH_TIME_FORMAT));

            let request = {
                employee_id: selectedEmployee?.id,
                leave_type: data[AstroInputTypesEnum.LEAVE_TYPE],
                leave_day: data[AstroInputTypesEnum.LEAVE_DAY],
                start_date: formatDateDyjs(selectedStartDate, DateFormat?.DATE_LOCAL_DASH_TIME_FORMAT),
                end_date: formatDateDyjs(selectedEndDate, DateFormat?.DATE_LOCAL_DASH_TIME_FORMAT),
                half_leave_type: data[AstroInputTypesEnum.HALF_DAY_TYPE] ? data[AstroInputTypesEnum.HALF_DAY_TYPE] : 0,
                reason: data[AstroInputTypesEnum.REASON] || "",
                leave_balance_date: formattedDates || []
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
                addEmployeeLeavesNew(request).then((response) => {
                    if (response?.code == Codes.SUCCESS) {
                        TOAST_SUCCESS(response?.message)
                        navigation(PATHS?.LEAVE_LIST)
                        const request = {
                            emp_leave_company: EMPLOYEE_STATUS[0]?.key
                        };
                        dispatch(getlistLeavesThunk(request))
                        dispatch(setLoader(false))
                        dispatch(getCustomerListThunk(request));
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

                                        <div className='row col-12 col-md-12 '>

                                            <div className='col-md-6 '>
                                                <div className="row">
                                                    {/* Employee Name */}
                                                    <div className="col-md-6 col-12 mb-4">
                                                        <label htmlFor="employeeName" className="form-label fw-semibold">
                                                            Employee Name<span className="text-danger ms-1"></span>
                                                        </label>
                                                        <div className="input-group border rounded-1">
                                                            <select
                                                                id="employeeName"
                                                                className="form-control ps-2 p-2"
                                                                autoComplete="off"
                                                                // disabled
                                                                {...register(AstroInputTypesEnum.EMPLOYEE, {
                                                                    required: "Select employee",
                                                                })}
                                                                onChange={(e) => {

                                                                    resetField(AstroInputTypesEnum.LEAVE_TYPE);
                                                                    resetField(AstroInputTypesEnum.LEAVE_DAY);
                                                                    resetField(AstroInputTypesEnum.HALF_DAY_TYPE);
                                                                    resetField(AstroInputTypesEnum.REASON);
                                                                    resetField(AstroInputTypesEnum.SELECTED_LEAVE_DATES);

                                                                    const selectedId = e.target.value;
                                                                    const selectedObj = customerList.find((c) => String(c.id) === String(selectedId));
                                                                    setSelectedEmployee(selectedObj || null);
                                                                    setValue(AstroInputTypesEnum?.EMPLOYEE_ID, selectedObj?.employee_id || "");
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

                                                    {/* Employee ID */}
                                                    <div className="col-md-6 col-12 mb-4">
                                                        <label htmlFor="employeeId" className="form-label fw-semibold">
                                                            Employee ID<span className="text-danger ms-1"></span>
                                                        </label>
                                                        <div className="input-group border rounded-1">
                                                            <input
                                                                id="employeeId"
                                                                name={AstroInputTypesEnum.EMPLOYEE_ID}
                                                                type="text"
                                                                className="form-control ps-2"
                                                                placeholder="Enter employee id"
                                                                autoComplete="off"
                                                                disabled
                                                                {...register(AstroInputTypesEnum.EMPLOYEE_ID, {
                                                                    required: "Enter employee id",
                                                                })}
                                                                onChange={(e) =>
                                                                    handleInputChange(AstroInputTypesEnum.EMPLOYEE_ID, e.target.value)
                                                                }
                                                            />
                                                        </div>
                                                        <label className="errorc ps-1 pt-1">
                                                            {errors[AstroInputTypesEnum.EMPLOYEE_ID]?.message}
                                                        </label>
                                                    </div>

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
                                                                // onChange: (e) => handleLeaveTypeChange(e),
                                                            })}
                                                            onChange={(e) => {
                                                                // resetField(AstroInputTypesEnum.LEAVE_TYPE);
                                                                resetField(AstroInputTypesEnum.LEAVE_DAY);
                                                                resetField(AstroInputTypesEnum.HALF_DAY_TYPE);
                                                                resetField(AstroInputTypesEnum.REASON);
                                                                resetField(AstroInputTypesEnum.SELECTED_LEAVE_DATES);
                                                                // const selectedId = e.target.value;
                                                                // const selectedObj = customerList.find((c) => String(c.id) === String(selectedId));
                                                                // setSelectedEmployee(selectedObj || null);
                                                                // setValue(AstroInputTypesEnum?.EMPLOYEE_ID, selectedObj?.employee_id || "");
                                                            }}
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

                                                {/* {
                                                    watch(AstroInputTypesEnum.LEAVE_DAY) && (watch(AstroInputTypesEnum.LEAVE_TYPE) == "casual" || watch(AstroInputTypesEnum.LEAVE_TYPE) == "compoff") &&
                                                    <div className="mb-2">
                                                        <label htmlFor="interest_type" className="form-label fw-semibold">
                                                            Select Leave Date<span className="text-danger ms-1">*</span>
                                                        </label>
                                                        <Controller
                                                            name={AstroInputTypesEnum.SELECTED_LEAVE_DATES}
                                                            control={control}
                                                            rules={{ required: "Select Leave Date" }}
                                                            render={({ field }) => {
                                                                const leaveDay = watch(AstroInputTypesEnum.LEAVE_DAY); // 👀 Watch for "half" or "full"
                                                                const filteredList = leaveBalanceList?.filter((item) => leaveDay == "half" ? [1, 2].includes(item.is_available) : item.is_available == 1) || [];
                                                                return (
                                                                    <Select
                                                                        mode="multiple"
                                                                        style={{ width: "100%" }}
                                                                        placeholder="Select Leave Date"
                                                                        value={field.value || []}
                                                                        onChange={(selectedIds) => {
                                                                            field.onChange(selectedIds);
                                                                            setValue(AstroInputTypesEnum.SELECTED_LEAVE_DATES, selectedIds);
                                                                        }}

                                                                        options={filteredList.map((c) => {

                                                                            const leaveType = LEAVE_TYPE_LIST.find((item) => item.key == c.leave_type)?.value || c.leave_type;
                                                                            const isAvailable = LEAVE_TYPE_LIST_AVAILABLE.find((item) => item.key == c.is_available)?.value || c.is_available;

                                                                            return {
                                                                                label: `${formatDate(c.created_at, DateFormat?.DATE_FORMAT) || '-'} (${leaveType} - ${isAvailable})`,
                                                                                value: c.id || '-',
                                                                                disabled: c.is_available == 0,
                                                                            };
                                                                        })}
                                                                        optionRender={(option) => <Space>{option?.label}</Space>}
                                                                        optionFilterProp="label"
                                                                        className="border rounded-1"
                                                                    />
                                                                );
                                                            }}
                                                        />
                                                        <label className="errorc ps-1 pt-1">{errors?.[AstroInputTypesEnum.SELECTED_LEAVE_DATES]?.message}</label>
                                                    </div>
                                                } */}

                                                {
                                                    watch(AstroInputTypesEnum.LEAVE_DAY) && (watch(AstroInputTypesEnum.LEAVE_TYPE) == "casual" || watch(AstroInputTypesEnum.LEAVE_TYPE) == "compoff") && (
                                                        <div className="mb-2">
                                                            <label htmlFor="interest_type" className="form-label fw-semibold">
                                                                Select Leave Date<span className="text-danger ms-1">*</span>
                                                            </label>

                                                            <Controller
                                                                name={AstroInputTypesEnum.SELECTED_LEAVE_DATES}
                                                                control={control}
                                                                rules={{
                                                                    required: "Select Leave Date",
                                                                    validate: (selectedDates) => {

                                                                        // const selectedStartDate = watch(AstroInputTypesEnum.START_DATE);
                                                                        // const selectedEndDate = watch(AstroInputTypesEnum.END_DATE);
                                                                        // ✅ Your existing formatted conversion

                                                                        const startDate = selectedStartDate ? formatDateDyjs(selectedStartDate, DateFormat?.DATE_LOCAL_DASH_TIME_FORMAT) : null;
                                                                        const endDate = selectedEndDate ? formatDateDyjs(selectedEndDate, DateFormat?.DATE_LOCAL_DASH_TIME_FORMAT) : null;

                                                                        if (startDate && endDate) {
                                                                            const start = new Date(startDate);
                                                                            const end = new Date(endDate);

                                                                            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                                                                                return "Invalid start or end date format.";
                                                                            }

                                                                            // ✅ Calculate inclusive day difference
                                                                            const totalDays = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;

                                                                            if (selectedDates?.length !== totalDays) {
                                                                                return `Please select ${totalDays} date(s) to match the selected range`;
                                                                            }
                                                                        }
                                                                        return true;
                                                                    },
                                                                }}
                                                                render={({ field }) => {

                                                                    const leaveDay = watch(AstroInputTypesEnum.LEAVE_DAY);
                                                                    // const filteredList = leaveBalanceList?.filter((item) => leaveDay == "half" ?
                                                                    //     [0, 1, 2].includes(item.is_available)
                                                                    //     : [0, 1].includes(item.is_available)) || [];

                                                                    const hasTwo = leaveBalanceList?.some(item => Number(item.is_available) === 2);
                                                                    const filteredList = leaveBalanceList?.filter((item) => leaveDay == "half"
                                                                        ? hasTwo
                                                                            ? Number(item.is_available) == 2
                                                                            : [0, 1, 2].includes(Number(item.is_available))
                                                                        : [0, 1].includes(Number(item.is_available))
                                                                    ) || [];

                                                                    return (
                                                                        <Select
                                                                            mode="multiple"
                                                                            style={{ width: "100%" }}
                                                                            placeholder="Select Leave Date"
                                                                            value={field.value || []}
                                                                            onChange={(selectedIds) => {
                                                                                field.onChange(selectedIds);
                                                                                setValue(AstroInputTypesEnum.SELECTED_LEAVE_DATES, selectedIds);
                                                                                trigger(AstroInputTypesEnum.SELECTED_LEAVE_DATES); // revalidate dynamically
                                                                            }}
                                                                            options={filteredList.map((c) => {
                                                                                const leaveType = LEAVE_TYPE_LIST.find((item) => item.key == c.leave_type)?.value || c.leave_type;
                                                                                const isAvailable = LEAVE_TYPE_LIST_AVAILABLE.find((item) => item.key == c.is_available)?.value || c.is_available;
                                                                                return {
                                                                                    label: `${formatDate(c.created_at, DateFormat?.DATE_FORMAT) || "-"} (${leaveType} - ${isAvailable})`, value: c.id || "-",
                                                                                    disabled: c.is_available == 0,
                                                                                };
                                                                            })}
                                                                            optionRender={(option) => <Space>{option?.label}</Space>}
                                                                            optionFilterProp="label"
                                                                            className="border rounded-1"
                                                                        />
                                                                    );
                                                                }}
                                                            />
                                                            <label className="errorc ps-1 pt-1">
                                                                {errors?.[AstroInputTypesEnum.SELECTED_LEAVE_DATES]?.message}
                                                            </label>
                                                        </div>
                                                    )
                                                }

                                                <div className="mb-4">
                                                    <label htmlFor="product_name" className="form-label fw-semibold">
                                                        Leave Reason <span className="text-danger ms-1">*</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <textarea
                                                            className="form-control ps-2"
                                                            placeholder="Enter leave reason"
                                                            rows={4}
                                                            autoComplete="off"
                                                            {...register(
                                                                AstroInputTypesEnum.REASON,
                                                                textInputValidation(
                                                                    AstroInputTypesEnum.REASON,
                                                                    Language('Enter leave reason')
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
                                                <button type='button' className="btn btn-danger m-2" onClick={() => { navigation(PATHS.LEAVE_LIST) }}>Cancel</button>
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
