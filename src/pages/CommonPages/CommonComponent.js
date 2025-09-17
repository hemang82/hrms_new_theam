import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Codes, ModelName, PUBLIC_URL, SEARCH_DELAY } from '../../config/constant'
import { closeModel, openModel } from '../../config/commonFunction'
import { useNavigate } from 'react-router-dom'
import { TOAST_ERROR, TOAST_SUCCESS } from '../../config/common'
import Model from '../../component/Model'
import useDebounce from '../../pages_astro/hooks/useDebounce'
import { LuLogOut } from 'react-icons/lu'
// import useDebounce from '../hooks/useDebounce'

export const PostComponent = ({ postDetails, customerDetails, is_load, setis_load, postModel, setPostModel }) => {
    console.log('postDetails--- :', postDetails);
    const { customModel } = useSelector((state) => state.masterslice);
    const [selectedPost, setSelectedPost] = useState()
    const [perPage, setPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const debounce = useDebounce(globalFilterValue, SEARCH_DELAY);
    const [likeList, setLikeList] = useState();
    const [commentlist, setCommentList] = useState();
    const [visibleReplies, setVisibleReplies] = useState({});

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handelPostDelete = () => {
        const insertData = {
            post_id: selectedPost?._id,
            is_delete: '1'
        }
        // editPostDetails(insertData).then((response) => {
        //     if (response?.code === Codes.SUCCESS) {
        //         navigate('/post_list');
        //         closeModel(dispatch)
        //     } else {
        //         TOAST_ERROR(response?.message)
        //     }
        // })
    }

    const handelPostStatus = (id, status) => {
        const insertData = {
            post_id: id,
            is_active: status
        }
        // editPostDetails(insertData).then((response) => {
        //     if (response?.code === Codes.SUCCESS) {
        //         // setPostDetails({ ...postDetails, is_active: status })
        //         // setPostDetails((prev) =>
        //         //     prev.map((item) => {
        //         //         if (id === item.id) {
        //         //             item.is_active = status == 1 ? 1 : 0
        //         //         }
        //         //         return item
        //         //     }),
        //         // )
        //         TOAST_SUCCESS(response.message)
        //     } else {
        //         TOAST_ERROR(response?.message)
        //     }
        // })
    }

    useEffect(() => {
        // getPostLikeList({ page: 1, post_id: postDetails?._id, search: globalFilterValue }).then((response) => {
        //     if (response.code === Codes.SUCCESS) {
        //         setLikeList(response?.data)
        //     } else {
        //         setLikeList([])
        //     }
        // })

        // getCommentList({ page: 1, post_id: postDetails?._id }).then((response) => {
        //     if (response.code === Codes.SUCCESS) {
        //         setCommentList(response?.data)
        //     } else {
        //         setCommentList([])
        //     }
        // })
    }, [is_load, debounce, page, postDetails])

    console.log('likeList---', likeList);
    console.log('commentlist', commentlist);

    const toggleRepliesVisibility = (commentId) => {
        setVisibleReplies((prevState) => ({
            ...prevState,
            [commentId]: !prevState[commentId],
        }));
    };

    return (
        <>
            <div className="card overflow-hidden chat-application">

                {/* <divs className="d-flex align-items-center justify-content-between gap-3 m-3 ">
                    <button className="btn btn-primary d-flex" type="button" data-bs-toggle="offcanvas" data-bs-target="#chat-sidebar" aria-controls="chat-sidebar">
                        <i className="ti ti-menu-2 fs-5" />
                    </button>
                    <form className="position-relative w-100">
                        <input type="text" className="form-control search-chat py-2 ps-5" id="text-srh" placeholder="Search Contact" />
                        <i className="ti ti-search position-absolute top-50 start-0 translate-middle-y fs-6 text-dark me-3" />
                    </form>
                </divs> */}

                <div className="d-flex w-100">
                    <div className="d-flex w-100">
                        <div className="w-100">
                            <div className="chat-container h-100 w-100">
                                <div className="chat-box-inner-part h-100" >
                                    <div className="chatting-box app-email-chatting-box">

                                        {/* <div className="p-9 py-3 border-bottom chat-meta-user d-flex align-items-center justify-content-between">
                                                            <h5 className="text-dark mb-0 fw-semibold">Change Password</h5>
                                                            <ul className="list-unstyled mb-0 d-flex align-items-center">
                                                            </ul>
                                                        </div> */}

                                        {postModel === true && (<div className='cursor_pointer d-flex justify-content-center m-2 ms-3' style={{ 'width': '30px' }} onClick={() => { setPostModel(false) }} ><i className="ti ti-arrow-left fs-8 "></i></div>)}

                                        <div className="position-relative overflow-hidden">
                                            <div className="position-relative">
                                                <div className="chat-box p-9" style={{ height: 'calc(100vh - 100px)' }} data-simplebar>
                                                    <div className="chat-list chat active-chat" data-user-id={1}>

                                                        <div className='row'>
                                                            <div className="row justify-content-center  mb-3">
                                                                <div className="col-12 col-md-5 d-flex justify-content-center align-items-center m-1">
                                                                    <video
                                                                        className="img-fluid rounded-4 shadow-sm cursor-pointer "
                                                                        style={{ height: '250px', width: '100%' }}
                                                                        controls
                                                                        alt="Responsive video"
                                                                    >
                                                                        <source src={`https://videos.pexels.com/video-files/27776045/12221991_1080_1920_24fps.mp4`} type="video/mp4" />
                                                                        Your browser does not support the video tag.
                                                                    </video>

                                                                </div>
                                                                <div className="col-12 col-md-6 d-flex flex-column align-items-start  mb-3">
                                                                    <div className="d-flex align-items-center w-100 mb-2">
                                                                        <img src={PUBLIC_URL + "/dist/images/profile/user-1.jpg"} className="rounded-pill img-fluid mb-2" width={50} alt="profile" />

                                                                        {/* <div className="ms-3  mb-2">
                                                                                            <h4 className="card-title mb-0">Ritesh Deshmukh</h4>
                                                                                            <p className="card-subtitle mb-0 text-muted">Today at 6:30 AM</p>
                                                                                        </div> */}

                                                                        <div className='ms-2'><h6 class="fw-semibold fs-2 mb-0 ">{postDetails?.userDetails?.first_name + ' ' + postDetails?.userDetails?.last_name}</h6><p class="mb-0">{customerDetails?.user_name}</p></div>
                                                                        <div className='ms-4'>
                                                                            {/* <button className='btn btn-info fs-2'>Active Post </button> */}
                                                                        </div>

                                                                        <div className="ms-auto mb-2">
                                                                            <div className="dropdown">
                                                                                <a href="#" className="link" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                                                                                    <i className="ti ti-dots fs-6 text-dark" />
                                                                                </a>
                                                                                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                                                    <li><div className="dropdown-item cursor_pointer" onClick={() => { openModel(dispatch, ModelName.DELETE_MODEL); setSelectedPost(postDetails) }}>Delete Post</div></li>
                                                                                    {postDetails?.is_active == 1 ? (<>
                                                                                        <li><div className="dropdown-item cursor_pointer" onClick={() => { handelPostStatus(postDetails?._id, '0') }} >Active</div></li>
                                                                                    </>) : (<>
                                                                                        <li><div className="dropdown-item cursor_pointer" onClick={() => { handelPostStatus(postDetails?._id, '1') }} >Inactive</div></li>
                                                                                    </>)}
                                                                                </ul>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="w-100" >
                                                                        <div className='mb-2'>
                                                                            <h6 className="fw-semibold mb-1">Title</h6>
                                                                            <p className="mb-0 fs-4  fw-3 text-muted p-1">
                                                                                <b> {postDetails?.title}</b>
                                                                            </p>
                                                                        </div>

                                                                        <h6 className="fw-semibold mb-2">Description</h6>
                                                                        <p className="mb-0 fs-3 text-muted fw-3 fw-normal p-1" style={{ maxHeight: '160px', overflowY: 'auto' }}>{postDetails?.description}</p>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className='col-12'>
                                                                <ul className="nav nav-pills user-profile-tab justify-content- mt-2 border-0 rounded-2 mb-1" id="pills-tab" role="tablist">
                                                                    <li className="nav-item" role="presentation">
                                                                        <button className="nav-link position-relative rounded-0 active d-flex align-items-center justify-content-center bg-transparent fs-3 py-6"
                                                                            id="pills-profile1-tab1"
                                                                            data-bs-toggle="pill"
                                                                            data-bs-target="#pills-profile1"
                                                                            type="button"
                                                                            role="tab"
                                                                            aria-controls="pills-profile1"
                                                                            aria-selected="true">
                                                                            <i className="ti ti-heart me-2 fs-5 "></i>
                                                                            <span className="d-none d-md-block">Like</span>
                                                                            <span className="d-none d-md-block ms-2">{likeList?.likeCount || 0}</span>
                                                                        </button>
                                                                    </li>
                                                                    <li className="nav-item" role="presentation">
                                                                        <button className="nav-link position-relative rounded-0 d-flex align-items-center justify-content-center bg-transparent fs-3 py-6"
                                                                            id="pills-followers-tab2"
                                                                            data-bs-toggle="pill"
                                                                            data-bs-target="#pills-followers2"
                                                                            type="button"
                                                                            role="tab"
                                                                            aria-controls="pills-followers2"
                                                                            aria-selected="false">
                                                                            <i className="ti ti-message-circle me-2 fs-5"></i>
                                                                            <span className="d-none d-md-block">Comment</span>
                                                                            <span className="d-none d-md-block ms-2 ">{commentlist?.commentCount || 0}</span>
                                                                        </button>
                                                                    </li>
                                                                    <li className="nav-item" role="presentation">
                                                                        <button className="nav-link position-relative rounded-0 d-flex align-items-center justify-content-center bg-transparent fs-3 py-6"
                                                                            id="pills-friends-tab2"
                                                                            data-bs-toggle="pill"
                                                                            data-bs-target="#pills-friends2"
                                                                            type="button"
                                                                            role="tab"
                                                                            aria-controls="pills-friends2"
                                                                            aria-selected="false">
                                                                            <i className="ti ti-share-3 me-2 fs-5"></i>
                                                                            <span className="d-none d-md-block">Share</span>
                                                                            <span className="d-none d-md-block ms-2 ">{likeList?.likeCount || 0}</span>
                                                                        </button>
                                                                    </li>
                                                                </ul>

                                                                <div className="tab-content" id="pills-tabContent">
                                                                    <div className="tab-pane fade show active" id="pills-profile1" role="tabpanel" aria-labelledby="pills-profile-tab1" tabIndex={1}>
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

                                                                                                    <div className="position-relative overflow-hidden">
                                                                                                        <div className="position-relative">
                                                                                                            <div className="chat-box p-9 custom-responsive " style={{ height: 'calc(100vh - 540px)' }} data-simplebar>
                                                                                                                <div className="chat-list chat active-chat" data-user-id={1}>

                                                                                                                    <div className="row">
                                                                                                                        <div className="p-9">
                                                                                                                            {likeList?.likeList?.length > 0 ? (
                                                                                                                                likeList.likeList.map((data, index) => (
                                                                                                                                    <div key={index} className="rounded-2 bg-light mb-2">
                                                                                                                                        <div className="d-flex align-items-center w-100 mb-2 p-2">
                                                                                                                                            <img
                                                                                                                                                src={PUBLIC_URL + "/dist/images/profile/user-1.jpg"}
                                                                                                                                                className="rounded-pill img-fluid mb-2"
                                                                                                                                                width={35}
                                                                                                                                                alt="profile"
                                                                                                                                            />
                                                                                                                                            <div className="ms-3 mb-2">
                                                                                                                                                <h5 className="card-title mb-1 pb-1">{data?.user_name}</h5>
                                                                                                                                                <p className="card-subtitle mb-0 text-muted">{data?.created_at}</p>
                                                                                                                                            </div>
                                                                                                                                        </div>
                                                                                                                                    </div>
                                                                                                                                ))
                                                                                                                            ) : (
                                                                                                                                <div className="p-3 rounded-2 bg-light mb-2 text-center">
                                                                                                                                    <p className="text-muted">No data found</p>
                                                                                                                                </div>
                                                                                                                            )}

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
                                                                    </div>

                                                                    <div className="tab-pane fade" id="pills-followers2" role="tabpanel" aria-labelledby="pills-followers-tab2" tabIndex={0}>

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


                                                                                                    <div className="position-relative overflow-hidden">
                                                                                                        <div className="position-relative">
                                                                                                            <div className="chat-box p-9 custom-responsive" style={{ height: 'calc(100vh -  540px)' }} data-simplebar>
                                                                                                                <div className="chat-list chat active-chat" data-user-id={1}>

                                                                                                                    <div className="col-lg-12">
                                                                                                                        <div className="position-relative">

                                                                                                                            {commentlist?.commentList && commentlist.commentList.length > 0 ? (
                                                                                                                                commentlist?.commentList?.map((data, index) => (
                                                                                                                                    <div key={index}>
                                                                                                                                        {/* Main Comment */}
                                                                                                                                        <div
                                                                                                                                            className="p-3 rounded-2 bg-light mb-2 comment-container"
                                                                                                                                            onClick={() => toggleRepliesVisibility(data._id)}
                                                                                                                                            style={{ cursor: 'pointer' }} // Add cursor to indicate it's clickable
                                                                                                                                        >
                                                                                                                                            <div className="d-flex align-items-center gap-3">
                                                                                                                                                <img
                                                                                                                                                    src={PUBLIC_URL + "/dist/images/profile/user-1.jpg"}
                                                                                                                                                    alt="profile"
                                                                                                                                                    className="rounded-circle"
                                                                                                                                                    width={33}
                                                                                                                                                    height={33}
                                                                                                                                                />
                                                                                                                                                <div>
                                                                                                                                                    <h5 className="fw-semibold mb-1 fs-4">
                                                                                                                                                        {`${data.first_name} ${data.last_name}`}
                                                                                                                                                    </h5>
                                                                                                                                                    <p className="card-subtitle mb-0 text-muted pt-1">
                                                                                                                                                        {new Date(data.created_at).toLocaleDateString()}
                                                                                                                                                    </p>
                                                                                                                                                </div>
                                                                                                                                            </div>
                                                                                                                                            <p className="my-3">{data.comment}</p>
                                                                                                                                        </div>

                                                                                                                                        {/* Replies with animation */}
                                                                                                                                        <div
                                                                                                                                            className={`replies-container ${visibleReplies[data._id] ? 'open' : 'closed'}`}
                                                                                                                                        >
                                                                                                                                            {data.replies && data.replies.length > 0 && data.replies.map((reply, replyIndex) => (
                                                                                                                                                <div className="p-3 rounded-2 bg-light mb-2 ms-7 reply-container" key={replyIndex}>
                                                                                                                                                    <div className="d-flex align-items-center gap-3">
                                                                                                                                                        <img
                                                                                                                                                            src={PUBLIC_URL + "/dist/images/profile/user-1.jpg"}
                                                                                                                                                            alt="profile"
                                                                                                                                                            className="rounded-circle"
                                                                                                                                                            width={33}
                                                                                                                                                            height={33}
                                                                                                                                                        />
                                                                                                                                                        <div>
                                                                                                                                                            <h6 className="fw-semibold mb-0 fs-4">
                                                                                                                                                                {`${reply.first_name} ${reply.last_name}`}
                                                                                                                                                            </h6>
                                                                                                                                                            <p className="card-subtitle mb-0 text-muted pt-1">
                                                                                                                                                                {new Date(reply.created_at).toLocaleDateString()}
                                                                                                                                                            </p>
                                                                                                                                                        </div>
                                                                                                                                                    </div>
                                                                                                                                                    <p className="my-3">{reply.comment}</p>
                                                                                                                                                </div>
                                                                                                                                            ))}
                                                                                                                                        </div>
                                                                                                                                    </div>
                                                                                                                                ))
                                                                                                                            ) : (
                                                                                                                                <div className="p-3 rounded-2 bg-light mb-2 text-center">
                                                                                                                                    <p className="text-muted">No data found</p>
                                                                                                                                </div>
                                                                                                                            )}


                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    {/* </div> */}
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

                                                                    <div className="tab-pane fade" id="pills-friends2" role="tabpanel" aria-labelledby="pills-friends-tab2" tabIndex={0}>
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

                                                                                                    <div className="position-relative overflow-hidden">
                                                                                                        <div className="position-relative">
                                                                                                            <div className="chat-box p-9 custom-responsive" style={{ height: 'calc(100vh -  540px)' }} data-simplebar>
                                                                                                                <div className="chat-list chat active-chat" data-user-id={1}>

                                                                                                                    <div className="row">

                                                                                                                        <div className="row">
                                                                                                                            <div className="p-9">
                                                                                                                                {likeList?.likeList?.length > 0 ? (
                                                                                                                                    likeList.likeList.map((data, index) => (
                                                                                                                                        <div key={index} className="rounded-2 bg-light mb-2">
                                                                                                                                            <div className="d-flex align-items-center w-100 mb-2 p-2">
                                                                                                                                                <img
                                                                                                                                                    src={PUBLIC_URL + "/dist/images/profile/user-1.jpg"}
                                                                                                                                                    className="rounded-pill img-fluid mb-2"
                                                                                                                                                    width={35}
                                                                                                                                                    alt="profile"
                                                                                                                                                />
                                                                                                                                                <div className="ms-3 mb-2">
                                                                                                                                                    <h5 className="card-title mb-1 pb-1">{data?.user_name}</h5>
                                                                                                                                                    <p className="card-subtitle mb-0 text-muted">{data?.created_at}</p>
                                                                                                                                                </div>
                                                                                                                                            </div>
                                                                                                                                        </div>
                                                                                                                                    ))
                                                                                                                                ) : (
                                                                                                                                    <div className="p-3 rounded-2 bg-light mb-2 text-center">
                                                                                                                                        <p className="text-muted">No data found</p>
                                                                                                                                    </div>
                                                                                                                                )}

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
                                                                        </div>
                                                                    </div>

                                                                    <div className="tab-pane fade" id="pills-gallery" role="tabpanel" aria-labelledby="pills-gallery-tab" tabIndex={0}>
                                                                        <h1>4</h1>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* <div className="col-lg-8">
                                                                            <div className="card">

                                                                                <div className="card-body p-4 border-bottom">

                                                                                    <div className="mb-4 row align-items-center">
                                                                                        <label htmlFor="exampleInputPassword1" className="form-label fw-semibold col-sm-3 col-form-label">Old password</label>
                                                                                        <div className="col-sm-9">
                                                                                            <div className="input-group border rounded-1">
                                                                                                <input type="password" className="form-control border-0" id="inputPassword" placeholder="Old password" />
                                                                                                <span className="input-group-text bg-transparent px-6 border-0" id="basic-addon1">
                                                                                                    <i className="ti ti-eye fs-6" />
                                                                                                </span>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div className="mb-4 row align-items-center">
                                                                                        <label htmlFor="exampleInputPassword1" className="form-label fw-semibold col-sm-3 col-form-label">New password</label>
                                                                                        <div className="col-sm-9">
                                                                                            <div className="input-group border rounded-1">
                                                                                                <input type="password" className="form-control border-0" id="inputPassword" placeholder="New password" />
                                                                                                <span className="input-group-text bg-transparent px-6 border-0" id="basic-addon1">
                                                                                                    <i className="ti ti-eye fs-6" />
                                                                                                </span>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div className="mb-4 row align-items-center">
                                                                                        <label htmlFor="confirmPassword" className="form-label fw-semibold col-sm-3 col-form-label text-inline">
                                                                                            Confirm
                                                                                            password
                                                                                        </label>

                                                                                        <div className="col-sm-9">
                                                                                            <div className="input-group border rounded-1">
                                                                                                <input type="password" className="form-control border-0" id="inputPassword" placeholder="Confirm
                                                                                        password" />
                                                                                                <span className="input-group-text bg-transparent px-6 border-0" id="basic-addon1">
                                                                                                    <i className="ti ti-eye fs-6" />
                                                                                                </span>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>

                                                                                </div>
                                                                            </div>
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
            </div >

            {
                customModel.isOpen && customModel?.modalType === ModelName.DELETE_MODEL && (
                    <Model>
                        <DeleteComponent onConfirm={handelPostDelete} />
                    </Model >
                )
            }
        </>


    )
}

export const DeleteComponent = ({ onConfirm }) => {

    const dispatch = useDispatch()
    return (<>
        <div className="text-center text-danger">
            <i class="ti ti-trash fs-9"></i>

            <h3 className="mt-4  mb-4">Are you sure, you want to Delete?</h3>

            <button type="button" className="btn btn-light m-2 align-items-center" onClick={() => { onConfirm(true) }} >
                Yes, Delete!
            </button>
            <button type="button" className="btn btn-info  my-2 border shdow-sm" onClick={() => { closeModel(dispatch) }}>
                Cancel
            </button>
        </div>
    </>)
}

export const LogoutComponent = ({ onConfirm }) => {
    const dispatch = useDispatch()
    return (<>
        <div className="text-center p-4 pt-0 pb-1">
            <div className="col-lg-12">
                <div className="card-body ">
                    <div className="d-flex flex-column align-items-center text-center p-2">
                        <div
                            className="d-flex justify-content-center align-items-center rounded-circle mb-3"
                            style={{
                                width: "70px",
                                height: "70px",
                                border: "2px solid #1F7494",
                            }}
                        >

                            <LuLogOut color="#1F7494" size={32} />
                        </div>
                        <h5 className="fw-bold mb-2"> Logout ?</h5>
                        <p className="text-muted mb-0 fs-4 fw-semibold">
                            Are you sure you want to log out ?
                        </p>
                    </div>
                </div>
                <div class="modal-footer justify-content-center border-0 ">

                    <button type="button" className="btn btn-danger" onClick={() => { closeModel(dispatch); onConfirm(false) }}>
                        Cancel
                    </button>
                    <button type="button" className="btn btn-primary" onClick={() => { onConfirm(true) }} >
                        Yes logout !
                    </button>
                </div>
                {/* </div> */}
            </div>
        </div >
    </>)
}
