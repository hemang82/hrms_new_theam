import React, { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { TOAST_ERROR, TOAST_SUCCESS } from '../../config/common';
import { addAttendance, addTicket, editTicket } from '../../utils/api.services';
import SubNavbar from '../../layout/SubNavbar';
import Constatnt, { AwsFolder, Codes } from '../../config/constant';
import { formatDate, formatDateDyjs, getBreakMinutes, getWorkingHours, selectOption, selectOptionCustomer, textInputValidation, } from '../../config/commonFunction';
import { AstroInputTypesEnum, DateFormat, EMPLOYEE_STATUS, InputRegex, PROJECT_LIST, PROJECT_PRIORITY, TASK_LIST, TimeFormat } from '../../config/commonVariable';
import { useDispatch, useSelector } from 'react-redux';
import { getAssignTaskListThunk, getCustomerListThunk, getListTicketThunk, getProjectListThunk, setLoader } from '../../Store/slices/MasterSlice';
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
    var TicketData = location?.state;

    const { assignTaskList: { data: assignTaskList } } = useSelector((state) => state.masterslice);
    const { projectList: { data: projectList } } = useSelector((state) => state.masterslice);
    const { customerList: { data: customerList }, } = useSelector((state) => state.masterslice);

    const [is_loding, setIs_loading] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [selectedProject, setSelectedProject] = useState({});


    const { register, handleSubmit, setValue, clearErrors, reset, watch, control, trigger, formState: { errors }, } = useForm({
        defaultValues: {
            breaks: [{ start: null, end: null }],
        },
    });

    // const { fields, append, remove } = useFieldArray({
    //     control,
    //     name: "breaks",
    // });

    useEffect(() => {
        const request = {
            emp_leave_company: EMPLOYEE_STATUS[0]?.key
        };
        if (customerList?.length === 0) {
            dispatch(getCustomerListThunk(request));
        }
        if (projectList?.length === 0) {
            dispatch(getProjectListThunk({}));
        }
        if (assignTaskList?.length === 0) {
            dispatch(getAssignTaskListThunk({}));
        }
    }, [])

    useEffect(() => {
        if (TicketData && customerList?.length > 0 && assignTaskList?.length > 0) {

            setValue(AstroInputTypesEnum.PROJECT, TicketData?.project_id || null);
            setValue(AstroInputTypesEnum.TITLE, TicketData?.title || null);

            watch(AstroInputTypesEnum.PROJECT) && setValue(AstroInputTypesEnum.TASK, TicketData?.task_id?.toString() || null);

            setValue(AstroInputTypesEnum.DESCRIPTION, TicketData?.description || null);

            // get selected objects
            const selectedObjects = projectList?.filter((p) => (p.id == TicketData?.project_id));
            setSelectedProject(selectedObjects?.length > 0 ? selectedObjects[0]?.team?.split(",").map((id) => id.trim()) : []);
            if (selectedObjects?.length > 0) {
                const AssignTO = TicketData?.assign_to ? TicketData?.assign_to?.split(",").map(String) : [];
                setValue(AstroInputTypesEnum.EMPLOYEE, AssignTO || []);
            }
            dispatch(setLoader(false))
        }
    }, [TicketData, customerList]);

    const onSubmitData = async (data) => {
        try {
            dispatch(setLoader(true))
            let request = {
                project_id: data[AstroInputTypesEnum.PROJECT],
                task_id: data[AstroInputTypesEnum.TASK],
                title: data[AstroInputTypesEnum.TITLE],
                description: data[AstroInputTypesEnum.DESCRIPTION],
                // deadline: formatDateDyjs(data[AstroInputTypesEnum.DATE], DateFormat?.DATE_DASH_TIME_FORMAT),
                assign_to: data[AstroInputTypesEnum.EMPLOYEE]?.length == 1 ? data[AstroInputTypesEnum.EMPLOYEE][0]?.toString() : data[AstroInputTypesEnum.EMPLOYEE],
                // priority: data[AstroInputTypesEnum.PRIORITY]
                status: ""
            };
            if (TicketData) {
                request.ticket_id = TicketData?.id?.toString();
                editTicket(request).then((response) => {
                    if (response?.code == Codes.SUCCESS) {
                        TOAST_SUCCESS(response?.message)
                        dispatch(getListTicketThunk({}));
                        navigation(PATHS?.LIST_TICKET)
                    } else {
                        TOAST_ERROR(response.message)
                    }
                })
            } else {
                addTicket(request).then((response) => {
                    if (response?.code == Codes.SUCCESS) {
                        TOAST_SUCCESS(response?.message)
                        navigation(PATHS?.LIST_TICKET)
                        dispatch(getListTicketThunk({}));
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
                <SubNavbar title={TicketData ? 'Edit Ticket' : 'Add Ticket'} header={'Ticket List'} subHeaderOnlyView={TicketData ? 'Edit Ticket' : 'Add Ticket'} />
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

                                                                    // get selected objects
                                                                    const selectedObjects = projectList?.filter((p) => (p.id == selectedIds));
                                                                    setSelectedProject(selectedObjects?.length > 0 ? selectedObjects[0]?.team?.split(",").map((id) => id.trim()) : []);
                                                                }}
                                                                options={projectList?.map((c) => ({
                                                                    label: c.name,
                                                                    value: c.id,
                                                                })) || []}
                                                                disabled={TicketData ? true : false}
                                                                optionRender={(option) => (
                                                                    <Space>{option?.label}</Space>
                                                                )}
                                                                className='border rounded-1'
                                                            />
                                                        )}
                                                    />
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.PROJECT]?.message}
                                                    </label>
                                                </div>

                                                <div className="mb-4">
                                                    <label htmlFor="lastname" className="form-label fw-semibold">
                                                        Ticket Name <span className="text-danger ms-1">*</span>
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
                                                                disabled={TicketData ? true : false}
                                                                // options={assignTaskList?.map((c) => ({
                                                                //     label: c.title,
                                                                //     value: c.id,
                                                                // })) || []}

                                                                options={watch(AstroInputTypesEnum.PROJECT) && assignTaskList?.filter((c) => watch(AstroInputTypesEnum.PROJECT) ? watch(AstroInputTypesEnum.PROJECT) == c.project_id : [""]).map((c) => ({
                                                                    label: c.title,
                                                                    value: String(c.id),
                                                                })) || []}

                                                                optionRender={(option) => (
                                                                    <Space>{option?.label}</Space>
                                                                )}

                                                                className='border rounded-1'
                                                                optionFilterProp="label"

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
                                                                mode="multiple"
                                                                style={{ width: "100%", height: "40px" }}
                                                                placeholder="Select employee"
                                                                value={field.value || []} // ensure controlled array
                                                                onChange={(selectedIds) => {
                                                                    field.onChange(selectedIds); // updates form value
                                                                    setValue(AstroInputTypesEnum.EMPLOYEE, selectedIds); // optional extra update
                                                                }}
                                                                options={
                                                                    customerList?.filter((c) => selectedProject?.length > 0 && selectedProject?.includes(String(c.id))) // match employee ids
                                                                        .map((c) => ({
                                                                            label: c.name,
                                                                            value: String(c.id),
                                                                        })) || []
                                                                }
                                                                optionRender={(option) => (
                                                                    <Space>{option?.label}</Space>
                                                                )}
                                                                className='border rounded-1'
                                                                optionFilterProp="label"
                                                            />
                                                        )}
                                                    />

                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.EMPLOYEE]?.message}
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="modal-footer justify-content-center mb-3">
                                                <button type='reset' className="btn btn-danger me-2" >Reset</button>

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
