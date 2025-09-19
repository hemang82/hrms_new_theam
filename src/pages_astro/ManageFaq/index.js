import React, { useEffect, useState } from 'react'
import Header from '../../layout/Header'
import { Link, useNavigate } from 'react-router-dom';
import Slidebar from '../../layout/Slidebar';
import { useDispatch, useSelector } from 'react-redux';
import { Codes, ModelName, PER_PAGE_DATA, PUBLIC_URL, SEARCH_DELAY } from '../../config/constant';
import useDebounce from '../hooks/useDebounce';
import { ExportToCSV, ExportToExcel, ExportToPdf, Language, SWIT_DELETE, SWIT_DELETE_SUCCESS, TOAST_ERROR, TOAST_SUCCESS } from '../../config/common';
import Pagination from '../../component/Pagination';
import { setLoader } from '../../Store/slices/MasterSlice';
import * as API from '../../utils/api.services';
import SubNavbar from '../../layout/SubNavbar';
import { useForm } from 'react-hook-form';
import Model from '../../component/Model';
import { closeModel, openModel } from '../../config/commonFunction';
import { DeleteComponent } from '../CommonPages/CommonComponent';

const ManageFaq = () => {

    let navigate = useNavigate();
    let dispatch = useDispatch();

    const { register, handleSubmit, setValue, clearErrors, reset, watch, control, formState: { errors } } = useForm();

    const { customModel } = useSelector((state) => state.masterslice);


    const [page, setPage] = useState(1);
    const [faqList, setFaqList] = useState([]);
    const [is_load, setis_load] = useState(false);
    const [faqModel, setFaqModel] = useState(null);
    const [selectedUser, setSelectedUser] = useState()

    useEffect(() => {
        // const handleContactUsListAPI = () => {
        dispatch(setLoader(true));
        // API.FAQList().then((response) => {
        //     if (response?.code === Codes.SUCCESS) {
        //         setFaqList(response.data)
        //     } else {
        //         setFaqList([])
        //     }
        // })
        dispatch(setLoader(false));
        // };
    }, [faqModel, is_load])

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handleStatusManage = async (data, newStatus) => {
        // dispatch(setLoader(true));
        // setis_flag(true)
        // let submitData = {
        //     faq_id: data?.id,
        //     is_active: newStatus,
        // }
        // API.editFaqs(submitData).then((response) => {
        //     if (response?.code === '1') {
        //         dispatch(setLoader(false));
        //         setis_flag(false)

        //     }
        // })
        // await dispatch(editContactUsDataApiCall(submitData));
        // await handleContactUsListAPI();
    }

    const handleDeleteManage = async (data) => {
        // SWIT_DELETE(`You won't be able to delete this!`).then(async result => {
        //     if (result?.isConfirmed) {
        //         dispatch(setLoader(true));
        //         setis_flag(true)

        //         let submitData = {
        //             faq_id: data?.id,
        //             is_delete: '1',
        //         }
        //         API.editFaqs(submitData).then((response) => {
        //             if (response?.code === '1') {
        //                 dispatch(setLoader(false));
        //                 setis_flag(false)
        //                 SWIT_DELETE_SUCCESS(`Contact deletion successful`);
        //             }
        //         })
        // await handleContactUsListAPI();

        // }
        // });
    }
    // console.log('faqList', faqList);

    const onSubmitData = (data) => {

        const sendRequest = {
            question: data.question_en,
            hi_question: data.question_hi,
            gu_question: data.question_gu,
            answer: data.answer_en,
            hi_answer: data.answer_hi,
            gu_answer: data.answer_gu
        }

        // API.AddFAQ(sendRequest).then((response) => {
        //     if (response?.code === Codes.SUCCESS) {
        //         TOAST_SUCCESS(response?.message);
        //         setFaqModel(false)
        //         reset()
        //         closeModel(dispatch)
        //     } else {
        //         TOAST_ERROR(response?.message)
        //     }
        // })
    }

    const handleDelete = (is_true) => {
        if (is_true) {
            setis_load(true)
            dispatch(setLoader(true));
            let submitData = {
                faqs_id: selectedUser?._id,
                is_delete: '1',
            }
            // API.DeleteFAQ(submitData).then((response) => {
            //     if (response.code === Codes?.SUCCESS) {
            //         setis_load(false)
            //         closeModel(dispatch)
            //         TOAST_SUCCESS(response?.message);
            //     }
            // });
            dispatch(setLoader(false))
        }
    };

    return (
        <>
            {/* <Slidebar />
            <div className="body-wrapper">
                <Header /> */}
            <div className="container-fluid mw-100">

                <SubNavbar title={"FAQ"} header={'FAQ'} />

                <div className="card card-body mb-4">
                    <div className="row">
                        <div className="col-md-4 col-xl-3">
                            {/* <form className="position-relative">
                                    <input type="text" className="form-control product-search ps-5" id="input-search" placeholder="Search Contacts..." />
                                    <i className="ti ti-search position-absolute top-50 start-0 translate-middle-y fs-6 text-dark ms-3" />
                                </form> */}
                        </div>
                        <div className="col-md-8 col-xl-9 text-end d-flex justify-content-md-end justify-content-center mt-3 mt-md-0">

                            {/* <div className="action-btn show-btn" style={{ display: 'none' }}>
                                        <a href="javascript:void(0)" className="delete-multiple btn-light-danger btn me-2 text-danger d-flex align-items-center font-medium">
                                            <i className="ti ti-trash text-danger me-1 fs-5" /> Delete All Row
                                        </a>
                                    </div> */}
                            <a id="btn-add-contact" className="btn btn-info d-flex align-items-center" onClick={() => { setFaqModel(true) }}>
                                Add FAQ
                            </a>
                        </div>
                    </div>
                </div>

                <div className="row justify-content-center mt-5">
                    <div className="col-lg-8">

                        <div className="text-center mb-7">
                            <h3 className="fw-semibold">Frequently asked questions</h3>
                            {/* <p className="fw-normal mb-0 fs-4">Get to know more about ready-to-use admin dashboard templates</p> */}
                        </div>

                        <div className="accordion accordion-flush mb-5 card position-relative overflow-hidden" id="accordionFlushExample">
                            {faqList?.faqList?.map((faq, index) => (
                                <div className="accordion-item" key={faq._id}>
                                    <h2 className="accordion-header d-flex" id={`flush-heading${index}`}>
                                        <button
                                            className="accordion-button collapsed fs-5 fw-semibold d-flex justify-content-between align-items-center"
                                            type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target={`#flush-collapse${index}`}
                                            aria-expanded="false"
                                            aria-controls={`flush-collapse${index}`}
                                        >
                                            <span>{faq.question}</span>
                                            {/* <span className="text-muted me-2"> | {faq.hi_question} | {faq.gu_question}</span> */}
                                        </button>

                                        <div className="action-btn me-4 mt-2">
                                            {/* <Link to={'/customer_list/customer_details'} state={faq} className="text-custom-theam edit cursor_pointer">
                                                    <i className="ti ti-eye fs-7 " />
                                                </Link> */}
                                            <a className="text-dark delete ms-2 cursor_pointer cursor_pointer" onClick={() => { openModel(dispatch, ModelName.DELETE_MODEL); setSelectedUser(faq) }}>
                                                <i className="ti ti-trash fs-7 text-danger" />
                                            </a>
                                        </div>
                                    </h2>
                                    <div id={`flush-collapse${index}`} className="accordion-collapse collapse" aria-labelledby={`flush-heading${index}`} data-bs-parent="#accordionFlushExample">
                                        <div className="accordion-body fw-normal">
                                            {faq.answer}
                                        </div>
                                        <hr className='m-1'></hr>
                                        <div className="accordion-body fw-normal">
                                            {faq.hi_answer}
                                        </div>
                                        <hr className='m-1'></hr>
                                        <div className="accordion-body fw-normal">
                                            {faq.gu_answer}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>

                {/* <div className="card bg-light-info rounded-2">
                        <div className="card-body text-center">
                            <div className="d-flex align-items-center justify-content-center mb-4 pt-8">
                                <a href="#">
                                    <img src="../../dist/images/profile/user-3.jpg" className="rounded-circle me-n2 card-hover border border-2 border-white" width={44} height={44} />
                                </a>
                                <a href="#">
                                    <img src="../../dist/images/profile/user-2.jpg" className="rounded-circle me-n2 card-hover border border-2 border-white" width={44} height={44} />
                                </a>
                                <a href="#">
                                    <img src="../../dist/images/profile/user-1.jpg" className="rounded-circle me-n2 card-hover border border-2 border-white" width={44} height={44} />
                                </a>
                            </div>
                            <h3 className="fw-semibold">Still have questions</h3>
                            <p className="fw-normal mb-4 fs-4">Can't find the answer your're looking for ? Please chat to our friendly team.</p>
                            <a href="javascript:void(0)" className="btn btn-primary mb-8">Chat with us</a>
                        </div>
                    </div> */}
                {/* </div>s */}
            </div>

            {/* {customModel.isOpen && customModel?.modalType === ModelName.FAQ_MODEL && (
                <Model>
                    <form onSubmit={handleSubmit(onSubmitData)}>
                        <div className="col-lg-12">
                            <div className="card-body p-4">
                                <div className='row d-flex gap-3'>
                                    <div className='col'>
                                        <div className="mb-4">
                                            <label htmlFor="question" className="form-label fw-semibold">Question<span className="text-danger ms-1">(English) *</span></label>
                                            <input type="text" className="form-control ps-2" placeholder="Enter question" {...register('question', { required: "Enter question" })} />
                                            <label className="errorc ps-1 pt-1">{errors.question?.message}</label>
                                        </div>
                                    </div>
                                    <div className='col'>
                                        <div className="mb-4">
                                            <label htmlFor="question_ar" className="form-label fw-semibold">Question<span className="text-danger ms-1">(Arabic) *</span></label>
                                            <input type="text" className="form-control ps-2" placeholder="Enter question" {...register('question_ar', { required: "Enter question" })} />
                                            <label className="errorc ps-1 pt-1">{errors.question_ar?.message}</label>
                                        </div>
                                    </div>
                                </div>

                                <div className='row d-flex gap-3'>
                                    <div className='col'>
                                        <div className="mb-4">
                                            <label htmlFor="answer" className="form-label fw-semibold">Answer<span className="text-danger ms-1">(English) *</span></label>
                                            <div className="input-group border rounded-1">
                                                <textarea
                                                    className="form-control p-7 ps-2"
                                                    placeholder="Enter Answer"
                                                    {...register('answer', { required: "Enter answer" })}
                                                ></textarea>
                                            </div>
                                            <label className="errorc ps-1 pt-1">{errors.answer?.message}</label>
                                        </div>
                                    </div>
                                    <div className='col'>
                                        <div className="mb-4">
                                            <label htmlFor="answer_ar" className="form-label fw-semibold">Answer<span className="text-danger ms-1">(Arabic) *</span></label>
                                            <div className="input-group border rounded-1">
                                                <textarea
                                                    className="form-control p-7 ps-2"
                                                    placeholder="Enter Answer"
                                                    {...register('answer_ar', { required: "Enter answer" })}
                                                ></textarea>
                                            </div>
                                            <label className="errorc ps-1 pt-1">{errors.answer_ar?.message}</label>
                                        </div>
                                    </div>
                                </div>

                                <div className="modal-footer justify-content-center">
                                    <button type="button" className="btn btn-danger" onClick={() => { closeModel(dispatch); reset(); }}>Cancel</button>
                                    <button type="submit" className="btn btn-primary">Submit</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </Model>
            )} */}

            <div className={`modal custom-modal  ${faqModel ? "fade show d-block " : "d-none"
                }`}
                id="addnotesmodal" tabIndex={-1} role="dialog" aria-labelledby="addnotesmodalTitle" aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-centered" role="document" >
                    <div className="modal-content border-0">
                        <div className="modal-header bg-primary " style={{ borderRadius: '10px 10px 0px 0px' }}>
                            <h6 className="modal-title text-white">Add Faq</h6>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" onClick={() => { setFaqModel(false) }} />
                        </div>

                        <div className="modal-body">
                            <form onSubmit={handleSubmit(onSubmitData)}>
                                <div className="col-lg-12">
                                    <div className="card-body p-4">
                                        <div className='row d-flex gap-3'>
                                            <div className='col'>
                                                <div className="mb-4">
                                                    <label htmlFor="question" className="form-label fw-semibold">Question<span className="text-danger ms-1">(English) *</span></label>
                                                    <input type="text" className="form-control ps-2" placeholder="Enter english question" {...register('question_en', { required: "Enter english question" })} />
                                                    <label className="errorc ps-1 pt-1">{errors.question_en?.message}</label>
                                                </div>
                                            </div>


                                            <div className='col'>
                                                <div className="mb-4">
                                                    <label htmlFor="question_ar" className="form-label fw-semibold">Question<span className="text-danger ms-1">(Hindi) *</span></label>
                                                    <input type="text" className="form-control ps-2" placeholder="Enter hindi question" {...register('question_hi', { required: "Enter hindi question" })} />
                                                    <label className="errorc ps-1 pt-1">{errors.question_hi?.message}</label>
                                                </div>
                                            </div>
                                            <div className='col'>
                                                <div className="mb-4">
                                                    <label htmlFor="question_ar" className="form-label fw-semibold">Question<span className="text-danger ms-1">(Gujarati) *</span></label>
                                                    <input type="text" className="form-control ps-2" placeholder="Enter gujrati question" {...register('question_gu', { required: "Enter gujrati question" })} />
                                                    <label className="errorc ps-1 pt-1">{errors.question_gu?.message}</label>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='row d-flex gap-3'>
                                            <div className='col'>
                                                <div className="mb-4">
                                                    <label htmlFor="answer" className="form-label fw-semibold">Answer<span className="text-danger ms-1">(English) *</span></label>
                                                    <div className="input-group border rounded-1">
                                                        <textarea
                                                            className="form-control p-7 ps-2"
                                                            placeholder="Enter english answer"
                                                            {...register('answer_en', { required: "Enter english answer" })}
                                                        ></textarea>
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">{errors.answer_en?.message}</label>
                                                </div>
                                            </div>
                                            <div className='col'>
                                                <div className="mb-4">
                                                    <label htmlFor="answer_ar" className="form-label fw-semibold">Answer<span className="text-danger ms-1">(Hindi) *</span></label>
                                                    <div className="input-group border rounded-1">
                                                        <textarea
                                                            className="form-control p-7 ps-2"
                                                            placeholder="Enter hindi answer"
                                                            {...register('answer_hi', { required: "Enter answer" })}
                                                        ></textarea>
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">{errors.answer_hi?.message}</label>
                                                </div>
                                            </div>
                                            <div className='col'>
                                                <div className="mb-4">
                                                    <label htmlFor="answer_ar" className="form-label fw-semibold">Answer<span className="text-danger ms-1">(Gujarati) *</span></label>
                                                    <div className="input-group border rounded-1">
                                                        <textarea
                                                            className="form-control p-7 ps-2"
                                                            placeholder="Enter gujrati answer"
                                                            {...register('answer_gu', { required: "Enter gujrati answer" })}
                                                        ></textarea>
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">{errors.answer_gu?.message}</label>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="modal-footer justify-content-center">
                                            <button type="button" className="btn btn-danger" onClick={() => { closeModel(dispatch); reset(); }}>Cancel</button>
                                            <button type="submit" className="btn btn-primary">Submit</button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div >
            {
                faqModel && (
                    <div className="modal-backdrop fade show"></div>
                )
            }

            {
                customModel.isOpen && customModel?.modalType === ModelName.DELETE_MODEL && (
                    <Model>
                        <DeleteComponent onConfirm={handleDelete} />
                    </Model >
                )
            }
        </>
    )
}

export default ManageFaq
