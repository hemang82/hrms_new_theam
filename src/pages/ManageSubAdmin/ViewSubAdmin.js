import React, { useEffect, useState } from 'react'
import Header from '../../layout/Header';
import Slidebar from '../../layout/Slidebar';
import { subAdminRole, userDetails } from '../../utils/api.services';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import SubNavbar from '../../layout/SubNavbar';
import { setLoader } from '../../Store/slices/MasterSlice';
import profile_image from '../../assets/Images/default.jpg'
import { Codes, PUBLIC_URL } from '../../config/constant';

const ViewSubAdmin = () => {
    const navigat = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const [userData, setUserData] = useState(location?.state);
    const [userPermition, setUserPermition] = useState(null);
    console.log('userDetails  userPermition:', userPermition);
    const [userRole, setUserRole] = useState(location?.state);
    console.log('userDetials userRole :', userRole);

    useEffect(() => {
        subAdminRole().then((response) => {
            if (response?.code === Codes?.SUCCESS) {
                setUserRole(response?.data)
            }
        })
        getPermitions()
    }, [])

    const getPermitions = async () => {
        dispatch(setLoader(true));

        const { code, data } = await userDetails({ user_id: userData?._id });
        if (code === Codes.SUCCESS) {
            setUserPermition(data?.permission)
            setUserData(data)
        }
        dispatch(setLoader(false));
    }

    return (
        <>
            <Slidebar />
            <div className="body-wrapper">
                <Header />
                {/* --------------------------------------------------- */}
                {/* Header End */}
                {/* --------------------------------------------------- */}

                <div className="container-fluid mw-100">
                    <SubNavbar title={'Sub Admin Details'} header={'Sub Admin List'} subHeaderOnlyView={'Sub Admin Details'} />

                    <ul className="nav nav-pills user-profile-tab justify-content-end mt-2 border border-2 rounded-2 mb-3" id="pills-tab" role="tablist">
                        <li className="nav-item" role="presentation">
                            <button className="nav-link position-relative rounded-0 active d-flex align-items-center justify-content-center bg-transparent fs-3 py-6" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="true">
                                <i className="ti ti-user-circle me-2 fs-6" />
                                <span className="d-none d-md-block">Sub Admin Details</span>
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button className="nav-link position-relative rounded-0 d-flex align-items-center justify-content-center bg-transparent fs-3 py-6" id="pills-followers-tab" data-bs-toggle="pill" data-bs-target="#pills-followers" type="button" role="tab" aria-controls="pills-followers" aria-selected="false">
                                <i className="ti ti-user-circle me-2 fs-6" />
                                <span className="d-none d-md-block">Sub Admin Permition</span>
                            </button>
                        </li>

                        {/* <li className="nav-item" role="presentation">
            <button className="nav-link position-relative rounded-0 d-flex align-items-center justify-content-center bg-transparent fs-3 py-6" id="pills-friends-tab" data-bs-toggle="pill" data-bs-target="#pills-friends" type="button" role="tab" aria-controls="pills-friends" aria-selected="false">
                <i className="ti ti-user-circle me-2 fs-6" />
                <span className="d-none d-md-block">Friends</span>
            </button>
        </li>
        <li className="nav-item" role="presentation">
            <button className="nav-link position-relative rounded-0 d-flex align-items-center justify-content-center bg-transparent fs-3 py-6" id="pills-gallery-tab" data-bs-toggle="pill" data-bs-target="#pills-gallery" type="button" role="tab" aria-controls="pills-gallery" aria-selected="false">
                <i className="ti ti-photo-plus me-2 fs-6" />
                <span className="d-none d-md-block">Gallery</span>
            </button>
        </li> */}
                    </ul>

                    <div className="tab-content" id="pills-tabContent">

                        <div className="tab-pane fade show active" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab" tabIndex={1}>

                            <div className="card overflow-hidden chat-application">
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
                                                        <div className="p-9 py-3 border-bottom chat-meta-user d-flex align-items-center justify-content-between mb-3">
                                                            <h5 className="text-dark mb-0 fw-semibold">Sub Admin Details</h5>
                                                            <ul className="list-unstyled mb-0 d-flex align-items-center">
                                                                {/* <div className="px-9 pt-4 pb-3">
                                            <button className="btn btn-primary fw-semibold py-8 w-100">Edit Profile</button>
                                        </div> */}
                                                            </ul>
                                                        </div>

                                                        <div className="position-relative overflow-hidden">
                                                            <div className="position-relative">
                                                                <div className="chat-box p-9" style={{ height: 'calc(100vh - 100px)' }} data-simplebar>
                                                                    <div className="chat-list chat active-chat" data-user-id={1}>
                                                                        <div className="hstack align-items-start mb-7 pb-1 align-items-center justify-content-between">
                                                                            <div className="d-flex align-items-center gap-3">
                                                                                <img src={profile_image} alt="user4" width={72} height={72} className="rounded-circle" />
                                                                                <div>
                                                                                    <h6 className="fw-semibold fs-4 mb-0">{userData?.firstname + ' ' + userData?.lastname}</h6>
                                                                                    <p className="mb-0">{userData?.role === 1 ? 'Admin' : 'Sub Admin'}</p>
                                                                                    {/* <p className="mb-0">Digital Arc Pvt. Ltd.</p> */}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="row">

                                                                            <div className="col-4 mb-7">
                                                                                <p className="mb-1 fs-2">First name</p>
                                                                                <h6 className="fw-semibold mb-0 ">{userData?.firstname || '-'}</h6>
                                                                            </div>
                                                                            <div className="col-8 mb-7">
                                                                                <p className="mb-1 fs-2">Last name</p>
                                                                                <h6 className="fw-semibold mb-0">{userData?.lastname || '-'}</h6>
                                                                            </div>
                                                                            <div className="col-4 mb-7">
                                                                                <p className="mb-1 fs-2">Phone number</p>
                                                                                <h6 className="fw-semibold mb-0">{userData?.country_code}  {userData?.mobile_number || '-'}</h6>

                                                                            </div>
                                                                            <div className="col-8 mb-7">
                                                                                <p className="mb-1 fs-2">Email address</p>
                                                                                <h6 className="fw-semibold mb-0">{userData?.email || '-'}</h6>
                                                                            </div>
                                                                            <div className="col-12 mb-9">
                                                                                <p className="mb-1 fs-2">Address</p>
                                                                                <h6 className="fw-semibold mb-0">312, Imperical Arc, New western corner</h6>
                                                                            </div>
                                                                            {/* <div className="col-4 mb-7">
                                                                <p className="mb-1 fs-2">City</p>
                                                                <h6 className="fw-semibold mb-0">New York</h6>
                                                            </div>
                                                            <div className="col-8 mb-7">
                                                                <p className="mb-1 fs-2">Country</p>
                                                                <h6 className="fw-semibold mb-0">United Stats</h6>
                                                            </div> */}
                                                                        </div>
                                                                        {/* <div className="border-bottom pb-7 mb-4">
                                                            <p className="mb-2 fs-2">Notes</p>
                                                            <p className="mb-3 text-dark">
                                                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque bibendum
                                                                hendrerit lobortis. Nullam ut lacus eros. Sed at luctus urna, eu fermentum diam.
                                                                In et tristique mauris.
                                                            </p>
                                                            <p className="mb-0 text-dark">Ut id ornare metus, sed auctor enim. Pellentesque nisi magna, laoreet a augue eget, tempor volutpat diam.</p>
                                                        </div> */}
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
                        </div>

                        <div className="tab-pane fade" id="pills-followers" role="tabpanel" aria-labelledby="pills-followers-tab" tabIndex={0}>


                            <div className="card overflow-hidden chat-application">
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
                                                        <div className="p-9 py-3 border-bottom chat-meta-user d-flex align-items-center justify-content-between mb-3">
                                                            <h5 className="text-dark mb-0 fw-semibold">Sub Admin Permitions</h5>
                                                            <ul className="list-unstyled mb-0 d-flex align-items-center">
                                                                {/* <div className="px-9 pt-4 pb-3">
                                            <button className="btn btn-primary fw-semibold py-8 w-100">Edit Profile</button>
                                        </div> */}

                                                                {/* <li className="nav-item ms-auto">
                                                    <a className="btn btn-primary d-flex align-items-center px-3" id="add-notes" onClick={() => { setProfileModel(true) }}>
                                                        <i className="ti  me-0 me-md-1 fs-4" />
                                                        <span className="d-none d-md-block font-weight-medium fs-3" >Change Password</span>
                                                    </a>
                                                </li> */}

                                                            </ul>
                                                        </div>

                                                        <div className="position-relative overflow-hidden">
                                                            <div className="position-relative">
                                                                <div className="chat-box p-9" style={{ height: 'calc(100vh - 100px)' }} data-simplebar>
                                                                    <div className="chat-list chat active-chat" data-user-id={1}>

                                                                        <div className="col-lg-8">

                                                                            {userPermition && userPermition.map((value, index) => (
                                                                                <div key={index} className='row mb-3'>
                                                                                    <div className='col-md-2 d-flex align-items-center'>
                                                                                        <h6 className=' text-capitalize'>
                                                                                            {/* {value?.role_name} */}
                                                                                            {userRole.find(item => { return item._id === value.role_id })?.name || ""}
                                                                                            {/* {console.log('userDetials userRole', userRole.find(item => { return item._id === value.role_id })?.name) || ""} */}
                                                                                        </h6>
                                                                                    </div>

                                                                                    <div className='col-md-9 d-flex align-items-center'>
                                                                                        <div className='form-check-inline form-check form-check-danger pe-3'>
                                                                                            <input
                                                                                                className='form-check-input rounded-circle permition-btn'
                                                                                                type='checkbox'
                                                                                                value='List'
                                                                                                checked={value.is_all === "1"}
                                                                                            />
                                                                                            <label className='form-check-label permition-label ms-"1"'>
                                                                                                All
                                                                                            </label>
                                                                                        </div>

                                                                                        <div className='form-check-inline form-check form-check-danger pe-3'>
                                                                                            <input
                                                                                                className='form-check-input rounded-circle permition-btn'
                                                                                                type='checkbox'
                                                                                                value='Add'
                                                                                                checked={value.is_add === "1"}
                                                                                            />
                                                                                            <label className='form-check-label permition-label ms-"1"'>
                                                                                                Add
                                                                                            </label>
                                                                                        </div>

                                                                                        <div className='form-check-inline form-check form-check-danger pe-3'>
                                                                                            <input
                                                                                                className='form-check-input rounded-circle permition-btn'
                                                                                                type='checkbox'
                                                                                                value='Update'
                                                                                                checked={value.is_edit === "1"}
                                                                                            />
                                                                                            <label className='form-check-label permition-label ms-"1"'>
                                                                                                Update
                                                                                            </label>
                                                                                        </div>

                                                                                        <div className='form-check-inline form-check form-check-danger pe-3'>
                                                                                            <input
                                                                                                className='form-check-input rounded-circle permition-btn'
                                                                                                type='checkbox'
                                                                                                value='Delete'
                                                                                                checked={value.is_delete === "1"}
                                                                                            />
                                                                                            <label className='form-check-label permition-label ms-"1"'>
                                                                                                Delete
                                                                                            </label>
                                                                                        </div>

                                                                                        <div className='form-check-inline form-check form-check-danger'>
                                                                                            <input
                                                                                                className='form-check-input rounded-circle permition-btn'
                                                                                                type='checkbox'
                                                                                                value='View'
                                                                                                checked={value.is_view === "1"}
                                                                                            />
                                                                                            <label className='form-check-label permition-label ms-1'>
                                                                                                View
                                                                                            </label>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            ))}
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
                        </div>
                        <div className="tab-pane fade" id="pills-friends" role="tabpanel" aria-labelledby="pills-friends-tab" tabIndex={0}>
                            <h1>3</h1>
                        </div>
                        <div className="tab-pane fade" id="pills-gallery" role="tabpanel" aria-labelledby="pills-gallery-tab" tabIndex={0}>
                            <h1>4</h1>
                        </div>
                    </div>


                </div>
            </div >
        </>
    )
}

export default ViewSubAdmin;
