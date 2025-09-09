import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../layout/Header';
import Slidebar from '../../layout/Slidebar';
import $ from 'jquery';
import 'datatables.net-bs5';
import 'datatables.net-responsive-bs5';
import SubNavbar from '../../layout/SubNavbar';
import {  updateLoanDetails, loanDetails } from '../../utils/api.services';
import { ExportToCSV, ExportToExcel, ExportToPdf, SWIT_DELETE, SWIT_DELETE_SUCCESS, SWIT_FAILED, TOAST_ERROR, TOAST_SUCCESS } from '../../config/common';
import profile_image from '../../assets/Images/default.jpg'
import ReactDatatable from '../../config/ReactDatatable';
import { Helmet } from 'react-helmet';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { getCustomerListThunk, getAllLoanListThunk, setLoader, updateLoanList, getProcessingFeeListThunk, getSalaryListThunk } from '../../Store/slices/MasterSlice';
import Constatnt, { Codes, ModelName, SEARCH_DELAY } from '../../config/constant';
import useDebounce from '../hooks/useDebounce';
import { closeModel, formatDate, formatDateDyjs, formatIndianPrice, getLoanStatusObject, openModel, selectOption, truncateWords } from '../../config/commonFunction';
import Model from '../../component/Model';
import { DeleteComponent } from '../CommonPages/CommonComponent';
import Pagination from '../../component/Pagination';
import { DateFormat, getAttendanceStatusColor, getStatus, InputRegex } from '../../config/commonVariable';
import { RiUserReceivedLine } from 'react-icons/ri';
import { useForm } from 'react-hook-form';
import { DatePicker, ConfigProvider } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import 'dayjs/locale/en'; // or your locale
import { IoAddCircleOutline } from 'react-icons/io5';

export default function ManageCoustomer() {

    let navigat = useNavigate();
    const dispatch = useDispatch();
    const dateFormat = 'YYYY-MM-DD';

    const [totalRows, setTotalRows] = useState(0);

    const [checked, setChecked] = useState('');
    const [is_load, setis_load] = useState(false);

    const { listAllLoan: { data: loanList }, } = useSelector((state) => state.masterslice);
    const { listProcessFee: { data: listProcessFeeList }, } = useSelector((state) => state.masterslice);
    const { listInterest: { data: listInterest }, } = useSelector((state) => state.masterslice);

    const { customModel } = useSelector((state) => state.masterslice);
    const { register, handleSubmit, setValue, clearErrors, reset, watch, trigger, control, formState: { errors } } = useForm();


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
        { key: "PENDING", value: "PENDING" },
        { key: "APPROVED", value: "APPROVED" },
        { key: "DISBURSEMENT_APPROVAL_PENDING", value: "DISBURSEMENT PENDING" },
        { key: "DISBURSED", value: "DISBURSED" },
        { key: "COMPLETED", value: "COMPLETED" },

        { key: "APPLICATION_SUBMITTED", value: "APPLICATION SUBMITTED" },
        { key: "UNDER_REVIEW", value: "UNDER REVIEW" },
        { key: "ON_HOLD", value: "ON HOLD" },
        { key: "REJECTED", value: "REJECTED" },
        { key: "AADHAR_VERIFIED", value: "AADHAR VERIFIED" },
        { key: "BANK_VERIFIED", value: "BANK VERIFIED" },
        { key: "USER_ACCEPTED", value: "USER ACCEPTED" },
        { key: "E_MANDATE_GENERATED", value: "E-MANDATE GENERATED" },

        // { key: "DISBURSEMENT_APPROVED", value: "DISBURSEMENT APPROVED" },
        { key: "CLOSED", value: "CLOSED" },
        { key: "CANCELLED", value: "CANCELED" },

    ];

    const ALLSTATUS_FILTER_LIST = [
        { key: "", value: "ALL STATUS" },
        { key: "PENDING", value: "PENDING" },
        { key: "UNDER_REVIEW", value: "UNDER REVIEW" },
        { key: "ON_HOLD", value: "ON HOLD" },
        { key: "APPROVED", value: "APPROVED" },
        { key: "REJECTED", value: "REJECTED" },
        { key: "CANCELLED", value: "CANCELED" },
        // { key: "CLOSED", value: "CLOSED" },
        // { key: "COMPLETED", value: "COMPLETED" },
    ];

    const DISABLED_STATUSES = [
        "USER_ACCEPTED",
        "DISBURSED",
        "COMPLETED",
        "DISBURSEMENT_APPROVAL_PENDING"
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
        // { key: "6", value: "6" },
        { key: "12", value: "12" },
        { key: "24", value: "24" },
        { key: "36", value: "36" },
    ];

    const [selectedLoan, setSelecteLoan] = useState({})
    const [loading, setLoading] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const debounce = useDebounce(globalFilterValue, SEARCH_DELAY);
    const [filters, setFilters] = useState({ global: { value: '' } });
    const [statusModal, setStatusModal] = useState(false);
    const [selectedOption, setSelectedOption] = useState(ALLSTATUS_LIST[0]);
    const [sortField, setSortField] = useState(null);
    const [sortOrder, setSortOrder] = useState(-1);

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [perPage, setPerPage] = useState(10);
    const [page, setPage] = useState(1);

    const [intrestDropdown, setIntrestDropdown] = useState([]);
    const [isCustom, setIsCustom] = useState(false);
    const [isProcessingCustom, setIsProcessingCustom] = useState(false);
    const [isTenureCustom, setIsTenureCustom] = useState(false);

    useEffect(() => {
        dispatch(setLoader(true));
        let request = {
            // page: page,
            search: globalFilterValue,
            status_filter: selectedOption?.key,
            order_by: sortField,
            order_direction: sortOrder === 1 ? 'asc' : 'desc',
            start_date: startDate ? formatDateDyjs(startDate, DateFormat.DATE_LOCAL_DASH_TIME_FORMAT) : null,
            end_date: endDate ? formatDateDyjs(endDate, DateFormat.DATE_LOCAL_DASH_TIME_FORMAT) : null,
            limit: perPage,
            offset: page
        };
        dispatch(getAllLoanListThunk(request))
        dispatch(setLoader(false));
    }, [page, debounce, selectedOption, sortField, sortOrder, endDate, perPage, page]);

    useEffect(() => {
        dispatch(getProcessingFeeListThunk())
        dispatch(getSalaryListThunk());
    }, [])

    const handleDelete = (is_true) => {
        if (is_true) {
            // setis_load(true)
            dispatch(setLoader(true));
            let submitData = {
                loan_id: selectedLoan?.id,
                is_deleted: true,
            }
            updateLoanDetails(submitData).then((response) => {
                if (response.status_code === Codes?.SUCCESS) {
                    setis_load(false)
                    const updatedList = loanList?.loan_applications?.filter((item) => item.id !== selectedLoan?.id)
                    dispatch(updateLoanList({
                        ...loanList,
                        loan_applications: updatedList
                    }))
                    closeModel(dispatch)
                    dispatch(setLoader(false))
                    TOAST_SUCCESS(response?.message);
                }
            });
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

    const onSubmitData = (data) => {

        const sendRequest = {
            loan_id: data.id,
            status: data.loan_status,
            remarks: data.remarks,
            approved_loan: data?.approved_amount,
            desired_loan: data?.applied_amount,
            credit_score_range_rate_id: data?.interest_rate ? parseInt(listInterest?.credit_range_rates.find(item => item.rate_percentage == data?.interest_rate)?.id || 0, 10) : "",
            credit_score_range_rate_percentage: data?.interest_rate ? data?.interest_rate : "",
            custom_rate_percentage: isCustom ? parseFloat(data?.custom_rate_percentage || 0) : null,

            processing_fee_id: data?.interest_rate ? parseInt(listProcessFeeList.find(item => item.min_fee_percent == data?.processing_fee)?.id || 0, 10) : "", // find the array
            processing_fee: data?.processing_fee,
            custom_processing_fee: isProcessingCustom ? parseFloat(data?.custom_processing_fee) : null,
            // tenure_months: isTenureCustom ? data?.custom_loan_tenure : data?.loan_tenure,
            tenure_months: parseFloat(data?.loan_tenure),
        }

        updateLoanDetails(sendRequest).then((response) => {
            if (response?.status_code === Codes.SUCCESS) {
                reset()
                let updatedList = loanList?.loan_applications?.map((item) => {
                    if (data.id === item.id) {
                        return {
                            ...item,
                            status: data.loan_status,
                            remarks: data?.remarks,
                            approved_loan: data?.approved_amount,

                            credit_score_range_rate_percentage: data?.interest_rate ? data?.interest_rate : "",
                            custom_rate_percentage: isCustom ? parseFloat(data?.custom_rate_percentage || 0) : null,

                            processing_fee: data?.processing_fee,
                            custom_processing_fee: isProcessingCustom ? parseFloat(data?.custom_processing_fee || 0) : null,

                            tenure_months: data?.loan_tenure,
                        };
                    }
                    return item;
                });
                dispatch(updateLoanList({
                    ...loanList,
                    loan_applications: updatedList
                }))
                TOAST_SUCCESS(response?.message);
                setStatusModal(false)
                setSelecteLoan(null)
                setIsCustom(false)
                setIsProcessingCustom(false)
            } else {
                TOAST_ERROR(response?.message)
            }
        })
    }

    const funcStatusChange = (rowData1) => {
        loanDetails({ loan_id: rowData1?.id }).then((response) => {
            if (response?.status_code === Codes.SUCCESS) {
                let rowData = response?.data?.loan_application;
                console.log('funcStatusChange', rowData);
                if (!rowData?.aadhaar_verified) {
                    SWIT_FAILED("Aadhaar card verification is pending.");
                } else if (DISABLED_STATUSES.includes(rowData?.status)) {
                    return
                } else {
                    setSelecteLoan(rowData)
                    setValue('loan_status', ALLSTATUS_FILTER_LIST.find(item => item.key === rowData?.status)?.key)
                    setValue('remarks', rowData?.remarks)
                    setValue('id', rowData?.id)
                    setValue('approved_amount', rowData?.approved_loan)
                    setValue('applied_amount', rowData?.desired_loan)

                    const loantTypeFilter = listInterest?.credit_range_rates?.filter(item => item?.loan_type?.toUpperCase() == rowData?.loan_type?.toUpperCase());
                    const intrestRate = getInterestRateByCibil(rowData?.credit_score, loantTypeFilter)

                    if (rowData?.credit_score_range_rate_percentage !== null && rowData?.custom_rate_percentage !== null) {
                        setIsCustom(true);
                        setValue('interest_rate', rowData?.credit_score_range_rate_percentage);
                        setValue('custom_rate_percentage', rowData?.custom_rate_percentage);
                    } else {
                        setValue('interest_rate', intrestRate);
                        setValue('custom_rate_percentage', null)
                    }

                    const processingFeeRate = getProcessingFeeRateByCibil(rowData?.credit_score, listProcessFeeList)

                    if (rowData?.processing_fee !== null && rowData?.custom_processing_fee !== null) {
                        setIsProcessingCustom(true);
                        setValue('processing_fee', rowData?.processing_fee);
                        setValue('custom_processing_fee', rowData?.custom_processing_fee);
                    } else {
                        setValue('processing_fee', processingFeeRate)
                        setValue('custom_processing_fee', null)
                    }
                    setValue('loan_tenure', rowData?.tenure_months)
                    setStatusModal(true)
                }
            }
        })
    }

    const changeStatusFunction = (data) => {
        setValue('loan_status', ALLSTATUS_LIST.find(item => item.key === data)?.key)
        const statusExists = selectedLoan?.status === data;
        setValue('remarks', statusExists ? selectedLoan?.remarks : '')

        setValue('id', selectedLoan?.id)
        setValue('approved_amount', selectedLoan?.approved_loan)
        setValue('applied_amount', selectedLoan?.desired_loan)
        const intrestRate = getInterestRateByCibil(selectedLoan.credit_score, listInterest?.credit_range_rates)

        if (selectedLoan?.credit_score_range_rate_percentage !== null && selectedLoan?.custom_rate_percentage !== null) {
            setIsCustom(true);
            setValue('interest_rate', selectedLoan?.credit_score_range_rate_percentage);
            setValue('custom_rate_percentage', selectedLoan?.custom_rate_percentage);
        } else {
            setValue('interest_rate', intrestRate);
            setValue('custom_rate_percentage', null)
        }
        const processingFeeRate = getProcessingFeeRateByCibil(selectedLoan.credit_score, listProcessFeeList)
        if (selectedLoan?.processing_fee !== null && selectedLoan?.custom_processing_fee !== null) {
            setIsCustom(true);
            setValue('processing_fee', selectedLoan?.processing_fee);
            setValue('custom_processing_fee', selectedLoan?.custom_processing_fee);
        } else {
            setValue('processing_fee', processingFeeRate)
            setValue('custom_processing_fee', null)
        }

        setValue('loan_tenure', selectedLoan?.tenure_months)
    }

    const handleSelect = (option) => {
        setSelectedOption(option);
        setPage(1);
    };

    const handleSort = (event) => {
        console.log("Sort event triggered:", event);
        setSortField(event.sortField); // ✅ correct key
        setSortOrder(event.sortOrder);
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

    const [isEditable, setIsEditable] = useState(false);

    return (
        <>

            <div className="container-fluid mw-100">

                <SubNavbar title={"Loan List"} header={'Loan List'} />

                <div className="widget-content searchable-container list">

                    {/* --------------------- start Contact ---------------- */}

                    <div className="card card-body mb-3">
                        <div className="row g-3">
                            {/* Search Bar */}
                            <div className="col-12 col-md-6 col-lg-4">
                                <div className="position-relative mt-4 w-75">
                                    <input
                                        type="text"
                                        className="form-control ps-5 "
                                        id="input-search"
                                        placeholder="Search loan..."
                                        value={globalFilterValue}
                                        onChange={onGlobalFilterChange}
                                    />
                                    <i className="ti ti-search position-absolute top-50 start-0 translate-middle-y fs-6 text-dark ms-3" />
                                </div>
                            </div>

                            {/* Start Date */}
                            <div className="col-12 col-md-6 col-lg-2 ">
                                <label className="d-block mb-1 fw-semibold">Start Date</label>
                                <DatePicker
                                    className="custom-datepicker w-100"
                                    format={dateFormat}
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
                                    className="custom-datepicker w-100"
                                    format={dateFormat}
                                    value={endDate}
                                    onChange={(date) => {
                                        setEndDate(date);
                                        setPage(1);
                                    }}
                                    disabled={!startDate}
                                    disabledDate={disabledEndDate}
                                />
                            </div>

                            {/* Status Dropdown */}
                            <div className="col-12 col-md-6 col-lg-2">
                                <label className="d-block mb-1 fw-semibold">Status</label>
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
                                    <ul
                                        className="dropdown-menu w-100 shadow-sm border border-2"
                                        style={{
                                            maxHeight: '400px',   // 👈 limit height
                                            overflowY: 'auto'     // 👈 scroll if too many items
                                        }}
                                    >
                                        {ALLSTATUS_LIST?.map((option) => (
                                            <li key={option.value}>
                                                <a
                                                    className="dropdown-item cursor_pointer text-secondary"
                                                    onClick={() => handleSelect(option)}
                                                >
                                                    {option?.value}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            {/* mt-3 mt-md-0 w-md-auto */}
                            <div className="col-12 col-md-6 col-lg-2">
                                <label className="d-block mb-1 fw-semibold mt-2 mt-md-4 "></label>
                                <Link
                                    to="/loan_list/add_loan"
                                    id="btn-add-contact"
                                    className="btn btn-info d-flex align-items-center justify-content-center"
                                    style={{ height: '40px' }}
                                >
                                    <span className="me-1">
                                        <IoAddCircleOutline style={{ fontSize: '1.2rem' }} />
                                    </span>
                                    <span className="fw-semibold ">Add Loan</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="modal fade" id="addContactModal" tabIndex={-1} role="dialog" aria-labelledby="addContactModalTitle" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-header d-flex align-items-center">
                                    <h5 className="modal-title">Contact</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                                </div>
                                <div className="modal-body">
                                    <div className="add-contact-box">
                                        <div className="add-contact-content">
                                            <form id="addContactModalTitle">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className="mb-3 contact-name">
                                                            <input type="text" id="c-name" className="form-control" placeholder="Name" />
                                                            <span className="validation-text text-danger" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="mb-3 contact-email">
                                                            <input type="text" id="c-email" className="form-control" placeholder="Email" />
                                                            <span className="validation-text text-danger" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className="mb-3 contact-occupation">
                                                            <input type="text" id="c-occupation" className="form-control" placeholder="Occupation" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="mb-3 contact-phone">
                                                            <input type="text" id="c-phone" className="form-control" placeholder="Phone" />
                                                            <span className="validation-text text-danger" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <div className="mb-3 contact-location">
                                                            <input type="text" id="c-location" className="form-control" placeholder="Location" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button id="btn-add" className="btn btn-success rounded-pill px-4">Add</button>
                                    <button id="btn-edit" className="btn btn-success rounded-pill px-4">Save</button>
                                    <button className="btn btn-danger rounded-pill px-4" data-bs-dismiss="modal"> Discard </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card card-body">
                        <div className="table-responsive">
                            <DataTable
                                value={loanList?.loan_applications}
                                // paginator
                                rows={15}
                                sortField={sortField}
                                sortOrder={sortOrder}
                                onSort={handleSort}
                                // rowsPerPageOptions={[5, 10, 20]}
                                currentPageReportTemplate='Showing {first} to {last} of {totalRecords} entries'
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                loading={loading}
                                // globalFilterFields={['name', 'annual_income']}
                                emptyMessage={<span style={{ textAlign: 'center', display: 'block' }}>Loan Not Found.</span>}>

                                <Column
                                    field="id"
                                    header="Id"
                                    style={{ minWidth: '4rem' }}
                                    body={(rowData, options) => options.rowIndex + 1}
                                    showFilterMenu={true}
                                    sortable
                                />

                                <Column field="status" header="Action" style={{ minWidth: '8rem' }} body={(rowData) => (
                                    <div className="action-btn">
                                        <a
                                            className={`text-info edit cursor_pointer me-1 ${DISABLED_STATUSES.includes(rowData?.status) ? "disabled-btn" : ""}`}
                                            onClick={() => {
                                                if (!DISABLED_STATUSES.includes(rowData?.status)) {
                                                    navigat(`/loan_list/edit_loan`, { state: rowData });
                                                }
                                            }}
                                        >
                                            <i className="ti ti-edit fs-7"></i>
                                        </a>
                                        <Link
                                            to={'/loan_list/loan_details'}
                                            state={rowData}
                                            className="text-info edit cursor_pointer"
                                        >
                                            <i className="ti ti-eye fs-7" />
                                        </Link>
                                        <a
                                            className={`text-dark delete ms-2 cursor_pointer ${DISABLED_STATUSES.includes(rowData?.status) ? "disabled-btn" : ""}`}
                                            onClick={() => {
                                                if (!DISABLED_STATUSES.includes(rowData?.status)) {
                                                    openModel(dispatch, ModelName.DELETE_MODEL);
                                                    setSelecteLoan(rowData);
                                                }
                                            }}
                                        >
                                            <i className="ti ti-trash fs-7 text-danger" />
                                        </a>
                                    </div>
                                )} />

                                <Column field="status" sortable data-pc-section="root" header="Status" style={{ minWidth: '10rem' }} body={(rowData) => (
                                    <>
                                        <span
                                            // className={`p-tag p-component cursor_pointer badge p-1 text-light fw-semibold ${STATUS_CLASSES[ALLSTATUS_LIST.find(item => item.value === rowData?.status)?.key]}`}
                                            className={`p-tag p-component cursor_pointer badge p-1 text-light fw-semibold px-3 rounded-4 py-2 ${getAttendanceStatusColor(rowData?.status) || "bg-secondary"}`}
                                            data-pc-name="tag"
                                            data-pc-section="root"
                                            onClick={() =>
                                                !DISABLED_STATUSES.includes(rowData?.status) && funcStatusChange(rowData)
                                            }
                                        >
                                            <span className="p-tag-value" data-pc-section="value">
                                                {/* {rowData?.status} */}
                                                {/* {
                                                    ALLSTATUS_LIST?.find(item => item.key === rowData?.status)?.value || rowData?.status
                                                } */}
                                                {getStatus(rowData?.status) || "-"}
                                            </span>
                                        </span>
                                    </>
                                )} />

                                <Column field="name" header="Name" sortable style={{ minWidth: '8rem', whiteSpace: 'nowrap', textTransform: 'capitalize' }} body={(rowData) => (
                                    <span>{rowData.name || '-'} </span>
                                )} />

                                <Column field="loan_type" sortable header="Loan Type" style={{ minWidth: '8rem' }} body={(rowData) => (
                                    <span>{rowData?.loan_type || '-'}</span>
                                )} />

                                <Column field="created_at" header="Apply Date" sortable style={{ minWidth: '8rem' }} body={(rowData) => (
                                    <span>{formatDate(rowData.created_at, DateFormat?.DATE_DOT_TIME_FORMAT) || '-'} </span>
                                )} />

                                {/* <Column field="annual_income" sortable header="Annual Income" style={{ minWidth: '12rem' }} /> */}

                                <Column field="annual_income" sortable header="Annual Income" style={{ minWidth: '10rem' }} body={(rowData) => (
                                    <span>{truncateWords(formatIndianPrice(rowData?.annual_income)) || '-'}</span>
                                )} />

                                <Column field="desired_loan" sortable header="Desired Loan" style={{ minWidth: '10rem' }} body={(rowData) => (
                                    <span>{truncateWords(formatIndianPrice(rowData?.desired_loan)) || '-'}</span>
                                )} />

                                <Column field="loan_uid" header="Loan ID" style={{ minWidth: '8rem', whiteSpace: 'nowrap', textTransform: 'capitalize' }} body={(rowData) => (
                                    <span>{rowData.loan_uid || '-'} </span>
                                )} />

                            </DataTable>

                            <div className=''>
                                <Pagination per_page={perPage} pageCount={loanList?.total_count} onPageChange={onPageChange} page={page} />
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
                            <h6 className="modal-title text-dark fs-5">Manage Loan Status</h6>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" onClick={() => { setStatusModal(false); setIsCustom(false); setIsProcessingCustom(false); setSelecteLoan(null); reset() }} />
                        </div>

                        <div className="modal-body">
                            <form onSubmit={handleSubmit(onSubmitData)}>
                                <div className="col-lg-12">
                                    <div className="card-body p-4">
                                        <div className='row d-flex gap-3'>
                                            <div className='col'>
                                                <div className="border-bottom chat-meta-user d-flex align-items-center justify-content-between mb-3">
                                                    <h5 className="text-dark mb-0 fw-semibold pb-3">CIBIL Score : {selectedLoan?.credit_score || 0}</h5>
                                                </div>
                                                <div className="mb-1">

                                                    <label htmlFor="product_name" className="form-label fw-semibold">
                                                        Loan Status<span className="text-danger ms-1"></span>
                                                    </label>

                                                    <div className="input-group border rounded-1">

                                                        {/* <select
                                                            className="form-control ps-2"
                                                            autoComplete="nope"
                                                            style={{ fontWeight: '600' }}
                                                            {...register('loan_status', { required: "Enter gender", })}>
                                                           
                                                            {selectOption(ALLSTATUS_LIST)}
                                                        </select> */}

                                                        <select
                                                            className="form-control ps-2"
                                                            autoComplete="nope"
                                                            style={{ fontWeight: '600' }}
                                                            {...register('loan_status', {
                                                                required: "Enter status",
                                                                onChange: (e) => changeStatusFunction(e.target.value),
                                                            })}
                                                        >
                                                            {/* <option value="">Select Status</option> */}
                                                            {selectOption(ALLSTATUS_FILTER_LIST)}
                                                        </select>
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">{errors.loan_status?.message}</label>
                                                </div>

                                            </div>
                                        </div>

                                        {watch('loan_status') === 'APPROVED' && (<>

                                            <div className="mb-1">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <label htmlFor="product_name" className="form-label fw-semibold mb-0">
                                                        Applied Amount <span className="text-danger ms-1"></span>
                                                    </label>

                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-primary py-0 px-2"
                                                        onClick={() => setIsEditable(!isEditable)}
                                                    >
                                                        {isEditable ? "Cancel" : "Edit"}
                                                    </button>
                                                </div>

                                                <div className="input-group border rounded-1 mt-1">
                                                    <input
                                                        type="number"
                                                        className="form-control ps-2"
                                                        placeholder="Applied Amount"
                                                        autoComplete="off"
                                                        disabled={!isEditable}
                                                        {...register("applied_amount", { required: "Enter applied amount" })}
                                                    />
                                                </div>

                                                <label className="errorc ps-1 pt-1">
                                                    {errors?.applied_amount?.message}
                                                </label>
                                            </div>
                                            <div className="mb-1">
                                                <label htmlFor="product_name" className="form-label fw-semibold">
                                                    Approved Amount <span className="text-danger ms-1"> *</span>
                                                </label>
                                                <div className="input-group border rounded-1">
                                                    {/* <input
                                                        type="text"
                                                        className="form-control ps-2"
                                                        placeholder="Approved Loan"
                                                        autoComplete='nope'
                                                        name='approved_amount'
                                                        // {...register('category_ara', { required: "Enter category arabic" })}
                                                        // {...register('approved_amount', { required: "Enter approved amount" })}
                                                        {...register('approved_amount', {
                                                            required: "Enter approved amount",
                                                            validate: (value) => {
                                                                const appliedAmount = parseFloat(watch('applied_amount'));
                                                                const approvedAmount = parseFloat(value);
                                                                if (isNaN(appliedAmount) || isNaN(approvedAmount)) return true; // Skip if either is not a valid number
                                                                return approvedAmount <= appliedAmount || "Approved Amount must be less than Applied Amount";
                                                            }
                                                        })}
                                                        onChange={(e) => handleInputChange('approved_amount', e.target.value)}
                                                        maxLength={10}
                                                    /> */}
                                                    <input
                                                        type="number"
                                                        className="form-control ps-2"
                                                        placeholder="Approved Loan"
                                                        autoComplete="nope"
                                                        name="approved_amount"
                                                        {...register('approved_amount', {
                                                            required: "Enter approved amount",
                                                            validate: (value) => {
                                                                const appliedAmount = parseFloat(watch('applied_amount'));
                                                                const approvedAmount = parseFloat(value);

                                                                if (isNaN(appliedAmount) || isNaN(approvedAmount)) return true; // Skip if not a number

                                                                if (approvedAmount < 10000) {
                                                                    return "Approved Amount must be greater than ₹10,000";
                                                                }

                                                                if (approvedAmount > 500000) {
                                                                    return "Approved Amount cannot exceed ₹500,000";
                                                                }

                                                                return approvedAmount <= appliedAmount || "Approved Amount must be less than Applied Amount";
                                                            }
                                                        })}
                                                        onChange={(e) => handleInputChange('approved_amount', e.target.value)}
                                                        max={500000}
                                                        min={0}
                                                        step="1"
                                                    />

                                                </div>
                                                <label className="errorc ps-1 pt-1">
                                                    {errors?.approved_amount?.message}
                                                </label>
                                            </div>

                                            <div className="mb-1">
                                                <label htmlFor="product_name" className="form-label fw-semibold">
                                                    Interest Rate<span className="text-danger ms-1">(in %) *</span>
                                                </label>

                                                <div className='flex d-flex  justify-content-between align-items-center'>
                                                    {
                                                        (<>
                                                            <div className="input-group border rounded-1 me-2">
                                                                <input
                                                                    type="number"
                                                                    className="form-control ps-2"
                                                                    placeholder="Enter interest rate"
                                                                    autoComplete='nope'
                                                                    min={0}
                                                                    max={100}
                                                                    step="0.01"
                                                                    disabled
                                                                    {...register('interest_rate', {
                                                                        required: "Enter interest rate",
                                                                        min: {
                                                                            value: 0,
                                                                            message: "Minimum value is 0",
                                                                        },
                                                                        max: {
                                                                            value: 100,
                                                                            message: "Maximum value is 100",
                                                                        },
                                                                    })}
                                                                />
                                                            </div>
                                                            {
                                                                isCustom && <>
                                                                    <div className="input-group border rounded-1 me-2">
                                                                        <input
                                                                            type="number"
                                                                            className="form-control ps-2"
                                                                            placeholder="Enter custom interest rate"
                                                                            autoComplete='nope'
                                                                            min={0}
                                                                            max={100}
                                                                            step="0.01"
                                                                            {...register('custom_rate_percentage', {
                                                                                required: "Enter custom interest rate",
                                                                                min: {
                                                                                    value: 0,
                                                                                    message: "Minimum value is 0",
                                                                                },
                                                                                max: {
                                                                                    value: 100,
                                                                                    message: "Maximum value is 100",
                                                                                },
                                                                            })}
                                                                        />
                                                                    </div>
                                                                </>
                                                            }
                                                        </>)
                                                    }

                                                    <div className="justify-content-center gap-2">
                                                        <button type="button" className="btn btn-primary " onClick={() => { setIsCustom(!isCustom) }}> {isCustom ? 'Cancel' : 'Custom'}</button>
                                                    </div>

                                                </div>

                                                {isCustom ? <label className="errorc ps-1 pt-1">
                                                    {errors?.custom_rate_percentage?.message}
                                                </label> :
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors?.interest_rate?.message}
                                                    </label>
                                                }
                                            </div>

                                            <div className="mb-1">
                                                <label htmlFor="product_name" className="form-label fw-semibold">
                                                    Processing Fee<span className="text-danger ms-1">(in %) *</span>
                                                </label>

                                                <div className='flex d-flex  justify-content-between align-items-center'>
                                                    {
                                                        (<>
                                                            <div className="input-group border rounded-1 me-2">
                                                                <input
                                                                    type="number"
                                                                    className="form-control ps-2"
                                                                    placeholder="Enter processing fee"
                                                                    autoComplete='nope'
                                                                    min={0}
                                                                    max={100}
                                                                    step="0.01"
                                                                    disabled
                                                                    {...register('processing_fee', {
                                                                        required: "Enter processing fee",
                                                                        min: {
                                                                            value: 0,
                                                                            message: "Minimum value is 0",
                                                                        },
                                                                        max: {
                                                                            value: 100,
                                                                            message: "Maximum value is 100",
                                                                        },
                                                                    })}
                                                                />
                                                            </div>

                                                            {
                                                                isProcessingCustom && <>
                                                                    <div className="input-group border rounded-1 me-2">
                                                                        <input
                                                                            type="number"
                                                                            className="form-control ps-2"
                                                                            placeholder="Enter custom processing fee"
                                                                            autoComplete='nope'
                                                                            min={0}
                                                                            max={100}
                                                                            step="0.01"
                                                                            {...register('custom_processing_fee', {
                                                                                required: "Enter custom processing fee",
                                                                                min: {
                                                                                    value: 0,
                                                                                    message: "Minimum value is 0",
                                                                                },
                                                                                max: {
                                                                                    value: 100,
                                                                                    message: "Maximum value is 100",
                                                                                },
                                                                            })}
                                                                        />
                                                                    </div>
                                                                </>
                                                            }
                                                        </>)
                                                    }
                                                    <div className="justify-content-center gap-2">
                                                        <button type="button" className="btn btn-primary " onClick={() => { setIsProcessingCustom(!isProcessingCustom) }}> {isProcessingCustom ? 'Cancel' : 'Custom'}</button>
                                                    </div>
                                                </div>

                                                {isCustom ? <label className="errorc ps-1 pt-1">
                                                    {errors?.custom_processing_fee?.message}
                                                </label> :
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors?.processing_fee?.message}
                                                    </label>
                                                }
                                            </div>

                                            {/* <div className="mb-1">
                                                <label htmlFor="product_name" className="form-label fw-semibold">
                                                    Tenure<span className="text-danger ms-1">(in Months) *</span>
                                                </label>
                                                <div className="input-group border rounded-1 me-2">
                                                    <select
                                                        id="gender1"
                                                        className="form-control ps-2 p-2"
                                                        autoComplete="nope"
                                                        {...register('loan_tenure', {
                                                            required: "Select loan tenure",
                                                        })}
                                                    >
                                                        {TENURE_LIST?.length > 0 && TENURE_LIST?.map((tenure) => (
                                                            <option key={tenure.id} value={tenure.value}>
                                                                {tenure.key}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <label className="errorc ps-1 pt-1">
                                                    {errors?.loan_tenure?.message}
                                                </label>
                                            </div> */}

                                            <div className="mb-1">
                                                <label htmlFor="product_name" className="form-label fw-semibold">
                                                    Tenure<span className="text-danger ms-1">(in Months) *</span>
                                                </label>

                                                <div className='flex d-flex  justify-content-between align-items-center'>
                                                    <div className="input-group border rounded-1 me-2">
                                                        {/* <input
                                                            type="number"
                                                            className="form-control ps-2"
                                                            placeholder="Select loan tenure"
                                                            autoComplete='nope'
                                                            step="1"
                                                            min={12}
                                                            max={350}
                                                            {...register("loan_tenure", {
                                                                required: "Select loan tenure",
                                                                min: {
                                                                    value: 12,
                                                                    message: "Minimum value is 12",
                                                                },
                                                                max: {
                                                                    value: 350,
                                                                    message: "Maximum value is 350",
                                                                },
                                                                validate: (value) =>
                                                                    Number.isInteger(Number(value)) || "Only whole numbers allowed",
                                                            })}
                                                        /> */}
                                                        <input
                                                            type="number"
                                                            className="form-control ps-2"
                                                            placeholder="Select loan tenure (12, 18, 24, ... up to 350)"
                                                            autoComplete="off"
                                                            min={12}
                                                            max={36}
                                                            // step={6} // shows steps when user uses arrows
                                                            {...register("loan_tenure", {
                                                                required: "Select loan tenure",
                                                                min: {
                                                                    value: 12,
                                                                    message: "Minimum allowed tenure is 12 months",
                                                                },
                                                                max: {
                                                                    value: 36,
                                                                    message: "Maximum allowed tenure is 36 months",
                                                                },
                                                                validate: (value) => {
                                                                    if (value % 6 !== 0) {
                                                                        return "Only multiples of 6 are allowed (12, 18, 24, ... 36)";
                                                                    }
                                                                    return true;
                                                                },
                                                            })}
                                                        />
                                                    </div>
                                                    {/* {
                                                        (<>
                                                            <div className="input-group border rounded-1 me-2">
                                                                <select
                                                                    id="gender1"
                                                                    className="form-control ps-2 p-2"
                                                                    autoComplete="nope"
                                                                    {...register('loan_tenure', {
                                                                        required: "Select loan tenure",
                                                                    })}
                                                                >
                                                                    {TENURE_LIST?.length > 0 && TENURE_LIST?.map((tenure) => (
                                                                        <option key={tenure.id} value={tenure.value}>
                                                                            {tenure.key}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                            {
                                                                isTenureCustom && <>
                                                                    <div className="input-group border rounded-1 me-2">
                                                                        <input
                                                                            type="number"
                                                                            className="form-control ps-2"
                                                                            placeholder="Enter custom loan tenure"
                                                                            autoComplete='nope'
                                                                            min={12}
                                                                            max={100}
                                                                            step="0.01"
                                                                            {...register('custom_loan_tenure', {
                                                                                required: "Enter custom loan tenure",
                                                                                min: {
                                                                                    value: 12,
                                                                                    message: "Minimum value is 12",
                                                                                },
                                                                                max: {
                                                                                    value: 100,
                                                                                    message: "Maximum value is 100",
                                                                                },
                                                                            })}
                                                                        />
                                                                    </div>
                                                                </>
                                                            }
                                                        </>)
                                                    } */}
                                                </div>
                                                <label className="errorc ps-1 pt-1">
                                                    {errors?.loan_tenure?.message}
                                                </label>
                                            </div>
                                        </>)}

                                        <div className='row d-flex gap-3'>
                                            <div className='col'>
                                                <div className="mb-1">
                                                    <label htmlFor="remarks" className="form-label fw-semibold">Remarks <span className="text-danger ms-1"> *</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <textarea
                                                            id="remarks"
                                                            className="form-control p-3 ps-2"
                                                            placeholder="Enter remarks"
                                                            {...register('remarks', { required: "Enter remarks" })}
                                                        ></textarea>
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">{errors.remarks?.message}</label>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="modal-footer justify-content-center">
                                            <button type="button" className="btn btn-danger" onClick={() => { setStatusModal(false); reset(); setIsCustom(false); setIsProcessingCustom(false); setSelecteLoan(null) }}>Cancel</button>
                                            <button type="submit" className="btn btn-primary">Submit</button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div >
            {
                statusModal && (
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


