import React, { useCallback, useEffect, useState } from 'react'
import Header from '../../layout/Header'
import Slidebar from '../../layout/Slidebar'
import Constatnt, { Codes, PUBLIC_URL } from '../../config/constant'
import SubNavbar from '../../layout/SubNavbar'
import { useForm } from 'react-hook-form'
import { selectOption } from '../../config/commonFunction'
import { TOAST_ERROR, TOAST_SUCCESS } from '../../config/common'
import { useLocation, useNavigate } from 'react-router-dom'
import Multiselect from "multiselect-react-dropdown";

const Notification = () => {


    const { register, handleSubmit, setValue, clearErrors, reset, watch, control, formState: { errors } } = useForm();
    var userData = JSON.parse(localStorage.getItem(Constatnt.AUTH_KEY));
    const navigation = useNavigate();
    const location = useLocation();
    var notificationData = location?.state;

    const [keyword, setKeyWord] = useState([]);
    const [userList, setUserList] = useState([]);

    const browserOptions = [
        {
            value: '', label: 'Select Type'
        },
        { value: 'all', label: 'All' },
        { value: 'spacificuser', label: 'Specific User' },
    ];

    console.log('keyword :', keyword);

    const handelList = async () => {
        // getNotificationUserList().then((response) => {
        //     console.log('response :', response);
        //     if (response?.code === Codes?.SUCCESS) {
        //         const updatedList = [
        //             {
        //                 "_id": "all",
        //                 "first_name": "All",
        //                 "last_name": "All",
        //                 "user_name": "All user",
        //                 "is_active": 1,
        //                 "is_delete": 0,
        //             },
        //             ...response?.data?.notificationList
        //         ];
        //         setKeyWord(updatedList);
        //         setUserList(response?.data?.notificationList)
        //         // setKeyWord(response?.data?.notificationList)
        //     } else {
        //         setKeyWord([])
        //     }
        // })
    }

    useEffect(() => {

        if (notificationData) {
            reset({
                subject_en: notificationData.title,
                subject_ar: notificationData.ar_title,
                message_en: notificationData.message,
                message_ar: notificationData.ar_message,
            })
        }
        handelList()
    }, [notificationData]);

    const submitNotification = (data) => {
        console.log('data :', data);
        var userListData = [];
        data.keywords.forEach((value) => {
            if (value === 'all') {
                userListData = userList.map(user => user._id);
            } else {
                userListData = data.keywords;
            }
        });

        console.log('userListData :', userListData);

        let insertData = {
            selectUserListData: userListData,
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

    const handleSelect = useCallback(
        (selectedList, selectedItem) => {
            console.log('selectedItem :', selectedItem);
            console.log('selectedList :', selectedList);

            if (selectedItem._id === 'all') {
                setKeyWord([]);
            }
            else {
                setKeyWord(keyword);
                // if (selectedList.length > 0) { // Assuming selectedIds is an array holding your selected IDs
                //     setKeyWord(keyword.filter((item) => item._id !== 'all'));
                // } else {
                //     // You can choose to keep the existing keywords or handle as needed
                //     setKeyWord(keyword); // This will keep the current state unchanged
                // }
            }

            let ids = selectedList.map((item) => item._id);
            let names = selectedList.map((item) => item.user_name);

            setValue("keywords", ids);
            setValue("keyword_names", names);
        },
        [setValue, keyword] // Make sure 'keyword' is included in the dependency array
    );

    const handleRemove = useCallback(
        (selectedList, selectedItem) => {

            console.log('selectedList :', selectedList);
            console.log('selectedItem :', selectedItem);

            if (selectedItem._id === 'all') {
                handelList()
            }

            let ids = selectedList.map((item) => item._id);
            let names = selectedList.map((item) => item.user_name);

            // Remove special "all" values if not all items are selected anymore
            if (selectedList.length !== keyword.length) {
                ids = ids.filter((id) => id !== "all");
                names = names.filter((name) => name !== "All Users");
            }

            setValue("keywords", ids);
            setValue("keyword_names", names);
        },
        [setValue, keyword] // Ensure 'keyword' is available and part of dependencies
    );

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
                                            <div className='col-md-8'>

                                                <div className="">
                                                    <label htmlFor="lastname" className="form-label fw-semibold">
                                                        Select user name  <span className="text-danger ms-1"></span>
                                                    </label>
                                                    <div className="input-group  rounded-1">
                                                        <div className="select2-with-icons form-control p-1 border-none">
                                                            <Multiselect
                                                                name="keywords"
                                                                options={keyword}
                                                                // selectedValues={selectedOptions} // Pre-selected value to persist in dropdown
                                                                onSelect={handleSelect}
                                                                onRemove={handleRemove} // Function to call on remove
                                                                displayValue="user_name" // Property name to display in the dropdown
                                                                placeholder={'Select user'} // Placeholder text for the dropdown
                                                            // disable={keyword.length <= 0}
                                                            />
                                                        </div>
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors.keywords && (
                                                            <span className="text-danger fs-12px ">
                                                                {errors.keywords.message}
                                                            </span>
                                                        )}
                                                    </label>
                                                </div>
                                            </div>
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

                                            <div className="modal-footer justify-content-center mb-3">
                                                <button type='button' className="btn btn-danger m-2" onClick={() => { reset() }}>Cancel</button>
                                                <button type='submit' className="btn btn-primary" >Submit</button>
                                            </div>

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
