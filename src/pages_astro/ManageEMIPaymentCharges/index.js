import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../layout/Header';
import Slidebar from '../../layout/Slidebar';
import $ from 'jquery';
import 'datatables.net-bs5';
import 'datatables.net-responsive-bs5';
import SubNavbar from '../../layout/SubNavbar';
import { addEMICharge, addHolidays, updateEMICharge, updateHolidays } from '../../utils/api.services';
import { TOAST_ERROR, TOAST_SUCCESS } from '../../config/common';
import profile_image from '../../assets/Images/default.jpg'
import ReactDatatable from '../../config/ReactDatatable';
import { Helmet } from 'react-helmet';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { getCustomerListThunk, getEMIChargeListThunk, getHolidayListThunk, getSalaryListThunk, setLoader, updateCustomerList, updateEMICahrgeList, updateHolidayList, updateIntrestList } from '../../Store/slices/MasterSlice';
import Constatnt, { Codes, ModelName, SEARCH_DELAY } from '../../config/constant';
import useDebounce from '../hooks/useDebounce';
import { closeModel, formatDate, formatIndianPrice, openModel, textInputValidation } from '../../config/commonFunction';
import Model from '../../component/Model';
import { DeleteComponent } from '../CommonPages/CommonComponent';
import Pagination from '../../component/Pagination';
import { AstroInputTypesEnum, DateFormat, InputRegex, LOAN_TYPES, PAYMENT_CHARGE_TYPES } from '../../config/commonVariable';
import { IoAddCircleOutline } from 'react-icons/io5';
import { useForm } from 'react-hook-form';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';

export default function EMIPaymentCharges() {

    let navigat = useNavigate();
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        setValue,
        clearErrors,
        reset,
        watch,
        control,
        trigger,
        formState: { errors },
    } = useForm();

    const { emiChargesList: { data: emiChargeList }, } = useSelector((state) => state.masterslice);
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
    const [scheduleDate, setScheduleDate] = useState(dayjs());
    const [is_edit, setIs_Edit] = useState(false);
    const [is_add, setIs_Add] = useState(false);
    const [editData, setEditData] = useState({});
    const PAYMENT_CHARGE_TYPE = [
        { key: "", value: "ALL PAYMENT STATUS" },
        { key: "BOUNCE_CHARGE", value: "BOUNCE CHARGE" },
        { key: "FORECLOSURE_CHARGE", value: "FORECLOSURE CHARGE" },
        { key: "PENALTY", value: "PENALTY" }
    ]

    const fetchData = async () => {
        const request = {
            // limit: perPage,
            // offset: page,
            // search: globalFilterValue || "",
            // order_by: sortField,
            // order_direction: sortOrder === 1 ? 'asc' : 'desc',
        };
        try {
            await dispatch(getEMIChargeListThunk(request));
        } finally {
            // dispatch(setLoader(false));
        }
    };

    useEffect(() => {
        fetchData();
    }, [debounce, page, is_edit, is_add, selectedUser]);

    const closeModelFunc = async () => {
        reset();
        setScheduleModel(false);
        setIs_Edit(false);
        setIs_Add(false);
        setEditData({});
        setScheduleDate(dayjs());
        setValue(AstroInputTypesEnum.PAYMENT_CHARGE_TYPE, "")
        setValue(AstroInputTypesEnum.AMOUNT, "");
    }

    const handleDelete = (is_true) => {
        if (is_true) {

            dispatch(setLoader(true));
            let submitData = {
                status: selectedUser?.status,
                amount: selectedUser?.amount,
                charge_id: selectedUser?.id,
                is_deleted: true,
            };
            updateEMICharge(submitData).then((response) => {
                if (response.status_code === Codes?.SUCCESS) {
                    closeModel(dispatch);
                    const updatedList = emiChargeList?.charges?.filter(
                        (item) => item.id !== selectedUser?.id
                    );
                    dispatch(
                        updateEMICahrgeList({
                            ...emiChargeList,
                            charges: updatedList,
                        })
                    );
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
                status: data[AstroInputTypesEnum.PAYMENT_CHARGE_TYPE],
                amount: data[AstroInputTypesEnum.AMOUNT]
            }
            dispatch(setLoader(true))
            if (is_edit) {
                request.charge_id = editData.id;
                updateEMICharge(request).then((response) => {
                    if (response?.status_code === Codes.SUCCESS) {
                        TOAST_SUCCESS(response?.message)
                        navigat('/emi_payment_charges')
                        setIs_Edit(false)
                        setScheduleModel(false)
                        setEditData({})
                        closeModelFunc()
                    } else {
                        setIs_Edit(false)
                        setScheduleModel(false)
                        TOAST_ERROR(response.message)
                        closeModelFunc()
                    }
                })
            } else {
                addEMICharge(request).then((response) => {
                    if (response?.status_code === Codes.SUCCESS) {
                        TOAST_SUCCESS(response?.message)
                        navigat('/emi_payment_charges')
                        setScheduleModel(false)
                        closeModelFunc();
                        setIs_Add(false)
                    } else {
                        setIs_Edit(false)
                        setIs_Add(false)
                        setScheduleModel(false)
                        closeModelFunc();
                        TOAST_ERROR(response.message)
                    }
                })
            }
            dispatch(setLoader(false))
        } catch (error) {
            TOAST_ERROR('Somthing went wrong')
        }
    }

    const editFunction = async (data) => {

        const matched = PAYMENT_CHARGE_TYPE.find(item => item.key === data?.status);
        if (matched) {
            setValue(AstroInputTypesEnum.PAYMENT_CHARGE_TYPE, matched.key);
        }
        setValue(AstroInputTypesEnum.AMOUNT, data?.amount);
        setIs_Edit(true)
        setScheduleModel(true)
        setEditData(data)
    }

    const handleInputChange = async (key, value) => {
        let filteredValue = value;
        if (key === AstroInputTypesEnum.PANCARD) {
            filteredValue = value.replace(InputRegex.ONCHANGE_PANNUMBER_REGEX, '');
        } else if (key === AstroInputTypesEnum.ADHARCARD) {
            filteredValue = value.replace(InputRegex.ONCHANGE_AADHAR_REGEX, '');
        } else if (key === AstroInputTypesEnum.MOBILE || AstroInputTypesEnum?.ANNUAL_INCOME || AstroInputTypesEnum?.DESIRED_LOAN_AMOUNT) {
            filteredValue = value.replace(InputRegex.ONCHANGE_MOBILE_REGEX, '');
        }
        else if (key === AstroInputTypesEnum.MOBILE || AstroInputTypesEnum?.ANNUAL_INCOME || AstroInputTypesEnum?.AMOUNT) {
            filteredValue = value.replace(InputRegex.ONCHANGE_MOBILE_REGEX, '');
        }
        setValue(key, filteredValue)
        clearErrors(key);
        await trigger(key);
    };

    return (
        <>
            <div className="container-fluid mw-100">

                <SubNavbar title={"EMI Payment Charges"} header={'EMI Payment Charges List'} />

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
                                        <span className="fw-semibold">Add EMI Charges</span>
                                    </Link>
                                </div>
                            </div>
                            <div className="col-md-8 col-xl-9 text-end d-flex justify-content-md-end justify-content-center mt-3 mt-md-0 gap-3">
                            </div>
                        </div>

                        <div className="table-responsive mt-2">
                            <DataTable
                                value={emiChargeList?.charges}
                                // paginator
                                rows={15}
                                // rowsPerPageOptions={[5, 10, 20]}
                                currentPageReportTemplate='Showing {first} to {last} of {totalRecords} entries'
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                loading={loading}
                                sortField={sortField}
                                sortOrder={sortOrder}
                                onSort={handleSort}
                                emptyMessage={<span style={{ textAlign: 'center', display: 'block' }}>No EMI Charges found.</span>}
                            >

                                <Column
                                    field="id"
                                    header="Id"
                                    style={{ minWidth: '6rem' }}
                                    body={(rowData, options) => options.rowIndex + 1}
                                    sortable
                                // showFilterMenu={true}
                                />

                                <Column field="charge_type" header="Charge Type" sortable style={{ minWidth: '10rem' }} body={(rowData) => (
                                    <span>{PAYMENT_CHARGE_TYPE.find(item => item.key === rowData.status).value || '-'}</span>
                                )} />

                                <Column field="emi_schedule_date" header="Charge Amount" sortable style={{ minWidth: '10rem' }} body={(rowData) => (
                                    <span>{formatIndianPrice(rowData.amount) || '-'}</span>
                                )} />

                                <Column field="is_deleted" data-pc-section="root" header="Status" style={{ minWidth: '8rem' }} body={(rowData) => (
                                    <>
                                        {!rowData?.is_deleted ? (
                                            <span className="p-tag p-component p-tag-success  badge bg-success p-1" data-pc-name="tag" data-pc-section="root"  >
                                                <span className="p-tag-value" data-pc-section="value">Active</span>
                                            </span>
                                        ) : (
                                            <span className="p-tag p-component p-tag-danger  badge bg-danger p-1" data-pc-name="tag" data-pc-section="root" >
                                                <span className="p-tag-value" data-pc-section="value">Inactive</span>
                                            </span>
                                        )}
                                    </>
                                )} />

                                <Column field="statuss" header="Action" style={{ minWidth: '10rem' }} body={(rowData) => (
                                    <div className="action-btn">
                                        <a className={`text-info edit cursor_pointer cursor_pointer  ms-2 ${rowData.is_deleted && 'disabled-btn'}`} onClick={() => { !rowData.is_deleted && editFunction(rowData) }} >
                                            <i class="ti ti-edit fs-7"></i>
                                        </a>
                                        <a className={`text-dark delete ms-2 cursor_pointer  ${rowData.is_deleted && 'disabled-btn'}`} onClick={() => { !rowData.is_deleted && openModel(dispatch, ModelName.DELETE_MODEL); setSelectedUser(rowData) }}>
                                            <i className="ti ti-trash fs-7 text-danger" />
                                        </a>
                                    </div>
                                )} />

                            </DataTable>

                            <div className=''>
                                <Pagination per_page={perPage} pageCount={emiChargeList?.total_count} onPageChange={onPageChange} page={page} />
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
                            <h6 className="modal-title text-dark fs-5">{is_edit ? 'Edit' : 'Add'} Payment Charges </h6>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" onClick={() => { closeModelFunc() }} />
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit(onSubmitData)}>
                                <div className="col-lg-12">
                                    <div className="card-body p-4">
                                        <div className='row d-flex gap-3'>
                                            <div className='col'>
                                                <div className="mb-2">
                                                    <label htmlFor="gender1" className="form-label fw-semibold">
                                                        Charge Type <span className="text-danger ms-1">*</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <select
                                                            id="gender1"
                                                            className="form-control ps-2 p-2"
                                                            autoComplete="nope"
                                                            disabled={is_edit}
                                                            {...register(AstroInputTypesEnum.PAYMENT_CHARGE_TYPE, {
                                                                required: "Select Charge Type",
                                                            })}
                                                        >
                                                            {PAYMENT_CHARGE_TYPE?.map((charge) => (
                                                                <option key={charge.id} value={charge.key}>
                                                                    {charge?.value}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.PAYMENT_CHARGE_TYPE]?.message}
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <label htmlFor="lastname" className="form-label fw-semibold">
                                                    Charge Amount<span className="text-danger ms-1">*</span>
                                                </label>
                                                <div className="input-group border rounded-1">
                                                    <input
                                                        type="text"
                                                        className="form-control ps-2"
                                                        placeholder={'Charge Amount'}
                                                        autoComplete='nope'
                                                        // {...register('category_en', { required: "Enter category" })}
                                                        {...register(AstroInputTypesEnum.AMOUNT, textInputValidation(AstroInputTypesEnum.AMOUNT, 'Enter Charge Amount'))}
                                                        onChange={(e) => handleInputChange(AstroInputTypesEnum.AMOUNT, e.target.value)}
                                                        maxLength={10}
                                                    />
                                                </div>
                                                <label className="errorc ps-1 pt-1">
                                                    {errors[AstroInputTypesEnum.AMOUNT]?.message}
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


