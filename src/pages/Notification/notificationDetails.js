import React, { useEffect, useState } from 'react'
import Header from '../../layout/Header'
import Slidebar from '../../layout/Slidebar'
import Constatnt, { Codes, PUBLIC_URL } from '../../config/constant'
import { addNotification, notificationList } from '../../utils/api.services'
import SubNavbar from '../../layout/SubNavbar'
import { useForm } from 'react-hook-form'
import { selectOption } from '../../config/commonFunction'
import { TOAST_ERROR, TOAST_SUCCESS } from '../../config/common'
import { useLocation, useNavigate } from 'react-router-dom'


const Notification = () => {


    const { register, handleSubmit, setValue, clearErrors, reset, watch, control, formState: { errors } } = useForm();
    var userData = JSON.parse(localStorage.getItem(Constatnt.AUTH_KEY));
    const navigation = useNavigate();
    const location = useLocation();
    var notificationData = location?.state;

    const [notification, setNotification] = useState([]);
    const browserOptions = [
        {
            value: '', label: 'Select Type'
        },
        { value: 'all', label: 'All' },
        { value: 'spacificuser', label: 'Specific User' },
    ];

    useEffect(() => {
        if (notificationData) {
            reset({
                subject_en: notificationData.title,
                subject_ar: notificationData.ar_title,
                message_en: notificationData.message,
                message_ar: notificationData.ar_message,
            })
        }
    }, [notificationData]);

    const submitNotification = (data) => {
        let insertData = {
            sender_id: userData._id,
            receiver_id: data.selected_id,
            receiver_type: 'user',
            sender_type: 'admin',
            title: data.subject_en,
            ar_title: data.subject_ar,
            message: data.message_en,
            ar_message: data.message_ar,
            notification_tag: 'admin'
        }

        addNotification(insertData).then((response) => {
            console.log('response :', response);
            if (response.code === Codes.SUCCESS) {
                TOAST_SUCCESS(response.message);
                reset();
                navigation(`/notification_list`)
            } else {
                TOAST_ERROR(response.message)
            }
        })
    }

    return (
        <>
            {/* <Slidebar />
            <div className="body-wrapper">
                <Header /> */}

            <div className="container-fluid mw-100">
                <SubNavbar title={'Notification Details'} header={'Notification List'} subHeaderOnlyView={'Notification Details'} />
                <div className="row m-2">
                    <div className="col-12 justify-content-center">
                        <div className='row justify-content-center '>
                            <form onSubmit={handleSubmit(submitNotification)}>
                                <div className="card" >
                                    <div className="card-body">
                                        {/* <div className="px-4 py-3 border-bottom mb-3">
                                            <h5 className="card-title fw-semibold mb-0">
                                                Product Details
                                            </h5>
                                        </div> */}
                                        <div className='row g-3'>
                                            <div className='col-md-6'>

                                                {/* <div className="mb-4">
                                                    <label htmlFor="category" className="form-label fw-semibold">
                                                        Category <span className="text-danger"> *</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <select
                                                            className="select2-with-icons form-control"
                                                            id="category"
                                                            style={{ width: '100%', height: '36px' }}
                                                        >
                                                            {selectOption(browserOptions)}
                                                        </select>
                                                    </div>
                                                </div> */}

                                                {/* <div className="mb-4">
                                                        <label htmlFor="lastname" className="form-label fw-semibold">
                                                            Category Name <span className="text-danger ms-1"> (English) *</span>
                                                        </label>
                                                        <div className="input-group border rounded-1">
                                                            <input
                                                                type="text"
                                                                className="form-control ps-2"
                                                                placeholder="Enter product name"
                                                                // onKeyPress={allowLettersAndSpaces}
                                                                autoComplete='nope'
                                                                {...register('product_name', { required: "Enter product name" })}
                                                            />
                                                        </div>
                                                        <label className="errorc ps-1 pt-1">
                                                            {errors.product_name?.message}
                                                        </label>
                                                    </div> */}

                                                {/* <div className="mb-4">
                                                    <label htmlFor="category" className="form-label fw-semibold">
                                                        {Constatnt.APP_NAME}
                                                        Send Type <span className="text-danger ms-1"> (English)  *</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <select
                                                            className="select2-with-icons form-control p-1"
                                                            id="category"
                                                            style={{ width: '100%', height: '36px' }}
                                                        >
                                                            {selectOption(browserOptions)}
                                                        </select>
                                                    </div>
                                                </div> */}
                                                <div className="mb-4">
                                                    <label htmlFor="lastname" className="form-label fw-semibold">
                                                        Subject <span className="text-danger ms-1"> (English) *</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <input
                                                            type="text"
                                                            className="form-control ps-2"
                                                            placeholder="Enter subject english"
                                                            // onKeyPress={allowLettersAndSpaces}
                                                            autoComplete='nope'
                                                            {...register('subject_en', { required: "Enter subject english" })}
                                                        />
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors.subject_en?.message}
                                                    </label>
                                                </div>

                                                <div className="mb-4">
                                                    <label htmlFor="message_en" className="form-label fw-semibold">
                                                        Message <span className="text-danger ms-1"> (English) *</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <textarea
                                                            className="form-control ps-2"
                                                            placeholder="Enter message english"
                                                            autoComplete='nope'
                                                            rows="4"  // You can adjust the rows value to change the height
                                                            {...register('message_en', { required: "Enter message english" })}
                                                        />
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors.message_en?.message}
                                                    </label>
                                                </div>

                                            </div>

                                            <div className='col-md-6'>

                                                {/* <div className="mb-4">
                                                        <label htmlFor="product_name" className="form-label fw-semibold">
                                                            Category Name <span className="text-danger ms-1"> (Arabic) *</span>
                                                        </label>
                                                        <div className="input-group border rounded-1">
                                                            <input
                                                                type="text"
                                                                className="form-control ps-2"
                                                                placeholder="Enter product name"
                                                                autoComplete='nope'
                                                                {...register('product_name', { required: "Enter product name" })}
                                                            />
                                                        </div>
                                                        <label className="errorc ps-1 pt-1">
                                                            {errors.product_name?.message}
                                                        </label>
                                                    </div> */}

                                                {/* <div className="mb-4">
                                                    <label htmlFor="category" className="form-label fw-semibold">
                                                        Send Type <span className="text-danger ms-1"> (Arabic) *</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <select
                                                            className="select2-with-icons form-control p-1"
                                                            id="category"
                                                            style={{ width: '100%', height: '36px' }}
                                                        >
                                                            {selectOption(browserOptions)}
                                                        </select>
                                                    </div>
                                                </div> */}

                                                <div className="mb-4">
                                                    <label htmlFor="product_name" className="form-label fw-semibold">
                                                        Subject <span className="text-danger ms-1"> (Arabic) *</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <input
                                                            type="text"
                                                            className="form-control ps-2"
                                                            placeholder="Enter subject arabic"
                                                            autoComplete='nope'
                                                            {...register('subject_ar', { required: "Enter subject arabic" })}
                                                        />
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors.subject_ar?.message}
                                                    </label>
                                                </div>

                                                <div className="mb-4">
                                                    <label htmlFor="message_ar" className="form-label fw-semibold">
                                                        Message <span className="text-danger ms-1"> (Arabic) *</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <textarea
                                                            className="form-control ps-2"
                                                            placeholder="Enter message arabic"
                                                            autoComplete='nope'
                                                            rows="4"  // You can adjust the rows value for height
                                                            {...register('message_ar', { required: "Enter message arabic" })}
                                                        />
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors.message_ar?.message}
                                                    </label>
                                                </div>

                                            </div>

                                            {/* <div className="modal-footer justify-content-center mb-3">
                                                <button type='button' className="btn btn-danger m-2" onClick={() => { reset() }}>Cancel</button>
                                                <button type='submit' className="btn btn-primary" >Submit</button>
                                            </div> */}

                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    {/* </div> */}
                </div >
            </div >

        </>
    )
}

export default Notification
