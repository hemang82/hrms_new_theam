import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import SubNavbar from '../../layout/SubNavbar';
import { processingFeeUpdate } from '../../utils/api.services';
import { TOAST_ERROR, TOAST_SUCCESS } from '../../config/common';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { getProcessingFeeListThunk, setLoader, updateCustomerList, updateProcessingFeeList } from '../../Store/slices/MasterSlice';
import { Codes, ModelName, SEARCH_DELAY } from '../../config/constant';
import useDebounce from '../hooks/useDebounce';
import { closeModel, openModel } from '../../config/commonFunction';
import Model from '../../component/Model';
import { DeleteComponent } from '../CommonPages/CommonComponent';
import Pagination from '../../component/Pagination';
import { IoAddCircleOutline } from 'react-icons/io5';

export default function ManageInterest() {

    let navigat = useNavigate();
    const dispatch = useDispatch();

    const { listInterest: { data: listInterest }, } = useSelector((state) => state.masterslice);
    const { listProcessFee: { data: listProcessFeeList }, } = useSelector((state) => state.masterslice);

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

    const fetchData = async () => {
        const request = {
            // limit: perPage,
            // offset: page,
            // search: globalFilterValue || "",
            // order_by: sortField,
            // order_direction: sortOrder === 1 ? 'asc' : 'desc',
        };
        try {
            await dispatch(getProcessingFeeListThunk())

        } finally {
            // dispatch(setLoader(false));
        }
    };

    useEffect(() => {
        fetchData();
    }, [debounce, page, sortField, sortOrder]);

    const handleDelete = (is_true) => {
        if (is_true) {
            dispatch(setLoader(true));
            let submitData = {
                fee_id: selectedUser?.id,
                is_deleted: true
            }
            processingFeeUpdate(submitData).then((response) => {
                if (response.status_code === Codes?.SUCCESS) {
                    const updatedList = listProcessFeeList?.filter((item) => item.id !== selectedUser?.id);
                    dispatch(updateProcessingFeeList({
                        ...listInterest,
                        credit_range_rates: updatedList
                    }))
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

    const onPageChange = (Data) => {
        setPage(Data)
    }

    const handleSort = (event) => {
        console.log("Sort event triggered:", event);
        setSortField(event.sortField); // ✅ correct key
        setSortOrder(event.sortOrder);
    };

    return (
        <>
            <div className="container-fluid mw-100">
                <SubNavbar title={"Processing Fee List"} header={'Processing Fee List'} />
                <div className="widget-content searchable-container list">
                    <div className="card card-body">
                        <div className="row border-bottom pb-3">
                            <div className="col-12 col-md-6 col-lg-3">
                            </div>

                            <div className="col-12 col-md-6 col-lg-9">
                                <div className="d-flex flex-column flex-md-row justify-content-end align-items-stretch gap-2 ">
                                    {/* Add User Button */}
                                    <Link
                                        to="/processing_fee_list/add_processing_fee"
                                        id="btn-add-contact"
                                        className="btn btn-info d-flex align-items-center justify-content-center mt-3 mt-md-0  w-md-auto "
                                        style={{ height: '40px' }}
                                    >
                                        <span className="me-1">
                                            <IoAddCircleOutline style={{ fontSize: '1.2rem' }} />
                                        </span>
                                        <span className="fw-semibold">Add Processing Fee</span>
                                    </Link>
                                </div>
                            </div>
                            <div className="col-md-8 col-xl-9 text-end d-flex justify-content-md-end justify-content-center mt-3 mt-md-0 gap-3">


                            </div>
                        </div>
                        <div className="table-responsive mt-2">
                            <DataTable
                                value={listProcessFeeList}
                                // paginator
                                rows={15}
                                currentPageReportTemplate='Showing {first} to {last} of {totalRecords} entries'
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                loading={loading}
                                sortField={sortField}
                                sortOrder={sortOrder}
                                onSort={handleSort}
                                emptyMessage={<span style={{ textAlign: 'center', display: 'block' }}>No Processing Fee found.</span>}
                            >
                                <Column
                                    field="id"
                                    header="Id"
                                    style={{ minWidth: '6rem' }}
                                    body={(rowData, options) => options.rowIndex + 1}
                                    sortable
                                />
                                <Column field="label" header="Label" sortable style={{ minWidth: '10rem' }} body={(rowData) => (
                                    <span>{rowData.label || '-'}</span>
                                )} />

                                <Column field="min_score" header="Min Credit Score" sortable style={{ minWidth: '10rem' }} body={(rowData) => (
                                    <span>{rowData.min_score}</span>
                                )} />

                                <Column field="max_score" header="Max Credit Score" sortable style={{ minWidth: '10rem' }} body={(rowData) => (
                                    <span>{rowData.max_score}</span>
                                )} />

                                <Column field="min_fee_percent" sortable header="Min Percentage" style={{ minWidth: '10rem' }} body={(rowData) => (
                                    <span>{rowData.min_fee_percent || '-'}</span>
                                )} />

                                <Column field="statuss" header="Action" style={{ minWidth: '10rem' }} body={(rowData) => (
                                    <div className="action-btn">
                                        <a className="text-info edit cursor_pointer cursor_pointer" onClick={() => navigat(`/processing_fee_list/edit_processing_fee`, { state: rowData })} >
                                            <i class="ti ti-edit fs-7"></i>
                                        </a>
                                        <Link to={'/processing_fee_list/processing_fee_details'} state={rowData} className="text-info edit cursor_pointer">
                                            <i className="ti ti-eye fs-7 ms-2" />
                                        </Link>
                                        <a className="text-dark delete ms-2 cursor_pointer cursor_pointer" onClick={() => { openModel(dispatch, ModelName.DELETE_MODEL); setSelectedUser(rowData) }}>
                                            <i className="ti ti-trash fs-7 text-danger" />
                                        </a>
                                    </div>
                                )} />
                            </DataTable>

                            <div className=''>
                                <Pagination per_page={perPage} pageCount={listInterest?.total_count} onPageChange={onPageChange} page={page} />
                            </div>
                        </div>
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


