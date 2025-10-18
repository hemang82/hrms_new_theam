import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../../layout/Header';
import Slidebar from '../../../layout/Slidebar';
import $ from 'jquery';
import 'datatables.net-bs5';
import 'datatables.net-responsive-bs5';
import SubNavbar from '../../../layout/SubNavbar';
import { updateLoanDetails, loanDetails, addDisbursementLoan, addLeaves, approvedRejectLeaves, deleteLeavesRequest, listLeavesRequestAcceptReject } from '../../../utils/api.services';
import { ExportToCSV, ExportToExcel, ExportToPdf, SWIT_DELETE, SWIT_DELETE_SUCCESS, SWIT_FAILED, TOAST_ERROR, TOAST_SUCCESS } from '../../../config/common';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { getDailyTaskListThunk, getAllLoanListThunk, setLoader, updateLoanList, getProcessingFeeListThunk, getSalaryListThunk, getlistLeavesThunk, updateLeaveList, getUserDetailsThunk, getlistLeavesRequestThunk, updateLeaveRequestList } from '../../../Store/slices/MasterSlice';
import Constatnt, { AwsFolder, Codes, ModelName, SEARCH_DELAY } from '../../../config/constant';
import useDebounce from '../../hooks/useDebounce';
import { closeModel, disableFutureDates, formatDate, formatDateDyjs, formatIndianPrice, getFileNameFromUrl, getLoanStatusObject, getLocalStorageItem, momentNormalDateFormat, openModel, QuillContentRowWise, selectOption, selectOptionCustomer, textInputValidation, truncateWords } from '../../../config/commonFunction';
import Model from '../../../component/Model';
import { DeleteComponent } from '../../CommonPages/CommonComponent';
import Pagination from '../../../component/Pagination';
import { AstroInputTypesEnum, DateFormat, EMPLOYEE_STATUS, InputRegex, LEAVE_TYPE_LIST, PAYMENT_STATUS, STATUS_COLORS } from '../../../config/commonVariable';
import { RiDeleteBinLine, RiUserReceivedLine } from 'react-icons/ri';
import { Controller, useForm } from 'react-hook-form';
import { DatePicker, ConfigProvider } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import 'dayjs/locale/en'; // or your locale
import { IoAddCircleOutline } from 'react-icons/io5';
import { uploadImageOnAWS } from '../../../utils/aws.service';
import { PATHS } from '../../../Router/PATHS';
import { BsQuestionOctagon } from 'react-icons/bs';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import ReactQuill from 'react-quill';
import "react-quill/dist/quill.snow.css";
import moment from 'moment';

export default function ManageCoustomer() {

    let navigat = useNavigate();
    const dispatch = useDispatch();

    const dateFormat = 'YYYY-MM-DD';

    const [totalRows, setTotalRows] = useState(0);

    const [checked, setChecked] = useState('');
    const [is_load, setis_load] = useState(false);

    const { leaveRequestList: { data: leaves } } = useSelector((state) => state.masterslice);
    const { customModel } = useSelector((state) => state.masterslice);
    // const { userDetails: { data: userDetails }, } = useSelector((state) => state.masterslice);

    const { register, handleSubmit, setValue, clearErrors, reset, watch, trigger, control, formState: { errors } } = useForm();

    const { register: register2, handleSubmit: handleSubmit2, formState: { errors: errors2 }, reset: reset2 } = useForm();

    const ALLSTATUS_LIST = [
        { key: "", value: "ALL STATUS" },
        { key: 0, value: "Pending" },
        { key: 1, value: "Approved" },
        { key: 2, value: "Rejected" },
    ];

    const [selectedLeave, setSelecteLeave] = useState({})
    const [loading, setLoading] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const debounce = useDebounce(globalFilterValue, SEARCH_DELAY);
    const [filters, setFilters] = useState({ global: { value: '' } });
    const [addLeaveRequestModal, setAddRequestLeave] = useState(false);
    const [actionModal, setAction] = useState(false);
    const [isLeaveRequestEdit, setIsLeaveRequestEdit] = useState(false)
    const [viewModel, setViewModel] = useState(false);

    const [selectedOption, setSelectedOption] = useState(ALLSTATUS_LIST[0]);
    const [sortField, setSortField] = useState(null);
    const [sortOrder, setSortOrder] = useState(-1);

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [perPage, setPerPage] = useState(10);
    const [page, setPage] = useState(1);

    const [updatedLeaveLeast, setupdatedLeavList] = useState(leaves?.length > 0 ? leaves : []);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    useEffect(() => {
        const request = {
            emp_leave_company: EMPLOYEE_STATUS[0]?.key,
        };
        // if (leaves?.length == 0) {
        //     dispatch(getlistLeavesRequestThunk(request));
        // }
        setSelectedOption({})
    }, [])

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

        const filteredList = leaves?.length > 0 ? (leaves?.filter((item) => {

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
        })) : [];
        setupdatedLeavList(filteredList);
    }, [leaves, endDate, selectedOption]);

    const handleStatus = async (data) => {
        dispatch(setLoader(true));
        setis_load(true);
        try {
            let submitData = {
                leaveId: selectedLeave?.leave_id,
                status: selectedLeave?.actionType === "approved" ? '1' : '2',
                admin_reason: data?.reason ? data?.reason : ""
            };
            const response = await approvedRejectLeaves(submitData);
            if (response && response.code === Codes.SUCCESS) {
                TOAST_SUCCESS(response.message || "Success");

                const updatedList = leaves?.map((item) => {
                    if (selectedLeave?.leave_id === item.leave_id) {
                        return {
                            ...item,
                            status: selectedLeave?.actionType === "approved" ? '1' : '2',
                            admin_reason: data?.reason ? data?.reason : ""
                        };
                    }
                    return item;
                });
                // dispatch(getUserDetailsThunk());
                dispatch(updateLeaveList(updatedList));
                setSelecteLeave({});
                closeActionModelFunc();
            } else {
                // Handle response error
                const errorMsg = (response && response.message)
                    ? response.message
                    : "Something went wrong while updating status.";
                TOAST_ERROR(errorMsg);
            }
        } catch (error) {
            console.error("handleStatus error:", error);
            TOAST_ERROR(error?.message || "An unexpected error occurred.");
        } finally {
            // Reset loaders regardless of success or error
            setis_load(false);
            dispatch(setLoader(false));
        }
    };

    const handleDelete = async (is_true) => {
        if (is_true) {
            try {
                dispatch(setLoader(true));

                const submitData = {
                    request_id: selectedLeave?.id,
                    emp_id: selectedLeave?.emp_id,
                    days: "1",
                    status: selectedLeave?.actionType == "approved" ? "1" : "2",
                    date: momentNormalDateFormat(selectedLeave?.date, DateFormat?.DATE_FORMAT, DateFormat?.DATE_DASH_TIME_FORMAT)
                };

                const response = await listLeavesRequestAcceptReject(submitData);

                if (response.code == Codes?.SUCCESS) {
                    dispatch(getlistLeavesRequestThunk({
                        action: "admin"
                    }))
                    // const updatedList = leaves?.filter(
                    //     (item) => item.id !== selectedLeave?.id
                    // );
                    // dispatch(
                    //     updateLeaveRequestList({
                    //         ...leaves,
                    //         loan_applications: updatedList,
                    //     })
                    // );

                    TOAST_SUCCESS(response?.message);
                } else {
                    TOAST_ERROR(response?.message || "Something went wrong!");
                }
            } catch (error) {
                console.error("Delete leave error:", error);
                TOAST_ERROR("Failed to delete leave. Please try again.");
                closeModel(dispatch);
                setAction(false)
            } finally {
                closeModel(dispatch);
                setAction(false)
                dispatch(setLoader(false));
            }
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
        dispatch(setLoader(true))

        let sendRequest = {
            date: momentNormalDateFormat(data[AstroInputTypesEnum.DATE], DateFormat?.DATE_FORMAT, DateFormat?.DATE_DASH_TIME_FORMAT),
            // leave_type: data[AstroInputTypesEnum?.LEAVE_TYPE],
            leave_day: data[AstroInputTypesEnum.LEAVE_DAY],
            reason: data[AstroInputTypesEnum.REASON],
        };
        console.log('emp_leave_company: EMPLOYEE_STATUS[0]?.key,', sendRequest);

        // addLeavesRequest(sendRequest).then((response) => {
        //     if (response?.code == Codes.SUCCESS) {
        //         TOAST_SUCCESS(response?.message);
        //         dispatch(getlistLeavesRequestThunk({ emp_leave_company: EMPLOYEE_STATUS[0]?.key }))
        //         closeLeaveRequestModelFunc()
        //         dispatch(setLoader(false))
        //         reset()
        //     } else {
        //         dispatch(setLoader(false))
        //         TOAST_ERROR(response?.message)
        //     }
        // })
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

    const openLeaveRequestModelFunc = () => {
        setAddRequestLeave(true)
    }

    const closeLeaveRequestModelFunc = () => {
        setAddRequestLeave(false)
    }

    const openViewModelFunc = (data) => {
        setSelecteLeave(data);
        setViewModel(true)
    }

    const closeViewModelFunc = () => {
        setViewModel(false)
        setSelecteLeave({});
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
                <SubNavbar title={"Comp Off Request"} header={'Comp Off Request'} />

                <div className="widget-content searchable-container list">
                    {/* --------------------- start Contact ---------------- */}
                    {
                        selectedEmployee &&
                        <div className="col-12 justify-content-center">
                            <div className="card  ">
                                <div className="p-3 row_2">
                                    <div className="row">
                                        {[
                                            { label: "Casual Leave", value: selectedEmployee?.casual },
                                            { label: "Compoff Leave", value: selectedEmployee?.compoff },
                                            {
                                                label: "Total Leave",
                                                value:
                                                    (Number(selectedEmployee?.casual) || 0) +
                                                    (Number(selectedEmployee?.compoff) || 0)
                                            }
                                        ].map((item, index) => (
                                            <div className='col-12 col-sm-6 col-md-3 col-lg-4 attendance_card'>
                                                <div key={index} className="card border-1 zoom-in them-light shadow-sm">
                                                    <div className="p-2 text-center">
                                                        <p className="fw-semibold fs-4 text-custom-theam">{item.label}</p>
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
                        </div>
                    }

                    <div className="card card-body mb-2 p-3">
                        <div className="row g-2">

                            {/* Search Bar */}
                            <div className="col-12 col-md-6 col-lg-4">
                                <div className="position-relative mt-2 w-75">
                                    <input
                                        type="text"
                                        className="form-control ps-5  "
                                        id="input-search"
                                        placeholder="Search Comp Off Request ..."
                                        value={globalFilterValue}
                                        onChange={onGlobalFilterChange}
                                    />
                                    <i className="ti ti-search position-absolute top-50 start-0 translate-middle-y fs-6 text-dark ms-3" />
                                </div>
                            </div>

                            {/* Start Date */}
                            <div className="col-12 col-md-6 col-lg-2">
                                {/* <label className="d-block mb-1 fw-semibold">Start Date</label>
                                <DatePicker
                                    className="custom-datepicker w-100 p-2"
                                    format={DateFormat?.DATE_FORMAT}
                                    value={startDate}
                                    onChange={(date) => {
                                        setStartDate(date);
                                        setEndDate(null);
                                    }}
                                /> */}
                            </div>

                            {/* End Date */}
                            <div className="col-12 col-md-6 col-lg-2">
                                {/* <label className="d-block mb-1 fw-semibold">End Date</label>
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
                                /> */}
                            </div>

                            <div className="col-12 col-md-6 col-lg-2">
                                {/* <label className="d-block mb-1 fw-semibold">Leave Status</label>
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
                                </div> */}
                            </div>

                            <div className="col-12 col-md-6 col-lg-2 mb-3 mb-md-0">
                                {/* <div className="d-flex justify-content-end mt-2">
                                    <Link
                                        // to={PATHS?.ADD_LEAVE}
                                        id="btn-add-contact"
                                        className="btn btn-info d-flex align-items-center justify-content-center w-100 w-md-auto"
                                        style={{ height: '40px' }}
                                        onClick={() => { openLeaveRequestModelFunc() }}
                                    >
                                        <span className="me-1">
                                            <IoAddCircleOutline style={{ fontSize: '1.2rem' }} />
                                        </span>
                                        <span className="fw-semibold text-nowrap">Add Leave Request</span>
                                    </Link>
                                </div> */}
                            </div>
                        </div>
                    </div>


                    <div className="card p-3">
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
                                />

                                <Column field="name" header="Name" style={{ minWidth: '12rem', textTransform: 'capitalize' }} body={(rowData) => (
                                    <span className='me-2'>{truncateWords(rowData.name) || '-'} </span>
                                )} />

                                <Column field="date" header="Date" style={{ minWidth: '8rem' }} body={(rowData) => (
                                    <span className='me-2'>{formatDate(rowData.date, DateFormat?.DATE_FORMAT) || '-'} </span>
                                )} />

                                <Column field="days" header="Day" style={{ minWidth: '6rem' }} body={(rowData) => (
                                    <span className='me-2'>{rowData?.leave_day_type == 'half' ? '0.5' : '1'} </span>
                                )} />

                                <Column field="created_at" header="Request Date" style={{ minWidth: '9rem' }} body={(rowData) => (
                                    <span className='me-2'>{formatDate(rowData.created_at, DateFormat?.DATE_YEAR_WISE_SLASH_TIME_FORMAT) || '-'} </span>
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

                                {/* <Column field="is_active" data-pc-section="root" header="Status" style={{ minWidth: '6rem' }} body={(rowData) => (
                                    <>
                                        {rowData?.status == 1 ? (
                                            <span className={`p-tag p-component  badge  text-light fw-semibold px-3 rounded-4 py-2 me-2 status_font ${STATUS_COLORS.SUCCESS}`} data-pc-name="tag" data-pc-section="root"  >
                                                <span className="p-tag-value" data-pc-section="value">Approved</span>
                                            </span>
                                        ) : rowData?.status == 2 ? (
                                            <span className={`p-tag p-component  badge  text-light fw-semibold px-3 rounded-4 py-2 me-2 status_font ${STATUS_COLORS.DANGER}`} data-pc-name="tag" data-pc-section="root" >
                                                <span className="p-tag-value" data-pc-section="value">Rejected</span>
                                            </span>
                                        ) : <span className={`p-tag p-component  badge  text-light fw-semibold px-3 rounded-4 py-2 me-2 status_font ${STATUS_COLORS.WARNING}`} data-pc-name="tag" data-pc-section="root" >
                                            <span className="p-tag-value" data-pc-section="value">Pending</span>
                                        </span>
                                        }
                                    </>
                                )} /> */}

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
                                                        <a className="text-success me-2 disabled-status "
                                                        // onClick={() => { handleStatus(rowData?.id, '1') }}
                                                        // onClick={() => { openActionModelFunc(rowData, 'approved') }}
                                                        >
                                                            <i className="ti ti-check fs-7"></i>
                                                        </a>
                                                        <a
                                                            className={`text-danger disabled-status`}
                                                            onClick={() => {
                                                                if (
                                                                    rowData?.status === 1
                                                                ) {
                                                                    openActionModelFunc(rowData, "cancel");
                                                                }
                                                            }}
                                                        >
                                                            <i className="ti ti-x fs-7"></i>
                                                        </a>
                                                    </>)
                                                }
                                            </div>
                                        )}
                                    />
                                }

                                {/* <Column
                                    field="status"
                                    header="Request"
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
                                /> */}

                                <Column field="status" header="Action" style={{ minWidth: '6rem' }} body={(rowData) => (
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
                                        {/* {rowData?.status == 0 ?
                                            <a
                                                className="text-danger delete ms-2 cursor_pointer"
                                                onClick={() => { openActionModelFunc(rowData, 'cancel') }}
                                            >
                                                <i className="ti ti-trash fs-7"></i>
                                            </a>

                                            : <a
                                                className="text-danger delete ms-2 disabled-status"
                                            >
                                                <i className="ti ti-trash fs-7"></i>
                                            </a>
                                        } */}
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

            <div className={`modal custom-modal  ${addLeaveRequestModal ? "fade show d-block " : "d-none"}`}
                id="addnotesmodal" tabIndex={-1} role="dialog" aria-labelledby="addnotesmodalTitle" aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-centered" role="document" >
                    <div className="modal-content border-0">
                        <div className="modal-header bg-primary" style={{ borderRadius: '10px 10px 0px 0px' }}>
                            <h6 className="modal-title fs-5">{'Add Request Leave'} </h6>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" onClick={() => { closeLeaveRequestModelFunc() }} />
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit(onSubmitData)}>
                                <div className="col-lg-12">
                                    <div className="card-body p-2">
                                        <div className="row g-1">

                                            <input
                                                type="hidden"
                                                value="some_default_value"
                                                {...register(AstroInputTypesEnum.ID)}
                                            />

                                            {/* Date + Title side by side */}
                                            <div className="row g-3">
                                                {/* Date Field */}
                                                <div className="col-md-4">
                                                    <label htmlFor="dob1" className="form-label fw-semibold">
                                                        Date <span className="text-danger ms-1">*</span>
                                                    </label>
                                                    <Controller
                                                        name={AstroInputTypesEnum.DATE}
                                                        control={control}
                                                        rules={{ required: "Date is required" }}
                                                        render={({ field }) => (
                                                            <DatePicker
                                                                id={AstroInputTypesEnum.DATE}
                                                                picker="date"
                                                                disabled={isLeaveRequestEdit}
                                                                className="form-control custom-datepicker w-100"
                                                                format={DateFormat?.DATE_FORMAT}
                                                                value={
                                                                    field.value ? dayjs(field.value, DateFormat?.DATE_FORMAT) : dayjs()
                                                                }
                                                                onChange={(date) =>
                                                                    field.onChange(
                                                                        date ? dayjs(date).format(DateFormat?.DATE_FORMAT) : dayjs()
                                                                    )
                                                                }
                                                            />
                                                        )}
                                                    />
                                                    {errors[AstroInputTypesEnum.DATE] && (
                                                        <small className="text-danger">
                                                            {errors[AstroInputTypesEnum.DATE].message}
                                                        </small>
                                                    )}
                                                </div>

                                                {/* Title Field */}
                                                <div className="col-md-8">
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
                                                                })}
                                                                defaultValue={'compoff'}
                                                                disabled
                                                            >
                                                                {selectOption(LEAVE_TYPE_LIST)}
                                                            </select>
                                                        </div>
                                                        <label className="errorc ps-1 pt-1">
                                                            {errors[AstroInputTypesEnum.LEAVE_TYPE]?.message}
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Work REASON */}
                                            <div className="mb-1">
                                                <label
                                                    htmlFor="leave_reason"
                                                    className="form-label fw-semibold"
                                                >
                                                    Reason<span className="text-danger ms-1">*</span>
                                                </label>
                                                <div className="input-group border rounded-1">
                                                    <Controller
                                                        name={AstroInputTypesEnum.REASON}
                                                        control={control}
                                                        rules={{ required: "Enter reason" }}
                                                        render={({ field }) => (
                                                            <textarea
                                                                {...field}
                                                                className="form-control w-100"
                                                                placeholder="Enter reason"
                                                                rows={3}
                                                            />
                                                        )}
                                                    />
                                                </div>
                                                <label className="errorc ps-1 pt-1">
                                                    {errors[AstroInputTypesEnum.REASON]?.message}
                                                </label>
                                            </div>

                                            {/* Footer */}
                                            <div className="modal-footer justify-content-center">
                                                <button
                                                    type="button"
                                                    className="btn btn-danger"
                                                    onClick={() => {
                                                        closeLeaveRequestModelFunc();
                                                    }}
                                                >
                                                    Cancel
                                                </button>
                                                <button type="submit" className="btn btn-primary">
                                                    Submit
                                                </button>
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
                addLeaveRequestModal && (
                    <div className="modal-backdrop fade show"></div>
                )
            }

            <div className={`modal custom-modal  ${actionModal ? "fade show d-block " : "d-none"}`}
                id="addnotesmodal" tabIndex={-1} role="dialog" aria-labelledby="addnotesmodalTitle" aria-hidden="true">
                <div className="modal-dialog modal-md modal-dialog-centered" role="document" >
                    <div className="modal-content border-0">
                        <div className="modal-header bg-primary" style={{ borderRadius: '10px 10px 0px 0px' }}>
                            <h6 className="modal-title fs-4">{selectedLeave?.actionType === "approved" ? 'Are you sure approve leave ?' : "Cancel Request Leave"} </h6>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" onClick={() => { closeActionModelFunc() }} />
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit2(handleDelete)}>
                                <div className="col-lg-12">
                                    <div className="card-body pt-4 p-2">
                                        <div className="row g-3">
                                            {/* Hidden Inputs */}
                                            <input type="hidden" value={2} {...register("actionType")} />
                                            <input
                                                type="hidden"
                                                value="Cancelled by Employee"
                                                {...register2(AstroInputTypesEnum.REASON)}
                                            />

                                            {/* Confirmation Section */}
                                            <div className="d-flex flex-column align-items-center text-center">
                                                {/* Icon in circle */}
                                                <div
                                                    className="d-flex justify-content-center align-items-center rounded-circle mb-3"
                                                    style={{
                                                        width: "70px",
                                                        height: "70px",
                                                        border: "2px solid #1F7494",
                                                    }}
                                                >
                                                    <RiDeleteBinLine color="#1F7494" size={32} />
                                                </div>

                                                {/* Confirmation Text */}
                                                <h5 className="fw-bold mb-2">Are you sure ?</h5>
                                                <p className="text-muted mb-0">
                                                    Do you really want to
                                                    <span className="fw-semibold "> cancel requested leave</span> ?
                                                </p>
                                            </div>

                                            {/* Footer Buttons */}
                                            <div className="modal-footer justify-content-center border-0">
                                                <button
                                                    type="button"
                                                    className="btn btn-danger"
                                                    onClick={closeActionModelFunc}
                                                >
                                                    No, Keep Leave
                                                </button>
                                                <button type="submit" className="btn btn-primary">
                                                    {selectedLeave?.actionType === "approved" ? 'Yes, Approve Leave' : 'Yes, Cancel Leave'}
                                                </button>
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
                            <h6 className="modal-title fs-5">Comp Off Requests Details</h6>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" onClick={() => { closeViewModelFunc() }} />
                        </div>
                        <div className="modal-body ">
                            <div className="row m-2">
                                {[
                                    { label: "Date", value: momentNormalDateFormat(selectedLeave?.date, DateFormat?.DATE_DASH_TIME_FORMAT, DateFormat?.DATE_FORMAT) || '-' },
                                    { label: "Leave Type", value: 'Comp off' },
                                    { label: "Day", value: `${selectedLeave?.leave_day_type == 'half' ? '0.5' : '1'}` || '-' },
                                ].map((item, index) => (

                                    <div key={index} className="col-12 col-md-4 mb-3 pb-2 border-1 border-bottom">

                                        {item?.label == "Reason" ? (<>
                                            <p className="mb-1 fs-4">{item.label}</p>
                                            <h6 dangerouslySetInnerHTML={{ __html: item.value }} />
                                        </>) :
                                            item.value &&
                                            <>
                                                <p className="mb-1 fs-3">{item.label}</p>
                                                <h6 className="fw-semibold mb-0 fs-4 text-capitalize">{item.value || 'N/A'}</h6>
                                            </>
                                        }
                                    </div>
                                ))}

                                {
                                    selectedLeave?.reason &&
                                    <>
                                        <div className="col-md-12 mb-4">
                                            <p className="mb-1 fs-4">Reason</p>
                                            <h6 className="fw-semibold mb-0 fs-5 text-capitalize">{selectedLeave.reason || 'N/A'}</h6>
                                        </div>
                                    </>
                                }
                                {selectedLeave?.admin_reason &&
                                    <>
                                        <div className="col-md-6 mb-4">
                                            <p className="mb-1 fs-4">Admin Reason</p>
                                            <h6 className="fw-semibold mb-0 fs-5 text-capitalize">{selectedLeave.admin_reason || 'N/A'}</h6>
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


