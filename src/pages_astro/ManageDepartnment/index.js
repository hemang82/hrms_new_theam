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
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { GoDotFill } from 'react-icons/go';
import { CiCalendarDate } from 'react-icons/ci';


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
        const request = {
            emp_leave_company: EMPLOYEE_STATUS[0]?.key,
        };
        if (customerList?.length === 0) {
            dispatch(getCustomerListThunk(request));
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
                    dispatch(getListDepartnmentThunk({}))

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
                    dispatch(getListDepartnmentThunk({}))
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

    const handleSort = (event) => {
        console.log("Sort event triggered:", event);
        setSortField(event?.sortField); // ✅ correct key
        setSortOrder(event?.sortOrder);
    };

    const DepartnmentCard = ({ dept }) => {
        return (
            <Col xs={12} sm={12} md={6} lg={3} className="mb-4">
                <Card className="shadow-sm h-100 rounded-3 border-1 position-relative text-center">

                    <div className="position-absolute top-0 end-0 m-2 d-flex gap-2">
                        <button
                            className="btn btn-sm d-flex align-items-center justify-content-center rounded-circle"
                            style={{
                                width: "32px",
                                height: "32px",
                                backgroundColor: "#e8f4ff",
                                border: "none",
                            }}
                            onClick={() => { openEditBankDetailsModelFunc(dept) }}
                            title="Edit"
                        >
                            <i className="ti ti-edit text-custom-theam fs-6"></i>
                        </button>

                        <button
                            className="btn btn-sm d-flex align-items-center justify-content-center rounded-circle"
                            style={{
                                width: "32px",
                                height: "32px",
                                backgroundColor: "#ffecec",
                                border: "none",
                            }}
                            onClick={() => { openModel(dispatch, ModelName.DELETE_MODEL); setSelectedUser(dept) }}
                            title="Delete"
                        >
                            <i className="ti ti-trash text-danger fs-6"></i>
                        </button>
                    </div>

                    <Card.Body className="d-flex flex-column justify-content-center align-items-center p-4 m-2 mt-3 ">

                        <h5 className="fw-semibold mb-2 fs-5" style={{ color: "#1f7494" }}>
                            {dept?.dept_name}
                        </h5>

                        {dept?.dept_code && (
                            <p className="text-muted mb-2 small">
                                Dept ID: {dept?.dept_code}
                            </p>
                        )}
                        <div
                            className="d-flex align-items-center justify-content-center fs-6 fw-semibold"
                            style={{
                                color: "#1f7494",
                                background: "#ebf1f6",
                                borderRadius: "5px",
                                padding: "5px 10px",
                                minWidth: "max-content", // so the box fits content
                                whiteSpace: "nowrap",
                                border: '2px solid greay',
                                minWidth: '50px',
                                minHeight: '50px',
                                marginTop: '12px'
                            }}
                        >
                            {/* <CiCalendarDate
                                className="me-2 flex-shrink-0"
                                size={20}
                                style={{ color: "#1f7494" }}
                            /> */}
                            <span className="truncate-date">
                                {dept?.total_emp ? String(dept?.total_emp).padStart(2, "0") : "00"}
                            </span>

                        </div>
                    </Card.Body>
                </Card>
            </Col>
        );
    };

    return (
        <>
            <div className="container-fluid mw-100">
                <SubNavbar title={"Department List"} header={'Department List'} />

                <div className="widget-content searchable-container list">

                    <div className="card card-body p-3 mb-2">
                        <div className="row">

                            <div className="col-12 col-md-6 col-lg-3 mb-3 mb-md-0">
                                {/* <div className="position-relative">
                                    <input
                                        type="text"
                                        className="form-control product-search ps-5"
                                        id="input-search"
                                        placeholder="Search Department ..."
                                        value={globalFilterValue}
                                        onChange={onGlobalFilterChange}
                                    />
                                    <i className="ti ti-search position-absolute top-50 start-0 translate-middle-y fs-6 text-dark ms-3" />
                                </div> */}
                            </div>

                            <div className="col-12 col-md-6 col-lg-5 mb-3 mb-md-0">
                            </div>

                            <div className="col-12 col-md-6 col-lg-2 mb-3 mb-md-0">
                            </div>

                            <div className="col-12 col-md-6 col-lg-2">
                                <div className="d-flex justify-content-end">
                                    <Link
                                        id="btn-add-contact"
                                        className="btn btn-info d-flex align-items-center justify-content-center w-100 w-md-auto"
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

                        </div>
                    </div>

                    <div className="card card-body">
                        <div className="my-2 p-2">
                            <Row >
                                {departnmentList?.length > 0 && departnmentList?.map((dept) => (
                                    <DepartnmentCard key={dept.id} dept={dept} />
                                ))}
                            </Row>
                        </div>
                        <div className=''>
                            <Pagination per_page={perPage} pageCount={departnmentList?.total_count} onPageChange={onPageChange} page={page} />
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


//  <div className="card card-body p-3 mb-2">
//                         <div className="row">

//                             <div className="col-12 col-md-6 col-lg-3 mb-3 mb-md-0">
//                                 <div className="position-relative">
//                                     <input
//                                         type="text"
//                                         className="form-control product-search ps-5"
//                                         id="input-search"
//                                         placeholder="Search Department ..."
//                                         value={globalFilterValue}
//                                         onChange={onGlobalFilterChange}
//                                     />
//                                     <i className="ti ti-search position-absolute top-50 start-0 translate-middle-y fs-6 text-dark ms-3" />
//                                 </div>
//                             </div>

//                             <div className="col-12 col-md-6 col-lg-5 mb-3 mb-md-0">
//                             </div>

//                             <div className="col-12 col-md-6 col-lg-2 mb-3 mb-md-0">
//                             </div>

//                             <div className="col-12 col-md-6 col-lg-2">
//                                 <div className="d-flex justify-content-end">
//                                     <Link
//                                         id="btn-add-contact"
//                                         className="btn btn-info d-flex align-items-center justify-content-center w-100 w-md-auto"
//                                         style={{ height: '40px' }}
//                                         onClick={() => { openBankDetailsModelFunc() }}

//                                     >
//                                         <span className="me-1">
//                                             <IoAddCircleOutline style={{ fontSize: '1.2rem' }} />
//                                         </span>
//                                         <span className="fw-semibold">Add Department</span>
//                                     </Link>
//                                 </div>
//                             </div>

//                         </div>
//                     </div>

//                     <div className="card card-body">
//                         <div className="table-responsive">
//                             <DataTable
//                                 value={updatedLeaveLeast?.length > 0 ? updatedLeaveLeast : []}
//                                 paginator
//                                 rows={20}
//                                 globalFilter={globalFilterValue}
//                                 sortField={sortField}
//                                 sortOrder={sortOrder}
//                                 onSort={handleSort}
//                                 rowsPerPageOptions={
//                                     updatedLeaveLeast?.length > 50
//                                         ? [20, 30, 50, updatedLeaveLeast?.length]
//                                         : [20, 30, 40]
//                                 }

//                                 currentPageReportTemplate='Showing {first} to {last} of {totalRecords} entries'
//                                 paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
//                                 loading={loading}
//                                 // globalFilterFields={['name', 'annual_income']}
//                                 emptyMessage={<span style={{ textAlign: 'center', display: 'block' }}>Department Not Found.</span>}>

//                                 <Column
//                                     field="id"
//                                     header="Id"
//                                     style={{ minWidth: '4rem' }}
//                                     body={(rowData, options) => options?.rowIndex + 1}
//                                     showFilterMenu={true}
//                                     sortable
//                                 />

//                                 <Column field="dept_name" header="Department Name	" style={{ minWidth: '8rem' }} body={(rowData) => (
//                                     <span className='me-2'>{rowData?.dept_name || '-'} </span>
//                                 )} />

//                                 <Column field="total_emp" header="No of Employees" sortable style={{ minWidth: '8rem', textTransform: 'capitalize' }} body={(rowData) => (
//                                     <span className='me-2'>{truncateWords(rowData.total_emp) || '-'} </span>
//                                 )} />

//                                 <Column field="created_at" header="Create Date" style={{ minWidth: '8rem' }} body={(rowData) => (
//                                     <span className='me-2'>{formatDate(rowData.created_at, DateFormat?.DATE_FORMAT) || '-'} </span>
//                                 )} />

//                                 {/* <Column field="end_date" header="To" style={{ minWidth: '6em' }} body={(rowData) => (
//                                     <span className='me-2'>{formatDate(rowData.end_date, DateFormat?.DATE_WEEK_MONTH_NAME_FORMAT) || '-'} </span>
//                                 )} /> */}

//                                 <Column field="statuss" header="Action" style={{ minWidth: '10rem' }} body={(rowData) => (
//                                     <div className="action-btn">
//                                         <a className="text-info edit cursor_pointer cursor_pointer" onClick={() => { openEditBankDetailsModelFunc(rowData) }} >
//                                             <i class="ti ti-edit fs-7"></i>
//                                         </a>
//                                         <a className="text-dark delete ms-2 cursor_pointer cursor_pointer" onClick={() => { openModel(dispatch, ModelName.DELETE_MODEL); setSelectedUser(rowData) }}>
//                                             <i className="ti ti-trash fs-7 text-danger" />
//                                         </a>
//                                     </div>
//                                 )} />
//                             </DataTable>

//                             <div className=''>
//                                 <Pagination per_page={50 || perPage} pageCount={departnmentList?.total_count} onPageChange={onPageChange} page={page} />
//                             </div>
//                         </div>
//                     </div>

