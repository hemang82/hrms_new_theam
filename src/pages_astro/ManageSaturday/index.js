import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../layout/Header';
import Slidebar from '../../layout/Slidebar';
import $ from 'jquery';
import 'datatables.net-bs5';
import 'datatables.net-responsive-bs5';
import SubNavbar from '../../layout/SubNavbar';
import { EditUser, CustomerList, editSaturday } from '../../utils/api.services';
import { ExportToCSV, ExportToExcel, ExportToPdf, SWIT_DELETE, SWIT_DELETE_SUCCESS, TOAST_ERROR, TOAST_SUCCESS } from '../../config/common';
import profile_image from '../../assets/Images/default.jpg'
import ReactDatatable from '../../config/ReactDatatable';
import { Helmet } from 'react-helmet';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { getCustomerListThunk, getSalaryListThunk, getSaturdayListThunk, setLoader, updateCustomerList, updateSaterdayList } from '../../Store/slices/MasterSlice';
import Constatnt, { Codes, ModelName, SEARCH_DELAY } from '../../config/constant';
import useDebounce from '../hooks/useDebounce';
import { closeModel, formatDate, formatDateDyjs, getAllStatusObject, getLoanStatusObject, getSaturdayOrdinal, openModel } from '../../config/commonFunction';
import Model from '../../component/Model';
import { DeleteComponent } from '../CommonPages/CommonComponent';
import Pagination from '../../component/Pagination';
import { DateFormat, getAttendanceStatusColor, getStatus, STATUS_COLORS } from '../../config/commonVariable';
import { IoAddCircleOutline } from 'react-icons/io5';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { InputSwitch } from 'primereact/inputswitch';

export default function ManageSaturday() {

    let navigat = useNavigate();
    const dispatch = useDispatch();
    const dateFormat = "YYYY";
    const [startDate, setStartDate] = useState(dayjs()); // ✅ start of previous month

    const [totalRows, setTotalRows] = useState(0);
    const [checked, setChecked] = useState('');
    const [is_load, setis_load] = useState(false);

    const { saturdayList: { data: saturdayList }, } = useSelector((state) => state.masterslice);
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
            // "month": startDate ? formatDateDyjs(startDate, 'MM') : null,
            year: startDate ? formatDateDyjs(startDate, 'YYYY') : null,
            month: startDate ? formatDateDyjs(startDate, 'MM') : null,
            // "page": 1,
            // "limit": 10
        }
        await dispatch(getSaturdayListThunk(request));

    };

    useEffect(() => {
        if (saturdayList?.length == 0) {
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
                    const updatedList = saturdayList?.user?.filter((item) => item.id !== selectedUser?.id);
                    dispatch(updateCustomerList({
                        ...saturdayList,
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
        const salaryData = saturdayList?.map((salary, index) => ({
            id: index + 1,
            employeeID: `${salary?.empId || '-'}`,
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
            year: data?.date ? formatDateDyjs(data.date, 'YYYY') : null,
            month: data?.date ? formatDateDyjs(data.date, 'MM') : null
        };
        dispatch(getSaturdayListThunk(request));
    };

    // Toggle function
    const handleToggle = (rowData) => {
        console.log('rowData', rowData);
        let submitData = {
            id: rowData?.id,
            type: rowData?.type == "working" ? "off" : "working",
            date: rowData?.date
        }
        editSaturday(submitData).then((response) => {
            if (response.code == Codes.SUCCESS) {
                let updatedList = saturdayList?.map((item) => {
                    if (rowData?.id == item.id) {
                        return {
                            ...item,
                            type: response?.data?.type,
                        };
                    }
                    return item;
                });
                dispatch(updateSaterdayList(updatedList));
                TOAST_SUCCESS(response?.message)
            } else {
                TOAST_ERROR(response.message)
            }
        })
    };

    return (
        <>
            <div className="container-fluid mw-100">
                <SubNavbar title={"Saturday List"} header={'Saturday List'} />
                <div className="widget-content searchable-container list">
                    <div className="card card-body mb-2 p-3 mb-2">
                        <div className="row g-3 ">
                            <div className="col-12 col-md-6 col-lg-8">
                                <div className="position-relative w-50">
                                    <input
                                        type="text"
                                        className="form-control ps-5 "
                                        id="input-search"
                                        placeholder="Search Saturday ..."
                                        value={globalFilterValue}
                                        onChange={onGlobalFilterChange}
                                    />
                                    <i className="ti ti-search position-absolute top-50 start-0 translate-middle-y fs-6 text-dark ms-3" />
                                </div>
                            </div>

                            <div className="col-12 col-md-6 col-lg-2">
                            </div>

                            <div className="col-12 col-md-6 col-lg-2">
                                <DatePicker
                                    className="custom-datepicker w-100 p-2"
                                    picker="month"   // ✅ only year picker
                                    format="YYYY-MMM"   // ✅ show only year
                                    value={startDate}
                                    onChange={(date) => {
                                        setStartDate(date);
                                        onChangeApiCalling({
                                            date: date,
                                        });
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="card card-body">
                        <div className="table-responsive">
                            <DataTable
                                value={saturdayList?.length > 0 ? saturdayList : []}
                                paginator
                                rows={50}
                                globalFilter={globalFilterValue}
                                rowsPerPageOptions={
                                    saturdayList?.length > 50
                                        ? [20, 30, 50, saturdayList?.length]
                                        : [20, 30, 40]
                                }
                                currentPageReportTemplate='Showing {first} to {last} of {totalRecords} entries'
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                loading={loading}
                                sortField={sortField}
                                sortOrder={sortOrder}
                                // onSort={handleSort}
                                emptyMessage={<span style={{ textAlign: 'center', display: 'block' }}>No Saturday Found.</span>}
                            >
                                <Column
                                    field="id"
                                    header="Id"
                                    style={{ minWidth: '4rem' }}
                                    body={(rowData, options) => options.rowIndex + 1}
                                    sortable
                                    showFilterMenu={true}
                                />
                                <Column field="date" header="Date" style={{ minWidth: '6rem' }} body={(rowData) => (
                                    <span className='me-2'>{formatDate(rowData.date, DateFormat.DATE_FORMAT) || '-'}</span>
                                )} />

                                <Column field="date" header="Week Day" style={{ minWidth: '6rem' }} body={(rowData) => (
                                    <span className='ms-4 me-2'>{getSaturdayOrdinal(rowData.date) || '-'}</span>
                                )} />

                                <Column field="type" data-pc-section="root" header="Day Type" style={{ minWidth: '6rem' }} body={(rowData) => (
                                    <>
                                        <span
                                            className={`p-tag p-component badge me-2 text-light fw-semibold px-2 rounded-4 py-1 status_font ${getAttendanceStatusColor(rowData?.type) || "bg-secondary"}`}
                                            data-pc-name="tag"
                                            data-pc-section="root"
                                        >
                                            <span className="p-tag-value fs-2 " data-pc-section="value">
                                                {getStatus(rowData?.type) || "-"}
                                            </span>
                                        </span>
                                    </>
                                )} />

                                <Column
                                    field="type"
                                    header="Status"
                                    style={{ minWidth: '6rem' }}
                                    body={(rowData) => (
                                        // <div className="flex items-center gap-4">
                                        //     {/* Toggle Switch */}
                                        //     <InputSwitch
                                        //         checked={rowData.type == 'working' ? true : false}
                                        //         onChange={(e) => handleToggle(e, rowData)}
                                        //     />
                                        // </div>

                                        <div className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                id={`customSoftSwitch-${rowData.id}`}
                                                checked={rowData.type == 'working' ? true : false}
                                                onChange={() => handleToggle(rowData)}
                                            />
                                            <label
                                                htmlFor={`customSoftSwitch-${rowData.id}`}
                                                className={`toggle-switch-label ${rowData.type == 'working' ? "active" : ""}`}
                                            >
                                                <span className="toggle-switch-slider"></span>
                                            </label>
                                        </div>
                                    )}
                                />
                            </DataTable>

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


