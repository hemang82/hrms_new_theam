import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../layout/Header';
import Slidebar from '../../layout/Slidebar';
import $ from 'jquery';
import 'datatables.net-bs5';
import 'datatables.net-responsive-bs5';
import SubNavbar from '../../layout/SubNavbar';
import { ExportToCSV, ExportToExcel, ExportToPdf, SWIT_DELETE, SWIT_DELETE_SUCCESS, TOAST_ERROR, TOAST_SUCCESS } from '../../config/common';
import profile_image from '../../assets/Images/default.jpg'
import ReactDatatable from '../../config/ReactDatatable';
import { Helmet } from 'react-helmet';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import {  getListContactUsThunk, setLoader } from '../../Store/slices/MasterSlice';
import Constatnt, { Codes, ModelName, SEARCH_DELAY } from '../../config/constant';
import useDebounce from '../hooks/useDebounce';
import { closeModel, formatDate, openModel, truncateWords } from '../../config/commonFunction';
import Model from '../../component/Model';
import { DeleteComponent } from '../CommonPages/CommonComponent';
import Pagination from '../../component/Pagination';
import { DateFormat } from '../../config/commonVariable';

export default function ManageCoustomer() {

    let navigat = useNavigate();
    const dispatch = useDispatch();

    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [checked, setChecked] = useState('');
    const [is_load, setis_load] = useState(false);

    const { contactUsList: { data: contactUsList }, } = useSelector((state) => state?.masterslice);
    const { customModel } = useSelector((state) => state.masterslice);
    const [selectedUser, setSelectedUser] = useState()

    const [loading, setLoading] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const debounce = useDebounce(globalFilterValue, SEARCH_DELAY);
    const [filters, setFilters] = useState({ global: { value: '' } });
    const [customerDeleteModel, setCustomerDeleteModel] = useState(false);

    // let contactUsList = "";
    useEffect(() => {
        dispatch(setLoader(true));
        let request = {
            page: page,
            search: globalFilterValue,
        };
        dispatch(getListContactUsThunk(request))
        dispatch(setLoader(false));
    }, [is_load, debounce, page]);

    const handleDelete = (is_true) => {
        if (is_true) {
            setis_load(true)
            dispatch(setLoader(true));
            let submitData = {
                contactus_id: selectedUser?._id,
            }
            // deleteContactUs(submitData).then((response) => {
            //     if (response.code === Codes?.SUCCESS) {
            //         setis_load(false)
            //         closeModel(dispatch)
            //         dispatch(setLoader(false))
            //         setSelectedUser('')
            //         TOAST_SUCCESS(response?.message);
            //     }
            // });
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

    // ----------------------------------Export Data----------------------------------

    const handleExportApiCall = async () => {
        // dispatch(setLoader(true));
        // let submitData = {
        //     search: globalFilterValue
        // }
        // // const { code, data } = await exportContactUsList(submitData);
        // return { code, data }
    }

    const handleExportToPdfManage = async () => {
        const { code, data } = await handleExportApiCall();
        if (code === Codes.SUCCESS) {
            ExportToPdf(data, 'Contact us List', 'Contact us List');
        }
        dispatch(setLoader(false));
    }

    const handleExportToCSVManage = async () => {
        const { code, data } = await handleExportApiCall();
        if (code === Codes.SUCCESS) {
            ExportToCSV(data, 'Contact us List');
        }
        dispatch(setLoader(false));

    };

    const handleExportToExcelManage = async () => {
        const { code, data } = await handleExportApiCall();
        if (code === Codes.SUCCESS) {
            ExportToExcel(data, 'Contact us List');
        }
        dispatch(setLoader(false));
    };

    const onPageChange = (Data) => {
        setPage(Data)
    }
    console.log('contactUsList', contactUsList);



    return (
        <>
            <div className="container-fluid mw-100">
                <SubNavbar title={"ContactUs List"} header={'ContactUs List'} />
                <div className="widget-content searchable-container list">
                    {/* --------------------- start Contact ---------------- */}

                    <div className="card card-body ">
                        <div className="row border-bottom pb-4">
                            <div className="col-md-4 col-xl-3">
                                <div className="position-relative">
                                    <input type="text" className="form-control product-search ps-5" id="input-search" placeholder="Search Contact us..."
                                        value={globalFilterValue}
                                        onChange={onGlobalFilterChange} />
                                    <i className="ti ti-search position-absolute top-50 start-0 translate-middle-y fs-6 text-dark ms-3" />
                                </div>
                            </div>
                            <div className="col-md-8 col-xl-9 text-end d-flex justify-content-md-end justify-content-center mt-3 mt-md-0">
                                {/* <div className="action-btn show-btn" style={{ display: 'none' }}>
                                    <a href="javascript:void(0)" className="delete-multiple btn-light-danger btn me-2 text-danger d-flex align-items-center font-medium">
                                        <i className="ti ti-trash text-danger me-1 fs-5" /> Delete All Row
                                    </a>
                                </div>
                           
                                <div className="btn-group mb-2">
                                    <button type="button" className="btn btn-info dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        Export
                                    </button>

                                    <ul className="dropdown-menu animated flipInY">
                                        <li><a className="dropdown-item cursor_pointer text-black-50" onClick={handleExportToPdfManage}>PDF</a></li>
                                        <li><a className="dropdown-item cursor_pointer text-black-50" onClick={handleExportToCSVManage}>CSV</a></li>
                                        <li><a className="dropdown-item cursor_pointer text-black-50" onClick={handleExportToExcelManage}>Excel</a></li>
                                    </ul>
                                </div> */}

                            </div>
                        </div>
                        <div className="table-responsive mt-2">
                            <DataTable
                                value={contactUsList?.contact_entries}
                                // paginator
                                rows={8}
                                // rowsPerPageOptions={[5, 10, 20]}
                                currentPageReportTemplate='Showing {first} to {last} of {totalRecords} entries'
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                loading={loading}
                                emptyMessage={<span style={{ textAlign: 'center', display: 'block' }}>Contacts not found.</span>}
                            >
                                <Column
                                    field="id"
                                    header="Id"
                                    style={{ minWidth: '4rem' }}
                                    body={(rowData, options) => (page - 1) * Constatnt.per_page + options.rowIndex + 1}
                                    sortable
                                    showFilterMenu={true}
                                />

                                {/* <Column field="profile_image" header="Profile Image" style={{ minWidth: '8rem', whiteSpace: 'nowrap' }} body={(rowData) => (
                                    <img src={`https://danberkidz.s3.amazonaws.com/profile_image/1719390366344.jpeg`} className='ms-3 rounded-circle  ' alt="Profile" style={{ alignSelf: 'center', height: '40px', width: '40px' }} />
                                )} /> */}

                                <Column field="name" sortable header="Name" style={{ minWidth: '10rem', whiteSpace: 'nowrap', textTransform: 'capitalize' }} body={(rowData) => (
                                    <span>{rowData.first_name + ' ' + rowData.last_name || '-'}</span>
                                )} />

                                <Column field="email" sortable header="Email" style={{ minWidth: '10rem', whiteSpace: 'nowrap', }} body={(rowData) => (
                                    <span>{rowData.email || '-'}</span>
                                )} />

                                <Column field="description" sortable header="Description" style={{ minWidth: '10rem', whiteSpace: 'nowrap', textTransform: 'capitalize' }} body={(rowData) => (
                                    <span>{truncateWords(rowData.message) || '-'}</span>
                                )} />

                                <Column field="created_at" sortable header="Create Date" style={{ minWidth: '12rem' }} body={(rowData) => (
                                    <span>{formatDate(rowData.created_at, DateFormat?.DATE_FORMAT) || '-'}</span>
                                )} />

                                {/* <Column field="mobile_number" sortable header="Description" style={{ minWidth: '12rem' }} body={(rowData) => (
                                        <span>{'Test Descreption'}</span>
                                    )} /> */}


                                {/* <Column field="country" sortable header="Country" style={{ minWidth: '8rem', textTransform: 'capitalize' }} body={(rowData) => (
                                        <span>{rowData.country || '-'}</span>
                                    )} />

                                    <Column field="city" sortable header="City" style={{ minWidth: '8rem', textTransform: 'capitalize' }} body={(rowData) => (
                                        <span>{rowData.city || '-'} </span>
                                    )} /> */}

                                {/* <Column field="first_name" sortable header="Request" style={{ minWidth: '10rem', whiteSpace: 'nowrap', textTransform: 'capitalize' }} body={(rowData) => (
                                    <>
                                        {
                                            rowData?.status === 'Resolved' ? (<>

                                                <span className="p-tag p-component p-tag-info cursor_pointer badge bg-success p-1 m-1" data-pc-name="tag" data-pc-section="root" onClick={() => { statusChange(rowData?._id, 'Resolved') }}>
                                                    <span className="p-tag-value" data-pc-section="value">Solve</span>
                                                </span>

                                            </>) : rowData?.status === 'Escaleted' ? (<>

                                                <span className="p-tag p-component p-tag-danger cursor_pointer badge bg-danger p-1" data-pc-name="tag" data-pc-section="root" onClick={() => { statusChange(rowData?._id, 'Escaleted') }}>
                                                    <span className="p-tag-value" data-pc-section="value">Reject</span>
                                                </span>
                                            </>) : (<>
                                                <>
                                                    <span className="p-tag p-component p-tag-info cursor_pointer badge bg-success p-1 m-1" data-pc-name="tag" data-pc-section="root" onClick={() => { statusChange(rowData?._id, 'Resolved') }}>
                                                        <span className="p-tag-value" data-pc-section="value">Solve</span>
                                                    </span>

                                                    <span className="p-tag p-component p-tag-danger cursor_pointer badge bg-danger p-1" data-pc-name="tag" data-pc-section="root" onClick={() => { statusChange(rowData?._id, 'Escaleted') }}>
                                                        <span className="p-tag-value" data-pc-section="value">Reject</span>
                                                    </span></>
                                            </>)
                                        }
                                    </>
                                )} /> */}




                                {/* <Column field="status" data-pc-section="root" header="Status" style={{ minWidth: '6rem' }} body={(rowData) => (
                                        <>
                                            {rowData.is_active === 1 ? (
                                                <span className="p-tag p-component p-tag-success cursor_pointer badge bg-secondary p-1" data-pc-name="tag" data-pc-section="root" onClick={() => { statusChange(rowData?.id, '0') }} >
                                                    <span className="p-tag-value" data-pc-section="value">Active</span>
                                                </span>
                                            ) : (
                                                <span className="p-tag p-component p-tag-danger cursor_pointer badge bg-danger p-1" data-pc-name="tag" data-pc-section="root" onClick={() => { statusChange(rowData?.id, ' 1') }}>
                                                    <span className="p-tag-value" data-pc-section="value">Inactive</span>
                                                </span>
                                            )}
                                        </>
                                    )} /> */}


                                {/* <Column field="status" data-pc-section="root" header="Status" style={{ minWidth: '8rem' }} body={(rowData) => (
                                        <>
                                            {rowData.is_active === 1 ? (
                                                <span className="p-tag p-component p-tag-success cursor_pointer badge bg-success p-1" data-pc-name="tag" data-pc-section="root" onClick={() => { statusChange(rowData?.id, '0') }} >
                                                    <span className="p-tag-value" data-pc-section="value"><b>Active</b></span>
                                                </span>
                                            ) : (
                                                <span className="p-tag p-component p-1 p-tag-danger cursor_pointer badge bg-danger" data-pc-name="tag" data-pc-section="root" onClick={() => { statusChange(rowData?.id, ' 1') }}>
                                                    <span className="p-tag-value" data-pc-section="value"><b>Inactive</b></span>
                                                </span>
                                            )}
                                        </>
                                    )} /> */}

                                {/* <Column field="status" header="Action" style={{ minWidth: '8rem' }} body={(rowData) => (
                                        // <div className='row d-flex table-button m-0 p-0'>
                                        //     <div className="action-icon cursor_pointer action-icon col p-0 m-0 " onClick={() => navigat(`/customer_list/customer_details`, { state: rowData })}><i className="mdi mdi-eye fs-3" /></div>
                                        //     <div className="action-icon cursor_pointer  action-icon col p-0 m-0" onClick={() => handleDeleteUser(rowData?.id)}> <i className="mdi mdi-delete fs-3" /></div>
                                        // </div>
                                        <div className="action-btn">
                                            <Link to={'/contact_us/contact_details'} className="text-custom-theam edit cursor_pointer">
                                                <i className="ti ti-eye fs-7 " />
                                            </Link>
                                            <a className="text-dark delete ms-2 cursor_pointer" onClick={() => { setCustomerDeleteModel(true) }}>
                                                <i className="ti ti-trash fs-7 " />
                                            </a>
                                        </div>
                                    )} /> */}

                                {/* <Column field="status" data-pc-section="root" header="Status" style={{ minWidth: '6rem' }} body={(rowData) => (
                                    <>
                                        {rowData.is_active === '1' ? (
                                            <span className="p-tag p-component p-tag-success cursor_pointer badge bg-success p-1" data-pc-name="tag" data-pc-section="root" onClick={() => { handleStatus(rowData?._id, '0') }} >
                                                <span className="p-tag-value" data-pc-section="value">Active</span>
                                            </span>
                                        ) : (
                                            <span className="p-tag p-component p-tag-danger cursor_pointer badge bg-danger p-1" data-pc-name="tag" data-pc-section="root" onClick={() => { handleStatus(rowData?._id, '1') }}>
                                                <span className="p-tag-value" data-pc-section="value">Inactive</span>
                                            </span>
                                        )}
                                    </>
                                )} /> */}

                                <Column field="status" header="Action" style={{ minWidth: '8rem' }} body={(rowData) => (
                                    <div className="action-btn">
                                        <Link to={'/contact_us_list/contact_details'} state={rowData} className="text-custom-theam edit cursor_pointer">
                                            <i className="ti ti-eye fs-7 " />
                                        </Link>
                                        {/* <a className="text-dark delete ms-2 cursor_pointer cursor_pointer" onClick={() => { openModel(dispatch, ModelName.DELETE_MODEL); setSelectedUser(rowData) }}>
                                            <i className="ti ti-trash fs-7 text-danger" />
                                        </a> */}
                                    </div>
                                )} />
                            </DataTable>
                        </div>

                        <div className=''>
                            <Pagination per_page={perPage} pageCount={contactUsList?.total_count} onPageChange={onPageChange} page={page} />
                        </div>

                    </div>
                </div>
            </div >

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


