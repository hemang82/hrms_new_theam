import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../layout/Header';
import Slidebar from '../../layout/Slidebar';
import $ from 'jquery';
import 'datatables.net-bs5';
import 'datatables.net-responsive-bs5';
import SubNavbar from '../../layout/SubNavbar';
import { EditDailyWork, DailyTaskList, AddDailyTask, DeleteDailyWork } from '../../utils/api.services';
import { TOAST_ERROR, TOAST_SUCCESS } from '../../config/common';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { getDailyTaskListThunk, setLoader, updateDailyTaskList } from '../../Store/slices/MasterSlice';
import Constatnt, { Codes, ModelName, SEARCH_DELAY } from '../../config/constant';
import useDebounce from '../hooks/useDebounce';
import { closeModel, dayjsDateFormat, dayjsNormalDateFormat, disableFutureDates, formatDate, formatDateDyjs, getAllStatusObject, getLoanStatusObject, momentDateFormat, momentNormalDateFormat, openModel, QuillContentRowWise, textInputValidation } from '../../config/commonFunction';
import Model from '../../component/Model';
import { DeleteComponent } from '../CommonPages/CommonComponent';
import Pagination from '../../component/Pagination';
import { AstroInputTypesEnum, DateFormat, EMPLOYEE_STATUS, STATUS_COLORS } from '../../config/commonVariable';
import { IoAddCircleOutline } from 'react-icons/io5';
import { Controller, useForm } from 'react-hook-form';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import ReactQuill from 'react-quill';
import "react-quill/dist/quill.snow.css";

export default function ManageWorkUpdate() {

    let navigat = useNavigate();
    const dispatch = useDispatch();

    const { register, handleSubmit, setValue, clearErrors, reset, watch, trigger, control, formState: { errors } } = useForm({
        defaultValues: {
            [AstroInputTypesEnum.DATE]: dayjs().format(DateFormat?.DATE_FORMAT), // today as default
        },
    });

    const { dailyTaskList: { data: dailyTaskList }, } = useSelector((state) => state.masterslice);
    const { customModel } = useSelector((state) => state.masterslice);

    const [loading, setLoading] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const debounce = useDebounce(globalFilterValue, SEARCH_DELAY);
    const [filters, setFilters] = useState({ global: { value: '' } });
    const [sortField, setSortField] = useState('created_at');
    const [sortOrder, setSortOrder] = useState(-1);
    const [perPage, setPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [startDate, setStartDate] = useState(dayjs().startOf("month")); // ✅ 1st day of month
    const [endDate, setEndDate] = useState(dayjs());
    const [employeeStatus, setEmployeeStatus] = useState(EMPLOYEE_STATUS[0]);
    const [addWorkUpdateModal, setAddWorkUpdate] = useState(false);
    const [viewModel, setViewModel] = useState(false);
    const [selectedWork, setSelectedWork] = useState({})
    const [isWorkEdit, setIsWorkEdit] = useState(false)

    const hasInitialLoaded = useRef(false);

    const fetchData = async () => {

        try {
            const request = {
                start_date: startDate ? dayjsDateFormat(startDate, DateFormat?.DATE_DASH_TIME_FORMAT) : null,
                end_date: endDate ? dayjsDateFormat(endDate, DateFormat?.DATE_DASH_TIME_FORMAT) : null,
            };
            await dispatch(getDailyTaskListThunk(request));
        } finally {
            // dispatch(setLoader(false));
        }
    };

    useEffect(() => {
        // if (!hasInitialLoaded.current) {
        //     hasInitialLoaded.current = true;
        //     return; // Skip first effect run
        // }
        if (dailyTaskList?.length === 0) {
            fetchData();
        }
    }, []);

    const handleDelete = async (is_true) => {
        if (!is_true) return;

        dispatch(setLoader(true));
        try {
            let submitData = {
                work_id: selectedWork?.id,
            };
            const response = await DeleteDailyWork(submitData);
            if (response.code == Codes?.SUCCESS) {
                const updatedList = dailyTaskList?.filter(item => item.id !== selectedWork?.id);
                dispatch(updateDailyTaskList(updatedList));
                closeModel(dispatch);
                TOAST_SUCCESS(response?.message);
            } else {
                closeModel(dispatch);
                TOAST_ERROR(response?.message);
            }
        } catch (error) {
            closeModel(dispatch);
            TOAST_ERROR("Something went wrong. Please try again.");
        } finally {
            dispatch(setLoader(false));
        }
    };

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        if (_filters['global']) { // Check if _filters['global'] is defined
            _filters['global'].value = value;
        }

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const disabledEndDate = (current) => {
        if (!startDate) return false;
        return current.isBefore(startDate, 'day');
    };

    const openWorkUpdateModelFunc = (data) => {
        if (data) {
            setIsWorkEdit(true)
            setValue(AstroInputTypesEnum.ID, data?.id)
            setValue(AstroInputTypesEnum.DATE, momentNormalDateFormat(data?.date, DateFormat?.DATE_DASH_TIME_FORMAT, DateFormat?.DATE_FORMAT))
            setValue(AstroInputTypesEnum.TITLE, data?.title)
            setValue(AstroInputTypesEnum.DESCRIPTION, data?.description)
        }
        setAddWorkUpdate(true)
    }

    const closeWorkUpdateModelFunc = () => {
        reset()
        setAddWorkUpdate(false)
        setIsWorkEdit(false)
    }

    const openViewModelFunc = (data) => {
        setSelectedWork(data);
        setViewModel(true)
    }

    const closeViewModelFunc = () => {
        setViewModel(false)
        setSelectedWork({})
    }

    const onSubmitData = async (data) => {
        dispatch(setLoader(true));
        try {
            let submitData = {
                date: momentNormalDateFormat(data?.date, DateFormat?.DATE_FORMAT, DateFormat?.DATE_DASH_TIME_FORMAT),
                description: data[AstroInputTypesEnum.DESCRIPTION],
                title: data[AstroInputTypesEnum.TITLE],
            };
            let response;
            if (isWorkEdit) {
                submitData.work_id = data[AstroInputTypesEnum.ID];
                submitData.remark = "";
                response = await EditDailyWork(submitData);
            } else {
                response = await AddDailyTask(submitData);
            }

            if (response.code == Codes.SUCCESS) {
                TOAST_SUCCESS(response?.message);
                dispatch(getDailyTaskListThunk());
                closeWorkUpdateModelFunc();
            } else {
                TOAST_ERROR(response?.message);
            }
        } catch (error) {
            console.error("Error in onSubmitData:", error);
            TOAST_ERROR("Something went wrong. Please try again.");
        } finally {
            dispatch(setLoader(false));
            closeWorkUpdateModelFunc();
        }
    };

    const onChangeApiCalling = async (data) => {
        try {
            const request = {
                start_date: data?.start_date ? dayjsNormalDateFormat(data?.start_date, DateFormat?.DATE_DASH_TIME_FORMAT) : null,
                end_date: data?.end_date ? dayjsNormalDateFormat(data?.end_date, DateFormat?.DATE_DASH_TIME_FORMAT) : null,
            };
            await dispatch(getDailyTaskListThunk(request));
        } finally {
        }
    };

    return (
        <>
            <div className="container-fluid mw-100">

                <SubNavbar title={"Daily Work Update List"} header={'Daily Work Update List'} />

                <div className="widget-content searchable-container list">
                    <div className="card card-body mb-2 p-3">
                        <div className="row g-2">

                            <div className="col-12 col-md-6 col-lg-3">
                                <div className="position-relative mt-4 w-100">
                                    <input
                                        type="text"
                                        className="form-control ps-5 "
                                        id="input-search"
                                        placeholder="Search work update ..."
                                        value={globalFilterValue}
                                        onChange={onGlobalFilterChange}
                                    />
                                    <i className="ti ti-search position-absolute top-50 start-0 translate-middle-y fs-6 text-dark ms-3" />
                                </div>
                            </div>

                            <div className="col-12 col-md-6 col-lg-1 mb-2 mb-md-0">
                            </div>

                            <div className="col-12 col-md-6 col-lg-4">
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
                                    disabledDate={disableFutureDates}
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

                        </div>
                    </div>

                    <div className="card card-body">
                        <div className="table-responsive">
                            <DataTable
                                value={dailyTaskList?.length > 0 ? dailyTaskList : []}
                                paginator
                                rows={15}
                                globalFilter={globalFilterValue}
                                rowsPerPageOptions={
                                    dailyTaskList?.length > 50
                                        ? [20, 30, 50, dailyTaskList?.length]
                                        : [20, 30, 40]
                                }
                                currentPageReportTemplate='Showing {first} to {last} of {totalRecords} entries'
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                loading={loading}
                                sortField={sortField}
                                sortOrder={sortOrder}
                                // onSort={handleSort}
                                emptyMessage={<span style={{ textAlign: 'center', display: 'block' }}>Daily work update not found.</span>}
                            >
                                <Column
                                    field="id"
                                    header="Id"
                                    style={{ minWidth: '4rem' }}
                                    body={(rowData, options) => options.rowIndex + 1}
                                    sortable
                                    showFilterMenu={true}
                                />
                                <Column
                                    field="name"
                                    header="Name"
                                    style={{ minWidth: '10rem', whiteSpace: 'nowrap', textTransform: 'capitalize' }}
                                    body={(rowData) => <span className='me-2'>{rowData.name || '-'}</span>}
                                />

                                <Column field="date" header="Date" style={{ minWidth: '8rem' }} body={(rowData) => (
                                    <span className='me-2'>{momentNormalDateFormat(rowData?.date, DateFormat?.DATE_DASH_TIME_FORMAT, DateFormat?.DATE_FORMAT) || '-'}</span>
                                )} />

                                <Column
                                    field="title"
                                    header="Title"
                                    style={{ minWidth: '10rem', whiteSpace: 'nowrap', textTransform: 'capitalize' }}
                                    body={(rowData) => <span className='me-2'>{rowData.title || '-'}</span>}
                                />

                                <Column field="status" header="Action" style={{ minWidth: '6rem' }} body={(rowData) => (
                                    <div className="action-btn">
                                        {/* <a
                                            className={`text-custom-theam edit cursor_pointer me-1`}
                                            onClick={() => {
                                                openWorkUpdateModelFunc(rowData);
                                            }}
                                        >
                                            <i className="ti ti-edit fs-7"></i>
                                        </a> */}
                                        <Link onClick={() => {
                                            openViewModelFunc(rowData);
                                        }}
                                            state={rowData}
                                            className={`text-custom-theam edit cursor_pointer`}
                                        >
                                            <i className="ti ti-eye fs-7" />
                                        </Link>
                                        <a
                                            className="text-danger delete ms-2 cursor_pointer"
                                            // onClick={() => { openActionModelFunc(rowData, 'cancel') }}
                                            onClick={() => {
                                                openModel(dispatch, ModelName.DELETE_MODEL);
                                                setSelectedWork(rowData)
                                            }}

                                        >
                                            <i className="ti ti-trash fs-7"></i>
                                        </a>
                                    </div>
                                )} />
                            </DataTable>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`modal custom-modal  ${addWorkUpdateModal ? "fade show d-block " : "d-none"}`}
                id="addnotesmodal" tabIndex={-1} role="dialog" aria-labelledby="addnotesmodalTitle" aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-centered" role="document" >
                    <div className="modal-content border-0">
                        <div className="modal-header bg-primary" style={{ borderRadius: '10px 10px 0px 0px' }}>
                            <h6 className="modal-title fs-5">{isWorkEdit ? 'Edit Work Update' : 'Add Work Update'} </h6>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" onClick={() => { closeWorkUpdateModelFunc() }} />
                        </div>

                        <div className="modal-body">
                            <form onSubmit={handleSubmit(onSubmitData)}>
                                <div className="col-lg-12">
                                    <div className="card-body p-2">
                                        <div className="row g-3">

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
                                                                disabled={isWorkEdit}
                                                                className="form-control custom-datepicker w-100"
                                                                format={DateFormat?.DATE_FORMAT}
                                                                value={
                                                                    field.value
                                                                        ? dayjs(field.value, DateFormat?.DATE_FORMAT)
                                                                        : dayjs()
                                                                }
                                                                onChange={(date) =>
                                                                    field.onChange(
                                                                        date
                                                                            ? dayjs(date).format(DateFormat?.DATE_FORMAT)
                                                                            : dayjs()
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
                                                    <label htmlFor="lastname" className="form-label fw-semibold">
                                                        Title <span className="text-danger ms-1">*</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <input
                                                            type="text"
                                                            className="form-control ps-2"
                                                            placeholder="Enter title"
                                                            autoComplete="nope"
                                                            {...register(
                                                                AstroInputTypesEnum.TITLE,
                                                                textInputValidation(AstroInputTypesEnum.TITLE, "Enter title")
                                                            )}
                                                        />
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.TITLE]?.message}
                                                    </label>
                                                </div>
                                            </div>

                                            {/* Work Description */}
                                            <div className="mb-3">
                                                <label
                                                    htmlFor="leave_reason"
                                                    className="form-label fw-semibold"
                                                >
                                                    Work Description <span className="text-danger ms-1">*</span>
                                                </label>
                                                <div className="input-group border rounded-1">
                                                    <Controller
                                                        name={AstroInputTypesEnum.DESCRIPTION}
                                                        control={control}
                                                        rules={{ required: "Enter work description" }}
                                                        render={({ field }) => (
                                                            <ReactQuill
                                                                {...field}
                                                                theme="snow"
                                                                placeholder="Enter work description"
                                                                className="custom-quill w-100"
                                                                style={{ minHeight: "250px" }} // ~4 lines
                                                            />
                                                        )}
                                                    />
                                                </div>
                                                <label className="errorc ps-1 pt-1">
                                                    {errors[AstroInputTypesEnum.DESCRIPTION]?.message}
                                                </label>
                                            </div>

                                            {/* Footer */}
                                            <div className="modal-footer justify-content-center">
                                                <button
                                                    type="button"
                                                    className="btn btn-danger"
                                                    onClick={() => {
                                                        closeWorkUpdateModelFunc();
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
                addWorkUpdateModal && (
                    <div className="modal-backdrop fade show"></div>
                )
            }

            <div className={`modal custom-modal  ${viewModel ? "fade show d-block " : "d-none"}`}
                id="addnotesmodal" tabIndex={-1} role="dialog" aria-labelledby="addnotesmodalTitle" aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-centered" role="document" >
                    <div className="modal-content border-0">
                        <div className="modal-header bg-primary" style={{ borderRadius: '10px 10px 0px 0px' }}>
                            <h6 className="modal-title fs-5">Work Update Details </h6>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" onClick={() => { closeViewModelFunc() }} />
                        </div>
                        <div className="modal-body ">
                            <div className="row m-2">
                                {[
                                    { label: "Date", value: momentNormalDateFormat(selectedWork?.date, DateFormat?.DATE_DASH_TIME_FORMAT, DateFormat?.DATE_FORMAT) || '-' },
                                    { label: "Title", value: selectedWork?.title },
                                    { label: "Work Description", value: QuillContentRowWise(selectedWork?.description ? selectedWork?.description : "") },
                                ].map((item, index) => (

                                    <div key={index} className="col-12 mb-3 pb-2 border-1 border-bottom">

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
                                    selectedWork?.reason &&
                                    <>
                                        <div className="col-md-6 mb-4">
                                            <p className="mb-1 fs-4">Reason</p>
                                            <h6 className="fw-semibold mb-0 fs-5 text-capitalize">{selectedWork.reason || 'N/A'}</h6>
                                        </div>
                                    </>
                                }
                                {selectedWork?.admin_reason &&
                                    <>
                                        <div className="col-md-6 mb-4">
                                            <p className="mb-1 fs-4">Admin Reason</p>
                                            <h6 className="fw-semibold mb-0 fs-5 text-capitalize">{selectedWork.admin_reason || 'N/A'}</h6>
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


