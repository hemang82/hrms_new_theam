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
import { jsPDF } from "jspdf";
import { FaDownload } from 'react-icons/fa';

export default function ManageSalary() {

    let navigat = useNavigate();
    const dispatch = useDispatch();
    const dateFormat = "MMM-YYYY";
    const [startDate, setStartDate] = useState(dayjs().subtract(1, 'month'));

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

    const INTERN_FILTER_OPTIONS = [
        { key: "", value: "All Types" },
        { key: "0", value: "Permanent" },
        { key: "1", value: "Intern" }
    ];
    const [internStatus, setInternStatus] = useState(INTERN_FILTER_OPTIONS[1]);

    const hasInitialLoaded = useRef(false);

    const fetchData = async (selectedDate = startDate, is_intern = internStatus.key) => {
        const request = {
            "month": selectedDate ? formatDateDyjs(selectedDate, 'MM') : null,
            "year": selectedDate ? formatDateDyjs(selectedDate, 'YYYY') : null,
            emp_leave_company: "0",
            is_intern: is_intern
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

    const downloadSalarySlip = (salary) => {
        const doc = new jsPDF();
        const monthYear = startDate ? formatDateDyjs(startDate, 'MMMM YYYY') : dayjs().format('MMMM YYYY');

        // Font settings
        doc.setFont("helvetica", "normal");

        // 1. Header Border and Title
        doc.setDrawColor(180, 180, 180);
        doc.setLineWidth(0.5);
        doc.rect(10, 10, 190, 277); // Outer page border

        // Company Name
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.setTextColor(30, 41, 59); // Sleek slate color
        doc.text("TRACEWAVE TRANSPARENCY", 105, 25, { align: "center" });

        // Subtitle
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(100, 116, 139);
        doc.text("Employee Salary Slip", 105, 31, { align: "center" });

        // Divider Line
        doc.setDrawColor(226, 232, 240);
        doc.line(15, 36, 195, 36);

        // Salary Slip Month Title
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(15, 23, 42);
        doc.text(`Salary Slip for the Month of: ${monthYear}`, 15, 45);

        // 2. Employee Details Block (Table format or Box)
        doc.setDrawColor(203, 213, 225);
        doc.rect(15, 52, 180, 28); // Employee Details Box

        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(71, 85, 105);
        doc.text("Employee ID:", 20, 60);
        doc.text("Employee Name:", 20, 70);

        doc.setFont("helvetica", "normal");
        doc.setTextColor(15, 23, 42);
        doc.text(salary?.employee_id || "-", 55, 60);
        doc.text(salary?.name || "-", 55, 70);

        // Right side of Employee details
        doc.setFont("helvetica", "bold");
        doc.setTextColor(71, 85, 105);
        doc.text("Payable Days:", 115, 60);
        doc.text("Status:", 115, 70);

        doc.setFont("helvetica", "normal");
        doc.setTextColor(15, 23, 42);
        doc.text(String(salary?.payableDays || "-"), 150, 60);
        doc.text(salary?.is_active ? "Active" : "Active", 150, 70);

        // 3. Attendance Details Section
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(30, 41, 59);
        doc.text("Attendance & Leave Details", 15, 95);

        // Attendance Table Grid
        // Headers
        doc.setFillColor(241, 245, 249);
        doc.rect(15, 100, 180, 8, "F");
        doc.setDrawColor(203, 213, 225);
        doc.rect(15, 100, 180, 24); // Table box

        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(71, 85, 105);
        doc.text("Full Days (FD)", 18, 105);
        doc.text("Half Days (HD)", 45, 105);
        doc.text("Absences (AB)", 72, 105);
        doc.text("Off Days (OD)", 99, 105);
        doc.text("Sundays (SUN)", 126, 105);
        doc.text("Leaves (BD/CL/CO)", 153, 105);

        // Divider in table
        doc.line(15, 108, 195, 108);

        // Values
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(15, 23, 42);
        doc.text(String(salary?.fullDays ?? 0), 18, 116);
        doc.text(String(salary?.halfDays ?? 0), 45, 116);
        doc.text(String(salary?.absences ?? 0), 72, 116);
        doc.text(String(salary?.offDayCount ?? 0), 99, 116);
        doc.text(String(salary?.sundays ?? 0), 126, 116);

        const leavesCount = (Number(salary?.birthdayLeave || salary?.BirthdayLeave || 0) + Number(salary?.casualLeave || 0) + Number(salary?.compOffLeave || 0));
        doc.text(String(leavesCount), 153, 116);

        // Vertical Grid lines
        doc.line(42, 100, 42, 124);
        doc.line(69, 100, 69, 124);
        doc.line(96, 100, 96, 124);
        doc.line(123, 100, 123, 124);
        doc.line(150, 100, 150, 124);

        // 4. Salary & Earnings Details Section
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(30, 41, 59);
        doc.text("Salary & Payment Summary", 15, 140);

        // Box
        doc.rect(15, 145, 180, 40);

        // Grid lines
        doc.line(110, 145, 110, 185); // Middle vertical line
        doc.line(15, 153, 195, 153); // Horizontal header line

        // Box Headers
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(71, 85, 105);
        doc.text("Earnings Description", 20, 150);
        doc.text("Amount (INR)", 115, 150);

        // Content
        doc.setFont("helvetica", "normal");
        doc.setTextColor(15, 23, 42);
        doc.text("Basic Monthly Salary", 20, 161);
        doc.text(`Rs. ${salary?.monthlySalary || "0.00"}`, 115, 161);

        doc.text("Leave Without Pay (LWP) Deductions", 20, 171);
        const lwpCount = Number(salary?.LWPLeave || salary?.LWP || 0);
        const dailyRate = Number(salary?.monthlySalary || 0) / 30;
        const deduction = (lwpCount * dailyRate).toFixed(2);
        doc.text(`Rs. ${lwpCount > 0 ? deduction : "0.00"} (LWP: ${lwpCount})`, 115, 171);

        // Net Payable Box
        doc.setFillColor(241, 245, 249);
        doc.rect(15, 185, 180, 10, "F");
        doc.rect(15, 185, 180, 10); // Border

        doc.setFont("helvetica", "bold");
        doc.setTextColor(30, 41, 59);
        doc.text("Net Payable Salary:", 20, 191);
        doc.text(`Rs. ${salary?.totalSalary || "0.00"}`, 115, 191);

        // 5. Signature Section
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(71, 85, 105);
        doc.text("Date of Issue: " + dayjs().format("DD-MM-YYYY"), 15, 230);

        doc.text("Signature of the Employee", 35, 260);
        doc.line(20, 255, 80, 255);

        doc.text("Authorized Signatory", 145, 260);
        doc.line(130, 255, 190, 255);

        // Save
        const fileName = `Salary_Slip_${salary?.name?.replace(/\s+/g, "_")}_${monthYear.replace(/\s+/g, "_")}.pdf`;
        doc.save(fileName);
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
            month: data?.hasOwnProperty('date') ? (data.date ? formatDateDyjs(data.date, 'MM') : null) : (startDate ? formatDateDyjs(startDate, 'MM') : null),
            year: data?.hasOwnProperty('date') ? (data.date ? formatDateDyjs(data.date, 'YYYY') : null) : (startDate ? formatDateDyjs(startDate, 'YYYY') : null),
            emp_leave_company: data?.hasOwnProperty('emp_leave_company') ? data.emp_leave_company : "0",
            is_intern: data?.hasOwnProperty('is_intern') ? data.is_intern : (internStatus?.key || "")
        };
        dispatch(getSalaryListThunk(request));
    };

    return (
        <>
            <div className="container-fluid mw-100">
                <SubNavbar title={"Salary List"} header={'Salary List'} />
                <div className="widget-content searchable-container list">
                    <div className="card card-body mb-2 p-3">                        <div className="row g-3 ">
                            <div className="col-12 col-md-6 col-lg-3">
                                <div className="position-relative w-100">
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

                            <div className="col-12 col-md-6 col-lg-1 ">
                            </div>

                            {/* Intern Filter Dropdown */}
                            <div className="col-12 col-md-6 col-lg-2">
                                <div className="btn-group w-100">
                                    <button
                                        type="button"
                                        className="btn btn-info dropdown-toggle w-100"
                                        data-bs-toggle="dropdown"
                                        aria-haspopup="true"
                                        aria-expanded="false"
                                        style={{ height: '40px' }}
                                    >
                                        {internStatus?.value || 'All Types'}
                                    </button>
                                    <ul className="dropdown-menu w-100 border">
                                        {INTERN_FILTER_OPTIONS?.map((option) => (
                                            <li key={option.key}>
                                                <a
                                                    className="dropdown-item cursor_pointer text-black-50"
                                                    onClick={() => {
                                                        setInternStatus(option);
                                                        onChangeApiCalling({
                                                            is_intern: option.key
                                                        });
                                                    }}
                                                >
                                                    {option.value}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
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
                        <div className="flex flex-wrap items-center p-4 bg-white border border-gray-200 rounded-md shadow-sm text-sm mb-2">
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
                        </div>


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
                                    field="employee_id"
                                    header="Employee ID"
                                    style={{ minWidth: '10rem', whiteSpace: 'nowrap', textTransform: 'capitalize' }}
                                    body={(rowData) => <span>{rowData?.employee_id || '-'}</span>}
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

                                <Column field="absences" header="AB" style={{ minWidth: '6rem' }} body={(rowData) => (
                                    <span className='me-2'>{rowData?.absences}</span>
                                )} />

                                {/* <Column field="email" header="Holidays" style={{ minWidth: '8rem' }} body={(rowData) => (
                                    <span className='me-2'>{rowData?.email }</span>
                                )} /> */}

                                <Column field="offDayCount" header="OD" style={{ minWidth: '6rem' }} body={(rowData) => (
                                    <span className='me-2'>{rowData?.offDayCount}</span>
                                )} />

                                <Column field="sundays" header="SUN" style={{ minWidth: '6rem' }} body={(rowData) => (
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

                                <Column field="monthlySalary" header="Salary" style={{ minWidth: '6rem' }} body={(rowData) => (
                                    <span className='me-2'>{rowData?.monthlySalary}</span>
                                )} />

                                <Column field="payableDays" header="Day" style={{ minWidth: '6rem' }} body={(rowData) => (
                                    <span className='me-2'>{rowData?.payableDays}</span>
                                )} />

                                <Column field="totalSalary" header="PayableSalary" style={{ minWidth: '8rem' }} body={(rowData) => (
                                    <span className='me-2'>{rowData?.totalSalary}</span>
                                )} />

                                {/* <Column
                                    header="Action"
                                    style={{ minWidth: '6rem', textAlign: 'center' }}
                                    body={(rowData) => (
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-info d-flex align-items-center justify-content-center mx-auto"
                                            style={{ height: '32px', width: '32px', padding: 0 }}
                                            onClick={() => downloadSalarySlip(rowData)}
                                            title="Download Salary Slip"
                                        >
                                            <FaDownload style={{ fontSize: '0.85rem' }} />
                                        </button>
                                    )}
                                /> */}

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


