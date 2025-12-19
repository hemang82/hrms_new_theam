import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../layout/Header';
import Slidebar from '../../layout/Slidebar';
import $, { data } from 'jquery';
import 'datatables.net-bs5';
import 'datatables.net-responsive-bs5';
import SubNavbar from '../../layout/SubNavbar';
import { updateLoanDetails, loanDetails, addDisbursementLoan, addLeaves, editAttendance, deleteProject } from '../../utils/api.services';
import { ExportToCSV, ExportToExcel, ExportToPdf, SWIT_DELETE, SWIT_DELETE_SUCCESS, SWIT_FAILED, TOAST_ERROR, TOAST_SUCCESS } from '../../config/common';
import profile_image from '../../assets/Images/default.jpg'
import ReactDatatable from '../../config/ReactDatatable';
import { Helmet } from 'react-helmet';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { getCustomerListThunk, setLoader, getlistLeavesThunk, updateLeaveList, getlistAttendanceThunk, updateAttendanceList, getProjectListThunk, updateProjectList } from '../../Store/slices/MasterSlice';
import Constatnt, { AwsFolder, Codes, ModelName, SEARCH_DELAY } from '../../config/constant';
import useDebounce from '../hooks/useDebounce';
import { closeModel, convertToUTC, formatDate, formatDateDyjs, formatIndianPrice, getBreakMinutes, getFileNameFromUrl, getLoanStatusObject, getWorkingHours, momentDateFormat, momentNormalDateFormat, momentTimeFormate, openModel, QuillContentRowWise, selectOption, selectOptionCustomer, textInputValidation, truncateWords } from '../../config/commonFunction';
import Model from '../../component/Model';
import { DeleteComponent } from '../CommonPages/CommonComponent';
import Pagination from '../../component/Pagination';
import { AstroInputTypesEnum, AttendanceStatus, DateFormat, EMPLOYEE_STATUS, getAttendanceStatusColor, getStatus, InputRegex, LEAVE_TYPE_LIST, PAYMENT_STATUS, STATUS_COLORS, TimeFormat } from '../../config/commonVariable';
import { RiUserReceivedLine } from 'react-icons/ri';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { DatePicker, ConfigProvider } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/en'; // or your locale
import { IoAddCircleOutline, IoClose } from 'react-icons/io5';
import { PATHS } from '../../Router/PATHS';
// import moment from 'moment';
import Spinner from '../../component/Spinner';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import cloneDeep from "lodash/cloneDeep";

dayjs.extend(utc);
dayjs.extend(timezone);

export default function ManageProject() {

    let navigat = useNavigate();
    const dispatch = useDispatch();

    const { projectList: { data: projectList } } = useSelector((state) => state.masterslice);
    const { customerList: { data: customerList }, } = useSelector((state) => state.masterslice);
    const { customModel } = useSelector((state) => state.masterslice);

    const { register, handleSubmit, setValue, clearErrors, reset, watch, control, trigger, formState: { errors }, } = useForm({
        defaultValues: {
            breaks: [{ start: null, end: null }], // ✅ at least one row
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "breaks",
    });

    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [selectedProject, setSelectedProject] = useState({})
    const [loading, setLoading] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({ global: { value: '' } });
    const [projectViewModal, setProjectViewModal] = useState(false);
    const [selectedOption, setSelectedOption] = useState({});
    const [sortField, setSortField] = useState(null);
    const [sortOrder, setSortOrder] = useState(-1);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [perPage, setPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [is_loding, setIs_loading] = useState(false);
    const [updatedAttendanceList, setUpdateAttendanceList] = useState([]);
    const [projectEditModal, setProjectEditModel] = useState(false);
    const [employeeStatus, setEmployeeStatus] = useState(EMPLOYEE_STATUS[0]);

    useEffect(() => {
        const request = {
            emp_leave_company: employeeStatus?.key,
        };
        if (customerList?.length === 0) {
            dispatch(getCustomerListThunk(request));
        }
        setSelectedOption({})
    }, [])

    useEffect(() => {
        if (projectList?.length === 0) {
            dispatch(getProjectListThunk({}));
        }
    }, []);

    const updatedData = (taskList, startDate, endDate, priority) => {

        // console.log('taskList', taskList, 'startDatestar', startDate, 'endDate', endDate);

        let start, end;

        if (startDate) {
            start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
        }
        if (endDate) {
            end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
        }

        const filtered = taskList?.filter((task) => {
            const currentDate = new Date(task?.deadline);

            // ✅ Date filter
            let dateCondition = true;
            if (start && !end) dateCondition = currentDate >= start;
            else if (!start && end) dateCondition = currentDate <= end;
            else if (start && end) dateCondition = currentDate >= start && currentDate <= end;

            // ✅ Priority filter
            let priorityCondition = true;
            if (priority) {
                priorityCondition = task?.priority?.toLowerCase() === priority.toLowerCase();
            }
            return dateCondition && priorityCondition;
        });

        const sorted = filtered?.sort(
            (a, b) => new Date(b.deadline).getTime() - new Date(a.deadline).getTime()
        );

        setUpdateAttendanceList(sorted);
    };

    useEffect(() => {
        if (projectList && projectList?.length > 0) {
            updatedData(projectList)
        } else {
            setUpdateAttendanceList([])
        }
    }, [projectList, startDate]);

    const handleDelete = (is_true) => {
        if (is_true) {
            dispatch(setLoader(true));
            let submitData = {
                project_id: selectedProject?.id,
            }
            deleteProject(submitData).then((response) => {
                if (response.code == Codes?.SUCCESS) {
                    const updatedList = projectList?.length > 0 && projectList?.filter((item) => item.id !== selectedProject?.id)
                    dispatch(updateProjectList(updatedList))
                    closeModel(dispatch)
                    dispatch(setLoader(false))
                    TOAST_SUCCESS(response?.message);
                } else {
                    TOAST_ERROR(response?.message);
                    dispatch(setLoader(false))
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
        setProjectViewModal(true)
        setSelectedProject(data)
    }

    const closeModelFunc = () => {
        setProjectViewModal(false)
        setSelectedProject({})
    }

    const closeAttendanceModel = () => {
        setProjectEditModel(false)
        setSelectedProject({})
        reset()
    }

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
            // const request = {
            //     start_date: data?.start_date ? formatDateDyjs(data.start_date, DateFormat.DATE_LOCAL_DASH_TIME_FORMAT) : null,
            //     end_date: data?.end_date ? formatDateDyjs(data.end_date, DateFormat.DATE_LOCAL_DASH_TIME_FORMAT) : null,
            //     employee_id: data?.employee_id || "",
            //     emp_leave_company: data?.emp_leave_company || "0"
            // };
            // await dispatch(getlistAttendanceThunk(request));
            updatedData(projectList, data?.start_date ? formatDateDyjs(data.start_date, DateFormat.DATE_LOCAL_DASH_TIME_FORMAT) : null, data?.end_date ? formatDateDyjs(data.end_date, DateFormat.DATE_LOCAL_DASH_TIME_FORMAT) : null);
        } finally {
        }
    };

    return (
        <>
            {<Spinner isActive={is_loding} message={'Please Wait'} />}
            <div className="container-fluid mw-100">

                <SubNavbar title={"Project List"} header={'Project List'} />

                <div className="widget-content searchable-container list">

                    {/* --------------------- start Contact ---------------- */}

                    <div className="card card-body mb-2 p-3">
                        <div className="row g-2">

                            <div className="col-12 col-md-6 col-lg-4">
                                <div className="position-relative mt-4 w-75">
                                    <input
                                        type="text"
                                        className="form-control ps-5 "
                                        id="input-search"
                                        placeholder="Search Project ..."
                                        value={globalFilterValue}
                                        onChange={onGlobalFilterChange}
                                    />
                                    <i className="ti ti-search position-absolute top-50 start-0 translate-middle-y fs-6 text-dark ms-3" />
                                </div>
                            </div>

                            <div className="col-12 col-md-6 col-lg-2 d-flex flex-column">

                            </div>

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
                                        })
                                    }}
                                    disabledDate={disabledEndDate}
                                    disabled={!startDate}
                                />
                            </div>

                            <div className="col-12 col-md-6 col-lg-2 d-flex flex-column">
                                <label className="form-label fw-semibold mb-1">&nbsp;</label>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-info d-flex align-items-center justify-content-center w-100"
                                    style={{ height: '40px' }}
                                    onClick={() => navigat(PATHS.ADD_PROJECT)}
                                >
                                    <IoAddCircleOutline className="me-1" style={{ fontSize: '1.2rem' }} />
                                    <span className="fw-semibold">Add Project</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="card card-body">
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
                                emptyMessage={<span style={{ textAlign: 'center', display: 'block' }}>Project Not Found.</span>}>

                                <Column field="id"
                                    header="Id"
                                    style={{ minWidth: '4rem' }}
                                    body={(rowData, options) => options?.rowIndex + 1}
                                    showFilterMenu={true}
                                />

                                <Column field="name" header="Project Name" style={{ minWidth: '12rem', textTransform: 'capitalize' }} body={(rowData) => (
                                    <span className='me-2'>{truncateWords(rowData?.name) || '-'} </span>
                                )} />

                                <Column field="deadline" header="Deadline Date" sortable style={{ minWidth: '10rem' }} body={(rowData) => (
                                    <span className='me-2'>{momentDateFormat(rowData.deadline[rowData?.deadline?.length - 1], DateFormat?.DATE_WEEK_MONTH_NAME_FORMAT) || '-'} </span>
                                )} />

                                <Column field="priority" sortable data-pc-section="root" header="Priority" style={{ minWidth: '8rem' }} body={(rowData) => (
                                    <>
                                        <span
                                            className={`p-tag p-component badge p-1 text-light fw-semibold px-3 status_font rounded-4 py-2 ${getAttendanceStatusColor(rowData?.priority) || "bg-secondary"}`}
                                            data-pc-name="tag"
                                            data-pc-section="root"
                                        >
                                            <span className="p-tag-value fs-2" data-pc-section="value">
                                                {getStatus(rowData?.priority) || "-"}
                                            </span>
                                        </span>
                                    </>
                                )} />


                                <Column field="status" header="Action" style={{ minWidth: '6rem' }} body={(rowData) => (
                                    <div className="action-btn">

                                        <a className="text-custom-theam edit cursor_pointer cursor_pointer me-1" onClick={() => navigat(PATHS?.EDIT_PROJECT, { state: rowData })} >
                                            <i class="ti ti-edit fs-7"></i>
                                        </a>

                                        <Link onClick={() => {
                                            openModelFunc(rowData);
                                        }}
                                            state={rowData}
                                            className={`text-info edit cursor_pointer text-custom-theam`}
                                        >
                                            <i className="ti ti-eye fs-7" />
                                        </Link>
                                        <a className="text-dark delete ms-2 cursor_pointer cursor_pointer" onClick={() => { openModel(dispatch, ModelName.DELETE_MODEL); setSelectedProject(rowData) }}>
                                            <i className="ti ti-trash fs-7 text-danger" />
                                        </a>
                                    </div>
                                )} />

                            </DataTable>

                            <div className=''>
                                <Pagination per_page={50 || perPage} pageCount={projectList?.total_count} onPageChange={onPageChange} page={page} />
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <div className={`modal custom-modal  ${projectViewModal ? "fade show d-block " : "d-none"}`}
                id="addnotesmodal" tabIndex={-1} role="dialog" aria-labelledby="addnotesmodalTitle" aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-centered" role="document" >
                    <div className="modal-content border-0">
                        <div className="modal-header bg-primary" style={{ borderRadius: '10px 10px 0px 0px' }}>
                            <h6 className="modal-title fs-5">{'Project Details'} </h6>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" onClick={() => { closeModelFunc() }} />
                        </div>

                        <div className="modal-body ">
                            <div className="row m-2">
                                {[
                                    { label: "Project Name", value: selectedProject?.name },
                                    { label: "Priority", value: selectedProject?.priority },
                                    // { label: "Date", value: <ul className="mb-1 ps-3 ">{ momentNormalDateFormat(selectedProject?.deadline, DateFormat?.DATE_DASH_TIME_FORMAT, DateFormat?.DATE_FORMAT) || '-' }</ul>},
                                    {
                                        label: "Deadline Date",
                                        value: (
                                            <ul className="mb-1 list-group list-group-numbered">
                                                {selectedProject?.deadline?.length
                                                    ? selectedProject.deadline.map((date, index) => {
                                                        const isLast = index == selectedProject.deadline.length - 1;
                                                        return (
                                                            <li
                                                                key={index}
                                                                className={`fs-4 p-2 list-group-item ${isLast ? 'text-custom-theam' : ''}`}
                                                            >
                                                                {momentNormalDateFormat(date, DateFormat?.DATE_DASH_TIME_FORMAT, DateFormat?.DATE_FORMAT)}
                                                            </li>
                                                        );
                                                    }) : <li>-</li>}
                                            </ul>
                                        )
                                    },
                                    {
                                        label: "Team Member",
                                        value: selectedProject?.team_names
                                            ? (<ul className="mb-1 list-group list-group-numbered">
                                                {selectedProject.team_names
                                                    .split(",")
                                                    .map(name => name.trim())
                                                    .map((name, index) => (
                                                        <li key={index} className='fs-4 p-2 list-group-item'> {name}</li>
                                                    ))}
                                            </ul>) : "-"
                                    },
                                    { label: "Project Description", value: QuillContentRowWise(selectedProject?.description ? selectedProject?.description : "") },
                                ].map((item, index) => (<>
                                    {
                                        item.label == "Project Name" || item.label == "Priority" ? (<>
                                            {
                                                item.label == "Priority" ? (
                                                    <div key={index} className="col-6 mb-3 pb-2 border-1 border-bottom">
                                                        <p className="mb-1 fs-3">{item.label}</p>
                                                        <span className={`p-tag p-component badge p-1 text-light fw-semibold px-3 status_font rounded-4 py-2 ${getAttendanceStatusColor(selectedProject?.priority) || "bg-secondary"}`}
                                                            data-pc-name="tag"
                                                            data-pc-section="root" >
                                                            <span className="p-tag-value fs-2" data-pc-section="value">
                                                                {getStatus(selectedProject?.priority) || "-"}
                                                            </span>
                                                        </span>
                                                    </div>
                                                ) : <div key={index} className="col-6 mb-3 pb-2 border-1 border-bottom">
                                                    <p className="mb-1 fs-3">{item.label}</p>
                                                    <h6 className="modal-title fs-4">{item.value || 'N/A'} </h6>
                                                </div>
                                            }
                                        </>) : item.label == "Project Description" ? (<>
                                            <div key={index} className="col-12 mb-3 pb-2 border-1 border-bottom">
                                                {
                                                    item.value && <>
                                                        <p className="mb-1 fs-3">{item.label}</p>
                                                        <h6 className="fw-meduim mb-0 fs-4 text-capitalize">{item.value || 'N/A'}</h6>
                                                    </>
                                                }
                                            </div>
                                        </>) : item.label == "Team Member" ? (<>
                                            <div key={index} className="col-6 mb-3 pb-2 border-1 border-bottom">
                                                {
                                                    item.value && <>
                                                        <p className="mb-1 fs-3">{item.label}</p>
                                                        <h6 className="fw-meduim mb-0 fs-4 text-capitalize">{item.value || 'N/A'}</h6>
                                                    </>
                                                }
                                            </div>
                                        </>) : (<>
                                            <div key={index} className="col-6 mb-3 pb-2 border-1 border-bottom">
                                                {
                                                    item.value &&
                                                    <>
                                                        <p className="mb-1 fs-3">{item.label}</p>
                                                        <h6 className="fw-meduim mb-0 fs-4 text-capitalize">{item.value || 'N/A'}</h6>
                                                    </>
                                                }
                                            </div>
                                        </>)
                                    }
                                </>))}
                            </div>
                        </div>
                    </div>
                </div>
            </div >
            {
                projectViewModal && (
                    <div className="modal-backdrop fade show"></div>
                )
            }

            <div className={`modal custom-modal  ${projectEditModal ? "fade show d-block " : "d-none"}`}
                id="addnotesmodal" tabIndex={-1} role="dialog" aria-labelledby="addnotesmodalTitle" aria-hidden="true">
                <div className="modal-dialog modal-md modal-dialog-centered" role="document" >
                    <div className="modal-content border-0">
                        <div className="modal-header bg-primary" style={{ borderRadius: '10px 10px 0px 0px' }}>
                            <h3 className="modal-title fs-5">{projectEditModal ? 'Edit Attendance Details' : 'Add Attendance Details'} </h3>
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
                                                    { label: "Total Break", value: getBreakMinutes(watch('breaks')) + 'm' || '-' },
                                                ].map((item, index) => (
                                                    <div className='col-12 col-sm-6'>
                                                        <div key={index} className="card border-1 zoom-in them-light shadow-sm m-1 ">
                                                            <div className="card-body text-center m-1 p-1">
                                                                <p className="fw-semibold fs-4 text-custom-theam ">{item.label}</p>
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
                projectEditModal && (
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


