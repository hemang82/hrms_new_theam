import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../layout/Header';
import Slidebar from '../../layout/Slidebar';
import $ from 'jquery';
import 'datatables.net-bs5';
import 'datatables.net-responsive-bs5';
import SubNavbar from '../../layout/SubNavbar';
import { addHolidays, deleteHolidays, updateHolidays } from '../../utils/api.services';
import { ExportToCSV, ExportToExcel, ExportToPdf, SWIT_DELETE, SWIT_DELETE_SUCCESS, TOAST_ERROR, TOAST_SUCCESS } from '../../config/common';
import profile_image from '../../assets/Images/default.jpg'
import ReactDatatable from '../../config/ReactDatatable';
import { Helmet } from 'react-helmet';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { getCustomerListThunk, getHolidayListThunk, getSalaryListThunk, setLoader, updateDailyTaskList, updateHolidayList, updateIntrestList } from '../../Store/slices/MasterSlice';
import Constatnt, { Codes, ModelName, PUBLIC_URL, SEARCH_DELAY } from '../../config/constant';
import useDebounce from '../hooks/useDebounce';
import { closeModel, formatDate, formatDateDyjs, openModel, textInputValidation } from '../../config/commonFunction';
import Model from '../../component/Model';
import { DeleteComponent } from '../CommonPages/CommonComponent';
import Pagination from '../../component/Pagination';
import { AstroInputTypesEnum, DateFormat, EMPLOYEE_STATUS, LOAN_TYPES } from '../../config/commonVariable';
import { IoAddCircleOutline } from 'react-icons/io5';
import { useForm } from 'react-hook-form';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { PATHS } from '../../Router/PATHS';
import { FaCalendarAlt, FaFlag, FaHeart } from 'react-icons/fa';
import { Container, Row, Col, Card, Button, Image, Badge } from 'react-bootstrap';
import { Calendar } from "react-bootstrap-icons";
import { CiCalendarDate } from 'react-icons/ci';
import { GoDotFill } from "react-icons/go";
import { motion } from "framer-motion";

export default function ManageBirthday() {

    let navigat = useNavigate();
    const dispatch = useDispatch();
    const { register, handleSubmit, setValue, clearErrors, reset, watch, control, formState: { errors } } = useForm();

    const { customerList: { data: customerList }, } = useSelector((state) => state.masterslice);
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
    const [holidayDate, setHolidayDate] = useState(null);
    const [is_edit, setIs_Edit] = useState(false);
    const [is_add, setIs_Add] = useState(false);
    const [editData, setEditData] = useState({});

    const fetchData = async () => {
        const request = {
            birthday: true,
            emp_leave_company: EMPLOYEE_STATUS[0]?.key
        };
        await dispatch(getCustomerListThunk(request));
    };

    useEffect(() => {
        // if (adminEmployeeList?.length === 0) {
        fetchData();
        // }
    }, []);

    const closeModelFunc = async () => {
        setScheduleModel(false);
        setIs_Edit(false);
        setIs_Add(false);
        setEditData({});
        setHolidayDate(dayjs());
        reset();
    }

    const handleDelete = (is_true) => {
        if (is_true) {
            dispatch(setLoader(true));
            let submitData = {
                holiday_id: selectedUser?.id,
                is_deleted: 0,
            };
            deleteHolidays(submitData).then((response) => {
                if (response.code == Codes?.SUCCESS) {
                    closeModel(dispatch);

                    const updatedList = customerList?.filter(
                        (item) => item.id !== selectedUser?.id
                    );

                    dispatch(updateHolidayList(updatedList));
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
                name: data[AstroInputTypesEnum.NAME],
                date: formatDateDyjs(holidayDate, DateFormat.DATE_DASH_TIME_FORMAT),
            }
            dispatch(setLoader(true))
            if (is_edit) {
                request.holiday_id = editData.id;
                updateHolidays(request).then((response) => {
                    if (response?.code == Codes.SUCCESS) {
                        TOAST_SUCCESS(response?.message)
                        navigat(PATHS?.HOLIDAYS_LIST)
                        setIs_Edit(false)
                        setScheduleModel(false)
                        setHolidayDate(dayjs())
                        setEditData({})
                        closeModelFunc()
                        dispatch(setLoader(false))
                        reset()
                    } else {
                        setIs_Edit(false)
                        setScheduleModel(false)
                        TOAST_ERROR(response.message)
                        reset()
                        dispatch(setLoader(false))
                        closeModelFunc()
                    }
                })
            } else {
                addHolidays(request).then((response) => {
                    if (response?.code == Codes.SUCCESS) {
                        TOAST_SUCCESS(response?.message)
                        navigat(PATHS?.HOLIDAYS_LIST)
                        setScheduleModel(false)
                        setHolidayDate(dayjs())
                        closeModelFunc();
                        setIs_Add(false)
                        dispatch(setLoader(false))

                    } else {
                        setIs_Edit(false)
                        setIs_Add(false)
                        setScheduleModel(false)
                        closeModelFunc();
                        TOAST_ERROR(response.message)
                        dispatch(setLoader(false))
                    }
                })
            }
        } catch (error) {
            dispatch(setLoader(false))
            TOAST_ERROR('Somthing went wrong')
        }
    }

    const editFunction = async (data) => {
        setValue(AstroInputTypesEnum.NAME, data?.name)
        setHolidayDate(data?.date ? dayjs(data?.date) : null)
        setIs_Edit(true)
        setScheduleModel(true)
        setEditData(data)
    }

    const BirthDayCard = ({ birthday }) => {


        const isBirthdayToday =
            dayjs().format("MM-DD") === dayjs(birthday?.birth_date).format("MM-DD");

        return (
            <Col xs={12} sm={6} md={4} lg={3} className="mb-4">
                <motion.div whileHover={{ scale: 1.02 }}>
                    <Card
                        className={`shadow-sm h-100 rounded-3 border-1 border-light position-relative overflow-hidden ${birthday?.is_upcoming ? 'green_border' : 'red_border'}`}
                    // style={{
                    //     background: "#ffffff",
                    // }}
                    >
                        {isBirthdayToday && (
                            <Badge
                                style={{
                                    backgroundColor: "#1f7494",
                                    fontSize: "0.75rem",
                                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.15)",
                                }}
                                className="position-absolute top-0 end-0 m-3 px-3 py-2 rounded-pill text-white"
                            >
                                🎉 Happy Birthday!
                            </Badge>
                        )}

                        <Card.Body className="d-flex flex-column justify-content-center align-items-center text-center p-3">
                            {/* Profile Image */}
                            <Image
                                // src={birthday?.profileImage || `${process.env.PUBLIC_URL}/dist/images/logos/hrms_icon.png`}
                                src={birthday?.profileImage || `${Constatnt?.DEFAULT_IMAGE}`}
                                roundedCircle
                                fluid
                                style={{
                                    width: "90px",
                                    height: "90px",
                                    objectFit: "cover",
                                }}
                                className="border border-2 border-white shadow-sm mb-3"
                                alt={birthday?.name || "Employee Profile"}
                            />

                            {/* Name */}
                            <h5
                                className="fw-bold mb-1 fs-6 fs-sm-5 text-capitalize text-dark truncate-text"
                                style={{
                                    maxWidth: "100%",
                                }}
                            >
                                {birthday?.name || "Employee Name"}
                            </h5>

                            <small
                                className="text-muted fw-semibold mb-3 truncate-text"
                                style={{ maxWidth: "90%" }}
                            >
                                Employee ID: {birthday?.employee_id}
                            </small>

                            <div
                                className="d-flex align-items-center justify-content-center fs-6 fw-semibold"
                                style={{
                                    color: "#1f7494",
                                    background: birthday?.is_upcoming ? "#ebf1f6" : "#f8f9fa",
                                    borderRadius: "12px",
                                    padding: "5px 10px",
                                    minWidth: "max-content", // so the box fits content
                                    whiteSpace: "nowrap",
                                    border: '2px solid greay'
                                }}
                            >
                                <CiCalendarDate
                                    className="me-2 flex-shrink-0"
                                    size={20}
                                    style={{ color: "#1f7494" }}
                                />
                                <span className="truncate-date">
                                    {dayjs(birthday?.birth_date).format("DD MMM YYYY")}
                                </span>
                            </div>
                        </Card.Body>
                    </Card>
                </motion.div>
            </Col>
        );
    }

    return (
        <>
            <div className="container-fluid mw-100">
                <SubNavbar title={"Birthday List"} header={'Birthday List'} />
                {/* <div className="widget-content searchable-container list"> */}

                <div className="card card-body p-2 mb-2">
                    <div className="row">
                        <h3 className="text-center text-custom-theam mt-2 fw-semibold">Employee Birthday</h3>
                    </div>
                </div>

                <div className="card card-body">
                    {/* <div className="table-responsive"> */}
                    <div className="my-2 p-2">
                        <Row >
                            {customerList?.length > 0 && customerList?.map((birthday) => (
                                <BirthDayCard key={birthday?.id} birthday={birthday} />
                            ))}
                        </Row>
                    </div>
                    <div className=''>
                        <Pagination per_page={perPage} pageCount={customerList?.total_count} onPageChange={onPageChange} page={page} />
                    </div>
                    {/* </div> */}
                </div>
                {/* </div> */}
            </div>

            <div className={`modal custom-modal  ${scheduleModel ? "fade show d-block " : "d-none"}`}
                id="addnotesmodal" tabIndex={-1} role="dialog" aria-labelledby="addnotesmodalTitle" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-sm modal-md modal-lg" role="document">
                    <div className="modal-content border-0">
                        <div className="modal-header bg-primary " style={{ borderRadius: '10px 10px 0px 0px' }}>
                            <h6 className="modal-title text-dark fs-5">{is_edit ? 'Edit' : 'Add'} Holidays</h6>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" onClick={() => { closeModelFunc() }} />
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit(onSubmitData)}>
                                <div className="col-lg-12">
                                    <div className="card-body p-4">
                                        <div className='row d-flex gap-3'>
                                            <div className='col'>
                                                <div className="mb-2">
                                                    <label htmlFor="lastname" className="form-label fw-semibold">
                                                        Name <span className="text-danger ms-1">*</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <input
                                                            type="text"
                                                            className="form-control ps-2"
                                                            placeholder="Enter name"
                                                            autoComplete='nope'
                                                            {...register(AstroInputTypesEnum.NAME, textInputValidation(AstroInputTypesEnum.NAME, 'Enter name'))}
                                                        />
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.NAME]?.message}
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <label htmlFor="payment_date" className="form-label fw-semibold">
                                                    Date<span className="text-danger ms-1">*</span>
                                                </label>
                                                <div className="input-group">
                                                    <DatePicker
                                                        id={AstroInputTypesEnum.DATE}
                                                        className="paymnet-custom-datepicker w-100"
                                                        format={'YYYY-MM-DD'}
                                                        value={holidayDate}
                                                        onChange={(date) => {
                                                            setHolidayDate(date); // Store date in state
                                                        }}
                                                    />
                                                </div>
                                                <label className="errorc ps-1 pt-1">
                                                    {errors[AstroInputTypesEnum.DATE]?.message}
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


