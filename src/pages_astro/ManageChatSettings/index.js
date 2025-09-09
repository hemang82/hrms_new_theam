import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../layout/Header';
import Slidebar from '../../layout/Slidebar';
import SubNavbar from '../../layout/SubNavbar';
import Footer from '../../layout/Footer';
import { ExportToCSV, ExportToExcel, ExportToPdf, SWIT_DELETE, SWIT_DELETE_SUCCESS, TOAST_ERROR, TOAST_SUCCESS } from '../../config/common';
import { Helmet } from 'react-helmet';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { setLoader } from '../../Store/slices/MasterSlice';
import Constatnt, { Codes, ModelName, PUBLIC_URL, SEARCH_DELAY } from '../../config/constant';
import useDebounce from '../hooks/useDebounce';
import { DeleteComponent } from '../CommonPages/CommonComponent';
import Model from '../../component/Model';
import { closeModel, openModel } from '../../config/commonFunction';
import Pagination from '../../component/Pagination';

export default function ManageChatSettings() {

    let navigat = useNavigate();
    const dispatch = useDispatch();
    const { chatSettingList: { data: chatSettingList }, } = useSelector((state) => state.masterslice);
    const { customModel } = useSelector((state) => state.masterslice);

    const [perPage, setPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [isload, setIsload] = useState(false);

    // const [categoryListt, setCategoryList] = useState(0);
    const [loading, setLoading] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const debounce = useDebounce(globalFilterValue, SEARCH_DELAY);
    const [filters, setFilters] = useState({ global: { value: '' } });
    const [selctedCategory, setSelctedCategory] = useState()

    useEffect(() => {
        dispatch(setLoader(true))
        let request = {
            page: page,
            search: globalFilterValue,
        }
        // dispatch(getlistSettingThunk(request))
        dispatch(setLoader(false))
    }, [isload, debounce, page]);

    // const handleStatus = async (id, changeChecked) => {
    //     let submitData = {
    //         category_id: id,
    //         is_active: changeChecked,
    //     }
    //     EditCategory(submitData).then((response) => {
    //         if (response.code === Codes.SUCCESS) {
    //             TOAST_SUCCESS(response?.message)
    //             let updatedList = chatSettingList?.CategoryList?.map((item) => {
    //                 if (id === item._id) {
    //                     return {
    //                         ...item,
    //                         is_active: item?.is_active == 1 ? 0 : 1
    //                     };
    //                 }
    //                 return item;
    //             });
    //             dispatch(updateCategoryList({
    //                 ...chatSettingList,
    //                 CategoryList: updatedList
    //             }))
    //         } else {

    //             TOAST_ERROR(response.message)
    //         }
    //     })
    // }

    // const handleDelete = (is_true) => {
    //     if (is_true) {
    //         dispatch(setLoader(true));
    //         let submitData = {
    //             category_id: selctedCategory?._id,
    //         }
    //         DeleteCategory(submitData).then((response) => {
    //             if (response.code === Codes?.SUCCESS) {
    //                 const updatedList = chatSettingList?.CategoryList?.filter((item) => item._id !== selctedCategory?._id)

    //                 dispatch(updateCategoryList({
    //                     ...chatSettingList,
    //                     CategoryList: updatedList
    //                 }))
    //                 closeModel(dispatch)
    //                 dispatch(setLoader(false))
    //                 TOAST_SUCCESS(response?.message);
    //             }
    //         });
    //         dispatch(setLoader(false))
    //         setIsload(false)
    //     }
    // };

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        if (_filters['global']) { // Check if _filters['global'] is defined
            _filters['global'].value = value;
        }

        setFilters(_filters);
        setGlobalFilterValue(value);

    };

    //  ------------------------------------Export Data --------------------------------------

    const handleExportApiCall = async () => {
        // dispatch(setLoader(true));
        // let submitData = {
        //     search: globalFilterValue
        // }
        // const { code, data } = await ListCategory(submitData);
        // const categoryData = data?.CategoryList?.map(item => ({
        //     // id: item._id,
        //     nameEnglish: item.name,
        //     nameHindi: item.hi_name,
        //     nameGujrati: item.gu_name,
        // })) || [];
        // return { code, data: categoryData }
    }

    const handleExportToPdfManage = async () => {
        const { code, data } = await handleExportApiCall();
        if (code === Codes.SUCCESS) {

            ExportToPdf(data, ' Category List', ' Category List');
        }
        dispatch(setLoader(false));
    }

    const handleExportToCSVManage = async () => {
        const { code, data } = await handleExportApiCall();
        if (code === Codes.SUCCESS) {
            ExportToCSV(data, ' Category List');
        }
        dispatch(setLoader(false));
    };

    const handleExportToExcelManage = async () => {
        const { code, data } = await handleExportApiCall();
        if (code === Codes.SUCCESS) {
            ExportToExcel(data, ' Category List');
        }
        dispatch(setLoader(false));
    };

    const onPageChange = (Data) => {
        setPage(Data)
    }

    return (
        <>
            {/* <Slidebar />

            <div className="body-wrapper">
                <Header /> */}
            <div className="container-fluid mw-100">

                <SubNavbar title={"Chat Setting List"} header={'Chat Setting List'} />
                <div className="widget-content searchable-container list m-3">

                    <div className="card card-body">
                        <div className="row">
                            <div className="col-md-4 col-xl-3">
                                {/* <div className="position-relative">
                                    <input type="text" className="form-control product-search ps-5" id="input-search" placeholder="Search Chat Setting..."
                                        value={globalFilterValue}
                                        onChange={onGlobalFilterChange} />
                                    <i className="ti ti-search position-absolute top-50 start-0 translate-middle-y fs-6 text-dark ms-3" />
                                </div> */}
                            </div>
                            <div className="col-md-8 col-xl-9 text-end d-flex justify-content-md-end justify-content-center mt-3 mt-md-0 gap-3">
                                {/* <div className="action-btn show-btn" style={{ display: 'none' }}>
                                        <a href="javascript:void(0)" className="delete-multiple btn-light-danger btn me-2 text-danger d-flex align-items-center font-medium">
                                            <i className="ti ti-trash text-danger me-1 fs-5" /> Delete All Row
                                        </a>
                                    </div> */}
                                <Link to={'/chat_setting_list/ApplyChats'} id="btn-add-contact" className="btn btn-info d-flex align-items-center" style={{ height: '40px' }}>
                                    <i className="ti ti-category me-1 fs-6" />Apply Chat
                                </Link>

                                <Link to={'/chat_setting_list/add_chat_setting'} id="btn-add-contact" className="btn btn-info d-flex align-items-center" style={{ height: '40px' }}>
                                    <i className="ti ti-category me-1 fs-6" />Add Chat Setting
                                </Link>

                                {/* <div className="btn-group mb-2 ms-2">

                                    <button type="button" className="btn btn-info dropdown-toggle " data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style={{ height: '40px' }}>
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
                    </div>
                    <div className="card card-body">
                        <div className="table-responsive">
                            <DataTable
                                value={chatSettingList}
                                // paginator
                                rows={10}
                                // rowsPerPageOptions={[5, 10, 20]}
                                currentPageReportTemplate='Showing {first} to {last} of {totalRecords} entries'
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                loading={loading}
                                emptyMessage={<span style={{ textAlign: 'center', display: 'block' }}>No Category found.</span>}
                            >
                                <Column
                                    field="id"
                                    header="Id"
                                    style={{ minWidth: '4rem' }}
                                    body={(rowData, options) => options.rowIndex + 1}
                                    // sortable
                                    showFilterMenu={true}
                                />

                                <Column field="type" header="Type" style={{ minWidth: '12rem', whiteSpace: 'nowrap' }} body={(rowData) => (
                                    <span>{rowData.type || '-'}</span>
                                )} />

                                <Column field="value" header="Chat Count" style={{ minWidth: '12rem', whiteSpace: 'nowrap' }} body={(rowData) => (
                                    <span>{rowData.value || '-'}</span>
                                )} />

                                <Column field="duration" header="Chat Duration" style={{ minWidth: '12rem', whiteSpace: 'nowrap' }} body={(rowData) => (
                                    <span>{rowData.duration || '-'}</span>
                                )} />

                                <Column field="expiry_count" header="Chat Expiry Count" style={{ minWidth: '12rem', whiteSpace: 'nowrap' }} body={(rowData) => (
                                    <span>{rowData.duration || '-'}</span>
                                )} />

                                {/* <Column field="spa_name" sortable header="Spanish name" style={{ minWidth: '10rem', whiteSpace: 'nowrap' }} body={(rowData) => (
                                <span>{rowData.spa_name || '-'}</span>
                            )} />
                            <Column field="fre_name" sortable header="French name" style={{ minWidth: '10rem', whiteSpace: 'nowrap' }} body={(rowData) => (
                                <span>{rowData.fre_name || '-'}</span>
                            )} />
                            <Column field="ita_name" sortable header="Italian name" style={{ minWidth: '10rem', whiteSpace: 'nowrap' }} body={(rowData) => (
                                <span>{rowData.ita_name || '-'}</span>
                            )} /> */}

                                {/* <Column field="email" sortable header="Email" style={{ minWidth: '8rem' }} />
                                                    <Column field="mobile_number" sortable header="Mobile Number" style={{ minWidth: '12rem' }} body={(rowData) => (
                                                        <span>{rowData.country_code} {rowData.mobile_number}</span>
                                                    )} /> */}
                                {/* <Column field="country" sortable header="Country" style={{ minWidth: '12rem' }} /> */}
                                {/* <Column field="city" sortable header="City" style={{ minWidth: '10rem' }} /> */}

                                {/* <Column field="status" data-pc-section="root" header="Status" style={{ minWidth: '6rem' }} body={(rowData) => (
                                    <>
                                        {rowData.is_active == 1 ? (
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

                                <Column field="status" header="Action" style={{ minWidth: '10rem' }} body={(rowData) => (
                                    <div className="action-btn">
                                        <a className="text-info edit cursor_pointer cursor_pointer" onClick={() => navigat(`/chat_setting_list/edit_chat_setting`, { state: rowData })} >
                                            <i class="ti ti-edit fs-7"></i>

                                        </a>
                                        {/* <a className="text-info ms-2 edit cursor_pointer cursor_pointer" onClick={() => navigat(`/category_list/category_details`, { state: rowData })} >
                                            <i className="ti ti-eye fs-7" />
                                        </a>
                                        <a className="text-dark delete ms-2 cursor_pointer cursor_pointer" onClick={() => { openModel(dispatch, ModelName.DELETE_MODEL); setSelctedCategory(rowData) }}>
                                            <i className="ti ti-trash fs-7 text-danger" />
                                        </a> */}
                                    </div>
                                    // <div className='row d-flex table-button m-0 p-0'>
                                    //     <div className="action-icon cursor_pointer action-icon col p-0 m-0" onClick={() => navigat(`/category_list/category_details`, { state: rowData })}><i className="mdi mdi-eye fs-3" /></div>
                                    //     <div className="action-icon cursor_pointer action-icon col p-0 m-0" onClick={() => navigat(`/add_category`, { state: rowData })}><i className="mdi mdi-square-edit-outline fs-3" /></div>

                                    //     <div className="action-icon cursor_pointer  action-icon col p-0 m-0" onClick={() => handleDeleteUser(rowData?.id)}> <i className="mdi mdi-delete fs-3" /></div>
                                    // </div>
                                )} />

                            </DataTable>
                            <div className=''>
                                <Pagination per_page={chatSettingList?.per_page} pageCount={chatSettingList?.perPage} onPageChange={onPageChange} page={page} />
                            </div>
                        </div>
                    </div>
                </div>
                {/* </div > */}
            </div >

            {
                customModel.isOpen && customModel?.modalType === ModelName.DELETE_MODEL && (
                    <Model>
                        <DeleteComponent onConfirm={'handleDelete'} />
                    </Model >
                )
            }

        </>
    )
}


