import React, { useState, useEffect, useRef } from 'react'
import Swal from 'sweetalert2'
import { useLocation, useNavigate } from 'react-router-dom'
import { Controller, useForm } from 'react-hook-form';
import Header from '../../layout/Header';
import Slidebar from '../../layout/Slidebar';
import Footer from '../../layout/Footer';
import { Language, TOAST_ERROR, TOAST_SUCCESS, allowLettersAndSpaces } from '../../config/common';
import {  processingFeeAdd, processingFeeDetails, processingFeeUpdate } from '../../utils/api.services';
import SubNavbar from '../../layout/SubNavbar';
import categoryImage from '../../assets/Images/Group 48096953.png'
import { uploadImageOnAWS } from '../../utils/aws.service';
import { AwsFolder, Codes } from '../../config/constant';
import { SketchPicker } from 'react-color';
import { getCommaSeparatedNames, getFileNameFromUrl, handelInputText, selectOption, textInputValidation, textValidation } from '../../config/commonFunction';
import { AstroInputTypesEnum, InputRegex, InputTypesEnum, LOAN_TYPES } from '../../config/commonVariable';
import { useDispatch } from 'react-redux';
import { setLoader } from '../../Store/slices/MasterSlice';
import { LazyLoadImage } from "react-lazy-load-image-component";
import CountryMobileNumber from '../../pages/CommonPages/CountryMobileNumber';
import Spinner from '../../component/Spinner';

export default function AddCustomer() {
    const navigation = useNavigate();
    const dispatch = useDispatch();

    const location = useLocation();
    const [showPanCardImage, setShowPanCardImage] = useState(null);
    const [panCardFileName, setPanCardFileName] = useState('');
    const [showadhaarCardImage, setShowadhaarCardImage] = useState(null);
    const [adhaarCardFileName, setAdhaarCardFileName] = useState('');
    const [is_loding, setIs_loading] = useState(false);

    var processingFeeData = location?.state;

    const {
        register,
        handleSubmit,
        setValue,
        clearErrors,
        reset,
        watch,
        control,
        trigger,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        if (processingFeeData) {
            dispatch(setLoader(true))
            setIs_loading(true)
            processingFeeDetails({ fee_id: processingFeeData?.id })?.then((response) => {
                if (response?.status_code === Codes.SUCCESS) {
                    let responseDetails = response?.data?.processing_fee;
                    setValue(AstroInputTypesEnum?.LABEL, responseDetails?.label);
                    setValue(AstroInputTypesEnum?.MAX_SCORE, responseDetails?.max_score);
                    setValue(AstroInputTypesEnum?.MIN_SCORE, responseDetails?.min_score);
                    setValue(AstroInputTypesEnum?.MIN_FEE_PERCENTAGE, responseDetails?.min_fee_percent);
                    setValue(AstroInputTypesEnum?.MAX_FEE_PERCENTAGE, responseDetails?.max_fee_percent);
                    setIs_loading(false)
                }
            }).catch(error => {
                setIs_loading(false)
            });
            dispatch(setLoader(false))
        }
    }, [processingFeeData]);

    const onSubmitData = async (data) => {
        try {

            dispatch(setLoader(true))

            let request = {
                label: data[AstroInputTypesEnum.LABEL],
                min_score: data[AstroInputTypesEnum.MIN_SCORE],
                max_score: data[AstroInputTypesEnum.MAX_SCORE],
                min_fee_percent: data[AstroInputTypesEnum.MIN_FEE_PERCENTAGE],
                max_fee_percent: data[AstroInputTypesEnum.MAX_FEE_PERCENTAGE],
            }
            if (processingFeeData) {
                request.fee_id = processingFeeData.id;
                processingFeeUpdate(request).then((response) => {
                    if (response?.status_code === Codes.SUCCESS) {
                        TOAST_SUCCESS(response?.message)
                        navigation('/processing_fee_list')
                    } else {
                        TOAST_ERROR(response.message)
                    }
                })
            } else {
                processingFeeAdd(request).then((response) => {
                    if (response?.status_code === Codes.SUCCESS) {
                        TOAST_SUCCESS(response?.message)
                        navigation('/processing_fee_list')
                        setIs_loading(false)
                    } else {
                        TOAST_ERROR(response.message)
                        setIs_loading(false)
                    }
                })
            }
            dispatch(setLoader(false))
        } catch (error) {
            TOAST_ERROR('Somthing went wrong')
        }
    }

    const handleInputChange = async (key, value) => {
        let filteredValue = value;
        if (key === AstroInputTypesEnum.MIN_SCORE) {
            filteredValue = value.replace(InputRegex.ONCHANGE_MOBILE_REGEX, '');
        } else if (key === AstroInputTypesEnum.MAX_SCORE) {
            filteredValue = value.replace(InputRegex.ONCHANGE_MOBILE_REGEX, '');
        }
        //  else if (key === AstroInputTypesEnum.MIN_FEE_PERCENTAGE || key === AstroInputTypesEnum.MAX_FEE_PERCENTAGE) {
        //     filteredValue = value.replace(InputRegex.ONCHANGE_MOBILE_REGEX, '');
        // }
        setValue(key, filteredValue)
        clearErrors(key);
        await trigger(key);
    };

    return (
        <>
            {<Spinner isActive={is_loding} message={'Please Wait'} />}
            <div className="container-fluid mw-100">
                <SubNavbar title={processingFeeData ? 'Edit Processing Fee' : 'Add Processing Fee'} header={'Processing Fee List'} subHeaderOnlyView={processingFeeData ? 'Edit Processing Fee' : 'Add Processing Fee'} />
                <div className="row m-2">
                    <div className="col-12 justify-content-center">
                        <div className='row justify-content-center '>
                            <form onSubmit={handleSubmit(onSubmitData)}>
                                <div className="card" >
                                    <div className="card-body">

                                        <div className="row justify-content-center">
                                            <div className="col-auto">
                                                <div className="card shadow-sm custom-card">

                                                </div>
                                            </div>
                                        </div>

                                        <div className='row'>
                                            <div className='col-md-6'>

                                                <div className="mb-4">
                                                    <label htmlFor="lastname" className="form-label fw-semibold">
                                                        Min Credit Score<span className="text-danger ms-1">*</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <input
                                                            name={AstroInputTypesEnum.MIN_SCORE}
                                                            type="text"
                                                            className="form-control ps-2"
                                                            placeholder="Enter min credit score"
                                                            autoComplete='nope'
                                                            {...register(AstroInputTypesEnum.MIN_SCORE, textInputValidation(AstroInputTypesEnum.MIN_SCORE, 'Enter min credit score'))}
                                                            onChange={(e) => handleInputChange(AstroInputTypesEnum.MIN_SCORE, e.target.value)}
                                                            maxLength={3}
                                                        />
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.MIN_SCORE]?.message}
                                                    </label>
                                                </div>


                                                <div className="mb-4">
                                                    <label htmlFor="lastname" className="form-label fw-semibold">
                                                        Min Fee Percentage<span className="text-danger ms-1">(in %) *</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <input
                                                            name={AstroInputTypesEnum.MIN_FEE_PERCENTAGE}
                                                            type="number"
                                                            className="form-control ps-2"
                                                            placeholder="Enter interest percentage"
                                                            autoComplete='nope'
                                                            step="0.01"
                                                            min={0}
                                                            max={100}
                                                            {...register(AstroInputTypesEnum.MIN_FEE_PERCENTAGE, textInputValidation(AstroInputTypesEnum.MIN_FEE_PERCENTAGE, 'Enter interest percentage'))}
                                                            onChange={(e) => handleInputChange(AstroInputTypesEnum.MIN_FEE_PERCENTAGE, e.target.value)}
                                                            maxLength={3}
                                                        />
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.MIN_FEE_PERCENTAGE]?.message}
                                                    </label>
                                                </div>

                                                <div className="mb-4">
                                                    <label htmlFor="lastname" className="form-label fw-semibold">
                                                        Processing Fee Label<span className="text-danger ms-1">*</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <input
                                                            type="text"
                                                            className="form-control ps-2"
                                                            placeholder="Enter processing fee label. Ex : (750 - 900)"
                                                            autoComplete='nope'
                                                            {...register(AstroInputTypesEnum.LABEL, textInputValidation(AstroInputTypesEnum.LABEL, Language('Enter processing fee label')))}
                                                        />
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.LABEL]?.message}
                                                    </label>
                                                </div>
                                            </div>

                                            <div className='col-md-6'>

                                                <div className="mb-4">
                                                    <label htmlFor="lastname" className="form-label fw-semibold">
                                                        Max Credit Score<span className="text-danger ms-1">*</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <input
                                                            name={AstroInputTypesEnum.MAX_SCORE}
                                                            type="text"
                                                            className="form-control ps-2"
                                                            placeholder="Enter max score"
                                                            autoComplete='nope'
                                                            {...register(AstroInputTypesEnum.MAX_SCORE, textInputValidation(AstroInputTypesEnum.MAX_SCORE, 'Enter max score'))}
                                                            onChange={(e) => handleInputChange(AstroInputTypesEnum.MAX_SCORE, e.target.value)}
                                                            maxLength={3}
                                                        />
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.MAX_SCORE]?.message}
                                                    </label>
                                                </div>

                                                <div className="mb-4">
                                                    <label htmlFor="lastname" className="form-label fw-semibold">
                                                        Max Fee Percentage<span className="text-danger ms-1">(in %) *</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <input
                                                            name={AstroInputTypesEnum.MAX_FEE_PERCENTAGE}
                                                            type="number"
                                                            step="0.01"
                                                            className="form-control ps-2"
                                                            placeholder="Enter interest percentage"
                                                            autoComplete='nope'
                                                            min={0}
                                                            max={100}
                                                            {...register(AstroInputTypesEnum.MAX_FEE_PERCENTAGE, textInputValidation(AstroInputTypesEnum.MAX_FEE_PERCENTAGE, 'Enter interest percentage'))}
                                                            onChange={(e) => handleInputChange(AstroInputTypesEnum.MAX_FEE_PERCENTAGE, e.target.value)}
                                                            maxLength={3}
                                                        />
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.MAX_FEE_PERCENTAGE]?.message}
                                                    </label>
                                                </div>


                                            </div>
                                            <div className="modal-footer justify-content-center mb-3">
                                                <button type='button' className="btn btn-danger m-2" onClick={() => { processingFeeData ? navigation('/processing_fee_list') : reset() }}>Cancel</button>
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
