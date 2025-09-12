import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../layout/Header';
import Slidebar from '../../layout/Slidebar';
import $, { data } from 'jquery';
import 'datatables.net-bs5';
import 'datatables.net-responsive-bs5';
import SubNavbar from '../../layout/SubNavbar';
import { updateLoanDetails, loanDetails, addDisbursementLoan, addLeaves, editAttendance } from '../../utils/api.services';
import { ExportToCSV, ExportToExcel, ExportToPdf, SWIT_DELETE, SWIT_DELETE_SUCCESS, SWIT_FAILED, TOAST_ERROR, TOAST_SUCCESS } from '../../config/common';
import profile_image from '../../assets/Images/default.jpg'
import ReactDatatable from '../../config/ReactDatatable';
import { Helmet } from 'react-helmet';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { getCustomerListThunk, getAllLoanListThunk, setLoader, updateLoanList, getProcessingFeeListThunk, getSalaryListThunk, getlistLeavesThunk, updateLeaveList, getlistAttendanceThunk, updateAttendanceList } from '../../Store/slices/MasterSlice';
import Constatnt, { AwsFolder, Codes, ModelName, SEARCH_DELAY } from '../../config/constant';
import useDebounce from '../hooks/useDebounce';
import { closeModel, convertToUTC, formatDate, formatDateDyjs, formatIndianPrice, getBreakMinutes, getFileNameFromUrl, getLoanStatusObject, getWorkingHours, momentDateFormat, momentTimeFormate, openModel, selectOption, selectOptionCustomer, textInputValidation, truncateWords } from '../../config/commonFunction';
import Model from '../../component/Model';
import { DeleteComponent } from '../CommonPages/CommonComponent';
import Pagination from '../../component/Pagination';
import { AstroInputTypesEnum, AttendanceStatus, DateFormat, EMPLOYEE_STATUS, getAttendanceStatusColor, getStatus, InputRegex, LEAVE_TYPE_LIST, PAYMENT_STATUS, STATUS_COLORS, TimeFormat } from '../../config/commonVariable';
import { RiUserReceivedLine } from 'react-icons/ri';
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
    const [employeeStatus, setEmployeeStatus] = useState(EMPLOYEE_STATUS[0]);

    useEffect(() => {
        const request = {
            emp_leave_company: employeeStatus?.key,
        };
        if (customerList?.length === 0) {
            dispatch(getCustomerListThunk({ request }));
        }
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
            updatedData(attendanceList, startDate, endDate)
            // const start = new Date(startDate);
            // start.setHours(0, 0, 0, 0); // normalize start date
            // const end = new Date(endDate);
            // end.setHours(23, 59, 59, 999); // include full day for end date
            // const modified = attendanceList.flatMap((item) =>
            //     item?.dates
            //         ?.filter((dates) => {
            //             const currentDate = new Date(dates?.date);
            //             return currentDate >= start && currentDate <= end;
            //         }).map((dates) => ({
            //             emp_id: item?.emp_id,
            //             name: item?.name,
            //             date: dates?.date,
            //             type: dates?.type,
            //             status: dates?.status,
            //             checkInTimes: dates?.checkInTimes,
            //             checkOutTimes: dates?.checkOutTimes,
            //             breaks: dates?.breaks,
            //         }))
            // );
            // const sorted = modified.sort(
            //     (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            // );
            // setUpdateAttendanceList(sorted);
        } else {
            setUpdateAttendanceList([])
        }
    }, [attendanceList, startDate, endDate, employeeStatus]);

    useEffect(() => {
        let request = {
            start_date: startDate ? formatDateDyjs(startDate, DateFormat.DATE_LOCAL_DASH_TIME_FORMAT) : null,
            end_date: endDate ? formatDateDyjs(endDate, DateFormat.DATE_LOCAL_DASH_TIME_FORMAT) : null,
            status: selectedOption?.key || "",
            emp_leave_company: employeeStatus?.key,
        };
        dispatch(getlistAttendanceThunk(request));
    }, []);

    const handleStatus = async (id, changeChecked) => {
        setis_load(true)
        let submitData = {
            astrologer_id: id,
            is_active: changeChecked,
        }
        // EditAstrologer(submitData).then((response) => {
        //     if (response.code === Codes.SUCCESS) {
        //         TOAST_SUCCESS(response?.message)
        // let updatedList = loanList?.astrologerList?.map((item) => {
        //     if (id === item._id) {
        //         return {
        //             ...item,
        //             is_active: item?.is_active == 1 ? 0 : 1
        //         };
        //     }
        //     return item;
        // });
        // dispatch(updateLoanList({
        //     ...loanList,
        //     astrologerList: updatedList
        // }))
        //         setis_load(false)
        //     } else {
        //         TOAST_ERROR(response.message)
        //     }
        // })
    }

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

    // ----------------------------------Export Data----------------------------------

    const handleExportApiCall = async () => {
        // dispatch(setLoader(true));
        // let submitData = {
        //     search: globalFilterValue
        // }
        // const { code, data } = await exportCustomerList(submitData);
        // return { code, data }
    }

    // const getInterestRateByCibil = (cibilScore, intrestDropdown = []) => {

    //     console.log('getInterestRateByCibil cibilScorecibilScore', cibilScore);
    //     console.log('getInterestRateByCibil intrestDropdown', intrestDropdown);

    //     if (!Array.isArray(intrestDropdown) || intrestDropdown.length === 0 || cibilScore === undefined) {
    //         return '';
    //     }
    //     const matchedRate = intrestDropdown.find(
    //         (item) => cibilScore >= item.min_score && cibilScore <= item.max_score
    //     );

    //     return matchedRate ? matchedRate.rate_percentage : '';
    // };

    const getInterestRateByCibil = (cibilScore, intrestDropdown = []) => {
        const validCibilScore = cibilScore != null && cibilScore !== '' && cibilScore > 0 ? cibilScore : 300;

        if (!Array.isArray(intrestDropdown) || intrestDropdown.length === 0) {
            return '';
        }

        const matchedRate = intrestDropdown.find(
            (item) => validCibilScore >= item.min_score && validCibilScore <= item.max_score
        );

        return matchedRate ? matchedRate.rate_percentage : '';
    };

    // const getProcessingFeeRateByCibil = (cibilScore, processingDropdown = []) => {

    //     console.log('processingDropdown cibilScorecibilScore', cibilScore);
    //     console.log('processingDropdown intrestDropdown', intrestDropdown);
    //     if (!Array.isArray(processingDropdown) || processingDropdown.length === 0 || cibilScore === undefined) {
    //         return '';
    //     }
    //     const matchedRate = processingDropdown.find(
    //         (item) => cibilScore >= item.min_score && cibilScore <= item.max_score
    //     );

    //     return matchedRate ? matchedRate.min_fee_percent : '';
    // };

    const getProcessingFeeRateByCibil = (cibilScore, processingDropdown = []) => {
        // Fallback to 300 if cibilScore is invalid
        const validCibilScore = cibilScore != null && cibilScore !== '' && cibilScore > 0 ? cibilScore : 0;

        console.log('validCibilScorevalidCibilScore', validCibilScore);

        if (!Array.isArray(processingDropdown) || processingDropdown.length === 0) {
            return '';
        }

        const matchedRate = processingDropdown.find(
            (item) => validCibilScore >= item.min_score && validCibilScore <= item.max_score
        );

        return matchedRate ? matchedRate.min_fee_percent : '';
    };

    const onPageChange = (Data) => {
        setPage(Data)
    }

    const onSubmitData = async (data) => {
        dispatch(setLoader(true))

        let sendRequest = {
            employee_id: selectedEmployee?.id,
            date: formatDateDyjs(data?.dob1, DateFormat?.DATE_DASH_TIME_FORMAT),
            check_in_time: data?.checkIn ? dayjs(data.checkIn).format("HH:mm") : null,
            check_out_time: data?.checkOut ? dayjs(data.checkOut).format("HH:mm") : null,
            // breaks: data?.breaks.length > 0 ? data?.breaks : [],
            breaks: Array.isArray(data?.breaks) && data.breaks.length > 0
                ? data.breaks.map(b => ({
                    start: b?.start
                        ? dayjs(b.start, TimeFormat?.TIME_WITH_SECONDS_12_HOUR_FORMAT).format("HH:mm")
                        : null,
                    end: b?.end
                        ? dayjs(b.end, TimeFormat?.TIME_WITH_SECONDS_12_HOUR_FORMAT).format("HH:mm")
                        : null
                }))
                : [],
            lat: "0.000",
            log: "0.000",
            location_id: "TRACEWAVE",
        };

        editAttendance(sendRequest).then((response) => {
            if (response?.code == Codes.SUCCESS) {
                dispatch(setLoader(false))
                TOAST_SUCCESS(response?.message);

                let updatedList = cloneDeep(updatedAttendanceList); // shallow copy (optional, if immutability needed)
                let target = updatedList.find(item => item.emp_id == selectedEmployee?.id);
                if (target) {
                    target.checkInTimes = data?.checkIn ? [convertToUTC(sendRequest?.date, sendRequest?.check_in_time, TimeFormat?.TIME_WITH_SECONDS_24_HOUR_FORMAT)] : [];
                    target.checkOutTimes = data?.checkOut ? [convertToUTC(sendRequest?.date, sendRequest?.check_out_time, TimeFormat?.TIME_WITH_SECONDS_24_HOUR_FORMAT)] : [];
                    target.breaks = Array.isArray(data?.breaks) && data?.breaks?.length > 0 ? data?.breaks?.map(b => ({
                        // start: b?.start ? convertToUTC(sendRequest?.date, b.start, TimeFormat?.TIME_WITH_SECONDS_24_HOUR_FORMAT) : null,
                        // end: b?.end ? convertToUTC(sendRequest?.date, b.end, TimeFormat?.TIME_WITH_SECONDS_24_HOUR_FORMAT) : null
                        start: b?.start ? convertToUTC(sendRequest?.date, dayjs(b.start, TimeFormat?.TIME_WITH_SECONDS_24_HOUR_FORMAT).format(TimeFormat?.TIME_WITH_SECONDS_24_HOUR_FORMAT), TimeFormat?.TIME_WITH_SECONDS_24_HOUR_FORMAT) : null,
                        end: b?.end ? convertToUTC(sendRequest?.date, dayjs(b.end, TimeFormat?.TIME_WITH_SECONDS_24_HOUR_FORMAT).format(TimeFormat?.TIME_WITH_SECONDS_24_HOUR_FORMAT), TimeFormat?.TIME_WITH_SECONDS_24_HOUR_FORMAT) : null
                    })) : [];
                }
                console.log("updatedList", updatedList);
                setUpdateAttendanceList(updatedList);

                closeAttendanceModel()
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

        console.log('attendanceData', attendanceData);

        // const formattedBreaks = attendanceData?.breaks?.map(b => ({
        //     start: b.start ? dayjs(`${b.start}`, 'HH:mm:ss') : null,
        //     end: b.end ? dayjs(`${b.end}`, 'HH:mm:ss') : null
        // }));

        const formattedBreaks = attendanceData?.breaks?.map(b => ({
            start: b.start ? dayjs(momentTimeFormate(b.start, 'HH:mm:ss'), 'HH:mm:ss').format(TimeFormat?.TIME_WITH_SECONDS_12_HOUR_FORMAT) : null,
            end: b.end ? dayjs(momentTimeFormate(b.end, 'HH:mm:ss'), 'HH:mm:ss').format(TimeFormat?.TIME_WITH_SECONDS_12_HOUR_FORMAT) : null
        }));

        setValue('breaks', formattedBreaks);
        const selectedObj = customerList?.find((c) => String(c.id) === String(attendanceData?.emp_id));
        setSelectedEmployee(selectedObj || null);
        setValue(AstroInputTypesEnum?.EMPLOYEE, selectedObj.id)

        setValue('dob1', attendanceData?.date ? dayjs(attendanceData?.date).format('DD-MM-YYYY') : null);

        // setValue('checkIn', attendanceData?.checkInTimes?.[0] ? dayjs(attendanceData.date + momentTimeFormate(attendanceData?.checkInTimes[0], 'HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss') : null);
        // setValue('checkOut', attendanceData?.checkOutTimes?.[0] ? dayjs(attendanceData.date + momentTimeFormate(attendanceData?.checkOutTimes[0], 'HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss') : null);
        // setValue(
        //     'checkIn',
        //     attendanceData?.checkInTimes?.[0]
        //         ? dayjs(
        //             momentTimeFormate(`${attendanceData.date} ${attendanceData.checkInTimes[0]}`, 'YYYY-MM-DD HH:mm:ss'),
        //             'YYYY-MM-DD HH:mm:ss'
        //         )
        //         : null
        // );

        // setValue(
        //     'checkOut',
        //     attendanceData?.checkOutTimes?.[0]
        //         ? dayjs(
        //             momentTimeFormate(`${attendanceData?.date} ${attendanceData?.checkOutTimes[0]}`, 'YYYY-MM-DD HH:mm:ss'),
        //             'YYYY-MM-DD HH:mm:ss'
        //         )
        //         : null
        // );

        setValue('checkIn', attendanceData?.checkInTimes?.[0] ? dayjs(`${attendanceData.date} ${momentTimeFormate(attendanceData.checkInTimes[0], 'HH:mm:ss')}`, 'YYYY-MM-DD HH:mm:ss') : null);
        setValue('checkOut', attendanceData?.checkOutTimes?.[0] ? dayjs(`${attendanceData.date} ${momentTimeFormate(attendanceData.checkOutTimes[0], 'HH:mm:ss')}`, 'YYYY-MM-DD HH:mm:ss') : null);

        // setValue('checkIn', attendanceData?.checkInTimes?.[0] ? dayjs(`${attendanceData.date} ${attendanceData.checkInTimes[0]}`, 'YYYY-MM-DD HH:mm:ss') : null);
        // setValue('checkOut', attendanceData?.checkOutTimes?.[0] ? dayjs(`${attendanceData.date} ${attendanceData.checkOutTimes[0]}`, 'YYYY-MM-DD HH:mm:ss') : null);
    }

    const closeAttendanceModel = () => {
        setAttendanceEditModel(false)
        setSelectedAttendance({})
        reset()
    }

    const funcStatusChange = (rowData) => {
        openModelFunc()
        // setIs_loading(true)
        // loanDetails({ loan_id: rowData?.id }).then((response) => {
        //     if (response?.status_code === Codes.SUCCESS) {
        //         let responseDetails = response?.data?.loan_application;
        //         if (!responseDetails?.aadhaar_verified) {
        //             SWIT_FAILED("Aadhaar card verification is pending.");
        //         } else if (responseDetails?.status === "DISBURSED") {
        //             return
        //         } else if (responseDetails?.status === "DISBURSEMENT_APPROVAL_PENDING") {
        //             const bankDetails = responseDetails?.bank_accounts[0]
        //             const approvalDetails = responseDetails?.approval_details[0]
        //             const disbursementDetails = responseDetails?.loan_disbursement[0]
        //             setSelecteLoan(responseDetails)
        //             // if (responseDetails?.status === "DISBURSED") {

        //             //     if (disbursementDetails?.payment_type === "BANK_TRANSFER") {
        //             //         setValue('bank_name', disbursementDetails?.bank_name)
        //             //         setValue('account_number', disbursementDetails?.account_number)
        //             //         setValue('ifsc_code', disbursementDetails?.ifsc_code)
        //             //         setValue('account_holder_name', disbursementDetails?.account_holder_name)
        //             //     }
        //             //     else if (disbursementDetails?.payment_type === "UPI") {
        //             //         setValue('upi_id', disbursementDetails?.upi_id)
        //             //         setValue('transaction_id', disbursementDetails?.transaction_id)
        //             //     }
        //             //     else if (disbursementDetails?.payment_type === "CHEQUE") {
        //             //         setValue('cheque_number', disbursementDetails?.cheque_number)
        //             //     }
        //             //     setValue('approved_amount', Number(disbursementDetails?.transferred_amount || 0).toFixed(2))
        //             //     setValue('payment_status', PAYMENT_STATUS.find(item => item.key === disbursementDetails?.payment_type)?.key)
        //             //     setProofFileName(getFileNameFromUrl(disbursementDetails?.payment_file))
        //             //     setShowProofImage(disbursementDetails?.payment_file)
        //             //     setPaymentDate(dayjs(disbursementDetails?.payment_date))
        //             //     //  setPaymentDate(dayjs(disbursementDetails?.payment_date).format("YYYY-MM-DD HH:mm:ss"));
        //             // } else {
        //             setValue('payment_status', PAYMENT_STATUS.find(item => item.key === "BANK_TRANSFER")?.key)
        //             setValue('approved_amount', Number(approvalDetails?.disbursed_amount || 0).toFixed(2))
        //             setValue('bank_name', bankDetails?.bank_name)
        //             setValue('account_number', bankDetails?.account_number)
        //             setValue('ifsc_code', bankDetails?.ifsc_code)
        //             setValue('account_holder_name', bankDetails?.account_holder_name)
        //             // }
        //             setIs_loading(false)
        //             setStatusModal(true)
        //         }
        //     } else {
        //         setIs_loading(false)
        //     }
        // })
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

    const handleInputChange = async (key, value) => {
        let filteredValue = value;
        if (key === 'approved_amount') {
            filteredValue = value.replace(InputRegex.ONCHANGE_MOBILE_REGEX, '');
        }
        setValue(key, filteredValue)
        clearErrors(key);               // Clear error message (if any)
        await trigger(key);
    };

    const allowLettersAndSpaces = (event) => {
        let value = event.target.value;
        // Remove any characters that are not letters or spaces
        value = value.replace(/[^A-Za-z\s]/g, '');
        // Convert to uppercase
        value = value.toUpperCase();
        // Update the input value
        event.target.value = value;
    };

    const handleProofImageChange = (e) => {
        const image = e.target.files[0]
        setShowProofImage(image)
        setProofFileName(image?.name)
        clearErrors('proof_image');
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
        } finally {
        }
    };

    console.log('updatedAttendanceListupdatedAttendanceList', updatedAttendanceList);


    return (
        <>
            {<Spinner isActive={is_loding} message={'Please Wait'} />}
            <div className="container-fluid mw-100">

                <SubNavbar title={"Attendance List"} header={'Attendance List'} />

                <div className="widget-content searchable-container list">

                    {/* --------------------- start Contact ---------------- */}

                    <div className="card card-body mb-2 p-3">
                        <div className="row g-2">

                            <div className="col-12 col-md-6 col-lg-3">
                                <div className="position-relative mt-4 w-75">
                                    <input
                                        type="text"
                                        className="form-control ps-5 "
                                        id="input-search"
                                        placeholder="Search Attendance ..."
                                        value={globalFilterValue}
                                        onChange={onGlobalFilterChange}
                                    />
                                    <i className="ti ti-search position-absolute top-50 start-0 translate-middle-y fs-6 text-dark ms-3" />
                                </div>
                            </div>

                            {/* Start Date */}
                            <div className="col-12 col-md-6 col-lg-2">
                                <label className="d-block mb-1 fw-semibold">Start Date</label>
                                <DatePicker
                                    className="custom-datepicker w-100 p-2"
                                    format={DateFormat?.DATE_FORMAT}
                                    value={startDate}
                                    onChange={(date) => {
                                        setStartDate(date);
                                        setEndDate(null);
                                    }}
                                />
                            </div>

                            {/* End Date */}
                            <div className="col-12 col-md-6 col-lg-2">
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
                                            status: ""
                                        })
                                    }}
                                    disabled={!startDate}
                                    disabledDate={disabledEndDate}
                                />
                            </div>

                            <div className="col-12 col-md-6 col-lg-2 d-flex flex-column">
                                <label className="form-label fw-semibold mb-1">Employees Filter</label>
                                <div className="dropdown w-100">
                                    <button
                                        className="btn btn-sm btn-info fw-semibold dropdown-toggle w-100"
                                        type="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                        style={{ height: '40px' }}
                                    >
                                        {selectedOption?.name || 'Select Employee'}
                                    </button>
                                    <ul
                                        className="dropdown-menu w-100"
                                        style={{
                                            maxHeight: "300px", // adjust height as needed
                                            overflowY: "auto",
                                        }}
                                    >
                                        <li key="all">
                                            <button
                                                className="dropdown-item text-black-50 p-2 fs-4"
                                                type="button"
                                                onClick={() => {
                                                    onChangeApiCalling({
                                                        start_date: startDate,
                                                        end_date: endDate,
                                                        employee_id: "" // empty for all employees
                                                    });
                                                    handleSelect({ id: "", name: "All Employees" });
                                                }}
                                            >
                                                All Employees
                                            </button>
                                        </li>
                                        {customerList?.map((option) => (
                                            <li key={option.id}>
                                                <button
                                                    className="dropdown-item text-black-50 p-2"
                                                    type="button"
                                                    onClick={() => {
                                                        onChangeApiCalling({
                                                            start_date: startDate,
                                                            end_date: endDate,
                                                            employee_id: option?.id
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

                            <div className="col-12 col-md-6 col-lg-2 mb-2 mb-md-0">
                                <label className="form-label fw-semibold mb-1">Status</label>

                                <div className="btn-group w-100">
                                    <button
                                        type="button"
                                        className="btn btn-info dropdown-toggle w-100"
                                        data-bs-toggle="dropdown"
                                        aria-haspopup="true"
                                        aria-expanded="false"
                                        style={{ height: '40px' }}
                                    >
                                        {employeeStatus?.value || 'Select Status'}
                                    </button>
                                    <ul className="dropdown-menu w-100 border">
                                        {EMPLOYEE_STATUS?.map((option) => (
                                            <li key={option.key}>
                                                <a
                                                    className="dropdown-item cursor_pointer text-black-50"
                                                    onClick={() => {
                                                        onChangeApiCalling({
                                                            start_date: startDate,
                                                            end_date: endDate,
                                                            employee_id: "",
                                                            emp_leave_company: option?.key
                                                        });
                                                        setEmployeeStatus(option)
                                                    }}
                                                >
                                                    {option?.value}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="col-12 col-md-6 col-lg-1 d-flex flex-column">
                                <label className="form-label fw-semibold mb-1">&nbsp;</label> {/* placeholder for alignment */}
                                <button
                                    type="button"
                                    className="btn btn-sm btn-info d-flex align-items-center justify-content-center w-100"
                                    style={{ height: '40px' }}
                                    onClick={() => navigat(PATHS.ADD_ATTENDANCE)}
                                >
                                    <IoAddCircleOutline className="me-1" style={{ fontSize: '1.2rem' }} />
                                    <span className="fw-semibold">Add</span>
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

                                <Column field="checkInTimes" header="Check In" style={{ minWidth: '10rem' }} body={(rowData) => (
                                    <span className='me-2'>
                                        {rowData?.checkInTimes[0]?.length > 0 ? momentTimeFormate(rowData?.checkInTimes[0], TimeFormat.TIME_12_HOUR_FORMAT) || '-' : "-"} </span>
                                )} />

                                <Column field="checkInTimes" header="Check Out" style={{ minWidth: '10rem' }} body={(rowData) => (
                                    <span className='me-2'>{rowData?.checkOutTimes[0]?.length > 0 ? momentTimeFormate(rowData?.checkOutTimes[0], TimeFormat.TIME_12_HOUR_FORMAT) || '-' : "-"} </span>
                                )} />

                                <Column field="checkInTimes" header="Work Hours" style={{ minWidth: '10rem' }} body={(rowData) => (
                                    <span className=''>{rowData?.checkInTimes[0]?.length > 0 ? getWorkingHours(rowData?.checkInTimes[0], rowData?.checkOutTimes[0], getBreakMinutes(rowData?.breaks?.length > 0 ? rowData?.breaks : [] || 0)) || '-' : "-"} </span>
                                )} />

                                <Column field="type" sortable data-pc-section="root" header="Day Type" style={{ minWidth: '8rem' }} body={(rowData) => (
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
                                )} />

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

                                        {/* <a className="text-info edit cursor_pointer cursor_pointer me-1" onClick={() => navigat(PATHS?.EDIT_ATTENDANCE, { state: rowData })} >
                                            <i class="ti ti-edit fs-7"></i>
                                        </a> */}

                                        <a className="text-info edit cursor_pointer cursor_pointer me-1" onClick={() => { openAttendanceModel(rowData) }} >
                                            <i class="ti ti-edit fs-7"></i>
                                        </a>

                                        <Link onClick={() => {
                                            if (rowData?.breaks?.length > 0) {
                                                openModelFunc(rowData);
                                            }
                                        }}
                                            state={rowData}
                                            className={`text-info edit ${rowData?.breaks?.length > 0 ? "cursor_pointer " : "disabled-status"}`}
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
            </div>

            <div className={`modal custom-modal  ${statusModal ? "fade show d-block " : "d-none"}`}
                id="addnotesmodal" tabIndex={-1} role="dialog" aria-labelledby="addnotesmodalTitle" aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-centered" role="document" >
                    <div className="modal-content border-0">
                        <div className="modal-header bg-primary" style={{ borderRadius: '10px 10px 0px 0px' }}>
                            <h6 className="modal-title text-dark ">{'Attendance Details'} </h6>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" onClick={() => { closeModelFunc() }} />
                        </div>

                        <div className="modal-body">
                            <div className="container py-3">
                                <div className="row">
                                    {
                                        selectedAttendance &&
                                        <div className="col-12 justify-content-center">
                                            <div className="mb-3">
                                                <div className="row">

                                                    {console.log('selectedAttendanceselectedAttendance', selectedAttendance)}
                                                    {[
                                                        // { label: "Employee Id", value: selectedEmployee?.employee_id },
                                                        // { label: "Name", value: selectedEmployee?.name },
                                                        // { label: "Gender", value: selectedEmployee?.gender == "M" ? "Male" : selectedEmployee?.gender == "F" ? "Female" : "Other" },
                                                        {
                                                            label: "Check In",
                                                            value: selectedAttendance?.checkInTimes?.[0]
                                                                ? dayjs(`${selectedAttendance?.date} ${momentTimeFormate(selectedAttendance?.checkInTimes[0], 'HH:mm:ss')}`, 'YYYY-MM-DD HH:mm:ss').format(TimeFormat?.TIME_12_HOUR_FORMAT)
                                                                : null
                                                        },
                                                        {
                                                            label: "Check Out",
                                                            value: selectedAttendance?.checkOutTimes?.[0]
                                                                ? dayjs(`${selectedAttendance?.date} ${momentTimeFormate(selectedAttendance?.checkOutTimes[0], 'HH:mm:ss')}`, 'YYYY-MM-DD HH:mm:ss').format(TimeFormat?.TIME_12_HOUR_FORMAT)
                                                                : null
                                                        },
                                                        { label: "Total Break", value: getBreakMinutes(selectedAttendance?.breaks) + 'm' },
                                                        { label: "Total Work Hours", value: getWorkingHours(selectedAttendance?.checkInTimes?.length > 0 ? selectedAttendance?.checkInTimes[0] : 0, selectedAttendance?.checkOutTimes?.length > 0 ? selectedAttendance?.checkOutTimes[0] : 0, getBreakMinutes(selectedAttendance?.breaks || 0)) || 0 },

                                                    ].map((item, index) => (
                                                        <div className='col-12 col-sm-6'>
                                                            <div key={index} className="card border-1  them-light shadow-sm mt-2 ">
                                                                <div className="card-body text-center m-1 p-1">
                                                                    <p className="fw-semibold fs-6 text-dark ">{item.label}</p>
                                                                    <h5 className="fw-semibold text-dark mb-0 fs-5">
                                                                        {item?.value || '0'}
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

                                <div className="text-center mb-4">
                                    <h3 className="fw-bold text-blue fs-6">Break Timeline</h3>
                                </div>

                                <div className="timeline position-relative ms-4">
                                    {/* Vertical Line */}
                                    <div
                                        className="border-start border-2 border-secondary position-absolute top-0 bottom-0 start-0"
                                        style={{ marginLeft: "7px" }}
                                    ></div>

                                    {selectedAttendance?.breaks?.length > 0 && selectedAttendance?.breaks?.map((b, index) => (
                                        <div key={index}>
                                            <div className="mb-4 d-flex align-items-start">
                                                <i className="bi bi-circle-fill text-success fs-5 me-3"></i>
                                                <div>
                                                    <span className="badge bg-light text-dark">
                                                        {momentTimeFormate(b.start, TimeFormat.DATE_TIME_12_HOUR_FORMAT)} - {momentTimeFormate(b.end, TimeFormat.DATE_TIME_12_HOUR_FORMAT)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
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

            <div className={`modal custom-modal  ${attendanceEditModal ? "fade show d-block " : "d-none"}`}
                id="addnotesmodal" tabIndex={-1} role="dialog" aria-labelledby="addnotesmodalTitle" aria-hidden="true">
                <div className="modal-dialog modal-md modal-dialog-centered" role="document" >
                    <div className="modal-content border-0">

                        <div className="modal-header bg-primary" style={{ borderRadius: '10px 10px 0px 0px' }}>
                            <h3 className="modal-title text-dark fs-5">{attendanceEditModal ? 'Edit Attendance Details' : 'Add Attendance Details'} </h3>
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
                                                    { label: "Work Hours", value: getWorkingHours(watch('checkIn') ? dayjs(watch('checkIn')).format("HH:mm:ss") : 0, dayjs(watch('checkOut') || dayjs()).format("HH:mm:ss"), getBreakMinutes(watch('breaks') || 0)) || 0 },
                                                    { label: "Total Break", value: getBreakMinutes(watch('breaks')) + 'm' },
                                                ].map((item, index) => (
                                                    <div className='col-12 col-sm-6'>
                                                        <div key={index} className="card border-1 zoom-in them-light shadow-sm m-1 ">
                                                            <div className="card-body text-center m-1 p-1">
                                                                <p className="fw-semibold fs-6 text-dark ">{item.label}</p>
                                                                <h5 className="fw-semibold text-dark mb-0 fs-5">
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
                                                    const selectedObj = customerList.find((c) => String(c.id) === String(selectedId));
                                                    console.log('selectedObjselectedObj', selectedObj);
                                                    setSelectedEmployee(selectedObj || null);
                                                    setValue(AstroInputTypesEnum?.EMPLOYEE_ID, selectedObj.id)
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

                                    <div className="mb-3">
                                        {fields.map((field, index) => (
                                            <div className="row g-3 mb-3" key={field.id}>

                                                <div className={`col-12  ${fields.length > 1 ? 'col-md-5' : 'col-md-6'}`}>
                                                    <label
                                                        htmlFor={`breaks[${index}].start`}
                                                        className="form-label fw-semibold"
                                                    >
                                                        Break In Time <span className="text-danger">*</span>
                                                    </label>

                                                    <Controller
                                                        name={`breaks.${index}.start`}
                                                        control={control}
                                                        rules={{ required: "Break In is required" }}
                                                        render={({ field, fieldState: { error } }) => (
                                                            <>
                                                                <DatePicker
                                                                    id={`breakIn-${index}`}
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
                                                                    <small className="text-danger">{error.message}</small>
                                                                )}
                                                            </>
                                                        )}
                                                    />
                                                </div>

                                                <div className="col-12 col-md-6">
                                                    <label
                                                        htmlFor={`breaks[${index}].end`}
                                                        className="form-label fw-semibold"
                                                    >
                                                        Break Out Time <span className="text-danger">*</span>
                                                    </label>

                                                    <Controller
                                                        name={`breaks.${index}.end`}
                                                        control={control}
                                                        rules={{ required: "Break Out is required" }}
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
                                                                    <small className="text-danger">{error.message}</small>
                                                                )}
                                                            </>
                                                        )}
                                                    />
                                                </div>

                                                {fields.length > 1 && (
                                                    <div className="col-12 col-md-1 d-flex align-items-end">
                                                        <button
                                                            type="button"
                                                            className="btn text-white bg-danger btn-sm mb-1"
                                                            style={{ border: "1px solid transparent" }}
                                                            onMouseEnter={(e) =>
                                                                (e.currentTarget.style.border = "1px solid #fa896b")
                                                            }
                                                            onMouseLeave={(e) =>
                                                                (e.currentTarget.style.border = "1px solid transparent")
                                                            }
                                                            onClick={() => remove(index)}
                                                        >
                                                            <IoClose />
                                                        </button>
                                                    </div>
                                                )}
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
        </>
    )

}


