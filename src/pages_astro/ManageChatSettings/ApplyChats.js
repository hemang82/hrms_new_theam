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

export default function ApplyChats() {

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
            setShowCategoryImage(chatSettingData?.image)
            setValue(AstroInputTypesEnum?.CATEGORY_IMAGE, getFileNameFromUrl(chatSettingData?.image));
            setValue(AstroInputTypesEnum?.CATEGORY_EN, chatSettingData.name);
            setValue(AstroInputTypesEnum?.CATEGORY_GU, chatSettingData.gu_name);
            setValue(AstroInputTypesEnum?.CATEGORY_HI, chatSettingData.hi_name);
        }
    }, [chatSettingData]);

    const onSubmitData = async (data) => {
        try {


            dispatch(setLoader(true));

            let request = {
                type: data[AstroInputTypesEnum?.TYPE],
            }
            // applyFreeChat(request).then((response) => {
            //     if (response?.code === Codes?.SUCCESS) {
            //         navigation('/chat_setting_list')
            //         TOAST_SUCCESS(response?.message)
            //     } else {
            //         TOAST_ERROR(response.message)
            //     }
            // })
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

                <SubNavbar title={chatSettingData ? 'Edit Chat Setting' : 'Apply Chat Setting'} header={'Chat Setting List'} subHeaderOnlyView={chatSettingData ? 'Edit Chat Setting' : 'Apply Chat Setting'} />

                <div className="row m-2">
                    <div className="card col-12 justify-content-center">
                        <div className='row justify-content-center '>

                            <form onSubmit={handleSubmit(onSubmitData)}>
                                <div className="" >
                                    <div className="card-body">
                                        <div className='row g-3'>
                                            <div className='col-md-6'>
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
                                            </div>

                                            <div className='col-md-6'>

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
