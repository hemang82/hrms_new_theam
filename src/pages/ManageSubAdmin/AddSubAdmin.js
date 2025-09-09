import React, { useEffect, useState } from 'react'
import Header from '../../layout/Header'
import Slidebar from '../../layout/Slidebar'
import SubNavbar from '../../layout/SubNavbar'
import { useLocation, useNavigate } from 'react-router-dom'
import { useFieldArray, useForm } from 'react-hook-form'
import { TOAST_SUCCESS, TOAST_ERROR, allowLettersAndSpaces } from '../../config/common'
import Footer from '../../layout/Footer'
import { addSubAdmin, editSubAdmin, getSubAdminDetials, subAdminRole, userDetails } from '../../utils/api.services'
import { setLoader } from '../../Store/slices/MasterSlice'
import { useDispatch } from 'react-redux'
import CountryMobileNumber from '../CommonPages/CountryMobileNumber'
import { handelInputText, textValidation } from '../../config/commonFunction'
import { InputTypesEnum } from '../../config/commonVariable'
import { Codes } from '../../config/constant'

const AddSubAdmin = () => {

    const navigation = useNavigate();
    const dispatch = useDispatch();

    const { register, handleSubmit, setValue, clearErrors, reset, watch, control, formState: { errors } } = useForm();

    const location = useLocation();
    const [ischange, setischange] = useState(false);
    const [userData, setUserData] = useState([]);

    // console.log('userData__ :', userData__);

    // const userData = [{ id: 1, name: 'Dashbord' }, { id: 2, name: 'Customer' }, { id: 3, name: 'Product' }, { id: 4, name: 'Category' }, { id: 5, name: 'Sub Category' }]

    const { fields, append, remove } = useFieldArray({
        name: 'menu',
        control
    })

    useEffect(() => {

        subAdminRole().then((response) => {
            if (response?.code === Codes?.SUCCESS) {
                setUserData(response?.data)
            }
        })

        if (locationData) {
            getPermitions();
            setValue('firstName', userData1?.firstname)
            setValue('lastName', userData1?.lastname)
            setValue('email', userData1?.email)
            setValue('country_code', userData1?.country_code)
            setValue('mobile_number', userData1?.mobile_number)
            setValue('status', userData1?.is_active);
        }
    }, []);

    const [result, setResult] = useState();

    useEffect(() => {
        let section_id = userData.map(item => { return item?._id });
        console.log('section_id :', section_id);
        setResult({
            role_id: section_id?.length > 0 && section_id,
            allArray: [],
            viewArray: [],
            addArray: [],
            updateArray: [],
            deleteArray: [],
        })
    }, [userData])

    const locationData = location?.state
    const [userData1, setUserData1] = useState(location?.state);
    const [userPermition, setUserPermition] = useState(null);

    useEffect(() => {
        if (userData && userPermition) {

            userPermition.forEach(item => {
                // if (item?.role_id === 1) {
                result.addArray.push({ role_id: item.role_id, is_add: item.is_add });
                result.deleteArray.push({ role_id: item.role_id, is_delete: item.is_delete });
                result.updateArray.push({ role_id: item.role_id, is_update: item.is_edit });
                result.viewArray.push({ role_id: item.role_id, is_view: item.is_view });

                // setResult(prevResult => ({
                //     ...prevResult,
                //     addArray: [...prevResult.addArray, { role_id: item.role_id, is_add: item.is_add }],
                // }));
                // }

                setResult(result)
            });
        }
    }, [userPermition])

    useEffect(() => {
        if (userData) {
            userPermition?.map(value => {
                append({
                    is_all: value.is_all, is_add: value.is_add, is_view: value.is_view, is_edit: value.is_edit, is_delete: value.is_delete, role_id: value.role_id, role_id: value.role_id, role_name: value.role_name
                });
            })
        }
    }, [userPermition])

    const getPermitions = async () => {
        dispatch(setLoader(true));
        const { code, data } = await userDetails({ user_id: userData1?._id });
        if (code === Codes.SUCCESS) {
            setUserPermition(data?.permission)
            setUserData1(data)
        }
        dispatch(setLoader(false));
    }

    const onSubmitData = async (data) => {
        try {
            dispatch(setLoader(true));
            let submitData = {
                firstname: data?.firstName,
                lastname: data?.lastName,
                email: data?.email,
                country: 'India',
                country_id: '101',
                country_code: data?.country_code,
                mobile_number: data?.mobile_number,
                // is_active: data?.status,
                rights: result
            }

            if (userData1) {
                submitData.user_id = userData1?._id
                editSubAdmin(submitData).then((response) => {
                    if (response?.code === Codes?.SUCCESS) {
                        dispatch(setLoader(false));
                        navigation(`/manage_sub_admin`)
                        TOAST_SUCCESS(response?.message)
                    } else {

                        TOAST_ERROR(response.message);
                    }
                });
            } else {

                const { code, message, data } = await addSubAdmin(submitData);
                if (code === Codes.SUCCESS) {
                    TOAST_SUCCESS(message);
                    dispatch(setLoader(false));
                    navigation(`/manage_sub_admin`)
                    reset();
                } else {
                    TOAST_ERROR(message)
                }
            }
            dispatch(setLoader(false));
        } catch (err) {
            TOAST_ERROR(err.message)
        }
    }

    const handleCheckboxChange = (event, role_id, role_type) => {
        if (role_type === "all") {

            const existingIndex = result.allArray.findIndex(item => item.role_id === role_id);

            if (existingIndex !== -1) {
                result.allArray[existingIndex] = {
                    ...result.allArray[existingIndex],
                    is_all: event.target.checked === true ? "1" : "0"
                };
            } else {
                result.allArray.push({
                    role_id: role_id,
                    is_all: event.target.checked === true ? "1" : "0"
                });
            }
        }
        if (role_type === "view") {

            const existingIndex = result.viewArray.findIndex(item => item.role_id === role_id);

            if (existingIndex !== -1) {
                result.viewArray[existingIndex] = {
                    ...result.viewArray[existingIndex],
                    is_view: event.target.checked === true ? "1" : "0"
                };
            } else {
                result.viewArray.push({
                    role_id: role_id,
                    is_view: event.target.checked === true ? "1" : "0"
                });
            }
        }
        if (role_type === "add") {
            const existingIndex = result.addArray.findIndex(item => item.role_id === role_id);

            if (existingIndex !== -1) {

                result.addArray[existingIndex] = {
                    ...result.addArray[existingIndex],
                    is_add: event.target.checked === true ? "1" : "0"
                };
            } else {

                result.addArray.push({
                    role_id: role_id,
                    is_add: event.target.checked === true ? "1" : "0"
                });
            }
        }
        if (role_type === "Update") {
            const existingIndex = result.updateArray.findIndex(item => item.role_id === role_id);

            if (existingIndex !== -1) {
                result.updateArray[existingIndex] = {
                    ...result.updateArray[existingIndex],
                    is_update: event.target.checked === true ? "1" : "0"
                };
            } else {
                result.updateArray.push({
                    role_id: role_id,
                    is_update: event.target.checked === true ? "1" : "0"
                });
            }
        }
        if (role_type === "Delete") {
            const existingIndex = result.deleteArray.findIndex(item => item.role_id === role_id);

            if (existingIndex !== -1) {
                result.deleteArray[existingIndex] = {
                    ...result.deleteArray[existingIndex],
                    is_delete: event.target.checked === true ? "1" : "0"
                };
            } else {
                result.deleteArray.push({
                    role_id: role_id,
                    is_delete: event.target.checked === true ? "1" : "0"
                });
            }
        }
        setResult(result)

    };

    var onChangeMobileNumber = (mobileNumber) => {
        setValue('mobile_number', mobileNumber)
        clearErrors('mobile_number', '')
    }

    var onChangeCountryCode = (countryCode) => {
        setValue('country_code', countryCode?.country_code)
        clearErrors('country_code', '')
    }

    // console.log('userData userData', userData);
    // console.log('userData userData1', userData1);
    console.log('EditUserData userPermition', fields);

    return (
        <>
            <Slidebar />
            <div className="body-wrapper">
                <Header />
                <div className="container-fluid mw-100">
                    <SubNavbar title={"Sub Admin List"} header={'Sub Admin List'} />
                    <div className="widget-content searchable-container list">

                        <div className="row m-2">
                            <div className="col-12 justify-content-center">
                                <div className='row justify-content-center m-2'>

                                    <form onSubmit={handleSubmit(onSubmitData)}>
                                        <div className="card" >
                                            <div className="card-body">
                                                <div className='row g-3 p-3'>

                                                    <div className='col-md-6'>
                                                        <div className="mb-4">
                                                            <label htmlFor="exampleInputPassword1" className="form-label fw-semibold">First name<spna className="text-danger"> *</spna></label>
                                                            <div className="input-group border rounded-1">
                                                                <input type="text" className="form-control  ps-2 form-control " placeholder="Enter first name" onKeyPress={handelInputText} {...register(InputTypesEnum.FIRSTNAME, textValidation(InputTypesEnum.FIRSTNAME))} />
                                                            </div>
                                                            <label className="errorc ps-1 pt-1" >{errors.firstName?.message}</label>
                                                        </div>

                                                        <div className="mb-4">
                                                            <label htmlFor="exampleInputPassword1" className="form-label fw-semibold">Email<spna className="text-danger"> *</spna></label>
                                                            <div className="input-group border rounded-1">
                                                                <input type="text" className="form-control  ps-2" placeholder="Enter your email address" onChange={handelInputText} {...register(InputTypesEnum.EMAIL, textValidation(InputTypesEnum.EMAIL))} />
                                                            </div>
                                                            <label className="errorc ps-1 pt-1" >{errors.email?.message}</label>
                                                        </div>
                                                    </div>

                                                    <div className='col-md-6'>

                                                        <div className="mb-4">
                                                            <label htmlFor="exampleInputPassword1" className="form-label fw-semibold">Last name<spna className="text-danger"> *</spna></label>
                                                            <div className="input-group border rounded-1">
                                                                <input type="text" className="form-control  ps-2" placeholder="Enter last name" onKeyPress={handelInputText} autoComplete='nope' {...register(InputTypesEnum.LASTNAME, textValidation(InputTypesEnum.LASTNAME))} />
                                                            </div>
                                                            <label className="errorc ps-1 pt-1" >{errors.lastName?.message}</label>
                                                        </div>

                                                        <div className="mb-4">
                                                            <label htmlFor="exampleInputPassword1" className="form-label fw-semibold">Phone no<spna className="text-danger"> *</spna></label>
                                                            <CountryMobileNumber onChangeMobileNumber={onChangeMobileNumber} onChangeCountryCode={onChangeCountryCode} setDefaultData={userData1} imageIcon={false} />
                                                            <input type='hidden' {...register('mobile_number', { required: "Enter mobile number" })} />
                                                            <input type='hidden' {...register('country_code')} />
                                                            <label className="errorc ps-1 pt-1" >{errors.mobile_number?.message}</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col">
                                                <div className="card">
                                                    <div className="card-body">
                                                        <div className="row justify-content-center">

                                                            <div class="px-4 py-3 border-bottom mb-4">
                                                                <h5 class="card-title fw-semibold mb-0">
                                                                    Sub Admin Rights
                                                                </h5>
                                                            </div>
                                                            {/* <h4 className="text-start text-capitalize fw-bolder mb-2">Sub Admin Rights :- </h4> */}


                                                            <div className="p-2">
                                                                {/* -----------------------------EDIT ----------------------------- */}

                                                                {userData1 && fields.map((value, index) => (
                                                                    <div className="container mb-3" key={index}>
                                                                        {console.log('EditUserData value', value)}
                                                                        <div className="row">

                                                                            <div className="col-2 d-flex align-items-center">
                                                                                {index + 1 > 0 && (
                                                                                    <>
                                                                                        {/* <label className="p-2">{index + 1}</label> */}
                                                                                        <h5 className="w-100 text-capitalize text-start mt-1">
                                                                                            {/* {value.role_id ? `${value.role_name}: ` : ""} */}
                                                                                            {userData.find(item => { return item._id === value.role_id })?.name || ""}
                                                                                            {/* {console.log('userData log', userData.find(item => { return item._id === value.role_id })?.name) || ""} */}

                                                                                        </h5>
                                                                                    </>
                                                                                )}
                                                                            </div>
                                                                            {/* Right column with checkboxes */}
                                                                            <div className="col-9">
                                                                                <div className="row">
                                                                                    {/* <div className="col-lg-10 col-md-12 col-12 d-flex align-items-center"> */}
                                                                                    <div className="col-6 col-md-4 col-lg-2 p-2">
                                                                                        <div className="form-check form-check-danger">
                                                                                            <input
                                                                                                className="form-check-input permition-btn rounded-circle"
                                                                                                type="checkbox"
                                                                                                id={`${index}_is_all`}
                                                                                                value={index}
                                                                                                {...register(`menu[${index}].is_all`)}
                                                                                                onChange={(event) => handleCheckboxChange(event, value.role_id, 'all')}
                                                                                            />
                                                                                            <label className="form-check-label ms-1" htmlFor={`${index}_is_all`}>All</label>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div className="col-6 col-md-4 col-lg-2 p-2">
                                                                                        <div className="form-check form-check-danger">
                                                                                            <input
                                                                                                className="form-check-input permition-btn rounded-circle"
                                                                                                type="checkbox"
                                                                                                value={index}
                                                                                                {...register(`menu[${index}].is_add`)}
                                                                                                onChange={(event) => handleCheckboxChange(event, value.role_id, 'add')}
                                                                                            />
                                                                                            <label className="form-check-label ms-1">Add</label>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-6 col-md-4 col-lg-2 p-2">
                                                                                        <div className="form-check form-check-danger">
                                                                                            <input
                                                                                                className="form-check-input permition-btn rounded-circle"
                                                                                                type="checkbox"
                                                                                                value="Update"
                                                                                                {...register(`menu[${index}].is_edit`)}
                                                                                                onChange={(event) => handleCheckboxChange(event, value.role_id, 'Update')}
                                                                                            />
                                                                                            <label className="form-check-label ms-1">Update</label>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-6 col-md-4 col-lg-2 p-2">
                                                                                        <div className="form-check form-check-danger">
                                                                                            <input
                                                                                                className="form-check-input permition-btn rounded-circle"
                                                                                                type="checkbox"
                                                                                                value="Delete"
                                                                                                {...register(`menu[${index}].is_delete`)}
                                                                                                onChange={(event) => handleCheckboxChange(event, value.role_id, 'Delete')}
                                                                                            />
                                                                                            <label className="form-check-label ms-1">Delete</label>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div className="col-6 col-md-4 col-lg-2 p-2">
                                                                                        <div className="form-check form-check-danger">
                                                                                            <input
                                                                                                className="form-check-input permition-btn rounded-circle"
                                                                                                type="checkbox"
                                                                                                value="View"
                                                                                                {...register(`menu[${index}].is_view`)}
                                                                                                onChange={(event) => handleCheckboxChange(event, value.role_id, 'view')}
                                                                                            />
                                                                                            <label className="form-check-label ms-1">View</label>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                {/* </div> */}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}

                                                                {/* --------------------------ADD permition --------------------------------------- */}

                                                                {!userData1 && userData && userData.map((value, index) => (
                                                                    <div className="container mb-3" key={index}>
                                                                        <div className="row">
                                                                            <div className="col-12">
                                                                                <div className="row">
                                                                                    <div className="col-2 d-flex align-items-center ">
                                                                                        {index + 1 > 0 && (
                                                                                            <>
                                                                                                {/* <label className="pe-1 fs-5">{index + 1}</label> */}
                                                                                                <h5 className="w-100 text-capitaliz text-start mt-1">
                                                                                                    {/* {value.id ? `${value.name}:` : ""} */}
                                                                                                    {value.name || ""}

                                                                                                </h5>
                                                                                            </>
                                                                                        )}
                                                                                    </div>
                                                                                    <div className="col-9">
                                                                                        <div className="row justify-center-start">
                                                                                            <div className="col-6 col-md-4 col-lg-2 p-2">
                                                                                                <div className="form-check form-check-danger">
                                                                                                    <input
                                                                                                        className="form-check-input permition-btn rounded-circle"
                                                                                                        type="checkbox"
                                                                                                        value={index}
                                                                                                        {...register(`menu[${index}].is_all`)}
                                                                                                        onChange={(event) => handleCheckboxChange(event, value._id, 'all')}
                                                                                                    />
                                                                                                    <label className="form-check-label ms-1">All</label>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-6 col-md-4 col-lg-2 p-2">
                                                                                                <div className="form-check form-check-danger">
                                                                                                    <input
                                                                                                        className="form-check-input permition-btn rounded-circle"
                                                                                                        type="checkbox"
                                                                                                        value={index}
                                                                                                        {...register(`menu[${index}].is_add`)}
                                                                                                        onChange={(event) => handleCheckboxChange(event, value._id, 'add')}
                                                                                                    />
                                                                                                    <label className="form-check-label ms-1">Add</label>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-6 col-md-4 col-lg-2 p-2">
                                                                                                <div className="form-check form-check-danger">
                                                                                                    <input
                                                                                                        className="form-check-input permition-btn rounded-circle"
                                                                                                        type="checkbox"
                                                                                                        value="Update"
                                                                                                        {...register(`menu[${index}].is_edit`)}
                                                                                                        onChange={(event) => handleCheckboxChange(event, value._id, 'Update')}
                                                                                                    />
                                                                                                    <label className="form-check-label ms-1">Update</label>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-6 col-md-4 col-lg-2 p-2">
                                                                                                <div className="form-check form-check-danger">
                                                                                                    <input
                                                                                                        className="form-check-input permition-btn rounded-circle"
                                                                                                        type="checkbox"
                                                                                                        value="Delete"
                                                                                                        {...register(`menu[${index}].is_delete`)}
                                                                                                        onChange={(event) => handleCheckboxChange(event, value._id, 'Delete')}
                                                                                                    />
                                                                                                    <label className="form-check-label ms-1">Delete</label>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-6 col-md-4 col-lg-2 p-2">
                                                                                                <div className="form-check form-check-danger">
                                                                                                    <input
                                                                                                        className="form-check-input permition-btn rounded-circle"
                                                                                                        type="checkbox"
                                                                                                        value="View"
                                                                                                        {...register(`menu[${index}].is_view`)}
                                                                                                        onChange={(event) => handleCheckboxChange(event, value._id, 'view')}
                                                                                                    />
                                                                                                    <label className="form-check-label ms-1">View</label>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>


                                                            <div className="modal-footer justify-content-center mt-3">
                                                                <button type='button' className="btn btn-danger m-3" onClick={() => { setischange(true) }}>Cancel</button>
                                                                <button type='submit' className="btn btn-primary" >Submit</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddSubAdmin
