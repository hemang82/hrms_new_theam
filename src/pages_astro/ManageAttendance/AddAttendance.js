import React, { useState, useEffect, useRef } from 'react'
import Swal from 'sweetalert2'
import { useLocation, useNavigate } from 'react-router-dom'
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import Header from '../../layout/Header';
import Slidebar from '../../layout/Slidebar';
import Footer from '../../layout/Footer';
import { Language, TOAST_ERROR, TOAST_SUCCESS, allowLettersAndSpaces } from '../../config/common';
import { addAttendance, addEmployeeLeaves, AddUser, CustomerDetails, departnmentList, EditUser, } from '../../utils/api.services';
import SubNavbar from '../../layout/SubNavbar';
import categoryImage from '../../assets/Images/Group 48096953.png'
import { uploadImageOnAWS } from '../../utils/aws.service';
import Constatnt, { AwsFolder, Codes } from '../../config/constant';
import { SketchPicker } from 'react-color';
import { formatDate, formatDateDyjs, getBreakMinutes, getCommaSeparatedNames, getFileNameFromUrl, getWorkingHours, handelInputText, selectOption, selectOptionCustomer, textInputValidation, textValidation } from '../../config/commonFunction';
import { AstroInputTypesEnum, DateFormat, EMPLOYEE_STATUS, HALF_DAY_TYPE, InputRegex, InputTypesEnum, LEAVE_DAY, LEAVE_TYPE_LIST, TimeFormat } from '../../config/commonVariable';
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
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const [timeRange, setTimeRange] = useState({
        checkIn: null,
        checkOut: null,
    });

    const [breaks, setBreaks] = useState([
        { start: null, end: null }
    ]);

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
    } = useForm({
        defaultValues: {
            breaks: [{ start: null, end: null }], // ✅ at least one row
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "breaks",
    });

    var attendanceData = location?.state;

    useEffect(() => {
        const request = {
            emp_leave_company: EMPLOYEE_STATUS[0]?.key
        };
        if (customerList?.length === 0) {
            dispatch(getCustomerListThunk(request));
        }
    }, [])

    useEffect(() => {
        if (attendanceData && customerList?.length > 0) {
            dispatch(setLoader(true))
            const formattedBreaks = attendanceData?.breaks?.map(b => ({
                start: b.start ? dayjs(`${b.start}`, 'HH:mm:ss') : null,
                end: b.end ? dayjs(`${b.end}`, 'HH:mm:ss') : null
            }));
            setValue('breaks', formattedBreaks);
            const selectedEmployee = customerList?.find(emp => emp.id == attendanceData?.emp_id) || null;
            setSelectedEmployee(selectedEmployee || null)
            setValue(AstroInputTypesEnum?.EMPLOYEE_ID, attendanceData?.emp_id);
            setValue('dob1', attendanceData?.date ? dayjs(attendanceData?.date).format('DD-MM-YYYY') : null);
            setValue('checkIn', attendanceData?.checkInTimes?.[0] ? dayjs(`${attendanceData.date} ${attendanceData.checkInTimes[0]}`, 'YYYY-MM-DD HH:mm:ss') : null);

            setValue('checkOut', attendanceData?.checkOutTimes?.[0] ? dayjs(`${attendanceData.date} ${attendanceData.checkOutTimes[0]}`, 'YYYY-MM-DD HH:mm:ss') : null);
            dispatch(setLoader(false))
        }
        console.log('userData?.departmentuserData?.department', attendanceData?.department);
    }, [attendanceData, customerList]);

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
            // {
            //     "employee_id": "69",
            //     "date": "2025-09-01",
            //     "check_in_time": "13:09",
            //     "check_out_time": "20:11",
            //     "breaks": [
            //         {
            //             "start": "18:11",
            //             "end": "19:11"
            //         },
            //         {
            //             "id": 2,
            //             "start": "17:12",
            //             "end": "18:13"
            //         }
            //     ],
            //     "lat": "0.000",
            //     "": "0.000",
            //     "location_id": "TRACEWAVE"
            // }

            // let request = {
            //     employee_id: selectedEmployee?.id,
            //     date: formatDateDyjs(data?.dob1, DateFormat?.DATE_DASH_TIME_FORMAT),
            //     check_in_time: data?.checkIn ? dayjs(data.checkIn).format("HH:mm") : null,
            //     check_out_time: data?.checkOut ? dayjs(data.checkOut).format("HH:mm") : null,
            //     // breaks: data?.breaks.length > 0 ? data?.breaks : [],
            //     breaks: Array.isArray(data?.breaks) && data.breaks.length > 0
            //         ? data.breaks.map(b => ({
            //             start: b?.start
            //                 ? dayjs(b.start, TimeFormat?.TIME_WITH_SECONDS_12_HOUR_FORMAT).format("HH:mm")
            //                 : null,
            //             end: b?.end
            //                 ? dayjs(b.end, TimeFormat?.TIME_WITH_SECONDS_12_HOUR_FORMAT).format("HH:mm")
            //                 : null
            //         }))
            //         : [],
            //     lat: "0.000",
            //     log: "0.000",
            //     location_id: "TRACEWAVE",
            // };

            let request = {
                employee_id: selectedEmployee?.id,
                date: formatDateDyjs(data?.dob1, DateFormat?.DATE_DASH_TIME_FORMAT),
                check_in_time: data?.checkIn ? dayjs(data.checkIn).format("HH:mm") : null,
                check_out_time: data?.checkOut ? dayjs(data.checkOut).format("HH:mm") : null,
                breaks: Array.isArray(data?.breaks) && data?.breaks?.length > 0
                    ? data.breaks.map(b => ({
                        start: b?.start
                            ? dayjs(b.start, TimeFormat?.TIME_WITH_SECONDS_12_HOUR_FORMAT).format("HH:mm")
                            : null,
                        end: b?.end
                            ? dayjs(b.end, TimeFormat?.TIME_WITH_SECONDS_12_HOUR_FORMAT).format("HH:mm")
                            : null
                    })) : [],
                lat: "0.000",
                log: "0.000",
                location_id: "TRACEWAVE",
            };

            if (attendanceData) {
                // request.employee_id = userData?.id?.toString();
                // EditUser(request).then((response) => {
                //     if (response?.code == Codes.SUCCESS) {
                //         TOAST_SUCCESS(response?.message)
                //         navigation(PATHS?.ATTENDANCE_LIST)
                //     } else {
                //         TOAST_ERROR(response.message)
                //     }
                // })
            } else {
                addAttendance(request).then((response) => {
                    if (response?.code == Codes.SUCCESS) {
                        TOAST_SUCCESS(response?.message)
                        navigation(PATHS?.ATTENDANCE_LIST)
                        dispatch(setLoader(false))

                    } else {
                        TOAST_ERROR(response.message)
                        dispatch(setLoader(false))
                    }
                })
            }

        } catch (error) {
            TOAST_ERROR('Somthing went wrong')
            dispatch(setLoader(false))
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

    const handleCheckInCheckOutChange = (field, value) => {
        setTimeRange((prev) => ({
            ...prev,
            [field]: value || null,
        }));
    };

    console.log('watch()', watch('breaks'));

    return (
        <>
            {<Spinner isActive={is_loding} message={'Please Wait'} />}
            <div className="container-fluid mw-100">

                <SubNavbar title={attendanceData ? 'Edit Attendance' : 'Add Attendance'} header={'Attendance List'} subHeaderOnlyView={attendanceData ? 'Edit Attendance' : 'Add Attendance'} />

                <div className="row">
                    {
                        selectedEmployee &&
                        <div className="col-12 justify-content-center">
                            <div className="card  ">
                                <div className="p-md-4 p-4 row_2">

                                    <div className="p-8 py-3 border-bottom chat-meta-user d-flex align-items-center justify-content-between mb-4">
                                        <h5 className="text-secondary mb-0 fw-semibold fs-5">Employee Attendance Details</h5>
                                    </div>

                                    {console.log('getWorkingHours', getBreakMinutes(watch('breaks')))}
                                    <div className="row">
                                        {[
                                            // { label: "Employee Id", value: selectedEmployee?.employee_id },
                                            // { label: "Name", value: selectedEmployee?.name },
                                            // { label: "Gender", value: selectedEmployee?.gender == "M" ? "Male" : selectedEmployee?.gender == "F" ? "Female" : "Other" },
                                            { label: "Work Hours", value: getWorkingHours(dayjs(watch('checkIn')).format("HH:mm:ss"), dayjs(watch('checkOut')).format("HH:mm:ss"), getBreakMinutes(watch('breaks'))) || 0 },
                                            { label: "Total Break", value: getBreakMinutes(watch('breaks')) + 'm' },

                                        ].map((item, index) => (
                                            <div className='col-12 col-sm-6 col-md-2 col-lg-4 '>
                                                <div key={index} className="card border-1 zoom-in them-light shadow-sm">
                                                    <div className="card-body text-center">
                                                        <p className="fw-semibold fs-4 text-custom-theam ">{item.label}</p>
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
                                                    {fields.map((field, index) => (
                                                        <div className="row g-3 mb-3" key={field.id}>
                                                            {/* ✅ Break In */}
                                                            <div className="col-12 col-md-5">
                                                                <label
                                                                    htmlFor={`breaks[${index}].start`}
                                                                    className="form-label fw-semibold"
                                                                >
                                                                    Break In Time <span className="text-danger">*</span>
                                                                </label>

                                                                <Controller
                                                                    name={`breaks.${index}.start`}
                                                                    control={control}
                                                                    // rules={{ required: "Break In is required" }}
                                                                    render={({ field, fieldState: { error } }) => (
                                                                        <>
                                                                            <DatePicker
                                                                                id={`breakIn-${index}`}
                                                                                className="form-control custom-datepicker w-100"
                                                                                picker="time"
                                                                                format={TimeFormat?.TIME_WITH_SECONDS_12_HOUR_FORMAT} z
                                                                                value={field.value ? dayjs(field.value, TimeFormat?.TIME_WITH_SECONDS_12_HOUR_FORMAT) : null}
                                                                                onChange={(time) =>
                                                                                    field.onChange(time ? dayjs(time).format(TimeFormat?.TIME_WITH_SECONDS_12_HOUR_FORMAT) : null)
                                                                                }
                                                                                allowClear={false}
                                                                            />
                                                                            {error && (
                                                                                <small className="text-danger">{error.message}</small>
                                                                            )}
                                                                        </>
                                                                    )}
                                                                />
                                                            </div>

                                                            {/* ✅ Break Out */}
                                                            <div className="col-12 col-md-5">
                                                                <label
                                                                    htmlFor={`breaks[${index}].end`}
                                                                    className="form-label fw-semibold"
                                                                >
                                                                    Break Out Time <span className="text-danger">*</span>
                                                                </label>

                                                                <Controller
                                                                    name={`breaks.${index}.end`}
                                                                    control={control}
                                                                    render={({ field, fieldState: { error } }) => (
                                                                        <>
                                                                            <DatePicker
                                                                                id={`breakOut-${index}`}
                                                                                className="form-control custom-datepicker w-100"
                                                                                picker="time"
                                                                                format={TimeFormat?.TIME_WITH_SECONDS_12_HOUR_FORMAT}
                                                                                value={field.value ? dayjs(field.value, TimeFormat?.TIME_WITH_SECONDS_12_HOUR_FORMAT) : null}
                                                                                onChange={(time) =>
                                                                                    field.onChange(time ? dayjs(time).format(TimeFormat?.TIME_WITH_SECONDS_12_HOUR_FORMAT) : null)
                                                                                }
                                                                                allowClear={false}
                                                                            />
                                                                            {error && (
                                                                                <small className="text-danger">{error?.message}</small>
                                                                            )}
                                                                        </>
                                                                    )}
                                                                />
                                                            </div>

                                                            {/* ✅ Remove Button */}
                                                            <div className="col-12 col-md-2 d-flex align-items-end">
                                                                {fields.length > 1 && (
                                                                    <button
                                                                        type="button"
                                                                        className="btn text-white bg-danger btn-sm"
                                                                        style={{ border: "1px solid transparent" }}
                                                                        onMouseEnter={(e) =>
                                                                            (e.currentTarget.style.border = "1px solid #fa896b")
                                                                        }
                                                                        onMouseLeave={(e) =>
                                                                            (e.currentTarget.style.border = "1px solid transparent")
                                                                        }
                                                                        onClick={() => remove(index)}
                                                                    >
                                                                        Remove
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}

                                                    {/* ✅ Add Break Row */}
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary"
                                                        onClick={() => append({ start: null, end: null })}
                                                    >
                                                        + Add Break
                                                    </button>
                                                </div>
                                            </div>

                                            <div className='col-md-6'>
                                                <div className="mb-4">
                                                    <div className="col-12 col-md-10">
                                                        <label htmlFor="dob1" className="form-label fw-semibold">
                                                            Date <span className="text-danger ms-1">*</span>
                                                        </label>

                                                        <Controller
                                                            name="dob1"
                                                            control={control}
                                                            rules={{ required: "Date is required" }}
                                                            render={({ field }) => (
                                                                <DatePicker
                                                                    id="dob1"
                                                                    className="form-control custom-datepicker w-100"
                                                                    format="DD-MM-YYYY" // ✅ change format as needed
                                                                    value={field.value ? dayjs(field.value) : null}
                                                                    onChange={(date) => field.onChange(date ? date.toISOString() : null)}
                                                                    allowClear={false}
                                                                    picker="date"
                                                                />
                                                            )}
                                                        />

                                                        {/* ✅ Error Message */}
                                                        {errors.dob1 && (
                                                            <small className="text-danger">{errors.dob1.message}</small>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="row mb-4 g-3">
                                                    {/* ✅ Check In */}
                                                    <div className="col-12 col-md-5">
                                                        <label htmlFor="checkIn" className="form-label fw-semibold">
                                                            Check In Time <span className="text-danger ms-1">*</span>
                                                        </label>
                                                        <Controller
                                                            name="checkIn"
                                                            control={control}
                                                            rules={{ required: "Check In time is required" }}
                                                            render={({ field }) => (
                                                                <DatePicker
                                                                    {...field}
                                                                    id="checkIn"
                                                                    className="form-control custom-datepicker w-100"
                                                                    picker="time"
                                                                    format={TimeFormat?.TIME_WITH_SECONDS_12_HOUR_FORMAT}
                                                                    value={field.value}
                                                                    onChange={(time) => field.onChange(time)}
                                                                    allowClear={false}
                                                                />
                                                            )}
                                                        />
                                                        {errors.checkIn && (
                                                            <span className="text-danger small">{errors.checkIn.message}</span>
                                                        )}
                                                    </div>

                                                    {/* ✅ Check Out */}
                                                    <div className="col-12 col-md-5">
                                                        <label htmlFor="checkOut" className="form-label fw-semibold">
                                                            Check Out Time <span className="text-danger ms-1">*</span>
                                                        </label>
                                                        <Controller
                                                            name="checkOut"
                                                            control={control}
                                                            // rules={{ required: "Check Out time is required" }}
                                                            render={({ field }) => (
                                                                <DatePicker
                                                                    {...field}
                                                                    id="checkOut"
                                                                    className="form-control custom-datepicker w-100"
                                                                    picker="time"
                                                                    format={TimeFormat?.TIME_WITH_SECONDS_12_HOUR_FORMAT}
                                                                    value={field.value}
                                                                    onChange={(time) => field.onChange(time)}
                                                                    allowClear={false}
                                                                />
                                                            )}
                                                        />
                                                        {errors.checkOut && (
                                                            <span className="text-danger small">{errors.checkOut.message}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="modal-footer justify-content-center mb-3">
                                                {/* {
                                                    attendanceData ?
                                                        <button type='button' className="btn btn-danger m-2" onClick={() => { navigation(PATHS.ATTENDANCE_LIST) }}>Cancel</button>
                                                        : <button type='button' className="btn btn-danger m-2" onClick={() => { reset(); setShowadhaarCardImage(""); setAdhaarCardFileName(""); setPanCardFileName(""); setShowPanCardImage("") }}>Reset</button>
                                                } */}
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
