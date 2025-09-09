import React, { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import * as API from '../../../utils/api.services'
import { useForm } from 'react-hook-form'

import COUNTRY_LIST_OPTION, { TOAST_WARNING, TOAST_INFO, TOAST_SUCCESS, SWIT_SUCCESS, SWIT_DELETE, SWIT_DELETE_SUCCESS, loginRedirection, Encryption, Decryption, PASSWORD_VALIDATION, EMAIL_VALIDATION, loginRedirectCallWithDataStore } from '../../../config/commonFunction';

import DashbordLayout from '../../../layout/DashbordLayout'
import Header from '../../../layout/Header'
import Slidebar from '../../../layout/Slidebar'
import Footer from '../../../layout/Footer'
import { Helmet } from 'react-helmet'
import logo from "../../../assets/Images/logo.svg"
import Constatnt, { Codes, PUBLIC_URL } from '../../../config/constant'
import { InputTypesEnum } from '../../../config/commonVariable'
import { textValidation } from '../../../config/commonFunction'
import { Language, TOAST_ERROR } from '../../../config/common';

const Login = () => {

    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, reset, getValues, watch, setValue } = useForm();

    let [showPassword, setShowPassword] = useState(false);

    const onSubmit = (submitData) => {
        let requestBody = {
            // role: "teacher",
            email: submitData?.email,
            password: submitData?.password
        }
        API.login(requestBody).then((response) => {
            console.log('response :', response);
            if (response?.code === Codes.SUCCESS) {
                console.log('response login', response?.data);
                loginRedirection(response?.data);
                navigate('/dashboard')
                reset();
            } else {
                TOAST_ERROR(response?.message)
            }
        })
    };

    const allowMobileNumbers = (event) => {
        const input = event.key;
        const mobileNumber = event.target.value.replace(/\D/g, '');
        if (mobileNumber.length >= 10 || !/^\d$/.test(input)) {
            event.preventDefault();
        }
    };

    const [passwordVisible, setPasswordVisible] = useState(false);
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <>
            <div className="page-wrapper" id="main-wrapper" data-layout="vertical" data-navbarbg="skin6" data-sidebartype="full" data-sidebar-position="fixed" data-header-position="fixed">
                <div className="position-relative overflow-hidden radial-gradient min-vh-100 d-flex align-items-center justify-content-center">
                    <div className="d-flex align-items-center justify-content-center w-100">
                        <div className="row justify-content-center w-100">
                            <div className="col-md-8 col-lg-6 col-xxl-5">
                                <div className="card mb-0">
                                    <div className="card-body">
                                        <a className="text-nowrap logo-img text-center d-block mb-3 w-100">
                                            <img src={Constatnt?.APP_LOGO} width={250} height={75} alt />
                                            {/* <img src={`${PUBLIC_URL}/dist/images/logo.svg`} width={60} alt /> */}
                                        </a>

                                        {/* <div className="row">
                                            <div className="col-6 mb-2 mb-sm-0">
                                                <a className="btn btn-white text-dark border fw-normal d-flex align-items-center justify-content-center rounded-2 py-8" href="javascript:void(0)" role="button">
                                                    <img src={`${PUBLIC_URL}/dist/images/svgs/google-icon.svg`} alt className="img-fluid me-2" width={18} height={18} />
                                                    <span className="d-none d-sm-block me-1 flex-shrink-0">Sign in with</span>Google
                                                </a>
                                            </div>
                                            <div className="col-6">
                                                <a className="btn btn-white text-dark border fw-normal d-flex align-items-center justify-content-center rounded-2 py-8" href="javascript:void(0)" role="button">
                                                    <img src={`${PUBLIC_URL}/dist/images/svgs/facebook-icon.svg`} alt className="img-fluid me-2" width={18} height={18} />
                                                    <span className="d-none d-sm-block me-1 flex-shrink-0">Sign in with</span>FB
                                                </a>
                                            </div>
                                        </div> */}
                                        {/* <div className="position-relative text-center my-4">
                                            <p className="mb-0 fs-4 px-3 d-inline-block bg-white text-dark z-index-5 position-relative">or sign in with</p>
                                            <span className="border-top w-100 position-absolute top-50 start-50 translate-middle" />
                                        </div> */}

                                        <form method='post' onSubmit={handleSubmit(onSubmit)}>

                                            <div className="mb-3">
                                                <label htmlFor="exampleInputEmail1" className="form-label">{Language('emailAddress')}</label>
                                                <div className="input-group border rounded-1 input_select shadow-sm">
                                                    <input type="email" className="form-control border-0 " placeholder={Language('enterEmailAddress')} {...register(InputTypesEnum.EMAIL, textValidation(InputTypesEnum.EMAIL))} id="exampleInputEmail1" aria-describedby="emailHelp" />
                                                </div>
                                                <label className="errorc p-1 mt-1">{errors.email?.message}</label>
                                            </div>

                                            <div className="mb-3 ">
                                                <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                                                {/* <input type="password" className="form-control" id="exampleInputPassword1" /> */}
                                                <div className="input-group border rounded-1 shadow-sm input_select">
                                                    <input type={passwordVisible ? "text" : "password"} className="form-control border-0" id="inputPassword" placeholder={Language('enterPassword')} {...register(InputTypesEnum.PASSWORD, textValidation(InputTypesEnum.PASSWORD))} />
                                                    <span className="input-group-text bg-transparent px-6 border-0 " id="basic-addon1">
                                                        {/* <i class="ti ti-eye-off"></i> */}
                                                        <i className={`fs-6 cursor_pointer  ${passwordVisible ? 'ti ti-eye' : 'ti ti-eye-off'}`} onClick={togglePasswordVisibility} />
                                                    </span>
                                                </div>
                                                <label className="errorc pt-1 mt-1">{errors.password?.message}</label>
                                            </div>

                                            <div className="d-flex align-items-center justify-content-between">
                                                <div className="form-check">
                                                    {/* <input className="form-check-input primary" type="checkbox" defaultValue id="flexCheckChecked" defaultChecked />
                                                    <label className="form-check-label text-dark" htmlFor="flexCheckChecked">
                                                        Remeber this Device
                                                    </label> */}
                                                </div>
                                                {/* <a className="text-primary fw-medium" href="./authentication-forgot-password.html">Forgot Password ?</a> */}
                                            </div>

                                            <button type='submit' className="btn btn-primary w-100 py-8 mb-2 rounded-2">Sign In</button>

                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default Login;

