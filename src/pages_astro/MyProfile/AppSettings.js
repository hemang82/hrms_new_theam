import React, { useState } from 'react'
import Header from '../../layout/Header'
import Slidebar from '../../layout/Slidebar'
import { Language, PASSWORD_VALIDATION, SWIT_DELETE, SWIT_DELETE_SUCCESS, TOAST_ERROR, TOAST_SUCCESS, allowLettersAndSpaces } from '../../config/common'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import SubNavbar from '../../layout/SubNavbar'
import profile_image from '../../assets/Images/default.jpg'
import Footer from '../../layout/Footer'
import * as API from '../../utils/api.services'
import { handelInputText, textInputValidation, textValidation } from '../../config/commonFunction'
import { AstroInputTypesEnum, InputTypesEnum } from '../../config/commonVariable'
import { Codes } from '../../config/constant'
import { useDispatch } from 'react-redux'
import { setLoader } from '../../Store/slices/MasterSlice'


const AppSettings = () => {

    let navigation = useNavigate()
    const dispatch = useDispatch()
    const { register, handleSubmit, reset, formState, formState: { errors }, watch } = useForm();
    const [oldPassVisible, setOldPassVisible] = useState(false);
    const [newPassVisible, setNewPassVisible] = useState(false);
    const [confPassVisible, setConfPassVisible] = useState(false);


    const onSubmitData = async (data) => {
        // SWIT_DELETE(`You won't be able to update!`, `Yes, update it!`).then(async (result) => {
        //     if (result.isConfirmed) {
        dispatch(setLoader(true))
        let request = {
            oldpassword: data?.old_password,
            newpassword: data?.new_password
        }
        API.ChangePassword(request).then((response) => {
            if (response?.code === Codes.SUCCESS) {
                TOAST_SUCCESS(response?.message);
                navigation('/')
                reset()
            } else {
                TOAST_ERROR(response?.message)
            }

            //     })
            // }
        });
        dispatch(setLoader(false))
    };


    return (
        <div className="card overflow-hidden chat-application">
            {/* <div className="d-flex align-items-center justify-content-between gap-3 m-3 d-lg-none">
                <button className="btn btn-primary d-flex" type="button" data-bs-toggle="offcanvas" data-bs-target="#chat-sidebar" aria-controls="chat-sidebar">
                    <i className="ti ti-menu-2 fs-5" />
                </button>
                <form className="position-relative w-100">
                    <input type="text" className="form-control search-chat py-2 ps-5" id="text-srh" placeholder="Search Contact" />
                    <i className="ti ti-search position-absolute top-50 start-0 translate-middle-y fs-6 text-dark me-3" />
                </form>
            </div> */}

            <div className="row m-2">
                <div className="col-12 justify-content-center">
                    <div className='row justify-content-center '>
                        <form onSubmit={handleSubmit(onSubmitData)}>
                            <div className="" >
                                <div className="card-body">
                                    <div className='row g-3'>
                                        <div className='col-md-6'>
                                            {/* <div className="mb-4">
                                                <label htmlFor="lastname" className="form-label fw-semibold">
                                                    Type <span className="text-danger ms-1"></span>
                                                </label>
                                                <div className="input-group border rounded-1">
                                                    <input
                                                        type="text"
                                                        className="form-control ps-2"
                                                        placeholder="Enter type"
                                                        // onKeyPress={allowLettersAndSpaces}
                                                        autoComplete='nope'
                                                        // {...register('category_en', { required: "Enter category" })}
                                                        {...register(AstroInputTypesEnum.TYPE, textInputValidation(AstroInputTypesEnum.TYPE, Language('Enter type')))}
                                                    />
                                                </div>
                                                <label className="errorc ps-1 pt-1">
                                                    {errors[AstroInputTypesEnum?.TYPE]?.message}
                                                </label>
                                            </div> */}

                                            <div className="mb-4">
                                                <label htmlFor="lastname" className="form-label fw-semibold">
                                                    Gender <span className="text-danger ms-1">*</span>
                                                </label>
                                                <div className="input-group border rounded-1">
                                                    <select
                                                        className="form-control ps-2"
                                                        autoComplete="nope"
                                                        {...register(AstroInputTypesEnum.TYPE, {
                                                            required: "Enter type",
                                                        })}
                                                    >
                                                        <option value="">Select type</option>
                                                        <option value="is_freechat">Free Chat</option>
                                                        <option value="is_festival_chat">Festival Chat</option>
                                                    </select>
                                                </div>
                                                <label className="errorc ps-1 pt-1">
                                                    {errors[AstroInputTypesEnum.TYPE]?.message}
                                                </label>
                                            </div>


                                            <div className="mb-4">
                                                <label htmlFor="lastname" className="form-label fw-semibol  d">
                                                  Chat Value<span className="text-danger ms-1"></span>
                                                </label>
                                                <div className="input-group border rounded-1">
                                                    <input
                                                        type="text"
                                                        className="form-control ps-2"
                                                        placeholder="Enter value"
                                                        // onKeyPress={allowLettersAndSpaces}
                                                        autoComplete='nope'
                                                        // {...register('category_en', { required: "Enter category" })}
                                                        {...register(AstroInputTypesEnum?.VALUE, textInputValidation(AstroInputTypesEnum?.VALUE, Language('Enter value')))}
                                                    />
                                                </div>
                                                <label className="errorc ps-1 pt-1">
                                                    {errors[AstroInputTypesEnum?.VALUE]?.message}
                                                </label>
                                            </div>

                                            <div className="mb-4">
                                                <label htmlFor="product_name" className="form-label fw-semibold">
                                                   Chat Duration <span className="text-danger ms-1"></span>
                                                </label>
                                                <div className="input-group border rounded-1">
                                                    <input
                                                        type="text"
                                                        className="form-control ps-2"
                                                        placeholder="Enter duretion"
                                                        autoComplete='nope'
                                                        // {...register('category_ara', { required: "Enter category arabic" })}
                                                        {...register(AstroInputTypesEnum.DURETION, textInputValidation(AstroInputTypesEnum.DURETION, Language('Enter duretion')))}
                                                    />
                                                </div>
                                                <label className="errorc ps-1 pt-1">
                                                    {errors[AstroInputTypesEnum.DURETION]?.message}
                                                </label>
                                            </div>

                                            <div className="mb-4">
                                                <label htmlFor="product_name" className="form-label fw-semibold">
                                                    Expiry Count <span className="text-danger ms-1"></span>
                                                </label>
                                                <div className="input-group border rounded-1">
                                                    <input
                                                        type="text"
                                                        className="form-control ps-2"
                                                        placeholder="Enter expiry count"
                                                        autoComplete='nope'
                                                        // {...register('category_ara', { required: "Enter category arabic" })}
                                                        {...register(AstroInputTypesEnum.EXPIRY_COUNT, textInputValidation(AstroInputTypesEnum.EXPIRY_COUNT, Language('Enter expiry count')))}
                                                    />
                                                </div>
                                                <label className="errorc ps-1 pt-1">
                                                    {errors[AstroInputTypesEnum.EXPIRY_COUNT]?.message}
                                                </label>
                                            </div>

                                        </div>

                                        <div className='col-md-6'>



                                            {/* <div className="mb-4">
                                                    <label htmlFor="product_name" className="form-label fw-semibold">
                                                        Category Image <span className="text-danger ms-1">*</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <input
                                                            type="file"
                                                            className="form-control ps-2"
                                                            placeholder="Enter category image"
                                                            autoComplete='nope'
                                                            // {...register('category_ara', { required: "Enter category arabic" })}
                                                            {...register(AstroInputTypesEnum.CATEGORY_IMAGE, textInputValidation(AstroInputTypesEnum.CATEGORY_IMAGE, Language('Enter category image')))}
                                                        />
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.CATEGORY_IMAGE]?.message}
                                                    </label>
                                                </div> */}

                                        </div>
                                        <div className="modal-footer justify-content-center mb-3">
                                            <button type='button' className="btn btn-danger m-2">Cancel</button>
                                            <button type='submit' className="btn btn-primary" >Submit</button>
                                        </div>

                                    </div>

                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AppSettings
