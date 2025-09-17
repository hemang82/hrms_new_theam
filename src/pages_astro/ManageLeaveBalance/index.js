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
import { getCustomerListThunk, getAllLoanListThunk, setLoader, updateLoanList, getProcessingFeeListThunk, getSalaryListThunk, getlistLeavesThunk, updateLeaveList, getEmpLeaveBalanceListThunk, updateLeaveBalanceList } from '../../Store/slices/MasterSlice';
import Constatnt, { AwsFolder, Codes, ModelName, SEARCH_DELAY } from '../../config/constant';
import useDebounce from '../hooks/useDebounce';
import { closeModel, formatDate, formatDateDyjs, formatIndianPrice, getFileNameFromUrl, getLoanStatusObject, openModel, selectOption, selectOptionCustomer, truncateWords } from '../../config/commonFunction';
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

export default function ManageLeaveBalance() {

    let navigat = useNavigate();
    const dispatch = useDispatch();

    const dateFormat = 'YYYY-MM-DD';

    const [totalRows, setTotalRows] = useState(0);

    const [checked, setChecked] = useState('');
    const [is_load, setis_load] = useState(false);

    const { empLeaveBalanceList: { data: empLeaveBalanceList } } = useSelector((state) => state.masterslice);
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
    const [updatedLeaveLeast, setupdatedLeavList] = useState(empLeaveBalanceList);
    const [employeeStatus, setEmployeeStatus] = useState(EMPLOYEE_STATUS[0]);


    useEffect(() => {
        const request = {
            emp_leave_company: employeeStatus?.key,
        };
        if (empLeaveBalanceList?.length === 0) {
            dispatch(getEmpLeaveBalanceListThunk(request))
        }
        if (customerList?.length === 0) {
            dispatch(getCustomerListThunk({ emp_leave_company: EMPLOYEE_STATUS[0]?.key }));
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

        const filteredList = empLeaveBalanceList?.filter((item) => {

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
    }, [empLeaveBalanceList, endDate, selectedOption]);


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
                let updatedList = empLeaveBalanceList?.map((item) => {
                    if (data[AstroInputTypesEnum?.EMPLOYEE] == item.id) {
                        return {
                            ...item,
                            casual: data[AstroInputTypesEnum?.LEAVE_TYPE] == "casual" ? Number(item?.casual || 0) + Number(data[AstroInputTypesEnum?.LEAVE_BALANCE] || 0) : item?.casual,
                            compoff: data[AstroInputTypesEnum?.LEAVE_TYPE] == "compoff" ? Number(item?.compoff || 0) + Number(data[AstroInputTypesEnum?.LEAVE_BALANCE] || 0) : item?.compoff,
                            total_balance: Number(item?.total_balance || 0) + Number(data[AstroInputTypesEnum?.LEAVE_BALANCE] || 0),
                        };
                    }
                    return item;
                });
                dispatch(updateLeaveBalanceList(updatedList))
                reset()
                TOAST_SUCCESS(response?.message);
                closeLeaveModelFunc()
                dispatch(getlistLeavesThunk({}))
                dispatch(setLoader(true))
            } else {
                TOAST_ERROR(response?.message)
                dispatch(setLoader(true))
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

    const funcStatusChange = (rowData) => {
        openLeaveModelFunc()
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
        const statusExists = selectedLeave?.status === data;
        setValue('remarks', statusExists ? selectedLeave?.remarks : '')
        const bankDetails = selectedLeave?.bank_accounts[0]
        const approvalDetails = selectedLeave?.approval_details[0]
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
                emp_leave_company: data?.key,
            };
            await dispatch(getEmpLeaveBalanceListThunk(request));
        } finally {
        }
    };
    return (
        <>
            {/* <Slidebar /> */}
            {/* <div className="body-wrapper"> */}
            {/* <Header /> */}

            <div className="container-fluid mw-100">
                <SubNavbar title={"Leave Balance List"} header={'Leave Balance List'} />

                <div className="widget-content searchable-container list">

                    <div className="card card-body p-3 mb-2">
                        <div className="row">
                            {/* Search Input */}
                            <div className="col-12 col-md-6 col-lg-3 mb-3 mb-md-0">
                                <div className="position-relative">
                                    <input
                                        type="text"
                                        className="form-control product-search ps-5"
                                        id="input-search"
                                        placeholder="Search leave balance ..."
                                        value={globalFilterValue}
                                        onChange={onGlobalFilterChange}
                                    />
                                    <i className="ti ti-search position-absolute top-50 start-0 translate-middle-y fs-6 text-dark ms-3" />
                                </div>
                            </div>

                            <div className="col-12 col-md-6 col-lg-5 mb-3 mb-md-0">
                            </div>

                            {/* Status Dropdown */}
                            <div className="col-12 col-md-6 col-lg-2 mb-3 mb-md-0">
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

                            {/* Add Employee Button */}
                            <div className="col-12 col-md-6 col-lg-2">
                                <div className="d-flex justify-content-end">
                                    <Link
                                        // to="/user_list/add_user"
                                        id="btn-add-contact"
                                        className="btn btn-info d-flex align-items-center justify-content-center w-100 w-md-auto"
                                        style={{ height: '40px' }}
                                        onClick={() => { funcStatusChange() }}

                                    >
                                        <span className="me-1">
                                            <IoAddCircleOutline style={{ fontSize: '1.2rem' }} />
                                        </span>
                                        <span className="fw-semibold">Add Balance</span>
                                    </Link>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="card card-body">
                        <div className="table-responsive">
                            <DataTable
                                value={updatedLeaveLeast?.length > 0 ? updatedLeaveLeast : []}
                                paginator
                                rows={20}
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
                                emptyMessage={<span style={{ textAlign: 'center', display: 'block' }}>Leave Balance Not Found.</span>}>

                                <Column
                                    field="id"
                                    header="Id"
                                    style={{ minWidth: '4rem' }}
                                    body={(rowData, options) => options?.rowIndex + 1}
                                    showFilterMenu={true}
                                    sortable
                                />

                                <Column field="employee_id" header="Employee ID" style={{ minWidth: '10rem', textTransform: 'capitalize' }} body={(rowData) => (
                                    <span className=' me-2'>{truncateWords(rowData.employee_id) || '-'} </span>
                                )} />

                                <Column field="name" header="Name" style={{ minWidth: '12rem', textTransform: 'capitalize' }} body={(rowData) => (
                                    <span className='me-2'>{truncateWords(rowData.name) || '-'} </span>
                                )} />

                                {/* <Column field="start_date" header="From" style={{ minWidth: '6rem' }} body={(rowData) => (
                                    <span className='me-2'>{formatDate(rowData.start_date, DateFormat?.DATE_WEEK_MONTH_NAME_FORMAT) || '-'} </span>
                                )} />

                                <Column field="end_date" header="To" style={{ minWidth: '6em' }} body={(rowData) => (
                                    <span className='me-2'>{formatDate(rowData.end_date, DateFormat?.DATE_WEEK_MONTH_NAME_FORMAT) || '-'} </span>
                                )} /> */}

                                <Column field="casual" header="Casual Leave" style={{ minWidth: '8rem' }} body={(rowData) => (
                                    <span className='ms-5 me-2'>{rowData?.casual || '-'} </span>
                                )} />

                                <Column field="compoff" header="Compoff Leave" style={{ minWidth: '8rem' }} body={(rowData) => (
                                    <span className='ms-5 me-2'>{rowData?.compoff || '-'}</span>
                                )} />

                                <Column field="total_balance" header="Total Leave" style={{ minWidth: '8rem' }} body={(rowData) => (
                                    <span className='ms-4 me-2'>{rowData?.total_balance || '0'}</span>
                                )} />

                            </DataTable>

                            <div className=''>
                                <Pagination per_page={50 || perPage} pageCount={empLeaveBalanceList?.total_count} onPageChange={onPageChange} page={page} />
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
                            <h6 className="modal-title text-dark fs-5">{'Add Leave Balance'} </h6>
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
                                                            <option value="">Select employee</option>
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
        </>
    )
}


