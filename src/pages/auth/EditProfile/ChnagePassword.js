import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../../layout/Header';
import Slidebar from '../../../layout/Slidebar';
import { editChangePassword } from '../../../utils/api.services';
import { TOAST_ERROR, TOAST_WARNING, TOAST_INFO, TOAST_SUCCESS, SWIT_SUCCESS, SWIT_DELETE, SWIT_DELETE_SUCCESS, loginRedirection, Encryption, Decryption, Language } from '../../../config/common'
import { useTranslation } from "react-i18next";
const ChnagePassword = () => {
    const { t, i18n } = useTranslation();

    const navigate = useNavigate()
    const publicUrl = process.env.PUBLIC_URL;
    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();
    let [showPassword, setShowPassword] = useState(false);
    let [showConfirmPassword, setShowConfirmPassword] = useState(false);
    let [showOldPassword, setShowOldPassword] = useState(false);


    const resetPasswordSubmit = (inputdata) => {
        let request = {
            oldpassword: inputdata.old_password,
            password: inputdata.password
        }
        editChangePassword(request).then((response) => {
            if (response.code === '1') {
                TOAST_SUCCESS(response.message);
                navigate('/dashboard')
            } else {
                TOAST_ERROR(response.message)
            }
        })
    }

    const togglePasswordVisibility = (field) => {
        if (field === 'password') {
            setShowPassword(!showPassword);
        } else if (field === 'confirmPassword') {
            setShowConfirmPassword(!showConfirmPassword);
        } else if (field === 'oldPassword') {
            setShowOldPassword(!showOldPassword)
        }
    };

    return (

        <div className="body_wrapper">
            <Header page_name={'Change Password'} />
            <Slidebar />
            <div className="content-main-box">
                <div className="content-wrap">
                    {/*start*/}
                    <div className="page-body page_brand border shadow rounded-5">
                        <div className='cursor_pointer d-flex justify-content-center m-2 p-2' style={{ 'width': '20px' }} onClick={() => { navigate(-1) }}><i className="bi bi-arrow-left"></i></div>
                        <div className="row border border-2 rounded-4 p-3 m-2">
                            <div className="col-xl-12 col-lg-12 col-md-12 col-12">
                                <form method='post' onSubmit={handleSubmit(resetPasswordSubmit)} >
                                    <div className='row mt-3'>
                                        <div className='col-md-6 mb-3'>
                                            <div className='login_div'>

                                                <div className='mb-3'>
                                                    <div className="input-group mb-1">
                                                        <input
                                                            type={showOldPassword ? 'text' : 'password'}
                                                            className="form-control"
                                                            placeholder={t('old_password')}
                                                            name="password"
                                                            {...register('old_password', {
                                                                required: `${t('please_enter_old_pass')}`,
                                                            })}

                                                        />
                                                        <span className="input-group-text eye-icon " onClick={() => togglePasswordVisibility('oldPassword')}>
                                                            <i className={` field-icon fa ${showOldPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                                        </span>
                                                    </div>
                                                    {errors.old_password && <small id='old_password' className='form-text text-danger p-3 '>{errors.old_password.message}</small>}
                                                </div>


                                                <div className='mb-3'>
                                                    <div className="input-group mb-1">
                                                        <input
                                                            type={showPassword ? 'text' : 'password'}
                                                            className="form-control"
                                                            placeholder={t('password')}
                                                            name="password"
                                                            {...register('password', {
                                                                required: `${t('please_enter_password')}`,
                                                                pattern: {
                                                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                                                                    message: `${t('password_validation')}`
                                                                }
                                                            })}
                                                        />

                                                        <span className="input-group-text eye-icon" onClick={() => togglePasswordVisibility('password')}>
                                                            <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                                        </span>

                                                    </div>
                                                    {errors.password && <small id='password' className='form-text text-danger p-3'>{errors.password.message}</small>}
                                                </div>

                                                <div className="mt-3 text-end">
                                                </div>

                                                <div className='mb-3'>
                                                    <div className="input-group mb-1">
                                                        <input
                                                            type={showConfirmPassword ? 'text' : 'password'}
                                                            className="form-control"
                                                            placeholder={t('password')}
                                                            name="password"
                                                            {...register('password', {
                                                                required: `${t('please_enter_password')}`,
                                                                pattern: {
                                                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                                                                    message: `${t('password_validation')}`
                                                                }
                                                            })}
                                                        />

                                                        <span className="input-group-text eye-icon" onClick={() => togglePasswordVisibility('confirmPassword')}>
                                                            <i className={`fa ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                                        </span>

                                                        {/* <Link className="input-group-text" style={{ backgroundColor: 'whitesmoke' }} onClick={() => { togglePasswordVisibility('password') }}>
                                                            <img
                                                                src={publicUrl + "/assets/images/show-password.svg"}
                                                                className="img-fluid"
                                                                alt={showPassword ? "hide" : "show"}
                                                            />
                                                        </Link> */}
                                                    </div>
                                                    {errors.password && <small id='password' className='form-text text-danger p-3'>{errors.password.message}</small>}
                                                </div>

                                                <div className="d-flex align-items-center justify-content-center ">
                                                    <button type="submit" className="submit_btn w-25 mt-3 btn_color">
                                                        {t('submit')}
                                                    </button>
                                                </div>

                                                <div className='forgot_password mt-4 text-center'>
                                                    {/* <label htmlFor="exampleColorInput" className="form-label">Already have an Account?   <Link to="/">Sign in</Link></label> */}
                                                </div>

                                            </div>
                                        </div>
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

export default ChnagePassword
