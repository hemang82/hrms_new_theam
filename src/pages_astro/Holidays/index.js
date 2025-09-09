import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../layout/Header';
import Slidebar from '../../layout/Slidebar';
import $ from 'jquery';
import 'datatables.net-bs5';
import 'datatables.net-responsive-bs5';
import SubNavbar from '../../layout/SubNavbar';
import { addHolidays, deleteHolidays, updateHolidays } from '../../utils/api.services';
import { ExportToCSV, ExportToExcel, ExportToPdf, SWIT_DELETE, SWIT_DELETE_SUCCESS, TOAST_ERROR, TOAST_SUCCESS } from '../../config/common';
import profile_image from '../../assets/Images/default.jpg'
import ReactDatatable from '../../config/ReactDatatable';
import { Helmet } from 'react-helmet';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { getCustomerListThunk, getHolidayListThunk, getSalaryListThunk, setLoader, updateCustomerList, updateHolidayList, updateIntrestList } from '../../Store/slices/MasterSlice';
import Constatnt, { Codes, ModelName, SEARCH_DELAY } from '../../config/constant';
import useDebounce from '../hooks/useDebounce';
import { closeModel, formatDate, formatDateDyjs, openModel, textInputValidation } from '../../config/commonFunction';
import Model from '../../component/Model';
import { DeleteComponent } from '../CommonPages/CommonComponent';
import Pagination from '../../component/Pagination';
import { AstroInputTypesEnum, DateFormat, LOAN_TYPES } from '../../config/commonVariable';
import { IoAddCircleOutline } from 'react-icons/io5';
import { useForm } from 'react-hook-form';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { PATHS } from '../../Router/PATHS';

export default function ManageEMISchedule() {

    let navigat = useNavigate();
    const dispatch = useDispatch();
    const { register, handleSubmit, setValue, clearErrors, reset, watch, control, formState: { errors } } = useForm();
    const { holidayList: { data: listHoliday }, } = useSelector((state) => state.masterslice);
    const { customModel } = useSelector((state) => state.masterslice);

    const [selectedUser, setSelectedUser] = useState()

    const [loading, setLoading] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const debounce = useDebounce(globalFilterValue, SEARCH_DELAY);
    const [filters, setFilters] = useState({ global: { value: '' } });
    const [sortField, setSortField] = useState('created_at');
    const [sortOrder, setSortOrder] = useState(-1);
    const [perPage, setPerPage] = useState(50);
    const [page, setPage] = useState(1);

    const [scheduleModel, setScheduleModel] = useState(false);
    const [holidayDate, setHolidayDate] = useState(null);
    const [is_edit, setIs_Edit] = useState(false);
    const [is_add, setIs_Add] = useState(false);
    const [editData, setEditData] = useState({});


    const fetchData = async () => {
        const request = {
            // limit: perPage,
            // offset: page,
            // search: globalFilterValue || "",
            // order_by: sortField,
            // order_direction: sortOrder === 1 ? 'asc' : 'desc',
        };
        try {
            await dispatch(getHolidayListThunk(request));
        } finally {
            // dispatch(setLoader(false));
        }
    };

    useEffect(() => {
        fetchData();
    }, [debounce, page, is_edit, is_add, selectedUser]);

    const closeModelFunc = async () => {
        setScheduleModel(false);
        setIs_Edit(false);
        setIs_Add(false);
        setEditData({});
        setHolidayDate(dayjs());
        reset();
    }

    const handleDelete = (is_true) => {
        if (is_true) {
            dispatch(setLoader(true));
            let submitData = {
                holiday_id: selectedUser?.id,
                is_deleted: 0,
            };
            deleteHolidays(submitData).then((response) => {
                if (response.code == Codes?.SUCCESS) {
                    closeModel(dispatch);

                    const updatedList = listHoliday?.filter(
                        (item) => item.id !== selectedUser?.id
                    );

                    dispatch(updateHolidayList(updatedList));
                    setSelectedUser(null);
                    dispatch(setLoader(false));
                    TOAST_SUCCESS(response?.message);
                } else {
                    closeModel(dispatch);
                    TOAST_ERROR(response?.message);
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
        setGlobalFilterValue(value);
    };

    const onPageChange = (Data) => {
        setPage(Data)
    }

    const handleSort = (event) => {
        console.log("Sort event triggered:", event);
        setSortField(event.sortField); // ✅ correct key
        setSortOrder(event.sortOrder);
    };

    const onSubmitData = async (data) => {
        try {
            let request = {
                name: data[AstroInputTypesEnum.NAME],
                date: formatDateDyjs(holidayDate, DateFormat.DATE_DASH_TIME_FORMAT),
            }
            dispatch(setLoader(true))
            if (is_edit) {
                request.holiday_id = editData.id;
                updateHolidays(request).then((response) => {
                    if (response?.code == Codes.SUCCESS) {
                        TOAST_SUCCESS(response?.message)
                        navigat(PATHS?.HOLIDAYS_LIST)
                        setIs_Edit(false)
                        setScheduleModel(false)
                        setHolidayDate(dayjs())
                        setEditData({})
                        closeModelFunc()
                        dispatch(setLoader(false))
                        reset()
                    } else {
                        setIs_Edit(false)
                        setScheduleModel(false)
                        TOAST_ERROR(response.message)
                        reset()
                        dispatch(setLoader(false))
                        closeModelFunc()
                    }
                })
            } else {
                addHolidays(request).then((response) => {
                    if (response?.code == Codes.SUCCESS) {
                        TOAST_SUCCESS(response?.message)
                        navigat(PATHS?.HOLIDAYS_LIST)
                        setScheduleModel(false)
                        setHolidayDate(dayjs())
                        closeModelFunc();
                        setIs_Add(false)
                        dispatch(setLoader(false))

                    } else {
                        setIs_Edit(false)
                        setIs_Add(false)
                        setScheduleModel(false)
                        closeModelFunc();
                        TOAST_ERROR(response.message)
                        dispatch(setLoader(false))
                    }
                })
            }
        } catch (error) {
            dispatch(setLoader(false))
            TOAST_ERROR('Somthing went wrong')
        }
    }

    const editFunction = async (data) => {
        setValue(AstroInputTypesEnum.NAME, data?.name)
        setHolidayDate(data?.date ? dayjs(data?.date) : null)
        setIs_Edit(true)
        setScheduleModel(true)
        setEditData(data)
    }

    return (
        <>
            <div className="container-fluid mw-100">
                <SubNavbar title={"Holidays List"} header={'Holidays List'} />
                <div className="widget-content searchable-container list">

                    {/* <div className="card card-body">
                        <div className="row">
                            <div className="col-12 col-md-6 col-lg-3">
                                <div className="position-relative">
                                    <input type="text" className="form-control product-search ps-5" id="input-search" placeholder="Search interest..."
                                        value={globalFilterValue}
                                        onChange={onGlobalFilterChange} />
                                    <i className="ti ti-search position-absolute top-50 start-0 translate-middle-y fs-6 text-dark ms-3" />
                                </div>
                            </div>

                            <div className="col-12 col-md-6 col-lg-9">
                                <div className="d-flex flex-column flex-md-row justify-content-end align-items-stretch gap-2 ">
                                    <Link
                                        id="btn-add-contact"
                                        className="btn btn-info d-flex align-items-center justify-content-center mt-3 mt-md-0  w-md-auto "
                                        style={{ height: '40px' }}
                                        onClick={() => { setScheduleModel(true); setIs_Add(true) }}
                                    >
                                        <span className="me-1">
                                            <IoAddCircleOutline style={{ fontSize: '1.2rem' }} />
                                        </span>
                                        <span className="fw-semibold">Add EMI schedule</span>
                                    </Link>
                                </div>
                            </div>
                            <div className="col-md-8 col-xl-9 text-end d-flex justify-content-md-end justify-content-center mt-3 mt-md-0 gap-3">

                            </div>
                        </div>
                    </div> */}

                    <div className="card card-body">
                        <div className="row border-bottom pb-3">
                            <div className="col-12 col-md-6 col-lg-3">
                                {/* <div className="position-relative">
                                    <input type="text" className="form-control product-search ps-5" id="input-search" placeholder="Search interest..."
                                        value={globalFilterValue}
                                        onChange={onGlobalFilterChange} />
                                    <i className="ti ti-search position-absolute top-50 start-0 translate-middle-y fs-6 text-dark ms-3" />
                                </div> */}
                            </div>

                            <div className="col-12 col-md-6 col-lg-9">
                                <div className="d-flex flex-column flex-md-row justify-content-end align-items-stretch gap-2 ">
                                    <Link
                                        // to="/emi_schedule_list/add_emi_schedule"
                                        id="btn-add-contact"
                                        className="btn btn-info d-flex align-items-center justify-content-center mt-3 mt-md-0  w-md-auto "
                                        style={{ height: '40px' }}
                                        onClick={() => { setScheduleModel(true); setIs_Add(true) }}
                                    >
                                        <span className="me-1">
                                            <IoAddCircleOutline style={{ fontSize: '1.2rem' }} />
                                        </span>
                                        <span className="fw-semibold">Add Holidays</span>
                                    </Link>
                                </div>
                            </div>
                            <div className="col-md-8 col-xl-9 text-end d-flex justify-content-md-end justify-content-center mt-3 mt-md-0 gap-3">
                            </div>
                        </div>
                        <div className="table-responsive mt-2">
                            <DataTable
                                value={listHoliday}
                                paginator
                                rows={15}
                                // globalFilter={globalFilterValue}
                                rowsPerPageOptions={[5, 10, 20]}
                                currentPageReportTemplate='Showing {first} to {last} of {totalRecords} entries'
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                loading={loading}
                                sortField={sortField}
                                sortOrder={sortOrder}
                                onSort={handleSort}
                                emptyMessage={<span style={{ textAlign: 'center', display: 'block' }}>No Holidays found.</span>}
                            >
                                <Column
                                    field="id"
                                    header="Id"
                                    style={{ minWidth: '6rem' }}
                                    body={(rowData, options) => options.rowIndex + 1}
                                    sortable
                                // showFilterMenu={true}
                                />

                                <Column field="date" header="Date" sortable style={{ minWidth: '10rem' }} body={(rowData) => (
                                    <span>{formatDate(rowData.date, DateFormat.DATE_FORMAT) || '-'}</span>
                                )} />

                                <Column field="date" header="Day" sortable style={{ minWidth: '10rem' }} body={(rowData) => (
                                    <span>{formatDate(rowData.date, DateFormat.DATE_WEEK_NAME_FORMAT) || '-'}</span>
                                )} />

                                <Column field="name" header="Name" sortable style={{ minWidth: '10rem' }} body={(rowData) => (
                                    <span>{rowData?.name || '-'}</span>
                                )} />

                                <Column field="status" header="Action" style={{ minWidth: '10rem' }} body={(rowData) => (
                                    <div className="action-btn">
                                        <a className="text-info edit cursor_pointer cursor_pointer  ms-2" onClick={() => { editFunction(rowData) }} >
                                            <i class="ti ti-edit fs-7"></i>
                                        </a>
                                        <a className="text-dark delete ms-2 cursor_pointer cursor_pointer" onClick={() => { openModel(dispatch, ModelName.DELETE_MODEL); setSelectedUser(rowData) }}>
                                            <i className="ti ti-trash fs-7 text-danger" />
                                        </a>
                                    </div>
                                )} />

                            </DataTable>

                            <div className=''>
                                <Pagination per_page={perPage} pageCount={listHoliday?.total_count} onPageChange={onPageChange} page={page} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`modal custom-modal  ${scheduleModel ? "fade show d-block " : "d-none"}`}
                id="addnotesmodal" tabIndex={-1} role="dialog" aria-labelledby="addnotesmodalTitle" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-sm modal-md modal-lg" role="document">
                    <div className="modal-content border-0">
                        <div className="modal-header bg-primary " style={{ borderRadius: '10px 10px 0px 0px' }}>
                            <h6 className="modal-title text-dark fs-5">{is_edit ? 'Edit' : 'Add'} Holidays</h6>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" onClick={() => { closeModelFunc() }} />
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit(onSubmitData)}>
                                <div className="col-lg-12">
                                    <div className="card-body p-4">
                                        <div className='row d-flex gap-3'>
                                            <div className='col'>
                                                <div className="mb-2">
                                                    <label htmlFor="lastname" className="form-label fw-semibold">
                                                        Name <span className="text-danger ms-1">*</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <input
                                                            type="text"
                                                            className="form-control ps-2"
                                                            placeholder="Enter name"
                                                            autoComplete='nope'
                                                            {...register(AstroInputTypesEnum.NAME, textInputValidation(AstroInputTypesEnum.NAME, 'Enter name'))}
                                                        />
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.NAME]?.message}
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <label htmlFor="payment_date" className="form-label fw-semibold">
                                                    Date<span className="text-danger ms-1">*</span>
                                                </label>
                                                <div className="input-group">
                                                    <DatePicker
                                                        id={AstroInputTypesEnum.DATE}
                                                        className="paymnet-custom-datepicker w-100"
                                                        format={'YYYY-MM-DD'}
                                                        value={holidayDate}
                                                        onChange={(date) => {
                                                            setHolidayDate(date); // Store date in state
                                                        }}
                                                    />
                                                </div>
                                                <label className="errorc ps-1 pt-1">
                                                    {errors[AstroInputTypesEnum.DATE]?.message}
                                                </label>
                                            </div>
                                        </div>
                                        <div className="modal-footer justify-content-center">
                                            <button type="button" className="btn btn-danger" onClick={() => { closeModelFunc() }}>Cancel</button>
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
                scheduleModel && (
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


