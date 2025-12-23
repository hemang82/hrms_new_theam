import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../layout/Header';
import Slidebar from '../../layout/Slidebar';
import $, { data } from 'jquery';
import 'datatables.net-bs5';
import 'datatables.net-responsive-bs5';
import SubNavbar from '../../layout/SubNavbar';
import { updateLoanDetails, loanDetails, addDisbursementLoan, addLeaves, editAttendance, addAttendance } from '../../utils/api.services';
import { ExportToCSV, ExportToExcel, ExportToPdf, SWIT_DELETE, SWIT_DELETE_SUCCESS, SWIT_FAILED, TOAST_ERROR, TOAST_SUCCESS } from '../../config/common';
import profile_image from '../../assets/Images/default.jpg'
import ReactDatatable from '../../config/ReactDatatable';
import { Helmet } from 'react-helmet';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { getCustomerListThunk, setLoader, updateLoanList, getlistAttendanceThunk, updateAttendanceList } from '../../Store/slices/MasterSlice';
import Constatnt, { AwsFolder, Codes, ModelName, SEARCH_DELAY } from '../../config/constant';
import useDebounce from '../hooks/useDebounce';
import { closeModel, convertToUTC, formatDate, formatDateDyjs, formatDateIncommingDyjs, formatIndianPrice, getBreakMinutes, getCheckInOutMinutes, getCheckOutMinutes, getFileNameFromUrl, getLoanStatusObject, getLocalStorageItem, getWorkingHours, momentDateFormat, momentTimeFormate, openModel, selectOption, selectOptionCustomer, textInputValidation, truncateWords } from '../../config/commonFunction';
import Model from '../../component/Model';
import { DeleteComponent } from '../CommonPages/CommonComponent';
import Pagination from '../../component/Pagination';
import { AstroInputTypesEnum, AttendanceStatus, DateFormat, EMPLOYEE_STATUS, getAttendanceStatusColor, getStatus, InputRegex, LEAVE_TYPE_LIST, PAYMENT_STATUS, STATUS_COLORS, TimeFormat } from '../../config/commonVariable';
import { RiAddCircleFill, RiUserReceivedLine } from 'react-icons/ri';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { DatePicker, ConfigProvider } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import 'dayjs/locale/en'; // or your locale
import { IoAddCircleOutline, IoClose } from 'react-icons/io5';
import { uploadImageOnAWS } from '../../utils/aws.service';
import { PATHS } from '../../Router/PATHS';
// import moment from 'moment';
import moment from 'moment-timezone';
import Spinner from '../../component/Spinner';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import cloneDeep from "lodash/cloneDeep";
import { FaDownload } from 'react-icons/fa';

dayjs.extend(utc);
dayjs.extend(timezone);

export default function ManageAttendance() {

    let navigat = useNavigate();
    const dispatch = useDispatch();

    const dateFormat = 'YYYY-MM-DD';

    const [totalRows, setTotalRows] = useState(0);

    const [is_load, setis_load] = useState(false);

    const { attendanceList: { data: attendanceList } } = useSelector((state) => state.masterslice);
    const { customerList: { data: customerList }, } = useSelector((state) => state.masterslice);
    const { customModel } = useSelector((state) => state.masterslice);

    // const { register, handleSubmit, setValue, clearErrors, reset, watch, trigger, control, formState: { errors } } = useForm();
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

    const ALLSTATUS_LIST = [
        // { key: "", value: "ALL STATUS" },
        { key: "2", value: "Pending" },
        { key: "1", value: "Accepted" },
        { key: "0", value: "Cancelled" },
    ];

    var userDetails = JSON.parse(localStorage.getItem(Constatnt.AUTH_KEY));

    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [selectedAttendance, setSelectedAttendance] = useState({})
    const [loading, setLoading] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const debounce = useDebounce(globalFilterValue, SEARCH_DELAY);
    const [filters, setFilters] = useState({ global: { value: '' } });
    const [statusModal, setStatusModal] = useState(false);
    const [selectedOption, setSelectedOption] = useState({});
    const [sortField, setSortField] = useState(null);
    const [sortOrder, setSortOrder] = useState(-1);
    const [startDate, setStartDate] = useState(dayjs()); // ✅ start of previous month
    const [endDate, setEndDate] = useState(dayjs());
    const [perPage, setPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [showProofImage, setShowProofImage] = useState(null);
    const [proofFileName, setProofFileName] = useState('');
    const [is_loding, setIs_loading] = useState(false);
    const [updatedAttendanceList, setUpdateAttendanceList] = useState([]);
    const [attendanceEditModal, setAttendanceEditModel] = useState(false);
    const [attendanceAddModal, setAttendanceAddModel] = useState(false);

    const [employeeStatus, setEmployeeStatus] = useState(EMPLOYEE_STATUS[0]);

    useEffect(() => {
        const request = {
            emp_leave_company: employeeStatus?.key,
        };
        // if (customerList?.length === 0) {
        dispatch(getCustomerListThunk(request));
        // }
        setSelectedOption({})
    }, [])

    const updatedData = (attendanceList, startDate, endDate) => {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0); // normalize start date
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // include full day for end date
        const modified = attendanceList.flatMap((item) =>
            item?.dates
                ?.filter((dates) => {
                    const currentDate = new Date(dates?.date);
                    return currentDate >= start && currentDate <= end;
                }).map((dates) => ({
                    emp_id: item?.emp_id,
                    name: item?.name,
                    date: dates?.date,
                    type: dates?.type,
                    status: dates?.status,
                    checkInTimes: dates?.checkInTimes,
                    checkOutTimes: dates?.checkOutTimes,
                    breaks: dates?.breaks,
                }))
        );
        const sorted = modified.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setUpdateAttendanceList(sorted);
    }

    useEffect(() => {
        if (attendanceList && attendanceList?.length > 0 && startDate && endDate) {
            // updatedData(attendanceList, startDate, endDate)
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0); // normalize start date
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999); // include full day for end date
            const modified = attendanceList.flatMap((item) =>
                item?.dates
                    ?.filter((dates) => {
                        const currentDate = new Date(dates?.date);
                        return currentDate >= start && currentDate <= end;
                    }).map((dates) => ({
                        emp_id: item?.emp_id,
                        name: item?.name,
                        date: dates?.date,
                        type: dates?.type,
                        status: dates?.status,
                        checkInTimes: dates?.checkInTimes,
                        checkOutTimes: dates?.checkOutTimes,
                        breaks: dates?.breaks,
                    }))
            );
            const sorted = modified?.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setUpdateAttendanceList(sorted);
        } else {
            setUpdateAttendanceList([])
        }
    }, [attendanceList, employeeStatus]);

    useEffect(() => {
        let request = {
            start_date: startDate ? formatDateDyjs(startDate, DateFormat.DATE_LOCAL_DASH_TIME_FORMAT) : null,
            end_date: endDate ? formatDateDyjs(endDate, DateFormat.DATE_LOCAL_DASH_TIME_FORMAT) : null,
            status: selectedOption?.key || "",
            emp_leave_company: employeeStatus?.key,
        };
        dispatch(getlistAttendanceThunk(request));
    }, []);

    const handleDelete = (is_true) => {
        if (is_true) {
            // dispatch(setLoader(true));
            // let submitData = {
            //     loan_id: selectedAttendance?.id,
            //     is_deleted: true,
            // }
            // updateLoanDetails(submitData).then((response) => {
            //     if (response.status_code === Codes?.SUCCESS) {
            //         setis_load(false)
            //         const updatedList = attendanceList?.filter((item) => item.id !== selectedAttendance?.id)
            //         dispatch(updateLoanList({
            //             ...attendanceList,
            //             loan_applications: updatedList
            //         }))
            //         closeModel(dispatch)
            //         dispatch(setLoader(false))
            //         TOAST_SUCCESS(response?.message);
            //     }
            // });
        }
    };

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };
        if (_filters['global']) { // Check if _filters['global'] is defined
            _filters['global'].value = value;
        }
        setFilters(_filters);
        setPage(1)
        setGlobalFilterValue(value?.trim());
    };

    const onPageChange = (Data) => {
        setPage(Data)
    }

    const onSubmitData = async (data) => {

        dispatch(setLoader(true));

        let sendRequest = {
            employee_id: selectedEmployee?.id,
            date: formatDateIncommingDyjs(data?.dob1, DateFormat?.DATE_FORMAT, DateFormat?.DATE_DASH_TIME_FORMAT),
            check_in_time: data?.checkIn ? dayjs(data.checkIn).format("HH:mm") : null,
            check_out_time: data?.checkOut ? dayjs(data.checkOut).format("HH:mm") : null,
            breaks: [],
            lat: "0.000",
            log: "0.000",
            location_id: `TRACEWAVE ADMIN ${userDetails?.email} ${moment.utc().format(DateFormat?.DATE_DOT_TIME_FORMAT)}`,
        };

        // return
        addAttendance(sendRequest).then((response) => {
            if (response?.code == Codes.SUCCESS) {
                dispatch(setLoader(false))
                TOAST_SUCCESS(response?.message);

                // let updatedList = cloneDeep(updatedAttendanceList); // shallow copy (optional, if immutability needed)
                // let target = updatedList.find(item => item.emp_id == selectedEmployee?.id);
                // if (target) {
                //     target.checkInTimes = data?.checkIn ? [convertToUTC(sendRequest?.date, sendRequest?.check_in_time, TimeFormat?.TIME_WITH_SECONDS_24_HOUR_FORMAT)] : [];
                //     target.checkOutTimes = data?.checkOut ? [convertToUTC(sendRequest?.date, sendRequest?.check_out_time, TimeFormat?.TIME_WITH_SECONDS_24_HOUR_FORMAT)] : [];
                //     target.breaks = Array.isArray(data?.breaks) && data?.breaks?.length > 0 ? data?.breaks?.map(b => ({
                //         // start: b?.start ? convertToUTC(sendRequest?.date, b.start, TimeFormat?.TIME_WITH_SECONDS_24_HOUR_FORMAT) : null,
                //         // end: b?.end ? convertToUTC(sendRequest?.date, b.end, TimeFormat?.TIME_WITH_SECONDS_24_HOUR_FORMAT) : null
                //         start: b?.start ? convertToUTC(sendRequest?.date, dayjs(b.start, TimeFormat?.TIME_WITH_SECONDS_24_HOUR_FORMAT).format(TimeFormat?.TIME_WITH_SECONDS_24_HOUR_FORMAT), TimeFormat?.TIME_WITH_SECONDS_24_HOUR_FORMAT) : null,
                //         end: b?.end ? convertToUTC(sendRequest?.date, dayjs(b.end, TimeFormat?.TIME_WITH_SECONDS_24_HOUR_FORMAT).format(TimeFormat?.TIME_WITH_SECONDS_24_HOUR_FORMAT), TimeFormat?.TIME_WITH_SECONDS_24_HOUR_FORMAT) : null
                //     })) : [];
                // }
                // console.log("updatedList", updatedList);
                // setUpdateAttendanceList(updatedList);
                let request = {
                    start_date: startDate ? formatDateDyjs(startDate, DateFormat.DATE_LOCAL_DASH_TIME_FORMAT) : null,
                    end_date: endDate ? formatDateDyjs(endDate, DateFormat.DATE_LOCAL_DASH_TIME_FORMAT) : null,
                    status: selectedOption?.key || "",
                    emp_leave_company: employeeStatus?.key,
                };
                dispatch(getlistAttendanceThunk(request));
                closeAddAttendanceModel()
            } else {
                TOAST_ERROR(response?.message)
            }
        })
    }

    const openModelFunc = (data) => {
        setStatusModal(true)
        setSelectedAttendance(data)
    }

    const closeModelFunc = () => {
        setStatusModal(false)
        setSelectedAttendance({})
    }

    const openAttendanceModel = (attendanceData) => {
        setAttendanceEditModel(true)
        setSelectedAttendance(attendanceData)
        const formattedBreaks = attendanceData?.breaks?.map(b => ({
            start: b.start ? dayjs(momentTimeFormate(b.start, 'HH:mm:ss'), 'HH:mm:ss').format(TimeFormat?.TIME_WITH_SECONDS_12_HOUR_FORMAT) : null,
            end: b.end ? dayjs(momentTimeFormate(b.end, 'HH:mm:ss'), 'HH:mm:ss').format(TimeFormat?.TIME_WITH_SECONDS_12_HOUR_FORMAT) : null
        }));

        setValue('breaks', formattedBreaks);
        const selectedObj = customerList?.length > 0 && customerList?.find((c) => String(c.id) === String(attendanceData?.emp_id));
        setSelectedEmployee(selectedObj || null);
        setValue(AstroInputTypesEnum?.EMPLOYEE, selectedObj.id)

        setValue('dob1', attendanceData?.date ? dayjs(attendanceData?.date).format('DD-MM-YYYY') : null);
        setValue('checkIn', attendanceData?.checkInTimes?.[0] ? dayjs(`${attendanceData.date} ${momentTimeFormate(attendanceData.checkInTimes[0], 'HH:mm:ss')}`, 'YYYY-MM-DD HH:mm:ss') : null);
        // setValue('checkOut', attendanceData?.checkOutTimes?.[0] ? dayjs(`${attendanceData.date} ${momentTimeFormate(attendanceData.checkOutTimes[0], 'HH:mm:ss')}`, 'YYYY-MM-DD HH:mm:ss') : null);

        setValue('checkOut', attendanceData?.checkInTimes?.length > 0 && attendanceData?.checkOutTimes?.length > 0 && attendanceData.checkOutTimes.length === attendanceData?.checkInTimes?.length
            ? dayjs(`${attendanceData.date} ${momentTimeFormate(attendanceData?.checkOutTimes[attendanceData?.checkOutTimes.length - 1], "HH:mm:ss")}`, "YYYY-MM-DD HH:mm:ss") : null);

    }

    const closeAttendanceModel = () => {
        setAttendanceEditModel(false)
        setSelectedAttendance({})
        reset()
    }

    const openAddAttendanceModel = () => {
        setAttendanceEditModel(false)
        setAttendanceAddModel(true)
        // setSelectedAttendance(attendanceData)
        // const formattedBreaks = attendanceData?.breaks?.map(b => ({
        //     start: b.start ? dayjs(momentTimeFormate(b.start, 'HH:mm:ss'), 'HH:mm:ss').format(TimeFormat?.TIME_WITH_SECONDS_12_HOUR_FORMAT) : null,
        //     end: b.end ? dayjs(momentTimeFormate(b.end, 'HH:mm:ss'), 'HH:mm:ss').format(TimeFormat?.TIME_WITH_SECONDS_12_HOUR_FORMAT) : null
        // }));

        // setValue('breaks', formattedBreaks);
        // const selectedObj = customerList?.length > 0 && customerList?.find((c) => String(c.id) === String(attendanceData?.emp_id));
        // setSelectedEmployee(selectedObj || null);
        // setValue(AstroInputTypesEnum?.EMPLOYEE, selectedObj.id)

        // setValue('dob1', attendanceData?.date ? dayjs(attendanceData?.date).format('DD-MM-YYYY') : null);
        // setValue('checkIn', attendanceData?.checkInTimes?.[0] ? dayjs(`${attendanceData.date} ${momentTimeFormate(attendanceData.checkInTimes[0], 'HH:mm:ss')}`, 'YYYY-MM-DD HH:mm:ss') : null);
        // // setValue('checkOut', attendanceData?.checkOutTimes?.[0] ? dayjs(`${attendanceData.date} ${momentTimeFormate(attendanceData.checkOutTimes[0], 'HH:mm:ss')}`, 'YYYY-MM-DD HH:mm:ss') : null);

        // setValue('checkOut', attendanceData?.checkInTimes?.length > 0 && attendanceData?.checkOutTimes?.length > 0 && attendanceData.checkOutTimes.length === attendanceData?.checkInTimes?.length
        //     ? dayjs(`${attendanceData.date} ${momentTimeFormate(attendanceData?.checkOutTimes[attendanceData?.checkOutTimes.length - 1], "HH:mm:ss")}`, "YYYY-MM-DD HH:mm:ss") : null);

    }

    const closeAddAttendanceModel = () => {
        setAttendanceAddModel(false)
        setSelectedAttendance({})
        reset()
    }

    const changeStatusFunction = (data) => {
        setValue('payment_status', PAYMENT_STATUS.find(item => item.key === data)?.key)
        const statusExists = selectedAttendance?.status === data;
        setValue('remarks', statusExists ? selectedAttendance?.remarks : '')
        const bankDetails = selectedAttendance?.bank_accounts[0]
        const approvalDetails = selectedAttendance?.approval_details[0]
        // setValue('payment_status', PAYMENT_STATUS.find(item => item.key === "BANK_TRANSFER")?.key)
        setValue('approved_amount', Number(approvalDetails?.disbursed_amount || 0).toFixed(2))
        setValue('bank_name', bankDetails?.bank_name)
        setValue('account_number', bankDetails?.account_number)
        setValue('ifsc_code', bankDetails?.ifsc_code)
        setValue('account_holder_name', bankDetails?.account_holder_name)
    }

    const handleSelect = (option) => {
        setSelectedOption(option);
        setPage(1);
    };

    const handleSort = (event) => {
        console.log("Sort event triggered:", event);
        setSortField(event?.sortField); // ✅ correct key
        setSortOrder(event?.sortOrder);
    };

    // ---------------------------------- Formate date filter----------------------------------------

    const disabledEndDate = (current) => {
        if (!startDate) return false;
        return current.isBefore(startDate, 'day');
    };

    const onChangeApiCalling = async (data) => {
        try {
            const request = {
                start_date: data?.start_date ? formatDateDyjs(data.start_date, DateFormat.DATE_LOCAL_DASH_TIME_FORMAT) : null,
                end_date: data?.end_date ? formatDateDyjs(data.end_date, DateFormat.DATE_LOCAL_DASH_TIME_FORMAT) : null,
                employee_id: data?.employee_id || "",
                emp_leave_company: data?.emp_leave_company || "0"
            };
            await dispatch(getlistAttendanceThunk(request));
            const request2 = {
                emp_leave_company: data?.emp_leave_company || "0",
            };
            // if (customerList?.length === 0) {
            dispatch(getCustomerListThunk(request2));
            // }
        } finally {
        }
    };

    // ---------------------------------- Export Data -----------------------------------------------

    const handleExportApiCall = async () => {
        dispatch(setLoader(true));

        let submitData = {
            search: globalFilterValue
        }
        const AttendanceExportData = updatedAttendanceList?.length > 0 && updatedAttendanceList?.map((item, index) => ({
            id: index + 1,
            // employeeID: `${salary?.emp_id || '-'}`,
            Name: `${item?.name || '-'}`,
            Date: momentDateFormat(item?.date, DateFormat?.DATE_FORMAT) || '-',
            Day: momentDateFormat(item?.date, DateFormat?.DATE_WEEK_NAME_FORMAT) || '-',
            Status: getStatus(item?.status) || "-",
            CheckIN: item?.checkInTimes[0]?.length > 0 ? momentTimeFormate(item?.checkInTimes[0], TimeFormat.TIME_12_HOUR_FORMAT) || '-' : "-" || '-',
            CheckOUT: item?.checkOutTimes[0]?.length > 0 ? momentTimeFormate(item?.checkOutTimes[0], TimeFormat.TIME_12_HOUR_FORMAT) || '-' : "-" || '-',
            WorkingHours: item?.checkInTimes[0]?.length > 0 ? getWorkingHours(item?.checkInTimes, item?.checkOutTimes) || '-' : "-",
            // BreakTime: item.breaks?.length > 0 ? getBreakMinutes(item.breaks) + 'm' : '-' || '-',
            // TotalBreak: item.breaks.length > 0 ? item.breaks.map((b, index) => `Break ${index + 1}: ${momentTimeFormate(b.start, TimeFormat.DATE_TIME_12_HOUR_FORMAT)} - ${momentTimeFormate(b.end, TimeFormat.DATE_TIME_12_HOUR_FORMAT)} `).join(" | ") : "N/A",
        }));

        return { code: 1, data: AttendanceExportData }
    };

    const handleExportToPdfManage = async () => {
        const { code, data } = await handleExportApiCall();
        if (code == Codes.SUCCESS) {
            data.forEach(item => {
                delete item.id;
                delete item.TotalBreak;
                delete item.Day;
            });
            ExportToPdf(data, 'Attendance List', 'Attendance List');
        }
        dispatch(setLoader(false));
    };

    const handleExportToCSVManage = async () => {
        const { code, data } = await handleExportApiCall();
        if (code == Codes.SUCCESS) {

            ExportToCSV(data, 'Attendance List');
        }
        dispatch(setLoader(false));
    };

    const handleExportToExcelManage = async () => {
        const { code, data } = await handleExportApiCall();
        if (code == Codes.SUCCESS) {
            ExportToExcel(data, 'Attendance List');
        }
        dispatch(setLoader(false));
    };

    return (
        <>
            {<Spinner isActive={is_loding} message={'Please Wait'} />}
            <div className="container-fluid mw-100">

                <SubNavbar title={"Attendance List"} header={'Attendance List'} />

                <div className="widget-content searchable-container list">

                    {/* --------------------- start Contact ---------------- */}

                    <div className="card card-body mb-2 p-3">
                        <div className="row g-2 align-items-end">

                            {/* Search */}
                            <div className="col-12 col-md-6 col-lg-3">
                                <div className="position-relative mt-2 mt-lg-0">
                                    <input
                                        type="text"
                                        className="form-control ps-5"
                                        id="input-search"
                                        placeholder="Search Attendance ..."
                                        value={globalFilterValue}
                                        onChange={onGlobalFilterChange}
                                    />
                                    <i className="ti ti-search position-absolute top-50 start-0 translate-middle-y fs-6 text-dark ms-3" />
                                </div>
                            </div>

                            <div className="col-12 col-md-6 col-lg-1">

                            </div>
                            {/* Start Date */}
                            <div className="col-6 col-md-6 col-lg-2">
                                <label className="d-block mb-1 fw-semibold">Start Date</label>
                                <DatePicker
                                    className="custom-datepicker w-100 p-2"
                                    format={DateFormat?.DATE_FORMAT}
                                    value={startDate}
                                    onChange={(date) => {
                                        setStartDate(date);
                                        setEndDate(null);
                                        // handleSelect({ id: "", name: "All Employees" });
                                    }}
                                />
                            </div>

                            {/* End Date */}
                            <div className="col-6 col-md-6 col-lg-2">
                                <label className="d-block mb-1 fw-semibold">End Date</label>
                                <DatePicker
                                    className="custom-datepicker w-100 p-2"
                                    format={DateFormat?.DATE_FORMAT}
                                    value={endDate}
                                    onChange={(end_date) => {
                                        setEndDate(end_date);
                                        setPage(1);
                                        onChangeApiCalling({
                                            end_date: end_date,
                                            start_date: startDate,
                                            status: "",
                                            emp_leave_company: employeeStatus?.key,
                                            employee_id: selectedOption?.id ? selectedOption?.id : ""
                                        });
                                    }}
                                    disabled={!startDate}
                                    disabledDate={disabledEndDate}
                                />
                            </div>

                            {/* Employee Filter */}
                            <div className="col-12 col-md-6 col-lg-2">
                                <label className="d-block mb-1 fw-semibold">Employees Filter</label>
                                <div className="dropdown w-100">
                                    <button
                                        className="btn btn-info dropdown-toggle w-100"
                                        type="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                        style={{ height: '40px' }}
                                    >
                                        {selectedOption?.name || 'Select Employee'}
                                    </button>
                                    <ul
                                        className="dropdown-menu w-100"
                                        style={{ maxHeight: '300px', overflowY: 'auto' }}
                                    >
                                        <li key="all">
                                            <button
                                                className="dropdown-item text-black-50 p-2"
                                                type="button"
                                                onClick={() => {
                                                    onChangeApiCalling({
                                                        start_date: startDate,
                                                        end_date: endDate,
                                                        employee_id: "",
                                                        emp_leave_company: employeeStatus?.key
                                                    });
                                                    handleSelect({ id: "", name: "All Employees" });
                                                }}
                                            >
                                                All Employees
                                            </button>
                                        </li>

                                        {customerList?.length > 0 && customerList?.map((option) => (
                                            <li key={option.id}>
                                                <button
                                                    className="dropdown-item text-black-50 p-2"
                                                    type="button"
                                                    onClick={() => {
                                                        onChangeApiCalling({
                                                            start_date: startDate,
                                                            end_date: endDate,
                                                            employee_id: option?.id,
                                                            emp_leave_company: employeeStatus?.key
                                                        });
                                                        handleSelect(option);
                                                    }}
                                                >
                                                    {option?.name}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Status */}
                            <div className="col-12 col-md-6 col-lg-1">
                                <label className="d-block mb-1 fw-semibold">Status</label>
                                <div className="dropdown w-100">
                                    <button
                                        type="button"
                                        className="btn btn-info dropdown-toggle w-100"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                        style={{ height: '40px' }}
                                    >
                                        {employeeStatus?.value || 'Select Status'}
                                    </button>
                                    <ul className="dropdown-menu w-100">
                                        {EMPLOYEE_STATUS?.map((option) => (
                                            <li key={option.key}>
                                                <a
                                                    className="dropdown-item text-black-50 cursor_pointer"
                                                    onClick={() => {
                                                        onChangeApiCalling({
                                                            start_date: startDate,
                                                            end_date: endDate,
                                                            emp_leave_company: option?.key,
                                                            employee_id: ""
                                                        });
                                                        setEmployeeStatus(option);
                                                        handleSelect({ id: "", name: "All Employees" });

                                                    }}
                                                >
                                                    {option?.value}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Add + Download */}
                            <div className="col-12 col-md-6 col-lg-1 d-flex align-items-end justify-content-between gap-2">

                                {/* Add Button */}
                                <button
                                    type="button"
                                    className="btn btn-sm btn-info d-flex align-items-center justify-content-center flex-fill"
                                    style={{ height: '40px', minWidth: '40px', padding: 0 }}
                                    // onClick={() => navigat(PATHS.ADD_ATTENDANCE)}
                                    onClick={() => { openAddAttendanceModel() }}
                                    title="Add Attendance"
                                >
                                    <RiAddCircleFill style={{ fontSize: '1rem' }} />
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-info d-flex align-items-center justify-content-center flex-fill"
                                    style={{ height: '40px', minWidth: '40px', padding: 0 }}
                                    onClick={handleExportToExcelManage}
                                    title="Download"
                                >
                                    <FaDownload style={{ fontSize: '0.95rem' }} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="card card-body">

                        {/* <div className="row border-bottom pb-2"> */}
                        {/* <div className="col-12 col-md-6 col-lg-3">

                            </div> */}

                        {/* <div className="col-12 col-md-6 col-lg-9"> */}
                        {/* <div className="d-flex flex-column flex-md-row justify-content-end align-items-stretch gap-2 ">
                                    <div
                                        id="btn-add-contact"
                                        className="btn btn-info d-flex align-items-center justify-content-center mt-3 mt-md-0  w-md-auto "
                                        style={{ height: '40px' }}
                                        onClick={() => { navigat(PATHS.ADD_ATTENDANCE) }}
                                    >
                                        <span className="me-1">
                                            <IoAddCircleOutline style={{ fontSize: '1.2rem' }} />
                                        </span>
                                        <span className="fw-semibold">Add Attendance</span>
                                    </div>
                                </div> */}
                        {/* </div> */}
                        {/* <div className="col-md-8 col-xl-9 text-end d-flex justify-content-md-end justify-content-center mt-3 mt-md-0 gap-3">
                            </div> */}
                        {/* </div> */}

                        <div className="table-responsive">
                            <DataTable
                                value={updatedAttendanceList?.length > 0 ? updatedAttendanceList : []}
                                paginator
                                rows={50}
                                globalFilter={globalFilterValue}
                                sortField={sortField}
                                sortOrder={sortOrder}
                                onSort={handleSort}
                                rowsPerPageOptions={
                                    updatedAttendanceList?.length > 50
                                        ? [20, 30, 50, updatedAttendanceList?.length]
                                        : [20, 30, 40]
                                }
                                currentPageReportTemplate='Showing {first} to {last} of {totalRecords} entries'
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                loading={loading}
                                // globalFilterFields={['name', 'annual_income']}
                                emptyMessage={<span style={{ textAlign: 'center', display: 'block' }}>Attendance Not Found.</span>}>

                                <Column field="id"
                                    header="Id"
                                    style={{ minWidth: '4rem' }}
                                    body={(rowData, options) => options?.rowIndex + 1}
                                    showFilterMenu={true}
                                // sortable
                                />

                                <Column field="name" header="Name" style={{ minWidth: '12rem', textTransform: 'capitalize' }} body={(rowData) => (
                                    <span className='me-2'>{truncateWords(rowData.name) || '-'} </span>
                                )} />

                                <Column field="date" header="Date" sortable style={{ minWidth: '10rem' }} body={(rowData) => (
                                    <span className='me-2'>{momentDateFormat(rowData?.date, DateFormat?.DATE_WEEK_MONTH_NAME_FORMAT) || '-'} </span>
                                )} />

                                {/* <Column field="day" header="Day" style={{ minWidth: '7rem' }} body={(rowData) => (
                                    <span className='text-center'>{rowData?.day || '-'} </span>
                                )} /> */}

                                <Column field="checkInTimes" header="First Check In" style={{ minWidth: '10rem' }} body={(rowData) => (
                                    <span className='me-2'>
                                        {rowData?.checkInTimes[0]?.length > 0 ? momentTimeFormate(rowData?.checkInTimes[0], TimeFormat.TIME_12_HOUR_FORMAT) || '-' : "-"} </span>
                                )} />

                                <Column field="checkInTimes" header="Last Check Out" style={{ minWidth: '10rem' }} body={(rowData) => (
                                    <span className='me-2'>{rowData?.checkInTimes?.length > 0 && rowData?.checkOutTimes?.length > 0 && rowData.checkOutTimes.length === rowData.checkInTimes.length
                                        ? dayjs(`${rowData.date} ${momentTimeFormate(rowData.checkOutTimes[rowData.checkOutTimes.length - 1], "HH:mm:ss")}`, "YYYY-MM-DD HH:mm:ss").format(TimeFormat.TIME_12_HOUR_FORMAT) : "-"} </span>
                                )} />

                                {/* <Column field="checkInTimes" header="Work Hours" style={{ minWidth: '10rem' }} body={(rowData) => (
                                    <span className=''>{checkOutTimes?.checkOutTimes?.length > 0  rowData?.checkInTimes[0]?.length > 0 ? getWorkingHours(rowData?.checkInTimes[0], rowData?.checkOutTimes[0], getBreakMinutes(rowData?.breaks?.length > 0 ? rowData?.breaks : [] || 0)) || '-' : "-"} </span>
                                )} /> */}

                                <Column field="checkInTimes"
                                    header="Working Hours"
                                    style={{ minWidth: "10rem" }}
                                    body={(rowData) => {
                                        const checkIns = rowData?.checkInTimes || [];
                                        const checkOuts = rowData?.checkOutTimes || [];
                                        const breaks = rowData?.breaks || [];

                                        const isToday = new Date(rowData?.date).toDateString() === new Date().toDateString();
                                        // Condition: If today and no checkout → show "-"
                                        if (!isToday && checkOuts.length === 0) {
                                            return <span>-</span>;
                                        }
                                        // Final calculation
                                        const workHours = getWorkingHours(rowData?.checkInTimes || [], rowData?.checkOutTimes || [], 0) || "-";
                                        return <span>{workHours}</span>;
                                    }}
                                />

                                {/* <Column field="checkInTimes" header="Total Break" style={{ minWidth: '10rem' }} body={(rowData) => (
                                    <span className=''>{rowData.checkInTimes?.length > 0 ? getBreakMinutes(rowData.checkInTimes) + 'm' : '-'} </span>
                                )} /> */}

                                {/* <Column field="type" sortable data-pc-section="root" header="Day Type" style={{ minWidth: '8rem' }} body={(rowData) => (
                                    <>
                                        <span
                                            className={`p-tag p-component badge p-1 text-light fw-semibold px-3 status_font rounded-4 py-2 ${getAttendanceStatusColor(rowData?.type) || "bg-secondary"}`}
                                            data-pc-name="tag"
                                            data-pc-section="root"
                                        >
                                            <span className="p-tag-value fs-2" data-pc-section="value">
                                                {getStatus(rowData?.type) || "-"}
                                            </span>
                                        </span>
                                    </>
                                )} /> */}

                                <Column field="status" sortable data-pc-section="root" header="Status" style={{ minWidth: '8rem' }} body={(rowData) => (
                                    <>
                                        <span
                                            className={`p-tag p-component badge  text-light fw-semibold px-2 rounded-4 py-1 status_font ${getAttendanceStatusColor(rowData?.status) || "bg-secondary"}`}
                                            data-pc-name="tag"
                                            data-pc-section="root"
                                        >
                                            <span className="p-tag-value fs-2" data-pc-section="value">
                                                {getStatus(rowData?.status) || "-"}
                                            </span>
                                        </span>
                                    </>
                                )} />

                                <Column field="status" header="Action" style={{ minWidth: '6rem' }} body={(rowData) => (
                                    <div className="action-btn">
                                        {/* {
                                            getLocalStorageItem(Constatnt?.ROLE_KEY) != '11' && <a className="text-custom-theam edit cursor_pointer cursor_pointer me-1" onClick={() => { openAttendanceModel(rowData) }} >
                                                <i class="ti ti-edit fs-7"></i>
                                            </a>
                                        } */}
                                        <Link onClick={() => {
                                            if (rowData?.checkInTimes?.length > 0) {
                                                openModelFunc(rowData);
                                            }
                                        }}
                                            state={rowData}
                                            className={`text-info edit ${rowData?.checkInTimes?.length > 0 ? "cursor_pointer text-custom-theam" : "disabled-status"}`}
                                        >
                                            <i className="ti ti-eye fs-7" />
                                        </Link>
                                    </div>
                                )} />

                            </DataTable>

                            <div className=''>
                                <Pagination per_page={50 || perPage} pageCount={attendanceList?.total_count} onPageChange={onPageChange} page={page} />
                            </div>

                        </div>
                    </div>

                </div>
            </div >

            <div className={`modal custom-modal  ${statusModal ? "fade show d-block " : "d-none"}`}
                id="addnotesmodal" tabIndex={-1} role="dialog" aria-labelledby="addnotesmodalTitle" aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-centered" role="document" >
                    <div className="modal-content border-0">
                        <div className="modal-header bg-primary" style={{ borderRadius: '10px 10px 0px 0px' }}>
                            <h6 className="modal-title fs-5">{'Attendance Details'} </h6>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" onClick={() => { closeModelFunc() }} />
                        </div>

                        <div className="modal-body">
                            <div className="container py-3">
                                <div className="row">
                                    {[
                                        // { label: "Employee Id", value: selectedEmployee?.employee_id },
                                        { label: "Date", value: momentDateFormat(selectedAttendance?.date, DateFormat?.DATE_FORMAT) || '-' },
                                        // { label: "Total Work Hours", value: getWorkingHours(selectedAttendance?.checkInTimes?.length > 0 ? selectedAttendance?.checkInTimes[0] : 0, selectedAttendance?.checkOutTimes?.length > 0 ? selectedAttendance?.checkOutTimes[0] : 0, getBreakMinutes(selectedAttendance?.breaks || '-')) || '-' },
                                        {
                                            label: "Total Work Hours",
                                            value: getWorkingHours(selectedAttendance?.checkInTimes || [], selectedAttendance?.checkOutTimes || [], 0) || "-"
                                        },
                                        {
                                            label: "First Check In",
                                            value: selectedAttendance?.checkInTimes?.length > 0 ? dayjs(`${selectedAttendance.date} ${momentTimeFormate(selectedAttendance.checkInTimes[0], "HH:mm:ss")}`, "YYYY-MM-DD HH:mm:ss").format(TimeFormat.TIME_12_HOUR_FORMAT) : "-"
                                        },
                                        {
                                            label: "Last Check Out",
                                            value:
                                                selectedAttendance?.checkInTimes?.length > 0 && selectedAttendance?.checkOutTimes?.length > 0 && selectedAttendance.checkOutTimes.length === selectedAttendance.checkInTimes.length
                                                    ? dayjs(`${selectedAttendance.date} ${momentTimeFormate(selectedAttendance.checkOutTimes[selectedAttendance.checkOutTimes.length - 1], "HH:mm:ss")}`, "YYYY-MM-DD HH:mm:ss").format(TimeFormat.TIME_12_HOUR_FORMAT) : "-"
                                        },
                                        { label: `Check In - Check Out Timeline`, value: "-" },

                                        // { label: "Total Break", value: selectedAttendance?.checkInTimes?.length > 0 ? getCheckInOutMinutes(selectedAttendance?.checkInTimes, selectedAttendance?.checkOutTimes) : "-" },

                                    ].map((item, index) => (<>
                                        <div className={`${item.label == "Check In - Check Out Timeline" ? 'col-12' : 'col-12 col-sm-6 attendance_card'}`}>
                                            <div key={index} className="card border-1 them-light shadow-sm mt-2 ">
                                                <div className="card-body text-center m-1 p-1">
                                                    <p className="fw-semibold fs-4 text-custom-theam ">{item.label}</p>
                                                    {
                                                        item.label == "Check In - Check Out Timeline" ? (<>

                                                            <div
                                                                className="timeline position-relative ms-4 overflow-y-auto"
                                                                style={{ maxHeight: "250px" }}   // adjust height as needed
                                                            >
                                                                <div
                                                                    className="border-custom-theam border-2 position-absolute top-0 bottom-0 start-0"
                                                                    style={{ marginLeft: "7px" }}
                                                                ></div>

                                                                {selectedAttendance?.checkInTimes?.length > 0 &&
                                                                    selectedAttendance?.checkInTimes.map((checkIn, index) => {
                                                                        const checkOut = selectedAttendance?.checkOutTimes?.[index];

                                                                        return (
                                                                            <div key={index}>
                                                                                <div className="mt-2 d-flex align-items-start">
                                                                                    <i className="bi bi-circle-fill text-success fs-5 me-3"></i>
                                                                                    <div>
                                                                                        <span className="badge bg-light text-dark fs-4 fw-medium">
                                                                                            {momentTimeFormate(checkIn, TimeFormat.DATE_TIME_12_HOUR_FORMAT)}
                                                                                            {" - "}
                                                                                            {checkOut
                                                                                                ? momentTimeFormate(
                                                                                                    checkOut,
                                                                                                    TimeFormat.DATE_TIME_12_HOUR_FORMAT
                                                                                                )
                                                                                                : "Ongoing"}
                                                                                        </span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })}
                                                            </div>

                                                        </>) : (<>
                                                            <h5 className="fw-medium text-dark mb-0 fs-5">
                                                                {item?.value || '0'}
                                                            </h5>
                                                        </>)
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </>))}

                                    {/* <div className='col-12 col-sm-6 attendance_card'>
                                                        <div className="card border-1 them-light shadow-sm mt-2 ">
                                                            <div className="card-body text-center m-1 p-1">

                                                                <p className="fw-semibold fs-4 text-custom-theam ">Break Timeline</p>

                                                                <div className="timeline position-relative ms-4">

                                                                    <div className=" border-custom-theam border-2 position-absolute top-0 bottom-0 start-0" style={{ marginLeft: "7px" }} ></div>
                                                                    {selectedAttendance?.breaks?.length > 0 && selectedAttendance?.breaks?.map((b, index) => (
                                                                        <div key={index}>
                                                                            <div className="mt-2 d-flex align-items-start">
                                                                                <i className="bi bi-circle-fill text-success fs-5 me-3"></i>
                                                                                <div>
                                                                                    <span className="badge bg-light text-dark fs-4 fw-medium">
                                                                                        {momentTimeFormate(b.start, TimeFormat.DATE_TIME_12_HOUR_FORMAT)} - {momentTimeFormate(b.end, TimeFormat.DATE_TIME_12_HOUR_FORMAT)}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ))}

                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
            {
                statusModal && (
                    <div className="modal-backdrop fade show"></div>
                )
            }

            {/* for the EDIT Attendance Data  */}
            <div className={`modal custom-modal  ${attendanceEditModal ? "fade show d-block " : "d-none"}`}
                id="addnotesmodal" tabIndex={-1} role="dialog" aria-labelledby="addnotesmodalTitle" aria-hidden="true">
                <div className="modal-dialog modal-md modal-dialog-centered" role="document" >
                    <div className="modal-content border-0">
                        <div className="modal-header bg-primary" style={{ borderRadius: '10px 10px 0px 0px' }}>
                            <h3 className="modal-title fs-5">{attendanceEditModal ? 'Edit Attendance Details' : 'Add Attendance Details'} </h3>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" onClick={() => { closeAttendanceModel() }} />
                        </div>

                        <div className="modal-body">
                            <div className="row">
                                {
                                    selectedEmployee &&
                                    <div className="col-12 justify-content-center">
                                        <div className="mb-3">
                                            <div className="row">
                                                {[
                                                    // { label: "Employee Id", value: selectedEmployee?.employee_id },
                                                    // { label: "Name", value: selectedEmployee?.name },
                                                    // { label: "Gender", value: selectedEmployee?.gender == "M" ? "Male" : selectedEmployee?.gender == "F" ? "Female" : "Other" },
                                                    { label: "Work Hours", value: getWorkingHours(selectedAttendance?.checkInTimes || [], selectedAttendance?.checkOutTimes || [], 0) || 0 },
                                                    // { label: "Total Break", value: watch('breaks')?.length > 0 ? getBreakMinutes(watch('breaks')) + 'm' : '-' },
                                                ].map((item, index) => (
                                                    <div className={`${item.label == "Work Hours" ? "col-12" : "col-12 col-sm-6"} attendance_card`}>
                                                        <div key={index} className="card border-1 zoom-in them-light shadow-sm m-1 ">
                                                            <div className="card-body text-center m-1 p-1">
                                                                <p className="fw-semibold fs-4 text-custom-theam ">{item.label}</p>
                                                                <h5 className="fw-medium text-dark mb-0 fs-5">
                                                                    {item.value || '-'}
                                                                </h5>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                            <form onSubmit={handleSubmit(onSubmitData)}>
                                <div className='row col-12 col-md-12 '>
                                    <div className="mb-3">
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
                                                    const selectedObj = customerList?.length > 0 && customerList?.find((c) => String(c.id) === String(selectedId));
                                                    console.log('selectedObjselectedObj', selectedObj);
                                                    setSelectedEmployee(selectedObj || null);
                                                    setValue(AstroInputTypesEnum?.EMPLOYEE_ID, selectedObj.id)
                                                }}
                                                disabled
                                            >
                                                <option value="">Select employee</option>
                                                {selectOptionCustomer(customerList || [])}
                                            </select>
                                        </div>
                                        <label className="errorc ps-1 pt-1">
                                            {errors[AstroInputTypesEnum.EMPLOYEE]?.message}
                                        </label>
                                    </div>

                                    <div className="mb-3">
                                        <div className="col-12 ">
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
                                                        picker="date"
                                                        className="form-control custom-datepicker w-100"
                                                        format={DateFormat?.DATE_FORMAT} // ✅ change format as needed
                                                        value={field.value ? dayjs(field.value, DateFormat?.DATE_FORMAT) : null}
                                                        // onChange={(date) => field.onChange(date ? date.toISOString() : null)}                                                        allowClear={false}
                                                        onChange={(date) => field.onChange(date ? dayjs(date).format(DateFormat?.DATE_FORMAT) : null)}
                                                    />
                                                )}
                                            />

                                            {/* ✅ Error Message */}
                                            {errors.dob1 && (
                                                <small className="text-danger">{errors.dob1.message}</small>
                                            )}
                                        </div>
                                    </div>


                                    <div className="mb-3">
                                        <div className='row'>
                                            <div className="col-12 col-md-6">
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
                                            <div className="col-12 col-md-6">
                                                <label htmlFor="checkOut" className="form-label fw-semibold">
                                                    Check Out Time <span className="text-danger ms-1">*</span>
                                                </label>
                                                <Controller
                                                    name="checkOut"
                                                    control={control}
                                                    rules={{ required: "Check Out time is required" }}
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


                                </div>

                                <div className="modal-footer justify-content-center mb-3">

                                    <button type='button' className="btn btn-danger m-2" onClick={() => { closeAttendanceModel(); }}>Cancel</button>
                                    <button type='submit' className="btn btn-primary" >Submit</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div >
            {
                attendanceEditModal && (
                    <div className="modal-backdrop fade show"></div>
                )
            }
            {
                customModel.isOpen && customModel?.modalType === ModelName.DELETE_MODEL && (
                    <Model>
                        <DeleteComponent onConfirm={handleDelete} />
                    </Model >
                )
            }

            {/* for the add Attendance Data  */}
            <div className={`modal custom-modal  ${attendanceAddModal ? "fade show d-block " : "d-none"}`}
                id="addnotesmodal" tabIndex={-1} role="dialog" aria-labelledby="addnotesmodalTitle" aria-hidden="true">
                <div className="modal-dialog modal-md modal-dialog-centered" role="document" >
                    <div className="modal-content border-0">
                        <div className="modal-header bg-primary" style={{ borderRadius: '10px 10px 0px 0px' }}>
                            <h3 className="modal-title fs-5">{attendanceAddModal ? 'Add Attendance Details' : 'Add Attendance Details'} </h3>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" onClick={() => { closeAddAttendanceModel() }} />
                        </div>

                        <div className="modal-body">
                            <div className="row">
                                {
                                    selectedEmployee &&
                                    <div className="col-12 justify-content-center">
                                        <div className="mb-3">
                                            <div className="row">
                                                {[
                                                    // { label: "Employee Id", value: selectedEmployee?.employee_id },
                                                    // { label: "Name", value: selectedEmployee?.name },
                                                    // { label: "Gender", value: selectedEmployee?.gender == "M" ? "Male" : selectedEmployee?.gender == "F" ? "Female" : "Other" },
                                                    {
                                                        label: "Working Hours",
                                                        value: getWorkingHours([dayjs(watch('checkIn')).format("HH:mm:ss")] || [], [dayjs(watch('checkOut')).format("HH:mm:ss")] || [], 0) || 0
                                                    }
                                                    // { label: "Total Break", value: watch('breaks')?.length > 0 ? getBreakMinutes(watch('breaks')) + 'm' : '-' },
                                                ].map((item, index) => (
                                                    <div className={`col-12 attendance_card`}>
                                                        <div key={index} className="card border-1 zoom-in them-light shadow-sm m-1 ">
                                                            <div className="card-body text-center m-1 p-1">
                                                                <p className="fw-semibold fs-4 text-custom-theam ">{item.label}</p>
                                                                <h5 className="fw-medium text-dark mb-0 fs-5">
                                                                    {item.value || '-'}
                                                                </h5>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}

                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>

                            <form onSubmit={handleSubmit(onSubmitData)}>
                                <div className='row col-12 col-md-12 '>

                                    <div className="mb-3">
                                        <label htmlFor="gender1" className="form-label fw-semibold">
                                            Select Employee<span className="text-danger ms-1">*</span>
                                        </label>
                                        <div className="input-group border rounded-1">
                                            <select
                                                id="gender1"
                                                className="form-control ps-2 p-2"
                                                autoComplete="nope"
                                                {...register(AstroInputTypesEnum.EMPLOYEE, { required: "Select employee" })}
                                                onChange={(e) => {
                                                    const selectedId = e.target.value;
                                                    const selectedObj = customerList?.find((c) => String(c.id) == String(selectedId));
                                                    setSelectedEmployee(selectedObj || null);
                                                    setValue(AstroInputTypesEnum?.EMPLOYEE_ID, selectedObj.id)
                                                    setValue(AstroInputTypesEnum?.EMPLOYEE, selectedObj.id)
                                                }}
                                            >
                                                <option value="">Select employee</option>
                                                {selectOptionCustomer(customerList || [])}
                                            </select>
                                        </div>
                                        <label className="errorc ps-1 pt-1">
                                            {errors[AstroInputTypesEnum.EMPLOYEE]?.message}
                                        </label>
                                    </div>
                                    <div className="mb-3">
                                        <div className="col-12 ">
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
                                                        picker="date"
                                                        className="form-control custom-datepicker w-100"
                                                        format={DateFormat?.DATE_FORMAT} // ✅ change format as needed
                                                        value={field.value ? dayjs(field.value, DateFormat?.DATE_FORMAT) : null}
                                                        // onChange={(date) => field.onChange(date ? date.toISOString() : null)}                                                        allowClear={false}
                                                        onChange={(date) => field.onChange(date ? dayjs(date).format(DateFormat?.DATE_FORMAT) : null)}
                                                    />
                                                )}
                                            />

                                            {/* ✅ Error Message */}
                                            {errors.dob1 && (
                                                <small className="text-danger">{errors.dob1.message}</small>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <div className='row'>
                                            <div className="col-12 col-md-6">
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
                                            <div className="col-12 col-md-6">
                                                <label htmlFor="checkOut" className="form-label fw-semibold">
                                                    Check Out Time <span className="text-danger ms-1">*</span>
                                                </label>
                                                <Controller
                                                    name="checkOut"
                                                    control={control}
                                                    rules={{ required: "Check Out time is required" }}
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
                                </div>

                                <div className="modal-footer justify-content-center mb-3">
                                    <button type='button' className="btn btn-danger m-2" onClick={() => { closeAddAttendanceModel(); }}>Cancel</button>
                                    <button type='submit' className="btn btn-primary" >Submit</button>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div >
            {
                attendanceAddModal && (
                    <div className="modal-backdrop fade show"></div>
                )
            }

            {
                customModel.isOpen && customModel?.modalType === ModelName.DELETE_MODEL && (
                    <Model>
                        <DeleteComponent onConfirm={handleDelete} />
                    </Model >
                )
            }
        </>
    )

}


