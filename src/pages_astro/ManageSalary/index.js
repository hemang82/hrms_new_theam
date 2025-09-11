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
import { getCustomerListThunk, getSalaryListThunk, setLoader, updateCustomerList } from '../../Store/slices/MasterSlice';
import Constatnt, { Codes, ModelName, SEARCH_DELAY } from '../../config/constant';
import useDebounce from '../hooks/useDebounce';
import { closeModel, formatDate, formatDateDyjs, getAllStatusObject, getLoanStatusObject, openModel } from '../../config/commonFunction';
import Model from '../../component/Model';
import { DeleteComponent } from '../CommonPages/CommonComponent';
import Pagination from '../../component/Pagination';
import { DateFormat, EMPLOYEE_STATUS, STATUS_COLORS } from '../../config/commonVariable';
import { IoAddCircleOutline } from 'react-icons/io5';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';

export default function ManageSalary() {

    let navigat = useNavigate();
    const dispatch = useDispatch();
    const dateFormat = "MMM-YYYY";
    const [startDate, setStartDate] = useState(dayjs()); // ✅ start of previous month

    const [totalRows, setTotalRows] = useState(0);
    const [checked, setChecked] = useState('');
    const [is_load, setis_load] = useState(false);

    const { salaryList: { data: salaryList }, } = useSelector((state) => state.masterslice);
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
    const [employeeStatus, setEmployeeStatus] = useState(EMPLOYEE_STATUS[0]);

    const hasInitialLoaded = useRef(false);

    const fetchData = async () => {
        const request = {
            "month": startDate ? formatDateDyjs(startDate, 'MM') : null,
            "year": startDate ? formatDateDyjs(startDate, 'YYYY') : null,
            // "page": 1,
            // "limit": 10
        }
        await dispatch(getSalaryListThunk(request));
    };

    useEffect(() => {
        if (salaryList?.length === 0) {
            fetchData();
        }
    }, []);

    const handleStatus = async (id, changeChecked) => {
        setis_load(true)

        let submitData = {
            user_id: id,
            is_active: changeChecked == '1' ? true : false,
        }
        EditUser(submitData).then((response) => {
            if (response.status_code === Codes.SUCCESS) {
                TOAST_SUCCESS(response?.message)
                setis_load(false)
                fetchData()
                // let updatedList = customerList?.user?.map((item) => {
                //     console.log('customerListuser',item);

                //     if (id == item.id) {
                //         return {
                //             ...item,
                //             is_active: changeChecked == '1' ? true : false, // set current user
                //         };
                //     }
                //     return item;
                // });
                // dispatch(updateCustomerList({
                //     ...customerList,
                //     user: updatedList
                // }))
            } else {
                setis_load(false)
                TOAST_ERROR(response.message)
            }
        })
    }

    const handleDelete = (is_true) => {
        if (is_true) {
            dispatch(setLoader(true));
            let submitData = {
                user_id: selectedUser?.id,
                is_deleted: true
            }
            EditUser(submitData).then((response) => {
                if (response.status_code === Codes?.SUCCESS) {
                    const updatedList = salaryList?.user?.filter((item) => item.id !== selectedUser?.id);
                    dispatch(updateCustomerList({
                        ...salaryList,
                        user: updatedList
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

    // ---------------------------------- Export Data ----------------------------------

    const handleExportApiCall = async () => {
        dispatch(setLoader(true));
        let submitData = {
            search: globalFilterValue
        }
        const salaryData = salaryList?.map((salary, index) => ({
            id: index + 1,
            employeeID: `${salary?.emp_id || '-'}`,
            EmployeeName: `${salary?.name || '-'}`,
            FullDays: salary?.fullDays || '-',
            HalfDays: `${salary?.halfDays || '-'}`,
            Absent: salary?.absences,
            OffDayCount: salary?.offDayCount || '-',
            Sundays: salary?.sundays || '-',
            BirthdayLeave: salary?.birthdayLeave || '-',
            CasualLeave: salary?.casualLeave || '-',
            CompOffLeave: salary?.compOffLeave || '-',
            LWP: salary?.LWP || '-',
            MonthlySalary: salary?.monthlySalary || '-',
            payable_days: salary?.payableDays || '-',
            totalSalary: salary?.totalSalary || '-',
            // CreateUser: formatDate(salary?.created_at, DateFormat?.DATE_FORMAT) || '-'
        }));
        return { code: 1, data: salaryData }
    };

    const handleExportToPdfManage = async () => {
        const { code, data } = await handleExportApiCall();
        if (code == Codes.SUCCESS) {
            ExportToPdf(data, 'Customer List', 'Customer List');
        }
        dispatch(setLoader(false));
    };

    const handleExportToCSVManage = async () => {
        const { code, data } = await handleExportApiCall();
        if (code == Codes.SUCCESS) {
            ExportToCSV(data, 'Salary List');
        }
        dispatch(setLoader(false));
    };

    const handleExportToExcelManage = async () => {
        const { code, data } = await handleExportApiCall();
        if (code == Codes.SUCCESS) {
            ExportToExcel(data, 'Salary List');
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

    const onChangeApiCalling = (data) => {
        const request = {
            month: data?.date ? formatDateDyjs(data.date, 'MM') : null,
            year: data?.date ? formatDateDyjs(data.date, 'YYYY') : null,
            emp_leave_company: data?.emp_leave_company ? data?.emp_leave_company : "0"
        };
        dispatch(getSalaryListThunk(request));
    };

    return (
        <>
            <div className="container-fluid mw-100">
                <SubNavbar title={"Salary List"} header={'Salary List'} />
                <div className="widget-content searchable-container list">
                    <div className="card card-body mb-2 p-3">
                        <div className="row g-3 ">
                            <div className="col-12 col-md-6 col-lg-6">
                                <div className="position-relative w-50">
                                    <input
                                        type="text"
                                        className="form-control ps-5 "
                                        id="input-search"
                                        placeholder="Search Salary ..."
                                        value={globalFilterValue}
                                        onChange={onGlobalFilterChange}
                                    />
                                    <i className="ti ti-search position-absolute top-50 start-0 translate-middle-y fs-6 text-dark ms-3" />
                                </div>
                            </div>

                            <div className="col-12 col-md-6 col-lg-2">
                                {/* <label className="form-label fw-semibold mb-1">Date Filter</label> */}
                                <DatePicker
                                    className="custom-datepicker w-100 p-2"
                                    picker="month"
                                    format={dateFormat}
                                    value={startDate}
                                    onChange={(date) => {
                                        setStartDate(date);
                                        onChangeApiCalling({
                                            date: date,
                                        });
                                    }}
                                />
                            </div>

                            <div className="col-12 col-md-6 col-lg-2 mb-2 mb-md-0">
                                {/* <label className="form-label fw-semibold mb-1">Status</label> */}
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
                                                        onChangeApiCalling({
                                                            emp_leave_company: option?.key
                                                        });
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

                            <div className="col-12 col-md-6 col-lg-2 ">
                                <button
                                    className="btn btn-info dropdown-toggle w-100 w-md-auto "
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                    style={{ height: '40px' }}
                                >
                                    Export
                                </button>
                                <ul className="dropdown-menu">
                                    {/* <li>
                                            <a className="dropdown-item text-black-50" onClick={handleExportToPdfManage}>PDF</a>
                                        </li> */}
                                    <li>
                                        <a className="dropdown-item text-black-50" onClick={handleExportToCSVManage}>CSV</a>
                                    </li>
                                    <li>
                                        <a className="dropdown-item text-black-50" onClick={handleExportToExcelManage}>Excel</a>
                                    </li>
                                </ul>
                            </div>


                        </div>
                    </div>

                    <div className="card card-body">
                        <div className="table-responsive">
                            <DataTable
                                value={salaryList}
                                paginator
                                rows={50}
                                globalFilter={globalFilterValue}
                                rowsPerPageOptions={
                                    salaryList?.length > 50
                                        ? [20, 30, 50, salaryList?.length]
                                        : [20, 30, 40]
                                }
                                currentPageReportTemplate='Showing {first} to {last} of {totalRecords} entries'
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                loading={loading}
                                sortField={sortField}
                                sortOrder={sortOrder}
                                // onSort={handleSort}
                                emptyMessage={<span style={{ textAlign: 'center', display: 'block' }}>No Salary found.</span>}
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
                                    field="emp_id"
                                    header="Employee ID"
                                    style={{ minWidth: '10rem', whiteSpace: 'nowrap', textTransform: 'capitalize' }}
                                    body={(rowData) => <span>{rowData?.emp_id || '-'}</span>}
                                />

                                <Column
                                    field="name"
                                    header="Employee Name"
                                    style={{ minWidth: '10rem', whiteSpace: 'nowrap', textTransform: 'capitalize' }}
                                    body={(rowData) => <span>{rowData?.name}</span>}
                                />

                                <Column field="fullDays" header="FD" style={{ minWidth: '6rem' }} body={(rowData) => (
                                    <span className='me-2'>{rowData?.fullDays}</span>
                                )} />

                                <Column field="halfDays" header="HD" style={{ minWidth: '6rem' }} body={(rowData) => (
                                    <span className='me-2'>{rowData?.halfDays}</span>
                                )} />

                                <Column field="absences" header="Ab" style={{ minWidth: '6rem' }} body={(rowData) => (
                                    <span className='me-2'>{rowData?.absences}</span>
                                )} />

                                {/* <Column field="email" header="Holidays" style={{ minWidth: '8rem' }} body={(rowData) => (
                                    <span className='me-2'>{rowData?.email }</span>
                                )} /> */}

                                <Column field="offDayCount" header="OD" style={{ minWidth: '6rem' }} body={(rowData) => (
                                    <span className='me-2'>{rowData?.offDayCount}</span>
                                )} />

                                <Column field="sundays" header="Sun" style={{ minWidth: '6rem' }} body={(rowData) => (
                                    <span className='me-2'>{rowData?.sundays}</span>
                                )} />

                                <Column field="BirthdayLeave" header="BD" style={{ minWidth: '6rem' }} body={(rowData) => (
                                    <span className='me-2'>{rowData?.BirthdayLeave}</span>
                                )} />

                                <Column field="casualLeave" header="CL" style={{ minWidth: '6rem' }} body={(rowData) => (
                                    <span className='me-2'>{rowData?.casualLeave}</span>
                                )} />

                                <Column field="compOffLeave" header="CO" style={{ minWidth: '6rem' }} body={(rowData) => (
                                    <span className='me-2'>{rowData?.compOffLeave}</span>
                                )} />

                                <Column field="LWPLeave" header="LWP" style={{ minWidth: '6rem' }} body={(rowData) => (
                                    <span className='me-2'>{rowData?.LWPLeave}</span>
                                )} />

                                <Column field="monthlySalary" header="Salary" style={{ minWidth: '8rem' }} body={(rowData) => (
                                    <span className='me-2'>{rowData?.monthlySalary}</span>
                                )} />

                                <Column field="payableDays" header="Day" style={{ minWidth: '8rem' }} body={(rowData) => (
                                    <span className='me-2'>{rowData?.payableDays}</span>
                                )} />

                                <Column field="totalSalary" header="PayableSalary" style={{ minWidth: '8rem' }} body={(rowData) => (
                                    <span className='me-2'>{rowData?.totalSalary}</span>
                                )} />

                            </DataTable>

                            {/* <div className=''>
                                <Pagination per_page={perPage} pageCount={customerList?.total_count} onPageChange={onPageChange} page={page} />
                            </div> */}

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


