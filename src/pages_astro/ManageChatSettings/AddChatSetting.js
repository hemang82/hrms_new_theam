import React, { useState, useEffect, useRef } from 'react'
import Swal from 'sweetalert2'
import { useLocation, useNavigate } from 'react-router-dom'
import { Controller, useForm } from 'react-hook-form';
import Header from '../../layout/Header';
import Slidebar from '../../layout/Slidebar';
import Footer from '../../layout/Footer';
import { Language, TOAST_ERROR, TOAST_SUCCESS, allowLettersAndSpaces } from '../../config/common';
import SubNavbar from '../../layout/SubNavbar';
import categoryImage from '../../assets/Images/Group 48096953.png'
import { uploadImageOnAWS } from '../../utils/aws.service';
import { AwsFolder, Codes } from '../../config/constant';
import { SketchPicker } from 'react-color';
import { getFileNameFromUrl, selectOption, textInputValidation, textValidation } from '../../config/commonFunction';
import { AstroInputTypesEnum, InputTypesEnum } from '../../config/commonVariable';
import { useDispatch } from 'react-redux';
import { setLoader } from '../../Store/slices/MasterSlice';
import { LazyLoadImage } from "react-lazy-load-image-component";

export default function AddChatSetting() {

    const navigation = useNavigate();
    const dispatch = useDispatch();

    const location = useLocation();
    const [shoWcategoryImage, setShowCategoryImage] = useState(null);

    var chatSettingData = location?.state;

    const {
        register,
        handleSubmit,
        setValue,
        clearErrors,
        reset,
        watch,
        control,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        if (chatSettingData) {
            setValue(AstroInputTypesEnum?.TYPE, chatSettingData.type);
            setValue(AstroInputTypesEnum?.VALUE, chatSettingData.value);
            setValue(AstroInputTypesEnum?.DURETION, chatSettingData.duration);
            setValue(AstroInputTypesEnum?.EXPIRY_COUNT, chatSettingData.expiry_count);
        }
    }, [chatSettingData]);

    const onSubmitData = async (data) => {
        try {

            dispatch(setLoader(true));
            let request = {
                type: data[AstroInputTypesEnum?.TYPE],
                value: data[AstroInputTypesEnum?.VALUE],
                duration: data[AstroInputTypesEnum?.DURETION],
                expiry_count: data[AstroInputTypesEnum?.EXPIRY_COUNT],
            }

            if (chatSettingData) {
                request.setting_id = chatSettingData._id;
                // editSetting(request).then((response) => {
                //     if (response?.code === Codes?.SUCCESS) {
                //         navigation('/chat_setting_list')
                //         TOAST_SUCCESS(response?.message)
                //     } else {
                //         TOAST_ERROR(response.message)
                //     }
                // })
            } else {
                // addSetting(request).then((response) => {
                //     if (response?.code === Codes?.SUCCESS) {
                //         navigation('/chat_setting_list')
                //         TOAST_SUCCESS(response?.message)
                //     } else {
                //         TOAST_ERROR(response.message)
                //     }
                // })
            }
            dispatch(setLoader(false))
        } catch (error) {
            TOAST_ERROR('Somthing went wrong')
        }
    }

    const handleImageChange = async (e) => {
        const image = e.target.files[0]
        setValue("category_image", image);
        clearErrors("category_image");
        setShowCategoryImage(URL.createObjectURL(image))
    }

    return (
        <>
            <div className="container-fluid mw-100">

                <SubNavbar title={chatSettingData ? 'Edit Chat Setting' : 'Add Chat Setting'} header={'Chat Setting List'} subHeaderOnlyView={chatSettingData ? 'Edit Chat Setting' : 'Add Chat Setting'} />

                <div className="row m-2">
                    <div className="card col-12 justify-content-center">
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
                                                        Select Chat type<span className="text-danger ms-1">*</span>
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
                                                        Chat Value<span className="text-danger ms-1">(Number of free chat)</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <input
                                                            type="number"
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
                                                        Chat Duration <span className="text-danger ms-1">(Minutes of free chat)</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <input
                                                            type="number"
                                                            className="form-control ps-2"
                                                            placeholder="Enter duration "
                                                            autoComplete='nope'
                                                            // {...register('category_ara', { required: "Enter category arabic" })}
                                                            {...register(AstroInputTypesEnum.DURETION, textInputValidation(AstroInputTypesEnum.DURETION, Language('Enter duration')))}
                                                        />
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.DURETION]?.message}
                                                    </label>
                                                </div>

                                                <div className="mb-4">
                                                    <label htmlFor="product_name" className="form-label fw-semibold">
                                                        Expiry Count <span className="text-danger ms-1">(Expire chat in days)</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <input
                                                            type="number"
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
                {/* </div > */}
            </div >
        </>
    )
}
