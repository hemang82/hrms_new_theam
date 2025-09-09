import React, { useEffect, useState } from 'react'
import Header from '../../layout/Header';
import Slidebar from '../../layout/Slidebar';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import SubNavbar from '../../layout/SubNavbar';
import { setLoader } from '../../Store/slices/MasterSlice';
import profile_image from '../../assets/Images/default.jpg'
import Constatnt, { Codes, PUBLIC_URL } from '../../config/constant';
import { TOAST_ERROR } from '../../config/common';
import { formatDate } from '../../config/commonFunction';
import { DateFormat } from '../../config/commonVariable';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const ContectDetails = () => {
    const navigat = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    var contactUsDetails = location?.state;

    const [ContactUsDetails, setContactUsDetails] = useState();

    return (
        <>

            {/* <Slidebar />
            <div className="body-wrapper">
                <Header /> */}
            {/* --------------------------------------------------- */}
            {/* Header End */}
            {/* --------------------------------------------------- */}
            <div className="container-fluid mw-100">

                <SubNavbar title={'ContactUs Details'} header={'ContactUs List'} subHeaderOnlyView={'ContactUs Details'} />

                <div className="tab-pane fade show active" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab" tabIndex={1}>

                    <div className="card overflow-hidden chat-application">
                        <div className="p-md-4 p-4 row_2">

                            {/*
                            <div className="p-8 py-3 border-bottom chat-meta-user d-flex align-items-center justify-content-between mb-4">
                                <h5 className="text-secondary mb-0 fw-semibold fs-6">ContactUs Details</h5>
                            </div> */}

                            <div className="row">
                                {[
                                    { label: "First name", value: contactUsDetails?.first_name },
                                    { label: "Last name", value: contactUsDetails?.last_name },
                                    { label: "Create Date", value: formatDate(contactUsDetails?.created_at, DateFormat?.DATE_FORMAT) },
                                    { label: "Service", value: contactUsDetails?.service },
                                    { label: "Description", value: contactUsDetails?.message },
                                ].map((item, index) => (

                                    <div key={index} className="col-md-4 mb-4">
                                        {
                                            item.label === "Image" ? (
                                                <LazyLoadImage
                                                    src={contactUsDetails?.profile_image || Constatnt?.DEFAULT_IMAGE}
                                                    alt="User Profile"
                                                    width={50}
                                                    height={50}
                                                    className="rounded-circle object-cover border"
                                                    style={{ objectFit: 'cover' }}
                                                />
                                            ) : <>
                                                <p className="mb-1 fs-4">{item.label}</p>
                                                <h6 className="fw-semibold mb-0 fs-5 text-capitalize">{item.value}</h6>
                                            </>

                                        }

                                    </div>
                                ))}
                            </div>
                            {/* </div> */}
                        </div>
                    </div>
                </div>

                {/* </div> */}
            </div >
        </>
    )
}

export default ContectDetails;
