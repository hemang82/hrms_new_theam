import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { changePassword } from '../../../utils/api.services';
import { TOAST_ERROR, TOAST_WARNING, TOAST_INFO, TOAST_SUCCESS, SWIT_SUCCESS, SWIT_DELETE, SWIT_DELETE_SUCCESS, loginRedirection, Encryption, Decryption } from '../../../config/common'

const ResetPassword = () => {

    const navigate = useNavigate()
    const publicUrl = process.env.PUBLIC_URL;
    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();
    let [showPassword, setShowPassword] = useState(false);
    let [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const resetPasswordSubmit = (inputdata) => {
        var userData = JSON.parse(localStorage.getItem('temperary_auth'))

        let request = {
            user_id: userData.user_id,
            password: inputdata.password
        }
        changePassword(request).then((response) => {
            if (response.code === '1') {
                navigate('/login')
                localStorage.removeItem('temperary_auth');
                TOAST_SUCCESS('Password Change Success')

            }
            // else {
            //     TOAST_ERROR('Password Change Unsuccess')
            // }
        })
    }

    const togglePasswordVisibility = (field) => {
        if (field === 'password') {
            setShowPassword(!showPassword);
        } else if (field === 'confirmPassword') {
            setShowConfirmPassword(!showConfirmPassword);
        }
    };

    return (
        <>
            <div className="wrapper-page">
                {/* <DashbordLayout /> */}
                <div className="login_body ">
                    <div className="panel-heading login_hadder">
                        <h3 className="text-center ">Reset Password</h3>
                        {/* <p>Lorem Ipsum is simply dummy text of the printing and <br />typesetting industry.
                        </p> */}
                    </div>
                    <div className="panel-body">
                        <form method='post' onSubmit={handleSubmit(resetPasswordSubmit)} >
                            <div className='login_div'>
                                <div>
                                    <div className="input-group mb-2 shadow-sm">

                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            className="form-control"
                                            placeholder="Password"
                                            name="password"
                                            {...register('password', {
                                                required: 'Please enter password',
                                                pattern: {
                                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                                                    message: `Password must be 8 characters long with at least 1 uppercase, 1 lowercase, 1 number, and 1 special character.`
                                                }
                                            })}
                                        />

                                        <span className="input-group-text eye-icon" onClick={() => togglePasswordVisibility('password')}>
                                            <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                        </span>

                                    </div>
                                    {errors.password && <small id='password' className='form-text text-danger p-2 pb-3'>{errors.password.message}</small>}
                                </div>

                                <div className="input-group shadow-sm mb-2">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        className="form-control "
                                        placeholder="Confirm Password"
                                        name='confirmPassword' {...register('confirmPassword', {
                                            required: 'Please enter confirm password',
                                            validate: (value) =>
                                                value === watch('password') || 'Password do not match',
                                        })}
                                    />
                                    <span className="input-group-text eye-icon" onClick={() => togglePasswordVisibility('confirmPassword')}>
                                        <i className={`fa ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                    </span>
                                </div>
                                {errors.confirmPassword && <small id='firstname' className='form-text text-danger p-2 '>{errors.confirmPassword.message}</small>}
                                <div className="mt-3 text-end">
                                </div>
                                <button type="submit" className="submit_btn w-100 mt-3 btn_color">
                                    Submit
                                </button>
                                <div className='forgot_password mt-4 text-center'>
                                    {/* <label htmlFor="exampleColorInput" className="form-label">Already have an Account?   <Link to="/">Sign in</Link></label> */}
                                </div>
                            </div>
                        </form>
                    </div>
                </div >
            </div >

        </>
    )
}

export default ResetPassword
