import React, { useEffect, useState } from 'react'
import Header from '../../layout/Header'
import Slidebar from '../../layout/Slidebar'
import SubNavbar from '../../layout/SubNavbar'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
// import { editSubAdmin, exportSubAdmin } from '../../utils/api.services'
import profile_image from '../../assets/Images/default.jpg'
import { ExportToCSV, ExportToExcel, ExportToPdf, SWIT_DELETE, SWIT_DELETE_SUCCESS, TOAST_SUCCESS } from '../../config/common'
import { getSubAdminListThunk, setLoader } from '../../Store/slices/MasterSlice';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { Codes, ModelName, SEARCH_DELAY } from '../../config/constant';
// import useDebounce from '../hooks/useDebounce';
import { closeModel, openModel } from '../../config/commonFunction'
import Model from '../../component/Model'
import { DeleteComponent } from '../CommonPages/CommonComponent'
import useDebounce from '../../pages_astro/hooks/useDebounce'

const ManageSubAdmin = () => {

    let navigat = useNavigate();
    const dispatch = useDispatch();

    const [isload, setIsload] = useState(false);

    const { subAdminList: { data: SubAdminList }, } = useSelector((state) => state.masterslice);
    console.log('subAdmin SubAdminListt :', SubAdminList);

    const { customModel } = useSelector((state) => state.masterslice);

    const [loading, setLoading] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const debounce = useDebounce(globalFilterValue, SEARCH_DELAY);
    const [filters, setFilters] = useState({ global: { value: '' } });

    const [selectedUser, setSelectedUser] = useState()
    console.log('subAdmin selectedUser :', selectedUser);

    useEffect(() => {
        dispatch(getSubAdminListThunk({ search: globalFilterValue }))
    }, [debounce, isload])

    const handleDelete = (is_true) => {
        // if (is_true) {
        //     setIsload(true)
        //     dispatch(setLoader(true));
        //     let submitData = {
        //         user_id: selectedUser?._id,
        //         is_delete: '1',
        //     }
        //     editSubAdmin(submitData).then((response) => {
        //         if (response.code === Codes?.SUCCESS) {
        //             setIsload(false)
        //             closeModel(dispatch)
        //             dispatch(setLoader(false))
        //             TOAST_SUCCESS(response?.message);
        //         }
        //     });
        // }
    };

    const handleStatus = async (id, changeChecked) => {
        // setIsload(true)
        // let submitData = {
        //     user_id: id,
        //     is_active: changeChecked,
        // }
        // console.log('subAdmin submitData :', submitData);

        // editSubAdmin(submitData).then((response) => {
        //     if (response.code === Codes?.SUCCESS) {
        //         setIsload(false)
        //         TOAST_SUCCESS(response?.message);
        //     }
        // })
    }

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        if (_filters['global']) { // Check if _filters['global'] is defined
            _filters['global'].value = value;
        }
        setFilters(_filters);
        setGlobalFilterValue(value);

    };

    // ------------------------------------Export Data --------------------------------------

    const handleExportApiCall = async () => {
        // dispatch(setLoader(true));
        // let submitData = {
        //     search: globalFilterValue
        // }
        // const { code, data } = await exportSubAdmin(submitData);

        // dispatch(setLoader(false));

        // return { code, data }
    }

    const handleExportToPdfManage = async () => {
        const { code, data } = await handleExportApiCall();
        if (code === Codes?.SUCCESS) {
            ExportToPdf(data, 'Sub Admin List', 'Sub Admin List');
        }
        dispatch(setLoader(false));
    }

    const handleExportToCSVManage = async () => {
        const { code, data } = await handleExportApiCall();
        if (code === Codes?.SUCCESS) {
            ExportToCSV(data, 'Sub Admin List');
        }
        dispatch(setLoader(false));
    };

    const handleExportToExcelManage = async () => {
        const { code, data } = await handleExportApiCall();
        if (code === Codes?.SUCCESS) {
            ExportToExcel(data, 'Sub Admin List');
        }
        dispatch(setLoader(false));
    };

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                console.log('Tab is not visible');
                // Optional: Display a custom message or perform actions
            } else {
                console.log('Tab is visible');
            }
        };
        const handleBeforeUnload = (event) => {
            const message = 'Are you sure you want to leave this page?';
            event.returnValue = message; // Standard way to set the message
            return message; // Required for older browsers
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    return (
        <>
            <Slidebar />
            <div className="body-wrapper">
                <Header />
                <div className="container-fluid mw-100">
                    <SubNavbar title={"Sub Admin List"} header={'Sub Admin List'} />
                    <div className="widget-content searchable-container list">

                        <div className="card card-body">
                            <div className="row">
                                <div className="col-md-4 col-xl-3">
                                    <div className="position-relative">
                                        <input type="text" className="form-control product-search ps-5" id="input-search" placeholder="Search Sub Admin..."
                                            value={globalFilterValue}
                                            onChange={onGlobalFilterChange} />
                                        <i className="ti ti-search position-absolute top-50 start-0 translate-middle-y fs-6 text-dark ms-3" />
                                    </div>
                                </div>
                                <div className="col-md-8 col-xl-9 text-end d-flex justify-content-md-end justify-content-center mt-3 mt-md-0">
                                    <Link to={'/manage_sub_admin/add_sub_admin'} id="btn-add-contact" className="btn btn-info d-flex align-items-center" style={{ height: '40px' }}>
                                        <i class="ti ti-users me-1 fs-6"></i>
                                        Add Sub Admin
                                    </Link>

                                    <div className="btn-group mb-2 ms-2">

                                        <button type="button" className="btn btn-info dropdown-toggle " data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style={{ height: '40px' }}>
                                            Export
                                        </button>

                                        <ul className="dropdown-menu animated flipInY">
                                            <li><a type='button' className="dropdown-item cursor_pointer text-black-50" onClick={() => { handleExportToPdfManage() }}>PDF</a></li>
                                            <li><a type='button' className="dropdown-item cursor_pointer text-black-50" onClick={handleExportToCSVManage}>CSV</a></li>
                                            <li><a type='button' className="dropdown-item cursor_pointer text-black-50" onClick={handleExportToExcelManage}>Excel</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <DataTable
                            value={SubAdminList}
                            paginator
                            rows={10}
                            // rowsPerPageOptions={[5, 10, 20]}
                            currentPageReportTemplate='Showing {first} to {last} of {totalRecords} entries'
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            loading={loading}
                            emptyMessage={<span style={{ textAlign: 'center', display: 'block' }}>No customers found.</span>}
                        >
                            <Column
                                field="id"
                                header="Id"
                                style={{ minWidth: '4rem' }}
                                body={(rowData, options) => options.rowIndex + 1}
                                sortable
                                showFilterMenu={true}
                            />
                            {/* <Column field="id" header="Id" style={{ minWidth: '4rem' }} sortable showFilterMenu={true} /> */}
                            <Column field="image" header="Image" style={{ minWidth: '10rem' }} body={(rowData) => (
                                <img src={`https://eveksia.s3.me-central-1.amazonaws.com/profile_image/1721286162134.png`} className='' alt="Profile" height={50} style={{ alignSelf: 'center' }} />
                            )} />
                            {/* <Column field="firstname" sortable header="Firstname" style={{ minWidth: '8rem' }} /> */}
                            <Column field="firstname" sortable header="Firstname" style={{ minWidth: '12rem' }} body={(rowData) => (
                                <span>{rowData.firstname}</span>
                            )} />
                            <Column field="lastname" sortable header="Lastnamer" style={{ minWidth: '12rem' }} body={(rowData) => (
                                <span>{rowData.lastname}</span>
                            )} />

                            <Column field="email" sortable header="Email" style={{ minWidth: '10rem', whiteSpace: 'nowrap' }} body={(rowData) => (
                                <span>{rowData.email}</span>
                            )} />

                            <Column field="mobile_number" sortable header="Mobile Number" style={{ minWidth: '10rem', whiteSpace: 'nowrap' }} body={(rowData) => (
                                <span> {rowData?.country_code + ' ' + rowData?.mobile_number}</span>
                            )} />

                            {/* <Column field="country_name" sortable header="Country" style={{ minWidth: '10rem', whiteSpace: 'nowrap' }} body={(rowData) => (
                                                        <span>{rowData?.country_name || 'India'}</span>
                                                    )} />
                                                    <Column field="fre_name" sortable header="City" style={{ minWidth: '10rem', whiteSpace: 'nowrap' }} body={(rowData) => (
                                                        <span>{rowData?.city_name || 'Ahmedabad'}</span>
                                                    )} /> */}
                            {/* <Column field="country" sortable header="Country" style={{ minWidth: '12rem' }} /> */}

                            {/* <Column field="city" sortable header="City" style={{ minWidth: '10rem' }} /> */}

                            <Column field="status" data-pc-section="root" header="Status" style={{ minWidth: '6rem' }} body={(rowData) => (
                                <>
                                    {rowData.is_active === "1" ? (
                                        <span className="p-tag p-component p-tag-success cursor_pointer badge bg-success p-1" data-pc-name="tag" data-pc-section="root" onClick={() => { handleStatus(rowData?._id, rowData?.is_active === '1' ? '0' : '1') }} >
                                            <span className="p-tag-value" data-pc-section="value">Active</span>
                                        </span>
                                    ) : (
                                        <span className="p-tag p-component p-tag-danger cursor_pointer badge bg-danger p-1" data-pc-name="tag" data-pc-section="root" onClick={() => { handleStatus(rowData?._id, rowData?.is_active === '1' ? '0' : '1') }}>
                                            <span className="p-tag-value" data-pc-section="value">Inactive</span>
                                        </span>
                                    )}
                                </>
                            )} />



                            <Column field="status" header="Action" style={{ minWidth: '10rem' }} body={(rowData) => (<>

                                <a className="text-info edit  cursor_pointer cursor_pointer" onClick={() => navigat(`/manage_sub_admin/add_sub_admin`, { state: rowData })} >
                                    <i class="ti ti-edit fs-7"></i>
                                </a>
                                <a className="text-info ms-2 edit cursor_pointer cursor_pointer" onClick={() => navigat(`/manage_sub_admin/view_sub_admin`, { state: rowData })} >
                                    <i className="ti ti-eye fs-7" />
                                </a>
                                <a className="text-dark delete ms-2 cursor_pointer cursor_pointer" onClick={() => { openModel(dispatch, ModelName.DELETE_MODEL); setSelectedUser(rowData) }}>
                                    <i className="ti ti-trash fs-7 text-danger" />
                                </a>

                                {/* // <div className='row d-flex table-button m-0 p-0'>
                                //     <div className="action-icon cursor_pointer action-icon col p-0 m-0" onClick={() => navigat(`/manage_sub_admin/view_sub_admin`, { state: rowData })}><i className="mdi mdi-eye fs-3" /></div>
                                //     <div className="action-icon cursor_pointer action-icon col p-0 m-0" onClick={() => navigat(`/manage_sub_admin/add_sub_admin`, { state: rowData })}><i className="mdi mdi-square-edit-outline fs-3" /></div>

                                //     <div className="action-icon cursor_pointer  action-icon col p-0 m-0" onClick={() => handleDeleteManage(rowData?.id)}> <i className="mdi mdi-delete fs-3" /></div>
                                // </div> */}

                            </>)} />

                        </DataTable>
                    </div>
                </div>
            </div>

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

export default ManageSubAdmin
