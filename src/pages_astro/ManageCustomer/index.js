import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import SubNavbar from '../../layout/SubNavbar';
import { EditUser } from '../../utils/api.services';
import { TOAST_ERROR, TOAST_SUCCESS } from '../../config/common';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { getCustomerListThunk, setLoader, updateCustomerList } from '../../Store/slices/MasterSlice';
import { Codes, ModelName, SEARCH_DELAY } from '../../config/constant';
import useDebounce from '../hooks/useDebounce';
import { closeModel, openModel } from '../../config/commonFunction';
import Model from '../../component/Model';
import { DeleteComponent } from '../CommonPages/CommonComponent';
import { AstroInputTypesEnum, DateFormat, EMPLOYEE_STATUS, STATUS_COLORS } from '../../config/commonVariable';
import { IoAddCircleOutline } from 'react-icons/io5';
import { Controller, useForm } from 'react-hook-form';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';

export default function ManageCoustomer() {

    let navigat = useNavigate();
    const dispatch = useDispatch();

    const { register, handleSubmit, setValue, reset, control, formState: { errors } } = useForm();
    const { customerList: { data: customerList }, } = useSelector((state) => state.masterslice);
    const { customModel } = useSelector((state) => state.masterslice);
    const [selectedUser, setSelectedUser] = useState()
    const [filters, setFilters] = useState({ global: { value: '' } });
    const [employeeStatus, setEmployeeStatus] = useState(EMPLOYEE_STATUS[0]);
    const [addEmployeeLeaveModal, setAddEmployueeLeave] = useState(false);

    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const debounce = useDebounce(globalFilterValue, SEARCH_DELAY);

    const fetchData = async () => {
        const request = {
            emp_leave_company: employeeStatus?.key
        };
        try {
            await dispatch(getCustomerListThunk(request));
        } finally {
        }
    };

    useEffect(() => {
        if (customerList?.length === 0) {
            fetchData();
        }
    }, [debounce]);

    const handleDelete = (is_true) => {
        if (is_true) {
            dispatch(setLoader(true));
            let submitData = {
                action: "admin",
                user_id: selectedUser?.id,
                is_deleted: 1
            }
            EditUser(submitData).then((response) => {
                if (response.status_code === Codes?.SUCCESS) {
                    const updatedList = customerList?.filter((item) => item.id !== selectedUser?.id);
                    dispatch(updateCustomerList(updatedList))
                    closeModel(dispatch)
                    dispatch(setLoader(false))
                    TOAST_SUCCESS(response?.message);
                    // fetchData()
                } else {
                    closeModel(dispatch)
                    TOAST_ERROR(response?.message)
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
        setGlobalFilterValue(value);
    };

    const openLeaveModelFunc = (data) => {
        setValue(AstroInputTypesEnum.ID, data?.id)
        setAddEmployueeLeave(true)
    }

    const closeLeaveModelFunc = () => {
        reset()
        setAddEmployueeLeave(false)
    }

    const onSubmitData = async (data) => {
        dispatch(setLoader(true))
        let submitData = {
            action: "admin",
            emp_leave_company: "1",
            emp_leave_date: data[AstroInputTypesEnum.DATE],
            emp_leave_reason: data[AstroInputTypesEnum.REASON],
            employee_id: data[AstroInputTypesEnum.ID],
        }
        EditUser(submitData).then((response) => {
            if (response.code == Codes.SUCCESS) {
                TOAST_SUCCESS(response?.message)
                const updatedList = customerList?.filter((item) => item.id !== data[AstroInputTypesEnum.ID]);
                dispatch(updateCustomerList(updatedList))
                dispatch(setLoader(false))
                closeLeaveModelFunc()
            } else {
                dispatch(setLoader(false))
                TOAST_ERROR(response?.message)
            }
        })
    }

    const onChangeApiCalling = async (data) => {
        try {
            const request = {
                emp_leave_company: data?.key,
            };
            await dispatch(getCustomerListThunk(request));
        } finally {
        }
    };

    return (
        <>
            <div className="container-fluid mw-100">

                <SubNavbar title={"Employee List"} header={'Employee List'} />

                <div className="widget-content searchable-container list">

                    <div className="card card-body p-3 mb-2">
                        <div className="row">

                            <div className="col-12 col-md-6 col-lg-3 mb-3 mb-md-0">
                                <div className="position-relative">
                                    <input
                                        type="text"
                                        className="form-control product-search ps-5"
                                        id="input-search"
                                        placeholder="Search Employee..."
                                        value={globalFilterValue}
                                        onChange={onGlobalFilterChange}
                                    />
                                    <i className="ti ti-search position-absolute top-50 start-0 translate-middle-y fs-6 text-dark ms-3" />
                                </div>
                            </div>

                            <div className="col-12 col-md-6 col-lg-6 mb-3 mb-md-0 mb-2">
                            </div>

                            {/* Status Dropdown */}
                            <div className="col-12 col-md-6 col-lg-1 mb-3 mb-md-0">
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
                                        to="/user_list/add_user"
                                        id="btn-add-contact"
                                        className="btn btn-info d-flex align-items-center justify-content-center w-100 w-md-auto"
                                        style={{ height: '40px' }}
                                    >
                                        <span className="me-1">
                                            <IoAddCircleOutline style={{ fontSize: '1.2rem' }} />
                                        </span>
                                        <span className="fw-semibold">Add Employee</span>
                                    </Link>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="card card-body">
                        <div className="table-responsive">
                            <DataTable
                                value={customerList}
                                paginator
                                rows={15}
                                globalFilter={globalFilterValue}
                                rowsPerPageOptions={
                                    customerList?.length > 50
                                        ? [20, 30, 50, customerList?.length]
                                        : [20, 30, 40]
                                }
                                currentPageReportTemplate='Showing {first} to {last} of {totalRecords} entries'
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                // loading={loading}
                                // sortField={sortField}
                                // sortOrder={sortOrder}
                                emptyMessage={<span style={{ textAlign: 'center', display: 'block' }}>No Customer found.</span>}
                            >
                                <Column
                                    field="id"
                                    header="Id"
                                    style={{ minWidth: '4rem' }}
                                    body={(rowData, options) => options.rowIndex + 1}
                                    sortable
                                    showFilterMenu={true}
                                />

                                <Column field="employee_id" header="Employee Id" style={{ minWidth: '8rem', whiteSpace: 'nowrap' }} body={(rowData) => (
                                    <span className='me-2'>{rowData.employee_id || '-'}</span>
                                )} />

                                <Column field="phone_number" header="Mobile No" style={{ minWidth: '8rem' }} body={(rowData) => (
                                    <span className='me-2'>{rowData.phone_number || '-'}</span>
                                )} />

                                <Column
                                    field="name"
                                    header="Name"
                                    style={{ minWidth: '10rem', whiteSpace: 'nowrap', textTransform: 'capitalize' }}
                                    body={(rowData) => <span className='me-2'>{rowData.name || '-'}</span>}
                                />

                                <Column field="email" header="Email" style={{ minWidth: '12rem' }} body={(rowData) => (
                                    <span className='me-2'>{rowData.email || '-'}</span>
                                )} />

                                <Column field="emp_leave_company" data-pc-section="root" sortable header="Status" style={{ minWidth: '6rem' }} body={(rowData) => (
                                    <>
                                        {rowData?.emp_leave_company == "0" ? (
                                            <span className={`p-tag p-component cursor_pointer badge status_font text-light fw-semibold px-3 rounded-4 py-2 me-2  ${STATUS_COLORS.SUCCESS}`} data-pc-name="tag" data-pc-section="root" onClick={() => { openLeaveModelFunc(rowData) }} >
                                                <span className="p-tag-value" data-pc-section="value">Active</span>
                                            </span>
                                        ) : (
                                            // onClick={() => { handleStatus(rowData?.id, "0") }}
                                            <span className={`p-tag p-component badge status_font text-light fw-semibold px-3 rounded-4 py-2 me-2 cursor_pointer ${STATUS_COLORS.DANGER}`} data-pc-name="tag" data-pc-section="root" onClick={() => { openLeaveModelFunc(rowData) }}  >
                                                <span className="p-tag-value" data-pc-section="value">Inactive</span>
                                            </span>
                                        )}
                                    </>
                                )} />

                                <Column field="statuss" header="Action" style={{ minWidth: '10rem' }} body={(rowData) => (
                                    <div className="action-btn">
                                        <a className="text-custom-theam edit cursor_pointer cursor_pointer" onClick={() => navigat(`/user_list/edit_user`, { state: rowData })} >
                                            <i class="ti ti-edit fs-7"></i>
                                        </a>
                                        <Link to={'/user_list/user_details'} state={rowData} className="text-custom-theam edit cursor_pointer">
                                            <i className="ti ti-eye fs-7 ms-2" />
                                        </Link>
                                        <a className="text-dark delete ms-2 cursor_pointer cursor_pointer" onClick={() => { openModel(dispatch, ModelName.DELETE_MODEL); setSelectedUser(rowData) }}>
                                            <i className="ti ti-trash fs-7 text-danger" />
                                        </a>
                                    </div>
                                )} />

                            </DataTable>
                        </div>
                    </div>
                </div>
            </div>

            {/* </div> */}

            <div className={`modal custom-modal  ${addEmployeeLeaveModal ? "fade show d-block " : "d-none"}`}
                id="addnotesmodal" tabIndex={-1} role="dialog" aria-labelledby="addnotesmodalTitle" aria-hidden="true">
                <div className="modal-dialog modal-md modal-dialog-centered" role="document" >
                    <div className="modal-content border-0">
                        <div className="modal-header bg-primary" style={{ borderRadius: '10px 10px 0px 0px' }}>
                            <h6 className="modal-title fs-5">{'Leave Employee Details'} </h6>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" onClick={() => { closeLeaveModelFunc() }} />
                        </div>

                        <div className="modal-body">
                            <form onSubmit={handleSubmit(onSubmitData)}>
                                <div className="col-lg-12">
                                    <div className="card-body p-2">
                                        <div className="row g-3">
                                            <input type="hidden" value="some_default_value" {...register(AstroInputTypesEnum.ID)} />
                                            <div className="">
                                                <div className="col-12 ">
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
                                                                className="form-control custom-datepicker w-100"
                                                                format={DateFormat?.DATE_FORMAT}
                                                                value={field.value ? dayjs(field.value, DateFormat?.DATE_FORMAT) : null}
                                                                onChange={(date) => field.onChange(date ? dayjs(date).format(DateFormat?.DATE_FORMAT) : null)}
                                                            />
                                                        )}
                                                    />
                                                    {errors.dob1 && (
                                                        <small className="text-danger">{errors.dob1.message}</small>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="">
                                                <label htmlFor="leave_reason" className="form-label fw-semibold">
                                                    Reason<span className="text-danger ms-1">*</span>
                                                </label>
                                                <div className="input-group border rounded-1">
                                                    <textarea
                                                        className="form-control ps-2"
                                                        rows={3}
                                                        placeholder="Enter reason for leave"
                                                        {...register(AstroInputTypesEnum.REASON, {
                                                            required: "Enter reason for leave",
                                                        })}
                                                    ></textarea>
                                                </div>
                                                <label className="errorc ps-1 pt-1">
                                                    {errors[AstroInputTypesEnum.REASON]?.message}
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
                addEmployeeLeaveModal && (
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


