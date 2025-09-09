import React, { useState } from 'react'
import Header from '../../layout/Header'
import Slidebar from '../../layout/Slidebar'
import { PASSWORD_VALIDATION, SWIT_DELETE, SWIT_DELETE_SUCCESS, TOAST_ERROR, TOAST_SUCCESS, allowLettersAndSpaces } from '../../config/common'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import SubNavbar from '../../layout/SubNavbar'
import profile_image from '../../assets/Images/default.jpg'
import Footer from '../../layout/Footer'
import * as API from '../../utils/api.services'
import { handelInputText, textValidation } from '../../config/commonFunction'
import { InputTypesEnum } from '../../config/commonVariable'
import { Codes } from '../../config/constant'
import { useDispatch } from 'react-redux'
import { setLoader } from '../../Store/slices/MasterSlice'


const ChangePassword = () => {

    let navigation = useNavigate()
    const dispatch = useDispatch()
    const { register, handleSubmit, reset, formState, formState: { errors }, watch } = useForm();
    const [oldPassVisible, setOldPassVisible] = useState(false);
    const [newPassVisible, setNewPassVisible] = useState(false);
    const [confPassVisible, setConfPassVisible] = useState(false);


    const onSubmitData = async (data) => {
        // SWIT_DELETE(`You won't be able to update!`, `Yes, update it!`).then(async (result) => {
        //     if (result.isConfirmed) {
        dispatch(setLoader(true))
        let request = {
            oldpassword: data?.old_password,
            newpassword: data?.new_password
        }
        API.ChangePassword(request).then((response) => {
            if (response?.code === Codes.SUCCESS) {
                TOAST_SUCCESS(response?.message);
                navigation('/')
                reset()
            } else {
                TOAST_ERROR(response?.message)
            }

            //     })
            // }
        });
        dispatch(setLoader(false))
    };

    return (
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

            <form method='post' onSubmit={handleSubmit(onSubmitData)}>
                <div className="d-flex w-100">

                    <div className="d-flex w-100">

                        <div className="w-100">
                            <div className="chat-container h-100 w-100">
                                <div className="chat-box-inner-part h-100">
                                    <div className="chatting-box app-email-chatting-box">

                                        <div className="p-9 py-3 border-bottom chat-meta-user d-flex align-items-center justify-content-between">
                                            <h5 className="text-dark mb-0 fw-semibold">Change Password</h5>
                                            <ul className="list-unstyled mb-0 d-flex align-items-center">
                                            </ul>
                                        </div>

                                        <div className="position-relative overflow-hidden">
                                            <div className="position-relative">
                                                <div className="chat-box p-9" style={{ height: 'calc(100vh - 150px)' }} data-simplebar>
                                                    <div className="chat-list chat active-chat" data-user-id={1}>

                                                        <div className="col-lg-6">
                                                            <div className="card">

                                                                <div className="card-body p-4 border-bottom">
                                                                    <div className="mb-4 row align-items-center">
                                                                        <label htmlFor="exampleInputPassword1" className="form-label fw-semibold col-sm-3 col-form-label text-nowrap">Old password<spna className="text-danger"> *</spna></label>

                                                                        {/* <label htmlFor="exampleInputPassword1" className="form-label fw-semibold col-sm-3 col-form-label">Old password<spna className="text-danger"> *</spna></label> */}

                                                                        <div className="col-sm-9">
                                                                            <div className="input-group border rounded-1">
                                                                                <input type={oldPassVisible ? "text" : "password"} className="form-control border-0" id="inputPassword" placeholder="Enter old password" onChange={handelInputText}  {...register(InputTypesEnum.OLDPASSWORD, textValidation(InputTypesEnum.OLDPASSWORD))} />
                                                                                <span className="input-group-text bg-transparent px-6 border-0" id="basic-addon1">
                                                                                    <i className={`${oldPassVisible ? 'ti ti-eye' : 'ti ti-eye-off'}  fs-6 cursor_pointer`} onClick={() => { setOldPassVisible(!oldPassVisible) }} />
                                                                                </span>
                                                                            </div>
                                                                            <label className="errorc pt-1">{errors.old_password?.message}</label>
                                                                        </div>
                                                                    </div>

                                                                    <div className="mb-4 row align-items-center">
                                                                        <label htmlFor="exampleInputPassword1" className="form-label fw-semibold col-sm-3 col-form-label text-nowrap">New password<spna className="text-danger"> *</spna></label>
                                                                        <div className="col-sm-9">
                                                                            <div className="input-group border rounded-1">
                                                                                <input type={newPassVisible ? "text" : "password"} className="form-control border-0" id="inputPassword" placeholder="Enter new password" onChange={handelInputText} {...register(InputTypesEnum.NEWPASSWORD, textValidation(InputTypesEnum.NEWPASSWORD))} />
                                                                                <span className="input-group-text bg-transparent px-6 border-0" id="basic-addon1">
                                                                                    <i className={`${newPassVisible ? 'ti ti-eye' : 'ti ti-eye-off'}  fs-6 cursor_pointer`} onClick={() => { setNewPassVisible(!newPassVisible) }} />
                                                                                </span>
                                                                            </div>
                                                                            <label className="errorc pt-1">{errors.new_password?.message}</label>
                                                                        </div>
                                                                    </div>

                                                                    <div className="mb-4 row align-items-center">
                                                                        <label htmlFor="confirmPassword" className="form-label fw-semibold col-sm-3 col-form-label text-inline  ">
                                                                            Confirm
                                                                            password
                                                                            <spna className="text-danger"> *</spna>
                                                                        </label>

                                                                        <div className="col-sm-9">
                                                                            <div className="input-group border rounded-1">
                                                                                <input type={confPassVisible ? "text" : "password"} className="form-control border-0" id="inputPassword"
                                                                                    placeholder="Enter confirm password" onChange={handelInputText} {...register(InputTypesEnum.CONFIRM_PASSWORD, textValidation(InputTypesEnum.CONFIRM_PASSWORD, watch(InputTypesEnum.NEWPASSWORD)))} />
                                                                                <span className="input-group-text bg-transparent px-6 border-0" id="basic-addon1">
                                                                                    <i className={`${confPassVisible ? 'ti ti-eye' : 'ti ti-eye-off'}  fs-6 cursor_pointer`} onClick={() => { setConfPassVisible(!confPassVisible) }} />
                                                                                </span>
                                                                            </div>
                                                                            <label className="errorc pt-1 ">{errors.confirm_password?.message}</label>
                                                                        </div>
                                                                    </div>

                                                                    <div className="modal-footer justify-content-center m-3 mt-">
                                                                        <button type='button' className="btn btn-danger m-2" onClick={() => { reset() }}>Cancel</button>
                                                                        <button id="btn-n-add" className="btn btn-primary" >Submit</button>
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
                        </div>
                    </div>

                    <div className="offcanvas offcanvas-start user-chat-box" tabIndex={-1} id="chat-sidebar" aria-labelledby="offcanvasExampleLabel">

                    </div>
                </div>

            </form>
        </div>
    )
}

export default ChangePassword
