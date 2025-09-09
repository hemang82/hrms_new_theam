import React from 'react'

const OtpVerification = () => {
    return (
        <div>
            <main className="bg-login-part-02">
                <section className="sec-1_verification-reset bg-login-part">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-lg-4 col-md-12 slider-bg">
                                <app-loginpart-left />
                            </div>
                            <div className="col-lg-8 col-md-12">
                                <div className="row">
                                    <div className="col-12">
                                        <p className="top-liks-right-login-rightpart">
                                            Don’t have an account?
                                            <span><a routerlink="/signup">Sign Up</a></span>
                                        </p>
                                    </div>

                                    <div className="col-12">
                                        <form className="form_login-part-comment mt-107px">
                                            <h1>Please enter 4-digit code</h1>
                                            <p className="subtitle-form_login text-red">johndoe@example.com</p>
                                            <div className="form-control1 otp-box">
                                                <input type="text" className="input-otp active" defaultValue={1} />
                                                <input type="password" className="input-otp" defaultValue={1} />
                                                <input type="password" className="input-otp" defaultValue={1} />
                                                <input type="password" className="input-otp" defaultValue={1} />
                                            </div>
                                            <div className="btns-loginpart">
                                                <a routerlink="/account_created" className="btn-theam-16px btn-theam-black">Verify</a>
                                                <a className="lable-01 mb-0 text-center">Didn't receive OTP? <span className="text-red">00:59</span></a>
                                            </div>
                                        </form>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}

export default OtpVerification
