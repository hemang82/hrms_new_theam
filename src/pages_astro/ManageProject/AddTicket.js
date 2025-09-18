import React, { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { TOAST_ERROR, TOAST_SUCCESS } from '../../config/common';
import { addAttendance } from '../../utils/api.services';
import SubNavbar from '../../layout/SubNavbar';
import Constatnt, { AwsFolder, Codes } from '../../config/constant';
import { formatDate, formatDateDyjs, getBreakMinutes, getWorkingHours, selectOption, selectOptionCustomer, textInputValidation, } from '../../config/commonFunction';
import { AstroInputTypesEnum, DateFormat, EMPLOYEE_STATUS, InputRegex, PROJECT_LIST, PROJECT_PRIORITY, TASK_LIST, TimeFormat } from '../../config/commonVariable';
import { useDispatch, useSelector } from 'react-redux';
import { getCustomerListThunk, setLoader } from '../../Store/slices/MasterSlice';
import Spinner from '../../component/Spinner';
import { DatePicker, Select, Space } from 'antd';
import dayjs from 'dayjs';
import { PATHS } from '../../Router/PATHS';
import ReactQuill from 'react-quill';
import "react-quill/dist/quill.snow.css";

export default function AddTicket() {

    const navigation = useNavigate();
    const dispatch = useDispatch();

    const location = useLocation();
    var ProjectData = location?.state;

    const { customerList: { data: customerList }, } = useSelector((state) => state.masterslice);

    const [is_loding, setIs_loading] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const { register, handleSubmit, setValue, clearErrors, reset, watch, control, trigger, formState: { errors }, } = useForm({
        defaultValues: {
            breaks: [{ start: null, end: null }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "breaks",
    });

    useEffect(() => {
        const request = {
            emp_leave_company: EMPLOYEE_STATUS[0]?.key
        };
        if (customerList?.length === 0) {
            dispatch(getCustomerListThunk(request));
        }
    }, [])

    useEffect(() => {
        if (ProjectData && customerList?.length > 0) {
            dispatch(setLoader(true))
            const formattedBreaks = ProjectData?.breaks?.map(b => ({
                start: b.start ? dayjs(`${b.start}`, 'HH:mm:ss') : null,
                end: b.end ? dayjs(`${b.end}`, 'HH:mm:ss') : null
            }));
            setValue('breaks', formattedBreaks);
            const selectedEmployee = customerList?.find(emp => emp.id == ProjectData?.emp_id) || null;
            setSelectedEmployee(selectedEmployee || null)
            setValue(AstroInputTypesEnum?.EMPLOYEE_ID, ProjectData?.emp_id);
            setValue('dob1', ProjectData?.date ? dayjs(ProjectData?.date).format('DD-MM-YYYY') : null);
            setValue('checkIn', ProjectData?.checkInTimes?.[0] ? dayjs(`${ProjectData.date} ${ProjectData.checkInTimes[0]}`, 'YYYY-MM-DD HH:mm:ss') : null);

            setValue('checkOut', ProjectData?.checkOutTimes?.[0] ? dayjs(`${ProjectData.date} ${ProjectData.checkOutTimes[0]}`, 'YYYY-MM-DD HH:mm:ss') : null);
            dispatch(setLoader(false))
        }
        console.log('userData?.departmentuserData?.department', ProjectData?.department);
    }, [ProjectData, customerList]);

    const onSubmitData = async (data) => {
        try {
            dispatch(setLoader(true))
            let request = {
                employee_id: selectedEmployee?.id,
                date: formatDateDyjs(data?.dob1, DateFormat?.DATE_DASH_TIME_FORMAT),
                check_in_time: data?.checkIn ? dayjs(data.checkIn).format("HH:mm") : null,
                check_out_time: data?.checkOut ? dayjs(data.checkOut).format("HH:mm") : null,
                breaks: Array.isArray(data?.breaks) && data?.breaks?.length > 0
                    ? data.breaks.map(b => ({
                        start: b?.start
                            ? dayjs(b.start, TimeFormat?.TIME_WITH_SECONDS_12_HOUR_FORMAT).format("HH:mm")
                            : null,
                        end: b?.end
                            ? dayjs(b.end, TimeFormat?.TIME_WITH_SECONDS_12_HOUR_FORMAT).format("HH:mm")
                            : null
                    })) : [],
                lat: "0.000",
                log: "0.000",
                location_id: "TRACEWAVE",
            };

            if (ProjectData) {
                // request.employee_id = userData?.id?.toString();
                // EditUser(request).then((response) => {
                //     if (response?.code == Codes.SUCCESS) {
                //         TOAST_SUCCESS(response?.message)
                //         navigation(PATHS?.ATTENDANCE_LIST)
                //     } else {
                //         TOAST_ERROR(response.message)
                //     }
                // })
            } else {
                addAttendance(request).then((response) => {
                    if (response?.code == Codes.SUCCESS) {
                        TOAST_SUCCESS(response?.message)
                        navigation(PATHS?.ATTENDANCE_LIST)
                        dispatch(setLoader(false))

                    } else {
                        TOAST_ERROR(response.message)
                        dispatch(setLoader(false))
                    }
                })
            }

        } catch (error) {
            TOAST_ERROR('Somthing went wrong')
            dispatch(setLoader(false))
        }
    }

    const handleInputChange = async (key, value) => {
        let filteredValue = value;
        if (key === AstroInputTypesEnum.PANCARD) {
            filteredValue = value.replace(InputRegex.ONCHANGE_PANNUMBER_REGEX, '');
        } else if (key === AstroInputTypesEnum.ADHARCARD) {
            filteredValue = value.replace(InputRegex.ONCHANGE_AADHAR_REGEX, '');
        } else if (key === AstroInputTypesEnum.MOBILE || key === AstroInputTypesEnum.MONTHLY_SALARY) {
            filteredValue = value.replace(InputRegex.ONCHANGE_MOBILE_REGEX, '');
        }
        setValue(key, filteredValue)
        clearErrors(key);               // Clear error message (if any)
        await trigger(key);
    };

    const handleChange = value => {
        console.log(`selected ${value}`);
    };

    return (
        <>
            {<Spinner isActive={is_loding} message={'Please Wait'} />}
            <div className="container-fluid mw-100">
                <SubNavbar title={ProjectData ? 'Edit Ticket' : 'Add Ticket'} header={'Ticket List'} subHeaderOnlyView={ProjectData ? 'Edit Ticket' : 'Add Ticket'} />
                <div className="row">
                    <div className="col-12 justify-content-center">
                        <div className='row justify-content-center '>
                            <form onSubmit={handleSubmit(onSubmitData)}>
                                <div className="card" >
                                    <div className="card-body">

                                        <div className='row col-12 col-md-12 '>
                                            <div className='col-md-6'>
                                                <div className="mb-4">
                                                    <label htmlFor="gender1" className="form-label fw-semibold">
                                                        Select Project<span className="text-danger ms-1">*</span>
                                                    </label>

                                                    <Controller
                                                        name={AstroInputTypesEnum.PROJECT}
                                                        control={control}
                                                        rules={{ required: "Select at least one project" }}
                                                        render={({ field }) => (
                                                            <Select
                                                                // mode="multiple"
                                                                style={{ width: "100%", height: "40px" }}
                                                                placeholder="Select project"
                                                                value={field.value || []}
                                                                onChange={(selectedIds) => {
                                                                    field.onChange(selectedIds);
                                                                    setValue(AstroInputTypesEnum.PROJECT, selectedIds);
                                                                }}
                                                                options={PROJECT_LIST?.map((c) => ({
                                                                    label: c.name,
                                                                    value: c.id,
                                                                })) || []}
                                                                optionRender={(option) => (
                                                                    <Space>{option?.label}</Space>
                                                                )}
                                                                className='border rounded-1'
                                                            />
                                                        )}
                                                    />
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.EMPLOYEE]?.message}
                                                    </label>
                                                </div>

                                                <div className="mb-4">
                                                    <label htmlFor="lastname" className="form-label fw-semibold">
                                                        Title <span className="text-danger ms-1">*</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <input
                                                            type="text"
                                                            className="form-control ps-2"
                                                            placeholder="Enter title"
                                                            autoComplete='nope'
                                                            {...register(AstroInputTypesEnum.TITLE, textInputValidation(AstroInputTypesEnum.TITLE, 'Enter title'))}
                                                        />
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.TITLE]?.message}
                                                    </label>
                                                </div>

                                                <div className="mb-4">
                                                    <label
                                                        htmlFor="leave_reason"
                                                        className="form-label fw-semibold"
                                                    >
                                                        Description <span className="text-danger ms-1">*</span>
                                                    </label>
                                                    <div className=" border rounded-1">
                                                        <Controller
                                                            name={AstroInputTypesEnum.DESCRIPTION}
                                                            control={control}
                                                            rules={{ required: "Enter description" }}
                                                            render={({ field }) => (
                                                                <ReactQuill
                                                                    {...field}
                                                                    theme="snow"
                                                                    placeholder="Enter description"
                                                                    className="custom-quill w-100"
                                                                    style={{ minHeight: "200px" }} // ~4 lines
                                                                />
                                                            )}
                                                        />
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.DESCRIPTION]?.message}
                                                    </label>
                                                </div>


                                            </div>

                                            <div className='col-md-6'>
                                                <div className="mb-4">
                                                    <label htmlFor="gender1" className="form-label fw-semibold">
                                                        Select Task<span className="text-danger ms-1">*</span>
                                                    </label>

                                                    <Controller
                                                        name={AstroInputTypesEnum.TASK}
                                                        control={control}
                                                        rules={{ required: "Select task" }}
                                                        render={({ field }) => (
                                                            <Select
                                                                // mode="multiple"
                                                                style={{ width: "100%", height: "40px" }}
                                                                placeholder="Select task"
                                                                value={field.value || []}
                                                                onChange={(selectedIds) => {
                                                                    field.onChange(selectedIds);
                                                                    setValue(AstroInputTypesEnum.TASK, selectedIds);
                                                                }}
                                                                options={TASK_LIST?.map((c) => ({
                                                                    label: c.name,
                                                                    value: c.id,
                                                                })) || []}
                                                                optionRender={(option) => (
                                                                    <Space>{option?.label}</Space>
                                                                )}
                                                                className='border rounded-1'
                                                            />
                                                        )}
                                                    />
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.TASK]?.message}
                                                    </label>
                                                </div>

                                                <div className="mb-4">
                                                    <label htmlFor="gender1" className="form-label fw-semibold">
                                                        Select Employee<span className="text-danger ms-1">*</span>
                                                    </label>

                                                    <Controller
                                                        name={AstroInputTypesEnum.EMPLOYEE}
                                                        control={control}
                                                        rules={{ required: "Select at least one employee" }}
                                                        render={({ field }) => (
                                                            <Select
                                                                // mode="multiple"
                                                                style={{ width: "100%", height: "40px" }}
                                                                placeholder="Select employee"
                                                                value={field.value || []} // ensure controlled array
                                                                onChange={(selectedIds) => {
                                                                    field.onChange(selectedIds); // updates form value
                                                                    setValue(AstroInputTypesEnum.EMPLOYEE, selectedIds); // optional extra update
                                                                }}
                                                                options={customerList?.map((c) => ({
                                                                    label: c.name,
                                                                    value: c.id,
                                                                })) || []}
                                                                optionRender={(option) => (
                                                                    <Space>{option?.label}</Space>
                                                                )}
                                                                className='border rounded-1'
                                                            />
                                                        )}
                                                    />

                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.EMPLOYEE]?.message}
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="modal-footer justify-content-center mb-3">
                                                <button type='submit' className="btn btn-primary" >Submit</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                </div>

            </div >
        </>
    )
}
