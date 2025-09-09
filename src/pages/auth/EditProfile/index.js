import React, { useEffect, useState } from 'react'
import Header from '../../../layout/Header'
import { useLocation, useNavigate } from 'react-router-dom';
import Slidebar from '../../../layout/Slidebar';
import Select from 'react-select';
import { useDispatch } from 'react-redux';
import COUNTRY_LIST_OPTION, { EMAIL_VALIDATION, FIRST_NAME_VALIDATION, LAST_NAME_VALIDATION, MOBILE_VALIDATION, TOAST_SUCCESS, TOAST_ERROR, capitalizeWords, Language } from '../../../config/common';
import { Controller, useForm } from 'react-hook-form';
import * as API from '../../../utils/api.services';
import { uploadImageOnAWS } from '../../../utils/aws.service';

const EditProfile = () => {

    let navigate = useNavigate();
    let dispatch = useDispatch();
    let location = useLocation();
    // let userData = location?.state;

    const {
        register,
        handleSubmit,
        setValue,
        clearErrors,
        reset,
        control,
        watch,
        formState: { errors },
    } = useForm();

    var [userData, setUserData] = useState()
    const [file, setFile] = useState();

    // useEffect(() => {
    //     API.getEditUserDetials().then((response) => {
    //         if (response.code === '1') {
    //             setUserData(response?.data)
    //             console.log('response.data', response?.data);
    //         } else {
    //             setUserData(null)
    //         }
    //     })
    // }, [])

    useEffect(() => {
        reset({
            first_name: userData?.firstname,
            last_name: userData?.lastname,
            email: userData?.email,
            country_code: userData?.country_code,
            mobile_number: userData?.mobile_number,
            status: userData?.is_active,
            profile_image: userData?.profile_image
        })

    }, [userData]);

    const handleInputChange = (e) => {
        const inputValue = e.target.value.replace(/[^0-9]/g, '');
        e.target.value = inputValue;
    };

    const onSubmit = async (submitedData) => {
        let image = submitedData?.profile_image;
        if (image instanceof Blob) image = await uploadImageOnAWS(image, "profile_image");
        let submitData = {
            firstname: submitedData?.first_name,
            lastname: submitedData?.last_name,
            email: submitedData?.email,
            country_code: submitedData?.country_code,
            mobile_number: submitedData?.mobile_number,
            profile_image: image
        }


        if (submitedData?.country_code != userData?.country_code || submitedData?.mobile_number != userData?.mobile_number) {
            // navigate('/varification', { state: { otp: '123' } })
            navigate('/edit_varification', { state: { otp: '1234', userDetials: submitData } })
        } else {
            // API.editProfile(submitData).then((response) => {
            //     if (response.code === '1') {
            //         localStorage.setItem('EPMauth', JSON.stringify(response.data.userDetials));
            //         TOAST_SUCCESS(response.message);
            //         navigate(`/dashboard`);
            //     } else {
            //         navigate(`/edit_profile`)
            //     }
            // })
        }
    }

    const handleImageChange = async (image) => {
        setValue("profile_image", image);
        clearErrors("profile_image");
    }

    return (
        <div className="body_wrapper">
            <Header page_name={'Edit Profile'} />
            <Slidebar />
            <div className="content-main-box">
                <div className="content-wrap">
                    {/*start*/}
                    <div className="page-body page_brand border shadow rounded-5 ">
                        <div className='cursor_pointer d-flex justify-content-center m-2 p-2' style={{ 'width': '20px' }} onClick={() => { navigate(-1) }}><i className="bi bi-arrow-left"></i></div>
                        <div className="row border border-2 rounded-4 p-3 m-2">
                            <div className="col-xl-12 col-lg-12 col-md-12 col-12">
                                <form className='p-4' onSubmit={handleSubmit(onSubmit)}>
                                    <div className='row'>
                                        <div className='col-md-6 mb-3'>
                                            <label className='form-label ps-2 '>{Language('first_name')}</label>
                                            <input type='text' className='form-control' placeholder='Enter first name' {...register("first_name", FIRST_NAME_VALIDATION())} aria-invalid={errors.first_name ? "true" : "false"} />
                                            <label className="errorc">{errors.first_name?.message}</label>
                                        </div>

                                        <div className='col-md-6 mb-3'>
                                            <label className='form-label ps-2'>{Language('last_name')}</label>
                                            <input type='text' className='form-control' placeholder='Enter last name' {...register("last_name", LAST_NAME_VALIDATION())} aria-invalid={errors.last_name ? "true" : "false"} />
                                            <label className="errorc">{errors.last_name?.message}</label>
                                        </div>

                                        <div className='col-md-6 mb-3'>
                                            <label className='form-label ps-2'>{Language('email_address')}</label>
                                            <input type='email' className='form-control' placeholder='Enter email address' {...register("email", EMAIL_VALIDATION())} aria-invalid={errors.email ? "true" : "false"} />
                                            <label className="errorc">{errors.email?.message}</label>
                                        </div>

                                        <div className='col-md-6 mb-1'>
                                            <label className='form-label ps-2'>{Language('mobile_no')}</label>
                                            <div className="input-group m-2">
                                                <div className="input-group-prepend">
                                                    <select className="form-control" style={{ "width": "90px", "textAlign": "center" }} id="country_code" name="country_code" data-attribute-name="Country Code" aria-expanded="false" {...register('country_code')} >
                                                        {/* {COUNTRY_LIST_OPTION(setValue, 'country_code', userData)} */}
                                                    </select>
                                                </div>
                                                <input
                                                    className="form-control form-controll ms-1 rounded-3"
                                                    type="number"
                                                    id="mobile_number"
                                                    placeholder="Enter mobile number"
                                                    {...register("mobile_number", MOBILE_VALIDATION())}
                                                    onInput={handleInputChange}
                                                    aria-invalid={errors.mobile_number ? "true" : "false"}
                                                    data-attribute-name="Mobile Number"
                                                />
                                            </div>
                                            <label className="errorc">{errors.mobile_number?.message}</label>
                                        </div>

                                        <div className="col-md-6 mb-3 ">
                                            <div className="mb_25 rounded-3 m-2 ">
                                                <label className='form-label ps-2'>{Language('profile_image')}</label>
                                                <Controller name="profile_image"
                                                    control={control} defaultValue={null}
                                                    rules={{ required: 'File is required' }}

                                                    render={({ field }) => (<>
                                                        <input type="file" name='profile_image' className="custom-file-input custom-file-inputt form-control rounded-3 mx-auto m-2" id="profile_image" accept="image/*" onChange={(e) => { handleImageChange(e.target.files[0]); setFile(e.target.files[0]); }} />
                                                        <p className='text-danger pt-1 '> <span>{errors.profile_image && errors.profile_image.message}</span></p>
                                                    </>
                                                    )} />
                                            </div>
                                        </div>

                                    </div>
                                    <div className="text-center d-flex justify-content-center mt-3">
                                        <button className=" w-25 rounded-3 submit_btn btn_color">{Language('submit')}</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </div>
    )
}

export default EditProfile
