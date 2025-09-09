import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../layout/Header';
import Slidebar from '../../layout/Slidebar';
import $ from 'jquery';
import 'datatables.net-bs5';
import 'datatables.net-responsive-bs5';
import SubNavbar from '../../layout/SubNavbar';
import { EditUser, CustomerList } from '../../utils/api.services';
import { ExportToCSV, ExportToExcel, ExportToPdf, SWIT_DELETE, SWIT_DELETE_SUCCESS, TOAST_ERROR, TOAST_SUCCESS } from '../../config/common';
import profile_image from '../../assets/Images/default.jpg'
import ReactDatatable from '../../config/ReactDatatable';
import { Helmet } from 'react-helmet';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { getCustomerListThunk, setLoader, updateCustomerList } from '../../Store/slices/MasterSlice';
import Constatnt, { Codes, ModelName, SEARCH_DELAY } from '../../config/constant';
import useDebounce from '../hooks/useDebounce';
import { closeModel, formatDate, getAllStatusObject, getLoanStatusObject, openModel } from '../../config/commonFunction';
import Model from '../../component/Model';
import { DeleteComponent } from '../CommonPages/CommonComponent';
import Pagination from '../../component/Pagination';
import { DateFormat, STATUS_COLORS } from '../../config/commonVariable';
import { IoAddCircleOutline } from 'react-icons/io5';

export default function ManageCoustomer() {

    let navigat = useNavigate();
    const dispatch = useDispatch();

    const [totalRows, setTotalRows] = useState(0);

    const [checked, setChecked] = useState('');
    const [is_load, setis_load] = useState(false);

    const { customerList: { data: customerList }, } = useSelector((state) => state.masterslice);
    const { customModel } = useSelector((state) => state.masterslice);

    const [selectedUser, setSelectedUser] = useState()

    const [loading, setLoading] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const debounce = useDebounce(globalFilterValue, SEARCH_DELAY);
    const [filters, setFilters] = useState({ global: { value: '' } });
    const [sortField, setSortField] = useState('created_at');
    const [sortOrder, setSortOrder] = useState(-1);
    const [perPage, setPerPage] = useState(10);
    const [page, setPage] = useState(1);

    const hasInitialLoaded = useRef(false);

    const fetchData = async () => {
        const request = {
            // limit: perPage,
            // offset: page,
            // per_page: 15,
            // page: page,
            // search: globalFilterValue || "",
            // order_by: sortField,
            // order_direction: sortOrder === 1 ? 'asc' : 'desc',
        };
        try {
            // await dispatch(getCustomerListThunk(request));
        } finally {
            // dispatch(setLoader(false));
        }
    };

    useEffect(() => {
        // if (!hasInitialLoaded.current) {
        //     hasInitialLoaded.current = true;
        //     return; // Skip first effect run
        // }

        if (customerList?.length === 0) {
            fetchData();
        }
    }, [debounce, page, sortField, sortOrder]);

    const handleStatus = async (id, changeChecked) => {
        setis_load(true)
        let submitData = {
            action: "admin",
            emp_leave_company: changeChecked,
            employee_id: id,
        }
        EditUser(submitData).then((response) => {
            if (response.code == Codes.SUCCESS) {
                TOAST_SUCCESS(response?.message)
                let updatedList = customerList?.map((item) => {
                    if (id == item.id) {
                        return {
                            ...item,
                            emp_leave_company: changeChecked, // set current user
                        };
                    }
                    return item;
                });
                dispatch(updateCustomerList(updatedList))
            } else {
                setis_load(false)
                TOAST_ERROR(response?.message)
            }
        })
    }

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

    // ---------------------------------- Export Data ----------------------------------

    const handleExportApiCall = async () => {
        dispatch(setLoader(true));
        let submitData = {
            search: globalFilterValue
        }
        const { code, data: { customerList } } = await CustomerList(submitData);
        const customerData = customerList?.map((customer, index) => ({
            id: index + 1,
            FullName: `${customer.name || '-'}`,
            Contact: customer?.country_code + ' ' + customer?.mobile_number || '-',
            Email: customer?.email || '-',
            Gender: customer?.gender || '-',
            Address: customer?.curr_address || '-',
            CreateUser: formatDate(customer?.created_at, DateFormat?.DATE_YEAR_WISE_DASH_TIME_FORMAT) || '-'
        }));

        return { code, data: customerData }
    };

    const handleExportToPdfManage = async () => {
        const { code, data } = await handleExportApiCall();
        if (code === Codes.SUCCESS) {
            ExportToPdf(data, 'Customer List', 'Customer List');
        }
        dispatch(setLoader(false));
    };

    const handleExportToCSVManage = async () => {
        const { code, data } = await handleExportApiCall();
        if (code === Codes.SUCCESS) {
            ExportToCSV(data, 'Customer List');
        }
        dispatch(setLoader(false));

    };

    const handleExportToExcelManage = async () => {
        const { code, data } = await handleExportApiCall();
        if (code === Codes.SUCCESS) {
            ExportToExcel(data, 'Customer List');
        }
        dispatch(setLoader(false));
    };

    const onPageChange = (Data) => {
        setPage(Data)
    }

    const handleSort = (event) => {
        console.log("Sort event triggered:", event);
        setSortField(event.sortField); // ✅ correct key
        setSortOrder(event.sortOrder);
    };

    console.log('customerList', customerList);

    return (
        <>
            <div className="container-fluid mw-100">

                <SubNavbar title={"Employee List"} header={'Employee List'} />

                <div className="widget-content searchable-container list">

                    <div className="card card-body p-3 mb-2">
                        <div className="row">
                            <div className="col-12 col-md-6 col-lg-3">
                                <div className="position-relative">
                                    <input type="text" className="form-control product-search ps-5" id="input-search" placeholder="Search Employee..."
                                        value={globalFilterValue}
                                        onChange={onGlobalFilterChange} />
                                    <i className="ti ti-search position-absolute top-50 start-0 translate-middle-y fs-6 text-dark ms-3" />
                                </div>
                            </div>

                            <div className="col-12 col-md-6 col-lg-9">
                                <div className="d-flex flex-column flex-md-row justify-content-end align-items-stretch gap-2 ">
                                    {/* Add User Button */}
                                    <Link
                                        to="/user_list/add_user"
                                        id="btn-add-contact"
                                        // className="btn btn-info d-flex align-items-center justify-content-center mt-3 w-md-auto"
                                        className="btn btn-info d-flex align-items-center justify-content-center mt-3 mt-md-0  w-md-auto "
                                        style={{ height: '40px' }}
                                    >
                                        <span className="me-1">
                                            <IoAddCircleOutline style={{ fontSize: '1.2rem' }} />
                                        </span>
                                        <span className="fw-semibold">Add Employee</span>
                                    </Link>
                                </div>
                            </div>


                            <div className="col-md-8 col-xl-9 text-end d-flex justify-content-md-end justify-content-center mt-3 mt-md-0 gap-3">

                                {/* <Link to={'/astrologer_list/request_astrologer'} id="btn-add-contact" className="btn btn-info d-flex align-items-center" style={{ height: '40px' }}>
                                    <span className='me-2' >
                                        < RiUserReceivedLine style={{ fontSize: '1.2rem' }} />
                                    </span> Request Loan
                                </Link> */}

                                {/* <Link to={'/astrologer_list/add_astrologer'} id="btn-add-contact" className="btn btn-info d-flex align-items-center" style={{ height: '40px' }}>
                                    <i className="ti ti-category me-1 fs-6" />Add Astrologer
                                </Link> */}

                                {/* <div className="btn-group mb-2 ms-2"> */}

                                {/* <button type="button" className="btn btn-info dropdown-toggle " data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style={{ height: '40px' }}>
                                        {selectedOption?.value || 'Select Status'}
                                    </button> */}

                                {/* <ul className="dropdown-menu animated flipInx w-50">
                                        {screenOptions?.length > 0 && screenOptions?.map((option) => (
                                            <li key={option?.value}>
                                                <a
                                                    className="dropdown-item cursor_pointer text-black-50"
                                                    onClick={() => handleSelect(option)}
                                                >
                                                    {option?.label}
                                                </a>
                                            </li>
                                        ))}
                                    </ul> */}

                                {/* <ul className="dropdown-menu animated flipInx w-50">
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
                                    </ul> */}
                                {/* </div> */}

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
                                loading={loading}
                                sortField={sortField}
                                sortOrder={sortOrder}
                                // onSort={handleSort}
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

                                {/* <Column field="profile_image" header="Profile Image" style={{ minWidth: '7rem', whiteSpace: 'nowrap' }} body={(rowData) => (
                                    <img src={rowData?.profile_image || Constatnt?.DEFAULT_IMAGE} className='ms-2 rounded-circle  ' alt="Profile" style={{ alignSelf: 'center', height: '40px', width: '40px' }} />
                                )} /> */}

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
                                        {rowData?.emp_leave_company == 0 ? (
                                            <span className={`p-tag p-component cursor_pointer badge status_font text-light fw-semibold px-3 rounded-4 py-2 me-2  ${STATUS_COLORS.SUCCESS}`} data-pc-name="tag" data-pc-section="root" onClick={() => { handleStatus(rowData?.id, 1) }} >
                                                <span className="p-tag-value" data-pc-section="value">Active</span>
                                            </span>
                                        ) : (
                                            <span className={`p-tag p-component cursor_pointer badge status_font text-light fw-semibold px-3 rounded-4 py-2 me-2  ${STATUS_COLORS.DANGER}`} data-pc-name="tag" data-pc-section="root" onClick={() => { handleStatus(rowData?.id, 0) }}>
                                                <span className="p-tag-value" data-pc-section="value">Inactive</span>
                                            </span>
                                        )}
                                    </>
                                )} />

                                <Column field="statuss" header="Action" style={{ minWidth: '10rem' }} body={(rowData) => (
                                    <div className="action-btn">
                                        <a className="text-info edit cursor_pointer cursor_pointer" onClick={() => navigat(`/user_list/edit_user`, { state: rowData })} >
                                            <i class="ti ti-edit fs-7"></i>
                                        </a>
                                        <Link to={'/user_list/user_details'} state={rowData} className="text-info edit cursor_pointer">
                                            <i className="ti ti-eye fs-7 ms-2" />
                                        </Link>
                                        <a className="text-dark delete ms-2 cursor_pointer cursor_pointer" onClick={() => { openModel(dispatch, ModelName.DELETE_MODEL); setSelectedUser(rowData) }}>
                                            <i className="ti ti-trash fs-7 text-danger" />
                                        </a>
                                    </div>
                                )} />
                            </DataTable>

                            {/* <div className=''>
                                <Pagination per_page={perPage} pageCount={customerList?.total_count} onPageChange={onPageChange} page={page} />
                            </div> */}

                        </div>
                    </div>
                </div>
            </div>

            {/* </div> */}

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


