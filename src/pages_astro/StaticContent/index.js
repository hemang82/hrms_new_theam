import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import SubNavbar from '../../layout/SubNavbar';
import { appContent, editAppContent, editStaticContent, getAppContent, listStaticContent } from '../../utils/api.services';
import { TOAST_SUCCESS } from '../../config/common';
import Header from '../../layout/Header';
import Slidebar from '../../layout/Slidebar';
import { Codes } from '../../config/constant';
import { useSelector } from 'react-redux';

export default function StaticContent(props) {

    // 

    const { contentDropDown: { data: contentDropDown }, } = useSelector((state) => state.masterslice);

    var navigation = useNavigate()
    const location = useLocation();
    const path = '/' + location?.pathname?.split('/')?.[1]

    const [englishContent, setEnglishContent] = useState('');
    const [hindiContent, setHindiContent] = useState('');
    const [gujratiContent, setGujratiContent] = useState('');

    const [aboutHi, setAboutHi] = useState('');
    const [aboutGu, setAboutGu] = useState('');

    const [policyHi, setPolicyHi] = useState('');
    const [policyGu, setPolicyGu] = useState('');

    const [conditionHi, setConditionHi] = useState('');
    const [conditionGu, setConditionGu] = useState('');

    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, 4, 5] }, { 'font': [] }],
            [{ size: [] }],
            ["bold", "underline", "italic", "strike", "blockquote"],
            ["code-block", "blockquote"],
            [{ list: "ordered" }, { list: "bullet" }, { 'indent': '-1' }, { 'indent': '+1' }],
            // ['link', 'image', 'video'],
            ['clean']
        ]
    }

    const screenOptions = [
        { label: "Home Screen", value: "home_screen" },
        { label: "Free Kundli Screen", value: "free_kundli" },
        { label: "Kundli Matching", value: "kundli_matching" },
        { label: "Chat With Astrologer", value: "chat_astrologer" },
        { label: "Talk With Astrologer", value: "talk_astrologer" }
    ];

    const [selectedScreen, setSelectedScreen] = useState(screenOptions[0]);

    const success = async () => {
        let request = {
            type: selectedScreen?.value,
            description: englishContent,
            hi_description: hindiContent,
            gu_description: gujratiContent
        }
        let { data, code, message } = await editStaticContent(request);
        if (code == Codes.SUCCESS) {
            TOAST_SUCCESS(message);
        }
    }

    useEffect(() => {
        listStaticContent({ type: selectedScreen?.value }).then((response) => {
            if (response?.code === Codes?.SUCCESS) {
                setEnglishContent(response?.data?.contentList[0]?.description)
                setHindiContent(response?.data?.contentList[0]?.hi_description)
                setGujratiContent(response?.data?.contentList[0]?.gu_description)
            } else {
                setEnglishContent("")
                setHindiContent("")
                setGujratiContent("")
            }
        }).catch(err => console.log("List Static Content ma Error aayi", err));
    }, [selectedScreen])

    const handleSelect = (option) => {
        setSelectedScreen(option);
    };

    return (
        <>
            <div className="container-fluid mw-100">

                <SubNavbar title={"Static Content"} header={'Static Content'} />

                <div className="row ">
                    <div className="col-lg-12">

                        <div className="col-md-8 col-xl-9 text-end d-flex justify-content-md-end justify-content-center mt-3 mt-md-0">
                            {/* <a href="javascript:void(0)" id="btn-add-contact" className="btn btn-info d-flex align-items-center">
                                        <i className="ti ti-users text-white me-1 fs-5" /> Add Contact
                            </a> */}
                        </div>

                        <div className="card shadow-sm m-2">
                            <div className="card text-center ">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="container-fluid">
                                                <div className="d-flex justify-content-start m-3">
                                                    <div className="btn-group mb-2 w-15">
                                                        <button
                                                            type="button"
                                                            className="btn btn-info dropdown-toggle btn-md "
                                                            data-bs-toggle="dropdown"
                                                            aria-haspopup="true"
                                                            aria-expanded="false"
                                                        >
                                                            {selectedScreen?.label}
                                                        </button>
                                                        <ul className="dropdown-menu animated flipInx w-50">
                                                            {contentDropDown?.length > 0 && contentDropDown?.map((option) => (
                                                                <li key={option?.value}>
                                                                    <a
                                                                        className="dropdown-item cursor_pointer text-black-50"
                                                                        onClick={() => handleSelect(option)}
                                                                    >
                                                                        {option?.label}
                                                                    </a>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>

                                                <div className="container-fluid py-4 bg-light border-bottom mb-4">
                                                    <div className="d-flex justify-content-center align-items-center">
                                                        <h1 className="h3 mb-0 fw-semibold">{selectedScreen?.label}</h1>
                                                    </div>
                                                </div>

                                                {/* Enaglish langauge */}
                                                {/* <hr></hr> */}
                                                <div className='col-lg-12  overflow-auto'>
                                                    <h4 className="d-flex justify-content-start fs-5 ms-2">Description<p className='ms-1 me-1 text-mute'>(English)</p> <span style={{ color: "red" }}>*</span> </h4>

                                                    <div className='editor m-2'>
                                                        <ReactQuill type="text" id="about_content" name="about_content" modules={modules} style={{ "height": "500px" }} theme="snow" value={englishContent} onChange={(englishContent) => { setEnglishContent(englishContent) }} />
                                                    </div>
                                                    <br />
                                                    <br />
                                                    <br />
                                                </div>

                                                <hr className=''></hr>
                                                {/* Hindi langauge */}
                                                <div className='col-lg-12 overflow-auto '>
                                                    <h4 className="d-flex justify-content-start mt-3 ms-2 fs-5">Description<span className='ms-1 me-1 text-mute'>(Hindi)</span> <span style={{ color: "red" }}>*</span> </h4>
                                                    <div className='editor m-2 mt-4'>
                                                        <ReactQuill type="text" id="about_content" name="about_content" modules={modules} style={{ "height": "430px" }} theme="snow" value={hindiContent} onChange={(hindiContent) => { setHindiContent(hindiContent) }} />
                                                    </div>
                                                    <br />
                                                    <br />
                                                    <br />
                                                </div>

                                                {/* Gujarati langauge */}
                                                <hr></hr>
                                                <div className='col-lg-12 overflow-auto '>
                                                    <h4 className="d-flex justify-content-start mt-3 ms-2 fs-5">Description<span className='ms-1 me-1 text-mute'>(Gujarati)</span> <span style={{ color: "red" }}>*</span> </h4>
                                                    <div className='editor m-2 mt-4'>
                                                        <ReactQuill type="text" id="about_content" name="about_content" modules={modules} style={{ "height": "430px" }} theme="snow" value={gujratiContent} onChange={(gujratiContent) => { setGujratiContent(gujratiContent) }} />
                                                    </div>
                                                    <br />
                                                    <br />
                                                    <br />
                                                </div>

                                            </div>
                                        </div>
                                    </div>

                                    <hr></hr>
                                    <div className="row mb-5 form_submit ">
                                        <div className="col-lg-">

                                            <div className="modal-footer justify-content-center">
                                                <button type='button' className="btn btn-danger m-2" >Cancel</button>
                                                <button type='submit' className="btn btn-primary" onClick={success}>Submit</button>
                                            </div>

                                            {/* <div className="text-center mb-3 ">
                                                    
                                                    <button className="btn secondary-btn" type="button" data-bs-toggle="" data-bs-target="">Cancel</button>
                                                    <button class="btn primary-btn" type="submit" data-bs-toggle="" data-bs-target="" onClick={success}>Submit</button>
                                                </div> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* </div> */}
            </div>
        </>
    )
}