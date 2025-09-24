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
import { Container, Row, Col, Card, Button, Image, Badge, Spinner } from 'react-bootstrap';
import { CiCalendarDate } from 'react-icons/ci';
import { motion } from "framer-motion";
import { NoDataFound } from '../CommonPages/NoDataFound';

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
            // month: startDate ? formatDateDyjs(startDate, 'MM') : null,
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

    const onChangeApiCalling = (data) => {
        const request = {
            year: data?.date ? formatDateDyjs(data.date, 'YYYY') : null
            // month: data?.date ? formatDateDyjs(data.date, 'MM') : null
        };
        dispatch(getSaturdayListThunk(request));
    };

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

    const SaturdayMonthCard = ({ monthObj }) => {
        const [saturdays, setSaturdays] = useState(monthObj.data || []);
        const [loadingId, setLoadingId] = useState(null);

        const handleToggle = async (rowData) => {
            setLoadingId(rowData.id);

            let submitData = {
                id: rowData?.id,
                type: rowData?.type == "working" ? "off" : "working",
                date: rowData?.date,
            };

            try {
                const response = await editSaturday(submitData);

                if (response.code == Codes.SUCCESS) {
                    setSaturdays((prev) =>
                        prev.map((sat) =>
                            sat.id === rowData.id
                                ? { ...sat, type: sat.type == "working" ? "off" : "working" }
                                : sat
                        )
                    );
                    TOAST_SUCCESS(response?.message);
                } else {
                    TOAST_ERROR(response.message);
                }
            } catch (error) {
                console.error("Toggle API Error:", error);
                TOAST_ERROR("Something went wrong. Please try again.");
            } finally {
                setLoadingId(null);
            }
        };
        return (
            <Col xs={12} md={6} lg={4} className="mb-4 saturday_month_view">
                <motion.div whileHover={{ scale: 1.02 }}>
                    <Card
                        className={`shadow-sm rounded-3 border-1 border-light ${monthObj.is_current ? "green_border" : "red_border"}`}
                        style={{ minHeight: "325px" }}
                    >
                        <Card.Body className="p-3">
                            <h5 className="text-center mb-4 fw-semibold text-custom-theam fontSize16">
                                {dayjs(`${dayjs().year()}-${monthObj.month}-01`).format("MMMM YYYY")}
                            </h5>

                            <Row className="fw-semibold custom_border_bottom pb-2 mb-2 text-muted small">
                                <Col xs={4}>Date</Col>
                                <Col xs={2}>Day's</Col>
                                <Col xs={4}>Day Type</Col>
                                <Col xs={2}>Status</Col>
                            </Row>

                            {saturdays.slice(0, 5).map((rowData) => (
                                <Row key={rowData.id} className="align-items-center custom_border_bottom py-2">
                                    <Col xs={4}>{dayjs(rowData.date).format("DD-MM-YYYY")}</Col>
                                    <Col xs={2}>{getSaturdayOrdinal(rowData.date) || "-"}</Col>
                                    <Col xs={4}>
                                        <span
                                            className={`badge me-2 text-light rounded-4 fontSize14 ${getAttendanceStatusColor(rowData?.type) || "bg-secondary"}`}
                                        >
                                            {getStatus(rowData?.type) || "-"}
                                        </span>
                                    </Col>
                                    <Col xs={2}>
                                        <div className="position-relative d-inline-block">
                                            <div className="toggle-switch">
                                                <input
                                                    type="checkbox"
                                                    id={`customSoftSwitch-${rowData.id}`}
                                                    checked={rowData.type === "working"}
                                                    onChange={() => handleToggle(rowData)}
                                                    disabled={loadingId === rowData.id}
                                                />
                                                <label
                                                    htmlFor={`customSoftSwitch-${rowData.id}`}
                                                    className={`toggle-switch-label ${rowData.type === "working" ? "active" : ""}`}
                                                >
                                                    <span className="toggle-switch-slider"></span>
                                                </label>
                                            </div>
                                            {loadingId === rowData.id && (
                                                <div
                                                    className="position-absolute top-50 start-50 translate-middle"
                                                    style={{ pointerEvents: "none" }}
                                                >
                                                    <Spinner animation="border" size="sm" />
                                                </div>
                                            )}
                                        </div>
                                    </Col>
                                </Row>
                            ))}
                        </Card.Body>
                    </Card>
                </motion.div>
            </Col>
        );
    };

    return (
        <>
            <div className="container-fluid mw-100">
                <SubNavbar title={"Saturday List"} header={'Saturday List'} />
                <div className="widget-content searchable-container list">

                    <div className="card card-body mb-2 p-3 mb-2">
                        <div className="row g-3 ">
                            <div className="col-12 col-md-6 col-lg-8">
                            </div>

                            <div className="col-12 col-md-6 col-lg-2">
                            </div>

                            <div className="col-12 col-md-6 col-lg-2">
                                <DatePicker
                                    className="custom-datepicker w-100 p-2"
                                    picker="year"   // ✅ only year picker
                                    format="YYYY"   // ✅ show only year
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
                        <div className="gx-4 gy-4">
                            <Row className="gx-4 gy-4 saturday_month_view_section">
                                {saturdayList?.length > 0 ? saturdayList?.map((monthObj) => (
                                    <SaturdayMonthCard key={monthObj?.month} monthObj={monthObj} />
                                )) : (<>
                                    <Col xs={12}>
                                        <NoDataFound />
                                    </Col>
                                </>)}
                            </Row>
                        </div>
                        {/* <div className=''>
                            <Pagination per_page={perPage} pageCount={saturdayList?.total_count} onPageChange={onPageChange} page={page} />
                        </div> */}
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


