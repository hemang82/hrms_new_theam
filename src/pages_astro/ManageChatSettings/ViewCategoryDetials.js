import React, { useState, useEffect, useRef } from 'react'
import Swal from 'sweetalert2'
import { useLocation, useNavigate } from 'react-router-dom'
import { Controller, useForm } from 'react-hook-form';
import Header from '../../layout/Header';
import Slidebar from '../../layout/Slidebar';
import Footer from '../../layout/Footer';
import { Language, TOAST_ERROR, TOAST_SUCCESS, allowLettersAndSpaces } from '../../config/common';
import { AddCategory, EditCategory } from '../../utils/api.services';
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

export default function DetailsCategoryPage() {
    const navigation = useNavigate();
    const dispatch = useDispatch();

    const location = useLocation();
    const [shoWcategoryImage, setShowCategoryImage] = useState(null);

    var categoryData = location?.state;
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
        if (categoryData) {
            setShowCategoryImage(categoryData?.image)
            setValue(AstroInputTypesEnum?.CATEGORY_IMAGE, getFileNameFromUrl(categoryData?.image));
            setValue(AstroInputTypesEnum?.CATEGORY_EN, categoryData.name);
            setValue(AstroInputTypesEnum?.CATEGORY_GU, categoryData.gu_name);
            setValue(AstroInputTypesEnum?.CATEGORY_HI, categoryData.hi_name);
        }
    }, [categoryData]);

    const onSubmitData = async (data) => {
        try {
            dispatch(setLoader(true));

            let image = data[AstroInputTypesEnum?.CATEGORY_IMAGE];
            if (image instanceof Blob) image = await uploadImageOnAWS(image, AwsFolder?.CATEGORY_IMAGE);

            let request = {
                name: data[AstroInputTypesEnum?.CATEGORY_EN],
                gu_name: data[AstroInputTypesEnum?.CATEGORY_GU],
                hi_name: data[AstroInputTypesEnum?.CATEGORY_HI],
                image: image
            }
            if (categoryData) {
                request.category_id = categoryData._id;
                EditCategory(request).then((response) => {
                    if (response?.code === Codes?.SUCCESS) {
                        navigation('/category_list')
                        TOAST_SUCCESS(response?.message)
                    } else {
                        TOAST_ERROR(response.message)
                    }
                })
            } else {
                AddCategory(request).then((response) => {
                    if (response?.code === Codes?.SUCCESS) {
                        navigation('/category_list')
                        TOAST_SUCCESS(response?.message)
                    } else {
                        TOAST_ERROR(response.message)
                    }
                })
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

                <SubNavbar title={categoryData ? 'Category Details' : 'Add Category'} header={'Category List'} subHeaderOnlyView={categoryData ? 'Category Details' : 'Add Category'} />

                <div className="row m-2">
                    <div className="col-12 justify-content-center">
                        <div className='row justify-content-center '>
                            <form onSubmit={handleSubmit(onSubmitData)}>
                                <div className="card" >
                                    <div className="card-body">
                                        {/* <div className="px-4 py-3 border-bottom mb-3">
                                            <h5 className="card-title fw-semibold mb-0">
                                                Product Details
                                            </h5>
                                        </div> */}

                                        <div className="row justify-content-center">
                                            <div className="col-auto">
                                                <div className="card shadow-sm custom-card">
                                                    <div className="card-body text-center" >

                                                        <div className="dropzone cursor_pointer custom_dropzone" >
                                                            <label htmlFor="category_image" className='cursor_pointer'>
                                                                {/* <Controller name={AstroInputTypesEnum.CATEGORY_IMAGE}
                                                                    control={control} defaultValue={null}
                                                                    rules={{ required: 'Select category image' }}
                                                                    render={({ field }) => (<>
                                                                        <input type="file" name={AstroInputTypesEnum.CATEGORY_IMAGE} className="custom-file-input form-control" id={AstroInputTypesEnum.CATEGORY_IMAGE} accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />

                                                                    </>
                                                                    )} />
                                                                <input
                                                                    className="form-control d-none"
                                                                    type="file"
                                                                    id="formFileMultiple"
                                                                    multiple
                                                                    onChange={handleImageChange}
                                                                /> */}
                                                                {
                                                                    shoWcategoryImage ? (

                                                                        <LazyLoadImage src={shoWcategoryImage}
                                                                            style={{ height: '150px', width: '300px', objectFit: 'contain' }}
                                                                            // className="img-fluid rounded-1 mt-4 post-image"
                                                                            alt="Image Alt" //onClick={() => { navigat('/post_list/post_details', { state: post }) }}
                                                                        />
                                                                        // <div className="fallback text-center" style={{ height: '150px', width: '300px', }}>
                                                                        //     <img src={shoWcategoryImage} alt="Category" style={{ height: '150px', width: '300px', objectFit: 'contain' }} />
                                                                        // </div>
                                                                    ) : (
                                                                        <div className="fallback text-center" style={{ height: '150px', width: '300px', objectFit: 'contain', alignItems: 'center', justifyContent: 'center' }}>
                                                                            <label htmlFor="formFileMultiple" className="dz-button centered-dropzone">
                                                                                Select files here to upload
                                                                            </label>

                                                                        </div>
                                                                    )
                                                                }
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* <p className='text-danger '> <span>{errors[AstroInputTypesEnum.CATEGORY_IMAGE] && errors[AstroInputTypesEnum.CATEGORY_IMAGE].message}</span></p> */}
                                                <label className="errorc ps-1 pt-1">
                                                    {errors[AstroInputTypesEnum?.CATEGORY_IMAGE]?.message}
                                                </label>
                                            </div>
                                        </div>

                                        <div className='row g-3'>
                                            <div className='col-md-6'>
                                                <div className="mb-4">
                                                    <label htmlFor="lastname" className="form-label fw-semibold">
                                                        Category Name <span className="text-danger ms-1"> (English) *</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <input
                                                            type="text"
                                                            className="form-control ps-2"
                                                            placeholder="Enter english category name"
                                                            disabled
                                                            // onKeyPress={allowLettersAndSpaces}
                                                            autoComplete='nope'
                                                            // {...register('category_en', { required: "Enter category" })}
                                                            {...register(AstroInputTypesEnum.CATEGORY_EN, textInputValidation(AstroInputTypesEnum.CATEGORY_EN, Language('Enter english category name')))}
                                                        />
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum?.CATEGORY_EN]?.message}
                                                    </label>
                                                </div>

                                                <div className="mb-4">
                                                    <label htmlFor="lastname" className="form-label fw-semibol  d">
                                                        Category Name <span className="text-danger ms-1"> (Gujarati) *</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <input
                                                            type="text"
                                                            className="form-control ps-2"
                                                            placeholder="Enter gujrati category name"
                                                            disabled
                                                            // onKeyPress={allowLettersAndSpaces}
                                                            autoComplete='nope'
                                                            // {...register('category_en', { required: "Enter category" })}
                                                            {...register(AstroInputTypesEnum?.CATEGORY_GU, textInputValidation(AstroInputTypesEnum?.CATEGORY_GU, Language('Enter gujrati category name')))}
                                                        />
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum?.CATEGORY_GU]?.message}
                                                    </label>
                                                </div>

                                                <div className="mb-4">
                                                    <label htmlFor="product_name" className="form-label fw-semibold">
                                                        Category Name <span className="text-danger ms-1"> (Hindi) *</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <input
                                                            type="text"
                                                            className="form-control ps-2"
                                                            placeholder="Enter hindi category name"
                                                            disabled
                                                            autoComplete='nope'
                                                            // {...register('category_ara', { required: "Enter category arabic" })}
                                                            {...register(AstroInputTypesEnum.CATEGORY_HI, textInputValidation(AstroInputTypesEnum.CATEGORY_HI, Language('Enter hindi category name')))}
                                                        />
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.CATEGORY_HI]?.message}
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
                                            {/* <div className="modal-footer justify-content-center mb-3">
                                                <button type='button' className="btn btn-danger m-2" onClick={() => { reset(); setShowCategoryImage("") }}>Cancel</button>
                                                <button type='submit' className="btn btn-primary" >Submit</button>
                                            </div> */}

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
