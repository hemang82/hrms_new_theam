import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import DashbordLayout from '../../../layout/DashbordLayout';
import { forgotPassword } from '../../../utils/api.services';
import { TOAST_ERROR, TOAST_WARNING, TOAST_INFO, TOAST_SUCCESS, SWIT_SUCCESS, SWIT_DELETE, SWIT_DELETE_SUCCESS, loginRedirection, Encryption, Decryption } from '../../../config/common'



const ForgotPassword = () => {
    let navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, reset, getValues, control, setValue } = useForm();
    var userData = JSON.parse(localStorage.getItem('EPMauth'));
    const allowMobileNumbers = (event) => {
        const input = event.key;
        const mobileNumber = event.target.value.replace(/\D/g, '');
        if (mobileNumber.length >= 10 || !/^\d$/.test(input)) {
            event.preventDefault();
        }
    };

    const forgotSubmit = (data) => {
        console.log('data', data);
        let insertData = {
            role: 'production_facility_manager',
            country_code: data.country_code,
            mobile_number: data.mobile_number
        }
        forgotPassword(insertData).then((response) => {
            if (response.code === '1') {
                navigate('/varification', { state: { otp: response.data.otp, userDetials: response.data.userDetials } })
                SWIT_SUCCESS('otp sent success')
            }
            //  else {

            //     TOAST_ERROR('otp sent unsuccess')
            // }
        })
    }
    return (
        <>
            <div className="wrapper-page">
                {/* <DashbordLayout /> */}
                <div className="login_body ">
                    <div className="panel-heading login_hadder">
                        <h3 className="text-center test-Capitalize "> Forgot Password</h3>
                        {/* <p>Lorem Ipsum is simply dummy text of the printing and <br />typesetting industry.
                        </p> */}
                    </div>
                    <div className="panel-body">
                        <form method='post' onSubmit={handleSubmit(forgotSubmit)} >
                            <div className='login_div'>
                                <div className="input-group rounded-3 ">
                                    {/* <div className="input-group-prepend">
                                        <select className="form-control shadow-sm" style={{ "width": "90px", "textAlign": "center" }} id="country_code" name="country_code" data-attribute-name="Country Code" aria-expanded="false" {...register('country_code')} >
                                            {COUNTRY_LIST_OPTION(setValue, 'country_code', userData)}
                                        </select>
                                    </div> */}
                                    <input
                                        type="text"
                                        className="form-control ms-1 shadow-sm p-2 me-1"
                                        id="exampleInputmobile_number1"
                                        aria-describedby="mobile_numberHelp"
                                        placeholder="Enter mobile number"
                                        onKeyPress={allowMobileNumbers}
                                        name="mobile_number" {...register('mobile_number', {
                                            required: 'Please Enter mobile_number',
                                            pattern: {
                                                value: /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/i,
                                                message: "Please enter valid mobile number",
                                            },
                                            maxLength: { value: 10, message: "Mobile number should not exceed 10 characters" }, minLength: { value: 8, message: "Please enter atleast 8 digits for mobile number" }
                                        })}
                                    />
                                    {errors.mobile_number && <small id='mobile_number' className='form-text text-danger pt-3 '>{errors.mobile_number.message}</small>}
                                </div>
                                <div className="mt-3 text-end">
                                </div>
                                <button type="submit" className="submit_btn w-100 mt-3 btn_color">
                                    Submit
                                </button>
                                <div className='forgot_password mt-4 text-center'>
                                    <label htmlFor="exampleColorInput" className="form-label">Already have an Account?   <Link to="/">Sign in</Link></label>
                                </div>
                            </div>
                        </form>
                    </div >
                </div >
            </div >

        </>
    )
}

export default ForgotPassword
