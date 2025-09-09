    <div className="card overflow-hidden chat-application ">
                                <div className="d-flex align-items-center justify-content-between gap-3 m-3 d-lg-none">
                                    <button className="btn btn-primary d-flex" type="button" data-bs-toggle="offcanvas" data-bs-target="#chat-sidebar" aria-controls="chat-sidebar">
                                        <i className="ti ti-menu-2 fs-5" />
                                    </button>
                                    <form className="position-relative w-100">
                                        <input type="text" className="form-control search-chat py-2 ps-5" id="text-srh" placeholder="Search Contact" />
                                        <i className="ti ti-search position-absolute top-50 start-0 translate-middle-y fs-6 text-dark me-3" />
                                    </form>
                                </div>

                                <div className="d-flex w-100">

                                    <div className="d-flex w-100">

                                        <div className="w-100">
                                            <div className="chat-container h-100 w-100">
                                                <div className="chat-box-inner-part h-100">
                                                    <div className="chatting-box app-email-chatting-box">
                                                        {/* <div className="p-9 py-3 border-bottom chat-meta-user d-flex align-items-center justify-content-between">
                                                            <h5 className="text-dark mb-0 fw-semibold">Profile Details</h5>
                                                            <ul className="list-unstyled mb-0 d-flex align-items-center">

                                                                <li className="nav-item ms-auto">
                                                                    <a className="btn btn-primary d-flex align-items-center px-3" id="add-notes">
                                                                        <i className="ti  me-0 me-md-1 fs-4" />
                                                                        <span className="d-none d-md-block font-weight-medium fs-3" >Edit Profile</span>
                                                                    </a>
                                                                </li>

                                                            </ul>
                                                        </div> */}

                                                        <div className="position-relative overflow-hidden">
                                                            <div className="position-relative">
                                                                <div className="chat-box p-9" style={{ height: 'calc(100vh - 200px)' }} data-simplebar>
                                                                    <div className="chat-list chat active-chat" data-user-id={1}>

                                                                        <div className="hstack align-items-start mb-7 pb-1 align-items-center justify-content-between">
                                                                            <div className="d-flex align-items-center gap-3">
                                                                                <img src={userDetailsData?.profile_image_link} alt="user4" width={72} height={72} className="rounded-circle" />
                                                                                <div>
                                                                                    <h6 className="fw-semibold fs-4 mb-0">{userDetailsData?.firstname + ' ' + userDetailsData?.lastname}</h6>
                                                                                    <p className="mb-0">{userDetailsData?.role == '1' ? 'Admin' : 'Sub admin'}</p>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        <div className="row">

                                                                            <div className="col-4 mb-7">
                                                                                <p className="mb-1 fs-2">First name</p>
                                                                                <h6 className="fw-semibold mb-0">{userDetailsData?.firstname}</h6>
                                                                            </div>
                                                                            <div className="col-8 mb-7">
                                                                                <p className="mb-1 fs-2">Last name</p>
                                                                                <h6 className="fw-semibold mb-0">{userDetailsData?.lastname}</h6>
                                                                            </div>
                                                                            <div className="col-4 mb-7">
                                                                                <p className="mb-1 fs-2">Phone number</p>
                                                                                <h6 className="fw-semibold mb-0">{userDetailsData?.country_code + ' ' + userDetailsData?.mobile_number}</h6>
                                                                            </div>
                                                                            <div className="col-8 mb-7">
                                                                                <p className="mb-1 fs-2">Email address</p>
                                                                                <h6 className="fw-semibold mb-0">{userDetailsData?.email}</h6>
                                                                            </div>
                                                                            <div className="col-12 mb-9">
                                                                                <p className="mb-1 fs-2">Address</p>
                                                                                <h6 className="fw-semibold mb-0">312, Imperical Arc, New western corner</h6>
                                                                            </div>

                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="offcanvas offcanvas-start user-chat-box" tabIndex={-1} id="chat-sidebar" aria-labelledby="offcanvasExampleLabel">

                                    </div>
                                </div>
                            </div>