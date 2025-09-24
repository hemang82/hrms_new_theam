import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../layout/Header';
import Slidebar from '../../layout/Slidebar';
import $ from 'jquery';
import 'datatables.net-bs5';
import 'datatables.net-responsive-bs5';
import SubNavbar from '../../layout/SubNavbar';
import { updateLoanDetails, loanDetails, addDisbursementLoan, addLeaves, approvedRejectLeaves, addEmployeeLeaves } from '../../utils/api.services';
import { ExportToCSV, ExportToExcel, ExportToPdf, SWIT_DELETE, SWIT_DELETE_SUCCESS, SWIT_FAILED, TOAST_ERROR, TOAST_SUCCESS } from '../../config/common';
import profile_image from '../../assets/Images/default.jpg'
import ReactDatatable from '../../config/ReactDatatable';
import { Helmet } from 'react-helmet';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { getCustomerListThunk, setLoader, updateLoanList, getlistLeavesThunk, updateLeaveList } from '../../Store/slices/MasterSlice';
import Constatnt, { AwsFolder, Codes, ModelName, SEARCH_DELAY } from '../../config/constant';
import useDebounce from '../hooks/useDebounce';
import { closeModel, formatDate, formatDateDyjs, formatIndianPrice, getFileNameFromUrl, getLoanStatusObject, getLocalStorageItem, openModel, QuillContentRowWise, selectOption, selectOptionCustomer, truncateWords } from '../../config/commonFunction';
import Model from '../../component/Model';
import { DeleteComponent } from '../CommonPages/CommonComponent';
import Pagination from '../../component/Pagination';
import { AstroInputTypesEnum, DateFormat, EMPLOYEE_STATUS, InputRegex, LEAVE_TYPE_LIST, PAYMENT_STATUS, STATUS_COLORS } from '../../config/commonVariable';
import { RiUserReceivedLine } from 'react-icons/ri';
import { useForm } from 'react-hook-form';
import { DatePicker, ConfigProvider } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import 'dayjs/locale/en'; // or your locale
import { IoAddCircleOutline } from 'react-icons/io5';
import { uploadImageOnAWS } from '../../utils/aws.service';
import { PATHS } from '../../Router/PATHS';
import { BsQuestionOctagon } from 'react-icons/bs';
import { LazyLoadImage } from 'react-lazy-load-image-component';

export default function ManageCoustomer() {

    let navigat = useNavigate();
    const dispatch = useDispatch();

    const dateFormat = 'YYYY-MM-DD';

    const [totalRows, setTotalRows] = useState(0);

    const [checked, setChecked] = useState('');
    const [is_load, setis_load] = useState(false);

    const { leaveList: { data: leaves } } = useSelector((state) => state.masterslice);
    const { customerList: { data: customerList }, } = useSelector((state) => state.masterslice);
    const { customModel } = useSelector((state) => state.masterslice);

    const { register, handleSubmit, setValue, clearErrors, reset, watch, trigger, control, formState: { errors } } = useForm();

    const { register: register2, handleSubmit: handleSubmit2, formState: { errors: errors2 }, reset: reset2 } = useForm();

    const {
        register: registerSecond,
        handleSubmit: handleSubmitSecond,
        reset: resetSecond,
        formState: { errors: errorsSecond }
    } = useForm();

    const ALL_DOCUMENT_STATUS_LIST = [
        { key: "PAN", value: "PAN Card", color: 'text-[#6e7881]' },
        { key: "AADHAR", value: "Aadhaar Card", color: 'text-green-600' },
        { key: "PASSPORT", value: "Passport", color: 'text-[#6e7881]' },
        { key: "VOTER_ID", value: "Voter ID", color: 'text-green-600' },
        { key: "DRIVING_LICENSE", value: "Driving License", color: 'text-red-600' },
        { key: "ADDRESS_PROOF", value: "Address Proof", color: 'text-red-600' },
        { key: "BANK_STATEMENT", value: "Bank Statement", color: 'text-red-600' },
        { key: "SALARY_SLIP", value: "Salary Slip", color: 'text-red-600' },
        { key: "ITR", value: "Income Tax Return (ITR)", color: 'text-green-600' },
        { key: "FORM_16", value: "Form 16", color: 'text-green-600' },
        { key: "PROPERTY_DOCUMENTS", value: "Property Documents", color: 'text-green-600' },
    ];

    const ALLSTATUS_LIST = [
        { key: "", value: "ALL STATUS" },
        { key: 0, value: "Pending" },
        { key: 1, value: "Approved" },
        { key: 2, value: "Rejected" },
    ];

    const STATUS_CLASSES = {
        PENDING: "bg-warning text-white",
        UNDER_REVIEW: "bg-info text-white",
        ON_HOLD: "bg-warning text-white",
        APPROVED: "bg-success text-white",
        REJECTED: "bg-danger text-white",
        DISBURSED: "bg-primary text-black",
        CLOSED: "bg-secondary text-white",
        CANCELLED: "bg-danger text-white"
    };

    const TENURE_LIST = [
        { key: "6", value: "6" },
        { key: "12", value: "12" },
        { key: "24", value: "24" },
        { key: "36", value: "36" },
    ];

    const [selectedLeave, setSelecteLeave] = useState({})
    const [loading, setLoading] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const debounce = useDebounce(globalFilterValue, SEARCH_DELAY);
    const [filters, setFilters] = useState({ global: { value: '' } });
    const [addLeaveModal, setAddLeave] = useState(false);
    const [actionModal, setAction] = useState(false);

    const [viewModel, setViewModel] = useState(false);

    const [selectedOption, setSelectedOption] = useState(ALLSTATUS_LIST[0]);
    const [sortField, setSortField] = useState(null);
    const [sortOrder, setSortOrder] = useState(-1);

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [perPage, setPerPage] = useState(10);
    const [page, setPage] = useState(1);

    const [isCustom, setIsCustom] = useState(false);
    const [isProcessingCustom, setIsProcessingCustom] = useState(false);
    const [showProofImage, setShowProofImage] = useState(null);
    const [proofFileName, setProofFileName] = useState('');
    const [paymentDate, setPaymentDate] = useState(dayjs());
    const [is_loding, setIs_loading] = useState(false);

    const [updatedLeaveLeast, setupdatedLeavList] = useState(leaves);
    const [employeeStatus, setEmployeeStatus] = useState(EMPLOYEE_STATUS[0]);

    useEffect(() => {
        const request = {
            emp_leave_company: EMPLOYEE_STATUS[0]?.key,
        };
        if (customerList?.length === 0) {
            dispatch(getCustomerListThunk(request));
        }
        setSelectedOption({})
    }, [])

    // useEffect(() => {
    //     dispatch(setLoader(true));
    //     let request = {
    //         // page: page,
    //         // search: globalFilterValue,
    //         // status_filter: selectedOption?.key,
    //         // order_by: sortField,
    //         // order_direction: sortOrder === 1 ? 'asc' : 'desc',
    //         start_date: startDate ? formatDateDyjs(startDate, DateFormat.DATE_LOCAL_DASH_TIME_FORMAT) : null,
    //         end_date: endDate ? formatDateDyjs(endDate, DateFormat.DATE_LOCAL_DASH_TIME_FORMAT) : null,
    //         status: selectedOption?.key || ""
    //         // limit: perPage,
    //         // offset: page
    //     };
    //     console.log('request', request);
    //     let filteredList = leaves?.filter((item) => item.status == request?.status);
    //     setupdatedLeavList(filteredList)
    //     // dispatch(updateLeaveList(filteredList))
    //     dispatch(setLoader(false));
    // }, [page, selectedOption, sortField, sortOrder, endDate, perPage, page]);

    useEffect(() => {
        let request = {
            start_date: startDate ? formatDateDyjs(startDate, DateFormat.DATE_LOCAL_DASH_TIME_FORMAT) : null,
            end_date: endDate ? formatDateDyjs(endDate, DateFormat.DATE_LOCAL_DASH_TIME_FORMAT) : null,
            status: selectedOption?.key // can be "", 0, 1, 2
        };
        // let filteredList = leaves?.filter((item) => {
        //     // Show all if status is explicitly "" or null/undefined
        //     if (request.status === "" || request.status === null || request.status === undefined) return true;
        //     // Convert both to Number to handle 0 correctly
        //     return Number(item.status) === Number(request.status);
        // });

        const filteredList = leaves?.filter((item) => {

            // ----- STATUS FILTER -----
            let statusMatch = true;
            if (request.status !== "" && request.status !== null && request.status !== undefined) {
                statusMatch = Number(item.status) === Number(request?.status);
            }

            // ----- DATE FILTER -----
            let dateMatch = true;
            if (request?.start_date && request?.end_date) {
                const itemStart = new Date(item?.start_date);
                const itemEnd = new Date(item?.end_date);
                const filterStart = new Date(request?.start_date);
                const filterEnd = new Date(request?.end_date);

                dateMatch = itemEnd >= filterStart && itemStart <= filterEnd;
            }

            return statusMatch && dateMatch;
        });
        setupdatedLeavList(filteredList);

    }, [leaves, endDate, selectedOption]);

    const handleStatus = async (data) => {
        console.log('handleStatus dataaa', data);
        setis_load(true)
        let submitData = {
            leaveId: selectedLeave?.leave_id,
            status: selectedLeave?.actionType === "approved" ? '1' : '2',
            admin_reason: data?.reason ? data?.reason : ""
        }
        approvedRejectLeaves(submitData).then((response) => {
            if (response.code == Codes.SUCCESS) {
                TOAST_SUCCESS(response?.message)
                let updatedList = leaves?.map((item) => {
                    if (selectedLeave?.leave_id === item.leave_id) {
                        return {
                            ...item,
                            status: selectedLeave?.actionType === "approved" ? '1' : '2'
                        };
                    }
                    return item;
                });
                dispatch(updateLeaveList(updatedList))
                setSelecteLeave({});
                closeActionModelFunc()
                setis_load(false)
            } else {
                TOAST_ERROR(response.message)
            }
        })
    }

    const handleDelete = (is_true) => {
        if (is_true) {
            // setis_load(true)
            dispatch(setLoader(true));
            let submitData = {
                loan_id: selectedLeave?.id,
                is_deleted: true,
            }
            // updateLoanDetails(submitData).then((response) => {
            //     if (response.status_code === Codes?.SUCCESS) {
            //         setis_load(false)
            //         const updatedList = leaves?.filter((item) => item.id !== selectedLeave?.id)
            //         dispatch(updateLoanList({
            //             ...leaves,
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
            balance: data[AstroInputTypesEnum?.LEAVE_BALANCE],
            employee_id: data[AstroInputTypesEnum?.EMPLOYEE],
            leave_type: data[AstroInputTypesEnum?.LEAVE_TYPE],
        };
        addEmployeeLeaves(sendRequest).then((response) => {
            if (response?.code == Codes.SUCCESS) {
                reset()
                TOAST_SUCCESS(response?.message);
                closeLeaveModelFunc()
                dispatch(setLoader(false))
                dispatch(getlistLeavesThunk({}))
            } else {
                dispatch(setLoader(false))
                TOAST_ERROR(response?.message)
            }
        })
    }

    const openActionModelFunc = (data, action) => {
        setAction(true)
        setSelecteLeave({
            ...data,
            actionType: action,
        });
    }

    const closeActionModelFunc = () => {
        setAction(false)
        setSelecteLeave({});
    }

    const openLeaveModelFunc = () => {
        setAddLeave(true)
    }

    const closeLeaveModelFunc = () => {
        setAddLeave(false)
    }

    const openViewModelFunc = (data) => {
        setSelecteLeave(data);
        setViewModel(true)
    }

    const closeViewModelFunc = () => {
        setViewModel(false)
        setSelecteLeave({});
    }

    const funcStatusChange = (rowData) => {
        openLeaveModelFunc()
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
                emp_leave_company: data?.key,
            };
            await dispatch(getlistLeavesThunk(request));
        } finally {
        }
    };

    return (
        <>
            <div className="container-fluid mw-100">
                <SubNavbar title={"Leave List"} header={'Leave List'} />

                <div className="widget-content searchable-container list">
                    {/* --------------------- start Contact ---------------- */}
                    <div className="card card-body mb-2 p-3">
                        <div className="row g-3">

                            {/* Search Bar */}
                            <div className="col-12 col-md-6 col-lg-4">
                                <div className="position-relative mt-4 w-75">
                                    <input
                                        type="text"
                                        className="form-control ps-5  "
                                        id="input-search"
                                        placeholder="Search leave ..."
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
                                    onChange={(date) => {
                                        setEndDate(date);
                                        setPage(1);
                                    }}
                                    disabled={!startDate}
                                    disabledDate={disabledEndDate}
                                />
                            </div>

                            <div className="col-12 col-md-6 col-lg-2">
                                <label className="d-block mb-1 fw-semibold">Leave Status</label>
                                <div className="btn-group w-100">
                                    <button
                                        type="button"
                                        className="btn btn-info dropdown-toggle w-100"
                                        data-bs-toggle="dropdown"
                                        aria-haspopup="true"
                                        aria-expanded="false"
                                        style={{ height: '40px' }}
                                    >
                                        {selectedOption?.value || 'Select Status'}
                                    </button>
                                    <ul className="dropdown-menu w-100">
                                        {ALLSTATUS_LIST?.map((option) => (
                                            <li key={option.value}>
                                                <a
                                                    className="dropdown-item cursor_pointer text-black-50"
                                                    onClick={() => handleSelect(option)}
                                                >
                                                    {option?.value}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="col-12 col-md-6 col-lg-2 mb-3 mb-md-0">
                                <label className="d-block mb-1 fw-semibold">Employee Status</label>
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
                                                        onChangeApiCalling(option)
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
                        </div>
                    </div>

                    <div className="card p-3">
                        <div className="row border-bottom pb-3 ">
                            <div className="col-12 col-md-6 col-lg-3">

                            </div>
                            <div className="col-12 col-md-6 col-lg-9">
                                <div className="d-flex flex-column flex-md-row justify-content-end align-items-stretch gap-2 ">
                                    <div
                                        // to="/emi_schedule_list/add_emi_schedule"
                                        id="btn-add-contact"
                                        className="btn btn-info d-flex align-items-center justify-content-centermt-md-0 w-md-auto "
                                        style={{ height: '40px' }}
                                        onClick={() => { navigat(PATHS?.ADD_LEAVE) }}
                                    >
                                        <span className="me-1">
                                            <IoAddCircleOutline style={{ fontSize: '1.2rem' }} />
                                        </span>
                                        <span className="fw-semibold">Add Leave</span>
                                    </div>
                                    <Link
                                        // to="/emi_schedule_list/add_emi_schedule"
                                        id="btn-add-contact"
                                        className="btn btn-info d-flex align-items-center justify-content-center mt-3 mt-md-0  w-md-auto "
                                        style={{ height: '40px' }}
                                        onClick={() => { funcStatusChange() }}
                                    >
                                        <span className="me-1">
                                            <IoAddCircleOutline style={{ fontSize: '1.2rem' }} />
                                        </span>
                                        <span className="fw-semibold">Add Leave Balance</span>
                                    </Link>
                                </div>
                            </div>
                            <div className="col-md-8 col-xl-9 text-end d-flex justify-content-md-end justify-content-center mt-3 mt-md-0 gap-3">
                            </div>
                        </div>

                        <div className="table-responsive">
                            <DataTable
                                value={updatedLeaveLeast?.length > 0 ? updatedLeaveLeast : []}
                                paginator
                                rows={15}
                                globalFilter={globalFilterValue}
                                sortField={sortField}
                                sortOrder={sortOrder}
                                onSort={handleSort}
                                rowsPerPageOptions={
                                    updatedLeaveLeast?.length > 50
                                        ? [20, 30, 50, updatedLeaveLeast?.length]
                                        : [20, 30, 40]
                                }
                                currentPageReportTemplate='Showing {first} to {last} of {totalRecords} entries'
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                loading={loading}
                                // globalFilterFields={['name', 'annual_income']}
                                emptyMessage={<span style={{ textAlign: 'center', display: 'block' }}>Leave Not Found.</span>}>

                                <Column
                                    field="id"
                                    header="Id"
                                    style={{ minWidth: '4rem' }}
                                    body={(rowData, options) => options?.rowIndex + 1}
                                    showFilterMenu={true}
                                    sortable
                                />

                                <Column
                                    field="show_employee_id"
                                    header="Employee ID"
                                    style={{ minWidth: '10rem', whiteSpace: 'nowrap', textTransform: 'capitalize' }}
                                    body={(rowData) => <span>{rowData?.show_employee_id || '-'}</span>}
                                />

                                <Column field="name" header="Name" style={{ minWidth: '12rem', textTransform: 'capitalize' }} body={(rowData) => (
                                    <span className='me-2'>{truncateWords(rowData.name) || '-'} </span>
                                )} />

                                <Column field="start_date" header="From" style={{ minWidth: '8rem' }} body={(rowData) => (
                                    <span className='me-2'>{formatDate(rowData.start_date, DateFormat?.DATE_FORMAT) || '-'} </span>
                                )} />

                                <Column field="end_date" header="To" style={{ minWidth: '8em' }} body={(rowData) => (
                                    <span className='me-2'>{formatDate(rowData.end_date, DateFormat?.DATE_FORMAT) || '-'} </span>
                                )} />

                                <Column field="days" header="Days" style={{ minWidth: '6rem' }} body={(rowData) => (
                                    <span className='me-2'>{rowData?.days || '-'} </span>
                                )} />

                                <Column field="leave_type" header="Type" style={{ minWidth: '6rem' }} body={(rowData) => (
                                    <span className='me-2'>{rowData?.leave_type || '-'}</span>
                                )} />

                                <Column field="created_at" header="Request Date" style={{ minWidth: '8rem' }} body={(rowData) => (
                                    <span className='me-2'>{formatDate(rowData.created_at, DateFormat?.DATE_FORMAT) || '-'} </span>
                                )} />

                                <Column field="is_active" data-pc-section="root" header="Status" style={{ minWidth: '8rem' }} body={(rowData) => (
                                    <>
                                        {rowData?.status == 1 ? (
                                            <span className={`p-tag p-component cursor_pointer badge  text-light fw-semibold px-3 rounded-4 py-2 me-2 status_font ${STATUS_COLORS.SUCCESS}`} data-pc-name="tag" data-pc-section="root"  >
                                                <span className="p-tag-value" data-pc-section="value">Approved</span>
                                            </span>
                                        ) : rowData?.status == 2 ? (
                                            <span className={`p-tag p-component cursor_pointer badge  text-light fw-semibold px-3 rounded-4 py-2 me-2 status_font ${STATUS_COLORS.DANGER}`} data-pc-name="tag" data-pc-section="root" >
                                                <span className="p-tag-value" data-pc-section="value">Rejected</span>
                                            </span>
                                        ) : <span className={`p-tag p-component cursor_pointer badge  text-light fw-semibold px-3 rounded-4 py-2 me-2 status_font ${STATUS_COLORS.WARNING}`} data-pc-name="tag" data-pc-section="root" >
                                            <span className="p-tag-value" data-pc-section="value">Pending</span>
                                        </span>
                                        }
                                    </>
                                )} />
                                {
                                    getLocalStorageItem(Constatnt?.ROLE_KEY) == '1' && <Column
                                        field="status"
                                        header="Action"
                                        style={{ minWidth: "6rem" }}
                                        body={(rowData) => (
                                            <div className="action-btn d-flex align-items-center">
                                                {
                                                    rowData?.status == 0 ? (<>
                                                        <a
                                                            className="text-success cursor_pointer me-2"
                                                            // onClick={() => { handleStatus(rowData?.id, '1') }}
                                                            onClick={() => { openActionModelFunc(rowData, 'approved') }}
                                                        >
                                                            <i className="ti ti-check fs-7"></i>
                                                        </a>
                                                        <a
                                                            className="text-danger cursor_pointer"
                                                            onClick={() => { openActionModelFunc(rowData, 'cancel') }}
                                                        >
                                                            <i className="ti ti-x fs-7"></i>
                                                        </a>
                                                    </>) : (<>
                                                        <a className="text-success me-2 disabled-status"
                                                        // onClick={() => { handleStatus(rowData?.id, '1') }}
                                                        // onClick={() => { openActionModelFunc(rowData, 'approved') }}
                                                        >
                                                            <i className="ti ti-check fs-7"></i>
                                                        </a>
                                                        <a
                                                            className="text-danger disabled-status"
                                                        // onClick={() => { openActionModelFunc(rowData, 'cancel') }}
                                                        >
                                                            <i className="ti ti-x fs-7"></i>
                                                        </a>
                                                    </>)
                                                }

                                            </div>
                                        )}
                                    />
                                }

                                <Column field="status" header="View" style={{ minWidth: '6rem' }} body={(rowData) => (
                                    <div className="action-btn">

                                        <Link onClick={() => {
                                            // if (rowData?.breaks?.length > 0) {
                                            openViewModelFunc(rowData);
                                            // }
                                        }}
                                            state={rowData}
                                            className={`text-custom-theam edit cursor_pointer`}
                                        >
                                            <i className="ti ti-eye fs-7" />
                                        </Link>

                                    </div>
                                )} />

                            </DataTable>

                            <div className=''>
                                <Pagination per_page={50 || perPage} pageCount={leaves?.total_count} onPageChange={onPageChange} page={page} />
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <div className={`modal custom-modal  ${addLeaveModal ? "fade show d-block " : "d-none"}`}
                id="addnotesmodal" tabIndex={-1} role="dialog" aria-labelledby="addnotesmodalTitle" aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-centered" role="document" >
                    <div className="modal-content border-0">
                        <div className="modal-header bg-primary" style={{ borderRadius: '10px 10px 0px 0px' }}>
                            <h6 className="modal-title fs-5">{'Add Leave Balance'} </h6>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" onClick={() => { closeLeaveModelFunc() }} />
                        </div>

                        <div className="modal-body">
                            <form onSubmit={handleSubmit(onSubmitData)}>
                                <div className="col-lg-12">
                                    <div className="card-body p-4">
                                        <div className="row g-3">
                                            {/* Payment Type */}
                                            <div className="col-12 col-md-6">
                                                <div className="mb-1">
                                                    <label htmlFor="payment_status" className="form-label fw-semibold">
                                                        Select Employee<span className="text-danger ms-1">*</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <select
                                                            id="payment_status"
                                                            className="form-control ps-2"
                                                            autoComplete="off"
                                                            style={{ fontWeight: '600' }}
                                                            {...register(AstroInputTypesEnum.EMPLOYEE, {
                                                                required: "Select employee",
                                                                // onChange: (e) => changeStatusFunction(e.target.value),
                                                            })}
                                                        >
                                                            {selectOptionCustomer(customerList)}
                                                        </select>
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.EMPLOYEE]?.message}
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-6">
                                                <div className="mb-1">
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
                                            </div>

                                            <div className="mb-1">
                                                <label htmlFor="product_name" className="form-label fw-semibold">
                                                    Leave Balance<span className="text-danger ms-1">*</span>
                                                </label>
                                                <div className="input-group border rounded-1">
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        className="form-control ps-2"
                                                        placeholder="Enter leave balance"
                                                        autoComplete='false'
                                                        {...register(AstroInputTypesEnum.LEAVE_BALANCE, { required: "Enter leave balance" })}
                                                    />
                                                </div>
                                                <label className="errorc ps-1 pt-1">
                                                    {errors[AstroInputTypesEnum.LEAVE_BALANCE]?.message}
                                                </label>
                                            </div>

                                            <div className="modal-footer justify-content-center">
                                                <button type="button" className="btn btn-danger" onClick={() => { closeLeaveModelFunc() }}>Cancel</button>
                                                <button type="submit" className="btn btn-primary">Submit</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div >
            {
                addLeaveModal && (
                    <div className="modal-backdrop fade show"></div>
                )
            }

            <div className={`modal custom-modal  ${actionModal ? "fade show d-block " : "d-none"}`}
                id="addnotesmodal" tabIndex={-1} role="dialog" aria-labelledby="addnotesmodalTitle" aria-hidden="true">
                <div className="modal-dialog modal-md modal-dialog-centered" role="document" >
                    <div className="modal-content border-0">
                        <div className="modal-header bg-primary" style={{ borderRadius: '10px 10px 0px 0px' }}>
                            <h6 className="modal-title">{selectedLeave?.actionType === "approved" ? 'Are you sure approve leave ?' : "Rejection Reason"} </h6>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" onClick={() => { closeActionModelFunc() }} />
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit2(handleStatus)}>
                                <div className="col-lg-12">
                                    <div className="card-body pt-4 p-2 ">
                                        <div className="row g-3">
                                            {/* Payment Type */}
                                            {/* <input
                                                type="hidden"
                                                step="0.01"
                                                className="form-control ps-2"
                                                placeholder="Enter leave balance"
                                                autoComplete='false'
                                                value={selectedLeave?.actionType === "approved" ? 1 : 2}
                                                {...register('actionType')}
                                            /> */}
                                            {
                                                selectedLeave?.actionType === "approved" ? (<>
                                                    <div className="text-center mb-3">
                                                        <BsQuestionOctagon style={{ fontSize: '2rem' }} />
                                                    </div>
                                                    <p className="fw-semibold fs-4 text-center">
                                                        Are you sure you want to approve this leave?
                                                    </p>
                                                </>) : (<>
                                                    <div className="mb-1">
                                                        <label htmlFor="reason" className="form-label fw-semibold">
                                                            Reason<span className="text-danger ms-1">*</span>
                                                        </label>
                                                        <div className="input-group border rounded-1">
                                                            <textarea
                                                                id="reason"
                                                                className="form-control ps-2"
                                                                placeholder="Enter reason"
                                                                rows={3} // 👈 controls height
                                                                {...register2(AstroInputTypesEnum.REASON, { required: "Enter reason" })}
                                                            />
                                                        </div>

                                                        <label className="errorc ps-1 pt-1">
                                                            {errors2[AstroInputTypesEnum.REASON]?.message}
                                                        </label>
                                                    </div>
                                                </>)
                                            }
                                            <div className="modal-footer justify-content-center">
                                                <button type="button" className="btn btn-danger" onClick={() => { closeActionModelFunc() }}>Cancel</button>
                                                <button type="submit" className="btn btn-primary"> {selectedLeave?.actionType === "approved" ? 'Yes, Approve Leave' : 'Submit'}</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div >
            {
                actionModal && (
                    <div className="modal-backdrop fade show"></div>
                )
            }

            <div className={`modal custom-modal  ${viewModel ? "fade show d-block " : "d-none"}`}
                id="addnotesmodal" tabIndex={-1} role="dialog" aria-labelledby="addnotesmodalTitle" aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-centered" role="document" >
                    <div className="modal-content border-0">
                        <div className="modal-header bg-primary" style={{ borderRadius: '10px 10px 0px 0px' }}>
                            <h6 className="modal-title fs-6"> Leave Details </h6>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" onClick={() => { closeViewModelFunc() }} />
                        </div>
                        <div className="modal-body ">
                            <div className="row m-2">
                                {[
                                    { label: "Leave Type", value: selectedLeave?.leave_type },
                                    { label: "Request Date", value: formatDate(selectedLeave?.created_at, DateFormat?.DATE_FORMAT) },
                                    { label: "Days", value: selectedLeave?.days },
                                    { label: "Start Date", value: formatDate(selectedLeave?.start_date, DateFormat?.DATE_FORMAT) },
                                    { label: "End Date", value: formatDate(selectedLeave?.end_date, DateFormat?.DATE_FORMAT) },
                                ].map((item, index) => (

                                    <div key={index} className="col-md-4 mb-4">

                                        {
                                            item.value && <>
                                                <p className="mb-1 fontSize14">{item.label}</p>
                                                <h6 className="fw-meduim mb-0 fontSize16 text-capitalize">{item.value || 'N/A'}</h6>
                                            </>
                                        }
                                    </div>
                                ))}

                                {
                                    selectedLeave?.reason && <>
                                        <div className={`${selectedLeave?.admin_reason ? 'col-md-6' : 'col-md-12'} mb-4`}>
                                            <p className="mb-1 fontSize14">Reason</p>
                                            <h6 className="fw-meduim mb-0 fontSize16 text-capitalize">{QuillContentRowWise(selectedLeave.reason ? selectedLeave.reason : "-")}</h6>
                                        </div>
                                    </>
                                }

                                {selectedLeave?.admin_reason &&
                                    <>
                                        <div className="col-md-6 mb-4">
                                            <p className="mb-1 fontSize14">Admin Reason</p>
                                            <h6 className="fw-meduim mb-0 fontSize16 text-capitalize">{QuillContentRowWise(selectedLeave.admin_reason ? selectedLeave.admin_reason : "-") || 'N/A'}</h6>
                                        </div>
                                    </>
                                }

                            </div>
                        </div>
                    </div>
                </div>
            </div >
            {
                viewModel && (
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


