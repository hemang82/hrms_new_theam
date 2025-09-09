import React from 'react'
import { Link } from 'react-router-dom'
import DashbordLayout from '../../../layout/DashbordLayout';

const SignUp = () => {
    return (
        <>
            <DashbordLayout />
            <div className="wrapper-page">

                <div className="login_body ">
                    <div className="panel-heading login_hadder">
                        <h3 className="text-center "> Sign Up</h3>
                        <p>Lorem Ipsum is simply dummy text of the printing and <br />typesetting industry.
                        </p>
                    </div>

                    <div className="panel-body">
                        <form className="form-horizontal m-t-20"  >
                            <div className='login_div '>

                                <div>
                                    <label htmlFor="exampleInputPassword1" className='m-2'>Select user type</label>
                                    <select className="form-select" aria-label="Brand">
                                        <option selected>Brand</option>
                                        <option value="1">One</option>
                                        <option value="2">Two</option>
                                        <option value="3">Three</option>
                                    </select>
                                </div>

                                <div className="form-group ">
                                    <label htmlFor="exampleInputEmail1" className='m-2'>Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="exampleInputEmail1"
                                        aria-describedby="emailHelp"
                                        placeholder="Enter email"
                                    />
                                </div>

                                <div className="form-group ">
                                    <label htmlFor="exampleInputPassword1" className='m-2'>Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="exampleInputPassword1"
                                        placeholder="Password"
                                    />
                                </div>

                                <div className="mt-3 text-end">
                                    <label htmlFor="formGroupExampleInput2" className="form-label">Forgot Password?</label>
                                </div>

                                <button type="submit" className="submit_btn w-100 mt-3">
                                    Submit
                                </button>

                                <div className='mt-4 text-center'>
                                    <label htmlFor="exampleColorInput" className="form-label">Already have an Account?   <Link to="/otp_verfication">Sign Up</Link></label>
                                </div>

                            </div>
                        </form>
                    </div>
                </div >
            </div >
        </>
    )
}

export default SignUp;
