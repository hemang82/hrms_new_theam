import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Button from 'react-bootstrap/Button';
// import { editProfile, forgotPassword } from '../../../utils/api.services';

import { TOAST_ERROR, TOAST_WARNING, TOAST_INFO, TOAST_SUCCESS, SWIT_SUCCESS, SWIT_DELETE, SWIT_DELETE_SUCCESS, loginRedirection, Encryption, Decryption } from '../../../config/common'

const EditVarification = () => {

    let navigate = useNavigate();
    let location = useLocation();

    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();
    let [userOtp, setuserOtp] = useState(location?.state?.otp);
    var [userData, setUserData] = useState(location?.state?.userDetials)
    const [isSent, setIsSent] = useState(false);
    const [timer, setTimer] = useState(59);

    useEffect(() => {
        setIsSent(true);
    }, [setIsSent]);

    useEffect(() => {
        otpValue1.current.focus();
        console.log(" 👍 ---------singup otp---------- 👍 ", userOtp);
        // console.log(" 👍 ---------singup otp---------- 👍 ", userData);
    }, [userOtp])

    useEffect(() => {
        const countdown = setInterval(() => {
            if (timer > 0) {
                setTimer((prevTimer) => prevTimer - 1);
            }
        }, 1000);

        if (timer == '00') {
            TOAST_WARNING("OTP Expired.")
            setIsSent(false);

        }

        return () => clearInterval(countdown);

    }, [timer]);

    const otpValue1 = useRef();
    const otpValue2 = useRef();
    const otpValue3 = useRef();
    const otpValue4 = useRef();

    const onHandleChange = (nextRef, e, index) => {
        const currentValue = e.target.value;

        if (!isNaN(Number(currentValue)) && currentValue.length === 1
        ) {

            if (index != 4 && nextRef.current) {
                nextRef.current.focus();
            }
        } else {
            e.target.value = '';
        }
    };

    const onKeyDownHandle = (prevRef, e, index) => {
        if (index != 1 && e.keyCode === 8 && e.target.value === "") {
            prevRef.current.focus()
        }
    }

    const verifyOtp = (() => {

        const enteredOtp = otpValue1.current?.value + otpValue2.current?.value + otpValue3.current?.value + otpValue4.current?.value;
        if (timer != '00') {

            console.log("Entered OTP--------", enteredOtp);
            if (otpValue1.current.value == '' || otpValue2.current.value == '' || otpValue3.current.value == '' || otpValue4.current.value == '') {

                TOAST_ERROR('Enter correct OTP.');

            } else if (enteredOtp === userOtp) {

                // editProfile(userData).then((response) => {
                //     if (response.code === '1') {
                //         localStorage.setItem('EPMauth', JSON.stringify(response.data.userDetials));
                //         TOAST_SUCCESS(response.message);
                //         navigate(`/dashboard`);
                //     } else {
                //         navigate(`/dashboard`)
                //     }
                // })
            } else {
                // console.log('---------');
                otpValue1.current.value = '';
                otpValue2.current.value = '';
                otpValue3.current.value = '';
                otpValue4.current.value = '';
                otpValue1.current.focus();
                TOAST_ERROR('Invalid OTP.')
            }
        } else {

            TOAST_WARNING(`Please resend the otp`)
        }

    });

    const handleResendCode = () => {

        setIsSent(true);
        otpValue1.current.value = '';
        otpValue2.current.value = '';
        otpValue3.current.value = '';
        otpValue4.current.value = '';

        let insertData = {
            role: 'production_facility_manager',
            country_code: '+91',
            mobile_number: userData.mobile_number
        }
        forgotPassword(insertData).then((response) => {
            if (response.code === '1') {
                setuserOtp(response.data.otp)
            } else {
                setuserOtp(null)
            }
        })
        setTimer(59);
    };

    return (
        <div className="wrapper-page">
            {/* <DashbordLayout /> */}
            <div className="login_body ">
                <div className="panel-heading login_hadder">
                    <h3 className="text-center mb-4 text-capitalize" > OTP Verification</h3>
                    {/* <p>Lorem Ipsum is simply dummy text of the printing and <br />typesetting industry.
                        </p> */}
                </div>
                <div className="panel-body">
                    <form className="login_form"  >

                        <div className="otp_input mb_25">

                            <input ref={otpValue1} name="digit1" onChange={(e) => { onHandleChange(otpValue2, e) }} type="text" className="digit1 form-control auth-code-input" onKeyDown={(e) => { onKeyDownHandle(null, e, 1) }} maxLength="1" />

                            <input ref={otpValue2} name="digit2" onChange={(e) => { onHandleChange(otpValue3, e) }} type="text" className="digit2 form-control auth-code-input" onKeyDown={(e) => { onKeyDownHandle(otpValue1, e) }} maxLength="1" />

                            <input ref={otpValue3} name="digit3" onChange={(e) => { onHandleChange(otpValue4, e) }} type="text" className="digit3 form-control auth-code-input" onKeyDown={(e) => { onKeyDownHandle(otpValue2, e) }} maxLength="1" />

                            <input ref={otpValue4} name="digit4" onChange={(e) => { onHandleChange(null, e, 4) }} type="text" className="digit4 form-control auth-code-input" onKeyDown={(e) => { onKeyDownHandle(otpValue3, e) }} maxLength="1" />

                        </div>
                        <div className="mb_20 mt-3 mb-3">

                            <Button onClick={() => {
                                verifyOtp();
                            }} className="submit_btn w-100 mt-3 btn_color " variant="outline-success" style={{ width: '100%' }}>
                                Verify
                            </Button>

                            {/* <button className="submit_btn w-100 mt-3 mb-3 btn_color" onClick={() => {
                                verifyOtp();
                            }} >
                                Verify
                            </button> */}
                        </div>

                        {isSent ? (
                            <Link href="javascript:void(0)" className="d-block text-center font_16 font_500 text-decoration-none text-capitalize">
                                <p id="resendAwait ">Expires In: <span id="resendTimer">00:{String(timer).padStart(2, '0')}</span></p>
                            </Link>
                        ) : (
                            <Link className="d-block text-center font_16 font_500 text-capitalize" style={{ color: '#764AF', textDecoration: 'none' }} >Didn’t receive code? <a href="#" onClick={handleResendCode}>Resend Code</a></Link>
                        )}

                    </form>
                </div>
            </div >
        </div >
    )
}

export default EditVarification
