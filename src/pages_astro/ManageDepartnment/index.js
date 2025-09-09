import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../layout/Header';
import Slidebar from '../../layout/Slidebar';
import $, { data } from 'jquery';
import 'datatables.net-bs5';
import 'datatables.net-responsive-bs5';
import SubNavbar from '../../layout/SubNavbar';
import { updateLoanDetails, loanDetails, addDisbursementLoan, addLeaves, approvedRejectLeaves, addBankDetails, deleteBankDetails, addDepartnment, editDepartnment, deleteDepartnment } from '../../utils/api.services';
import { ExportToCSV, ExportToExcel, ExportToPdf, SWIT_DELETE, SWIT_DELETE_SUCCESS, SWIT_FAILED, TOAST_ERROR, TOAST_SUCCESS } from '../../config/common';
import profile_image from '../../assets/Images/default.jpg'
import ReactDatatable from '../../config/ReactDatatable';
import { Helmet } from 'react-helmet';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { getCustomerListThunk, getAllLoanListThunk, setLoader, updateLoanList, getProcessingFeeListThunk, getSalaryListThunk, getlistLeavesThunk, updateLeaveList, getEmpLeaveBalanceListThunk, updateLeaveBalanceList, getListBankDetailsThunk, updateBankDetailsList, getListDepartnmentThunk, updateDepartnmentList } from '../../Store/slices/MasterSlice';
import Constatnt, { AwsFolder, Codes, ModelName, SEARCH_DELAY } from '../../config/constant';
import useDebounce from '../hooks/useDebounce';
import { closeModel, formatDate, formatDateDyjs, formatIndianPrice, getFileNameFromUrl, getLoanStatusObject, openModel, selectOption, selectOptionCustomer, textInputValidation, truncateWords } from '../../config/commonFunction';
import Model from '../../component/Model';
import { DeleteComponent } from '../CommonPages/CommonComponent';
import Pagination from '../../component/Pagination';
import { AstroInputTypesEnum, DateFormat, InputRegex, LEAVE_TYPE_LIST, PAYMENT_STATUS, STATUS_COLORS } from '../../config/commonVariable';
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

export default function ManageDepartnment() {

    let navigat = useNavigate();
    const dispatch = useDispatch();

    const dateFormat = 'YYYY-MM-DD';

    const [is_load, setis_load] = useState(false);
    const [selectedUser, setSelectedUser] = useState()

    const { departnmentList: { data: departnmentList } } = useSelector((state) => state.masterslice);
    const { customerList: { data: customerList }, } = useSelector((state) => state.masterslice);
    const { customModel } = useSelector((state) => state.masterslice);

    const { register, handleSubmit, setValue, clearErrors, reset, watch, trigger, control, formState: { errors } } = useForm();

    const { register: register2, handleSubmit: handleSubmit2, formState: { errors: errors2 }, reset: reset2 } = useForm();

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

    const [selectedBankDetails, setSelectedBankDetails] = useState({})
    const [loading, setLoading] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const debounce = useDebounce(globalFilterValue, SEARCH_DELAY);
    const [filters, setFilters] = useState({ global: { value: '' } });
    const [actionModal, setAction] = useState(false);

    const [selectedOption, setSelectedOption] = useState(ALLSTATUS_LIST[0]);
    const [sortField, setSortField] = useState(null);
    const [sortOrder, setSortOrder] = useState(-1);

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [perPage, setPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [showProofImage, setShowProofImage] = useState(null);
    const [proofFileName, setProofFileName] = useState('');
    const [updatedLeaveLeast, setupdatedLeavList] = useState(departnmentList);

    const [addLeaveModal, setAddLeave] = useState(false);
    const [editLeaveModal, setEditLeave] = useState(false);

    useEffect(() => {
        if (departnmentList?.length === 0) {
            dispatch(getListDepartnmentThunk({}))
        }
        setSelectedOption({})
    }, [addLeaveModal])

    useEffect(() => {
        if (customerList?.length === 0) {
            dispatch(getCustomerListThunk({}));
        }
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

        const filteredList = departnmentList?.filter((item) => {

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

    }, [departnmentList, endDate, selectedOption]);

    const handleStatus = async (data) => {
        console.log('handleStatus dataaa', data);
        setis_load(true)
        let submitData = {
            leaveId: selectedBankDetails?.leave_id,
            status: selectedBankDetails?.actionType === "approved" ? '1' : '2',
            admin_reason: data?.reason ? data?.reason : ""
        }
        approvedRejectLeaves(submitData).then((response) => {
            if (response.code == Codes.SUCCESS) {
                TOAST_SUCCESS(response?.message)
                let updatedList = departnmentList?.map((item) => {
                    if (selectedBankDetails?.leave_id === item.leave_id) {
                        return {
                            ...item,
                            status: selectedBankDetails?.actionType === "approved" ? '1' : '2'
                        };
                    }
                    return item;
                });
                dispatch(updateLeaveList(updatedList))
                setSelectedBankDetails({});
                closeActionModelFunc()
                setis_load(false)
            } else {
                TOAST_ERROR(response.message)
            }
        })
    }

    const handleDelete = (is_true) => {
        if (is_true) {
            dispatch(setLoader(true));
            let submitData = {
                dept_id: selectedUser?.id,
                // is_deleted: 1,
            }
            deleteDepartnment(submitData).then((response) => {
                if (response?.code == Codes?.SUCCESS) {
                    const updatedList = departnmentList?.filter((item) => item.id !== selectedUser?.id)
                    dispatch(updateDepartnmentList(updatedList))
                    closeModel(dispatch)
                    dispatch(setLoader(false))
                    TOAST_SUCCESS(response?.message);
                } else {
                    dispatch(setLoader(false));
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

    // ---------------------------------- Export Data----------------------------------

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
            dept_name: data[AstroInputTypesEnum?.DEPARTMENT],
            total_emp: data[AstroInputTypesEnum?.NO_OF_EMPLOYEE],
        };
        if (editLeaveModal) {
            sendRequest.dept_id = selectedUser?.id;
            editDepartnment(sendRequest).then((response) => {
                if (response?.code == Codes.SUCCESS) {
                    dispatch(setLoader(false))
                    TOAST_SUCCESS(response?.message);
                    closeBankDetailsModelFunc()
                } else {
                    dispatch(setLoader(false))
                    TOAST_ERROR(response?.message)
                }
            })
        } else {

            addDepartnment(sendRequest).then((response) => {
                if (response?.code == Codes.SUCCESS) {
                    dispatch(setLoader(false))
                    TOAST_SUCCESS(response?.message);
                    closeBankDetailsModelFunc()
                } else {
                    dispatch(setLoader(false))
                    TOAST_ERROR(response?.message)
                }
            })
        }
    }

    const openActionModelFunc = (data, action) => {
        setAction(true)
        setSelectedBankDetails({
            ...data,
            actionType: action,
        });
    }

    const closeActionModelFunc = () => {
        setAction(false)
        setSelectedBankDetails({});
    }

    const openBankDetailsModelFunc = () => {
        setAddLeave(true)
    }

    const openEditBankDetailsModelFunc = (data) => {
        setAddLeave(true)
        setEditLeave(true)
        setSelectedUser(data)
        setValue(AstroInputTypesEnum?.DEPARTMENT, data?.dept_name)
        setValue(AstroInputTypesEnum?.NO_OF_EMPLOYEE, data?.total_emp)
    }

    const closeBankDetailsModelFunc = () => {
        setAddLeave(false)
        setEditLeave(false)
        setSelectedUser({})
        reset()
    }

    const funcStatusChange = (rowData) => {
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
        const statusExists = selectedBankDetails?.status === data;
        setValue('remarks', statusExists ? selectedBankDetails?.remarks : '')
        const bankDetails = selectedBankDetails?.bank_accounts[0]
        const approvalDetails = selectedBankDetails?.approval_details[0]
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
        if (key === AstroInputTypesEnum.ACCOUNT_NUMBER) {
            filteredValue = value.replace(InputRegex.ONCHANGE_PANNUMBER_REGEX, '');
        } else if (key === AstroInputTypesEnum.ADHARCARD) {
            filteredValue = value.replace(InputRegex.ONCHANGE_AADHAR_REGEX, '');
        } else if (key === AstroInputTypesEnum.MOBILE || AstroInputTypesEnum?.ANNUAL_INCOME || AstroInputTypesEnum?.DESIRED_LOAN_AMOUNT) {
            filteredValue = value.replace(InputRegex.ONCHANGE_MOBILE_REGEX, '');
        }
        else if (key === AstroInputTypesEnum.MOBILE || AstroInputTypesEnum?.ANNUAL_INCOME || AstroInputTypesEnum?.DESIRED_LOAN_AMOUNT) {
            filteredValue = value.replace(InputRegex.ONCHANGE_MOBILE_REGEX, '');
        }
        setValue(key, filteredValue)
        clearErrors(key);
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

    return (
        <>

            {/* <Slidebar /> */}
            {/* <div className="body-wrapper"> */}
            {/* <Header /> */}

            <div className="container-fluid mw-100">
                <SubNavbar title={"Department List"} header={'Department List'} />

                <div className="widget-content searchable-container list">
                    <div className="card card-body">
                        <div className="row border-bottom pb-3">
                            <div className="col-12 col-md-6 col-lg-3">
                                <div className="position-relative">
                                    <input type="text" className="form-control product-search ps-5" id="input-search" placeholder="Search Department ..."
                                        value={globalFilterValue}
                                        onChange={onGlobalFilterChange} />
                                    <i className="ti ti-search position-absolute top-50 start-0 translate-middle-y fs-6 text-dark ms-3" />
                                </div>
                            </div>

                            <div className="col-12 col-md-6 col-lg-9">
                                <div className="d-flex flex-column flex-md-row justify-content-end align-items-stretch gap-2 ">
                                    <Link
                                        // to="/emi_schedule_list/add_emi_schedule"
                                        id="btn-add-contact"
                                        className="btn btn-info d-flex align-items-center justify-content-center mt-3 mt-md-0  w-md-auto "
                                        style={{ height: '40px' }}
                                        onClick={() => { openBankDetailsModelFunc() }}
                                    >
                                        <span className="me-1">
                                            <IoAddCircleOutline style={{ fontSize: '1.2rem' }} />
                                        </span>
                                        <span className="fw-semibold">Add Department</span>
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
                                emptyMessage={<span style={{ textAlign: 'center', display: 'block' }}>Department Not Found.</span>}>

                                <Column
                                    field="id"
                                    header="Id"
                                    style={{ minWidth: '4rem' }}
                                    body={(rowData, options) => options?.rowIndex + 1}
                                    showFilterMenu={true}
                                    sortable
                                />

                                <Column field="dept_name" header="Department Name	" style={{ minWidth: '8rem' }} body={(rowData) => (
                                    <span className='me-2'>{rowData?.dept_name || '-'} </span>
                                )} />

                                <Column field="total_emp" header="No of Employees" sortable style={{ minWidth: '8rem', textTransform: 'capitalize' }} body={(rowData) => (
                                    <span className='me-2'>{truncateWords(rowData.total_emp) || '-'} </span>
                                )} />

                                <Column field="created_at" header="Create Date" style={{ minWidth: '8rem' }} body={(rowData) => (
                                    <span className='me-2'>{formatDate(rowData.created_at, DateFormat?.DATE_FORMAT) || '-'} </span>
                                )} />

                                {/* <Column field="end_date" header="To" style={{ minWidth: '6em' }} body={(rowData) => (
                                    <span className='me-2'>{formatDate(rowData.end_date, DateFormat?.DATE_WEEK_MONTH_NAME_FORMAT) || '-'} </span>
                                )} /> */}

                                <Column field="statuss" header="Action" style={{ minWidth: '10rem' }} body={(rowData) => (
                                    <div className="action-btn">
                                        <a className="text-info edit cursor_pointer cursor_pointer" onClick={() => { openEditBankDetailsModelFunc(rowData) }} >
                                            <i class="ti ti-edit fs-7"></i>
                                        </a>
                                        <a className="text-dark delete ms-2 cursor_pointer cursor_pointer" onClick={() => { openModel(dispatch, ModelName.DELETE_MODEL); setSelectedUser(rowData) }}>
                                            <i className="ti ti-trash fs-7 text-danger" />
                                        </a>
                                    </div>
                                )} />
                            </DataTable>

                            <div className=''>
                                <Pagination per_page={50 || perPage} pageCount={departnmentList?.total_count} onPageChange={onPageChange} page={page} />
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <div className={`modal custom-modal  ${addLeaveModal ? "fade show d-block " : "d-none"}`}
                id="addnotesmodal" tabIndex={-1} role="dialog" aria-labelledby="addnotesmodalTitle" aria-hidden="true">
                <div className="modal-dialog modal-md modal-dialog-centered" role="document" >
                    <div className="modal-content border-0">

                        <div className="modal-header bg-primary" style={{ borderRadius: '10px 10px 0px 0px' }}>
                            <h6 className="modal-title text-dark fs-5">{editLeaveModal ? 'Edit Department' : 'Add Department'} </h6>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" onClick={() => { closeBankDetailsModelFunc() }} />
                        </div>

                        <div className="modal-body">
                            <form onSubmit={handleSubmit(onSubmitData)}>
                                <div className="col-lg-12">
                                    <div className="card-body p-4">
                                        <div className="row g-3">

                                            <div className="">
                                                <label htmlFor="lastname" className="form-label fw-semibold">
                                                    Department Name<span className="text-danger ms-1">*</span>
                                                </label>
                                                <div className="input-group border rounded-1">
                                                    <input
                                                        type="text"
                                                        className="form-control ps-2"
                                                        placeholder="Enter Department Name"
                                                        autoComplete='nope'
                                                        {...register(AstroInputTypesEnum.DEPARTMENT, textInputValidation(AstroInputTypesEnum.DEPARTMENT, 'Enter Department Name'))}
                                                    />
                                                </div>
                                                <label className="errorc ps-1 pt-1">
                                                    {errors[AstroInputTypesEnum.DEPARTMENT]?.message}
                                                </label>
                                            </div>

                                            <div className="">
                                                <label htmlFor="lastname" className="form-label fw-semibold">
                                                    No of Employees<span className="text-danger ms-1">*</span>
                                                </label>
                                                <div className="input-group border rounded-1">
                                                    <input
                                                        type="number"
                                                        className="form-control ps-2"
                                                        placeholder="Enter No of Employees"
                                                        autoComplete='nope'
                                                        {...register(AstroInputTypesEnum.NO_OF_EMPLOYEE, textInputValidation(AstroInputTypesEnum.NO_OF_EMPLOYEE, 'Enter No of Employees'))}
                                                    />
                                                </div>
                                                <label className="errorc ps-1 pt-1">
                                                    {errors[AstroInputTypesEnum.NO_OF_EMPLOYEE]?.message}
                                                </label>
                                            </div>
                                            <div className="modal-footer justify-content-center">
                                                <button type="button" className="btn btn-danger" onClick={() => { closeBankDetailsModelFunc() }}>Cancel</button>
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


