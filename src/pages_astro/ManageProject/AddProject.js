import React, { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { TOAST_ERROR, TOAST_SUCCESS } from '../../config/common';
import { addAttendance, addProject, editProject } from '../../utils/api.services';
import SubNavbar from '../../layout/SubNavbar';
import Constatnt, { AwsFolder, Codes } from '../../config/constant';
import { formatDate, formatDateDyjs, getBreakMinutes, getWorkingHours, selectOption, selectOptionCustomer, textInputValidation, } from '../../config/commonFunction';
import { AstroInputTypesEnum, DateFormat, EMPLOYEE_STATUS, InputRegex, PROJECT_PRIORITY, TimeFormat } from '../../config/commonVariable';
import { useDispatch, useSelector } from 'react-redux';
import { getCustomerListThunk, getProjectListThunk, setLoader } from '../../Store/slices/MasterSlice';
import Spinner from '../../component/Spinner';
import { DatePicker, Select, Space } from 'antd';
import dayjs from 'dayjs';
import { PATHS } from '../../Router/PATHS';
import ReactQuill from 'react-quill';
import "react-quill/dist/quill.snow.css";

export default function AddProject() {
    const navigation = useNavigate();
    const dispatch = useDispatch();

    const location = useLocation();
    var ProjectData = location?.state;

    const { customerList: { data: customerList }, } = useSelector((state) => state.masterslice);

    const [is_loding, setIs_loading] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const { register, handleSubmit, setValue, clearErrors, reset, watch, control, trigger, formState: { errors }, } = useForm({
        defaultValues: {
            breaks: [{ start: null, end: null }], // ✅ at least one row
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

    console.log('ProjectData', ProjectData);

    useEffect(() => {
        if (ProjectData && customerList?.length > 0) {
            dispatch(setLoader(true))
            const teamArray = ProjectData?.team ? ProjectData?.team?.split(",").map(Number) : [];
            const selectedEmployees = customerList?.filter(emp => teamArray?.includes(emp?.id)) || [];
            setValue(AstroInputTypesEnum.EMPLOYEE, teamArray || []);
            setValue(AstroInputTypesEnum.NAME, ProjectData?.name || null);
            setValue(AstroInputTypesEnum.DESCRIPTION, ProjectData?.description || null);
            setValue(AstroInputTypesEnum.PRIORITY, ProjectData?.priority || null);
            setValue(AstroInputTypesEnum.DATE, ProjectData?.deadline ? dayjs(ProjectData?.deadline, 'YYYY-MM-DD') : null);

            dispatch(setLoader(false))
        }
    }, [ProjectData, customerList]);

    const onSubmitData = async (data) => {
        try {
            dispatch(setLoader(true))
            let request = {
                name: data[AstroInputTypesEnum.NAME],
                description: data[AstroInputTypesEnum.DESCRIPTION],
                deadline: formatDateDyjs(data[AstroInputTypesEnum.DATE], DateFormat?.DATE_DASH_TIME_FORMAT),
                team: data[AstroInputTypesEnum.EMPLOYEE]?.length == 1 ? data[AstroInputTypesEnum.EMPLOYEE][0]?.toString() : data[AstroInputTypesEnum.EMPLOYEE],
                priority: data[AstroInputTypesEnum.PRIORITY]
            };
            if (ProjectData) {
                request.project_id = ProjectData?.id?.toString();
                editProject(request).then((response) => {
                    if (response?.code == Codes.SUCCESS) {
                        TOAST_SUCCESS(response?.message)
                        dispatch(getProjectListThunk({}));
                        navigation(PATHS?.LIST_PROJECT)
                    } else {
                        TOAST_ERROR(response.message)
                    }
                })
            } else {
                addProject(request).then((response) => {
                    if (response?.code == Codes.SUCCESS) {
                        TOAST_SUCCESS(response?.message)
                        navigation(PATHS?.LIST_PROJECT)
                        dispatch(getProjectListThunk({}));
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
                <SubNavbar title={ProjectData ? 'Edit Project' : 'Add Project'} header={'Project List'} subHeaderOnlyView={ProjectData ? 'Edit Project' : 'Add Project'} />
                <div className="row">
                    <div className="col-12 justify-content-center">
                        <div className='row justify-content-center '>
                            <form onSubmit={handleSubmit(onSubmitData)}>
                                <div className="card" >
                                    <div className="card-body">

                                        <div className='row col-12 col-md-12 '>
                                            <div className='col-md-6'>
                                                <div className="mb-4">
                                                    <label htmlFor="lastname" className="form-label fw-semibold">
                                                        Project Name <span className="text-danger ms-1">*</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <input
                                                            type="text"
                                                            className="form-control ps-2"
                                                            placeholder="Enter project name"
                                                            autoComplete='nope'
                                                            {...register(AstroInputTypesEnum.NAME, textInputValidation(AstroInputTypesEnum.NAME, 'Enter project name'))}
                                                        />
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.NAME]?.message}
                                                    </label>
                                                </div>

                                                <div className="mb-4">
                                                    <label
                                                        htmlFor="leave_reason"
                                                        className="form-label fw-semibold"
                                                    >
                                                        Project Description <span className="text-danger ms-1">*</span>
                                                    </label>
                                                    <div className=" border rounded-1">
                                                        <Controller
                                                            name={AstroInputTypesEnum.DESCRIPTION}
                                                            control={control}
                                                            rules={{ required: "Enter project description" }}
                                                            render={({ field }) => (
                                                                <ReactQuill
                                                                    {...field}
                                                                    theme="snow"
                                                                    placeholder="Enter project description"
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

                                                <div className="2 d-flex gap-2">
                                                    <div className="col-12 col-md-6">

                                                        <label htmlFor="dob1" className="form-label fw-semibold">
                                                            Deadline Date <span className="text-danger ms-1">*</span>
                                                        </label>
                                                        <Controller
                                                            name={AstroInputTypesEnum.DATE}
                                                            control={control}
                                                            rules={{ required: "Select Deadline Date" }}
                                                            render={({ field }) => (
                                                                <DatePicker
                                                                    id={AstroInputTypesEnum.DATE}
                                                                    className="form-control custom-datepicker w-100"
                                                                    format={DateFormat?.DATE_FORMAT}
                                                                    value={field.value ? dayjs(field.value) : null}
                                                                    onChange={(date) => {
                                                                        console.log('date', date);

                                                                        field.onChange(date ? date.toISOString() : null)
                                                                    }}
                                                                    allowClear={false}
                                                                    picker="date"
                                                                />
                                                            )}
                                                        />
                                                        {errors[AstroInputTypesEnum.DATE] && (
                                                            <small className="text-danger">{errors[AstroInputTypesEnum.DATE].message}</small>
                                                        )}
                                                    </div>
                                                    <div className="col-12 col-md-6">
                                                        <div className="mb-4">
                                                            <label htmlFor="priority" className="form-label fw-semibold">
                                                                Priority<span className="text-danger ms-1">*</span>
                                                            </label>
                                                            <div className="input-group">
                                                                <Controller
                                                                    name={AstroInputTypesEnum.PRIORITY}
                                                                    control={control}
                                                                    rules={{ required: "Select priority" }}
                                                                    render={({ field }) => (
                                                                        <Select
                                                                            style={{ width: "100%", height: "40px" }}
                                                                            placeholder="Select priority"
                                                                            value={field.value || undefined} // single value
                                                                            onChange={(selectedId) => {
                                                                                field.onChange(selectedId); // update form
                                                                                setValue(AstroInputTypesEnum.PRIORITY, selectedId); // optional extra
                                                                            }}
                                                                            options={PROJECT_PRIORITY?.map((c) => ({
                                                                                label: c.value,
                                                                                value: c.key,
                                                                            })) || []
                                                                            }
                                                                            // optionFilterProp="label"
                                                                            // filterSort={(optionA, optionB) =>
                                                                            //     (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                                                            // }
                                                                            optionRender={(option) => <Space>{option?.label}</Space>}
                                                                            className=" border rounded-1"
                                                                        />
                                                                    )}
                                                                />
                                                            </div>
                                                            <label className="errorc ps-1 pt-1">
                                                                {errors[AstroInputTypesEnum.PRIORITY]?.message}
                                                            </label>
                                                        </div>
                                                    </div>
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
                                                                mode="multiple"
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
                                                                className="border rounded-1"
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
