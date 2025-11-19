import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../layout/Header';
import Slidebar from '../../layout/Slidebar';
import $ from 'jquery';
import 'datatables.net-bs5';
import 'datatables.net-responsive-bs5';
import SubNavbar from '../../layout/SubNavbar';
import { EditUser, CustomerList, adminLogs } from '../../utils/api.services';
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
import { DateFormat, EMPLOYEE_STATUS, STATUS_COLORS, TimeFormat } from '../../config/commonVariable';
import { IoAddCircleOutline } from 'react-icons/io5';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';

export default function ManageSalary() {

    let navigat = useNavigate();
    const dispatch = useDispatch();
    const dateFormat = "MMM-YYYY";
    const [startDate, setStartDate] = useState(dayjs().subtract(1, 'month'));

    const [totalRows, setTotalRows] = useState(0);
    const [checked, setChecked] = useState('');
    const [is_load, setis_load] = useState(false);

    // const { salaryList: { data: salaryList }, } = useSelector((state) => state.masterslice);
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
    const [adminLogsList, setAdminLogsList] = useState([]);


    const fetchData = async () => {
        const request = {
            "month": startDate ? formatDateDyjs(startDate, 'MM') : null,
            "year": startDate ? formatDateDyjs(startDate, 'YYYY') : null,
            emp_leave_company: "0"
        }
        adminLogs().then((response) => {
            if (response?.code == Codes?.SUCCESS) {
                setAdminLogsList(response?.data)
            } else {
                setAdminLogsList([])
            }
        })
    };

    useEffect(() => {
        if (adminLogsList?.length === 0) {
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
                    const updatedList = adminLogsList?.user?.filter((item) => item.id !== selectedUser?.id);
                    dispatch(updateCustomerList({
                        ...adminLogsList,
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
        const salaryData = adminLogsList?.map((salary, index) => ({
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
            month: startDate ? formatDateDyjs(startDate, 'MM') : null,
            year: startDate ? formatDateDyjs(startDate, 'YYYY') : null,
            emp_leave_company: data?.emp_leave_company ? data?.emp_leave_company : "0"
        };
        dispatch(getSalaryListThunk(request));
    };

    function formatText(value) {
        if (!value) return "";

        // remove all underscores
        const cleaned = value.replace(/_/g, " ");

        // capitalize first letter
        return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    }

    return (
        <>
            <div className="container-fluid mw-100">
                <SubNavbar title={"Admin Logs List"} header={'Admin Logs List'} />
                <div className="widget-content searchable-container list">
                    <div className="card card-body">
                        {/* <div className="flex flex-wrap items-center p-4 bg-white border border-gray-200 rounded-md shadow-sm text-sm mb-2">
                            <span className="text-gray-700"><strong>FD</strong>: Full Day</span>
                            <span className="px-3 text-gray-400">|</span>
                            <span className="text-gray-700"><strong>HD</strong>: Half Day</span>
                            <span className="px-3 text-gray-400">|</span>
                            <span className="text-gray-700"><strong>AB</strong>: Absent</span>
                            <span className="px-3 text-gray-400">|</span>
                            <span className="text-gray-700"><strong>OD</strong>: Off Day</span>
                            <span className="px-3 text-gray-400">|</span>
                            <span className="text-gray-700"><strong>SUN</strong>: Sunday</span>
                            <span className="px-3 text-gray-400">|</span>
                            <span className="text-gray-700"><strong>BD</strong>: Birthday Leave</span>
                            <span className="px-3 text-gray-400">|</span>
                            <span className="text-gray-700"><strong>CL</strong>: Casual Leave</span>
                            <span className="px-3 text-gray-400">|</span>
                            <span className="text-gray-700"><strong>CO</strong>: Comp Off</span>
                            <span className="px-3 text-gray-400">|</span>
                            <span className="text-gray-700"><strong>LWP</strong>: Leave Without Pay</span>
                        </div> */}
                        <div className="table-responsive">
                            <DataTable
                                value={adminLogsList}
                                paginator
                                rows={50}
                                globalFilter={globalFilterValue}
                                rowsPerPageOptions={
                                    adminLogsList?.length > 50
                                        ? [20, 30, 50, adminLogsList?.length]
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
                                    field="user_name"
                                    header="User Name"
                                    style={{ minWidth: '10rem', whiteSpace: 'nowrap', textTransform: 'capitalize' }}
                                    body={(rowData) => <span>{rowData?.user_name || '-'}</span>}
                                />

                                <Column
                                    field="module"
                                    header="Module Name"
                                    style={{ minWidth: '10rem', whiteSpace: 'nowrap', textTransform: 'capitalize' }}
                                    body={(rowData) => <span>{formatText(rowData?.module)}</span>}
                                />

                                <Column field="action" header="Action" style={{ minWidth: '6rem' }} body={(rowData) => (
                                    <span className='me-2'>{formatText(rowData?.action)}</span>
                                )} />

                                <Column field="created_at" header="Created At" style={{ minWidth: '6rem' }} body={(rowData) => (
                                    <span className='me-2'>{formatDate(rowData?.created_at, DateFormat?.DATE_YEAR_WISE_SLASH_TIME_FORMAT)}</span>
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


