import React, { useState, useEffect, useRef, useCallback } from 'react'
import Swal from 'sweetalert2'
import { useLocation, useNavigate } from 'react-router-dom'
import { Controller, useForm } from 'react-hook-form';
import Header from '../../layout/Header';
import Slidebar from '../../layout/Slidebar';
import Footer from '../../layout/Footer';
import { Language, TOAST_ERROR, TOAST_SUCCESS, allowLettersAndSpaces } from '../../config/common';
import { loanDetails } from '../../utils/api.services';
import SubNavbar from '../../layout/SubNavbar';
import categoryImage from '../../assets/Images/Group 48096953.png'
import { uploadImageOnAWS } from '../../utils/aws.service';
import Constatnt, { AwsFolder, Codes } from '../../config/constant';
import { SketchPicker } from 'react-color';
import { formatDate, formatIndianPrice, getArrayFromCommaSeparated, getCommaSeparatedNames, selectOption, textInputValidation, textValidation } from '../../config/commonFunction';
import { AstroInputTypesEnum, DateFormat, InputTypesEnum } from '../../config/commonVariable';
import { useDispatch, useSelector } from 'react-redux';
import { getcategoryListThunk, setLoader } from '../../Store/slices/MasterSlice';
import { LazyLoadImage } from "react-lazy-load-image-component";
import CountryMobileNumber from '../../pages/CommonPages/CountryMobileNumber';
import Multiselect from "multiselect-react-dropdown";
import pdfThmbnail from "../../assets/ProfileImage/PDF_Thmbnail.png";
import Spinner from '../../component/Spinner';
import { PersonalDetails } from './LoanDetails/PersonalDetails';
import { LoanDescription } from './LoanDetails/LoanDescription';
import { Disbursement } from './LoanDetails/Disbursement';
import { DocumentDetails } from './LoanDetails/DocumentDetails';
import { MdPayments } from 'react-icons/md';
import { LuHandCoins } from 'react-icons/lu';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { EMIScedule } from './LoanDetails/EMIScedule';
import { RiMoneyRupeeCircleLine } from 'react-icons/ri';
import { FaMoneyBillTransfer } from 'react-icons/fa6';
import { TransectionHistory } from './LoanDetails/TransectionHistory';
import { loanStatus, loanStatusKey } from './LoanDetails/ApplicationStatus';

export default function AddAstrologers() {

    const navigation = useNavigate();
    const dispatch = useDispatch();

    const location = useLocation();
    const [shoWcategoryImage, setShowCategoryImage] = useState(null);
    const [loanDetailsData, setLoanDetailsData] = useState({});
    const [is_loding, setIs_loading] = useState(false);
    const loanAprovedDetails = loanDetailsData?.approval_details?.length > 0 && loanDetailsData?.approval_details[0];
    const loanBankDetails = loanDetailsData?.bank_accounts?.length > 0 && loanDetailsData?.bank_accounts[0];

    var loanListData = location?.state;
    let userDetailsData = ""

    const {
        register,
        handleSubmit,
        setValue,
        clearErrors,
        reset,
        watch,
        control,
        formState: { errors },
    } = useForm();

    const [selectLanguage, setSelectLanguage] = useState([{
        "_id": "1",
        "value": "en",
        "name": "English",
    }, {
        "_id": "2",
        "value": "hi",
        "name": "Hindi",
    }, {
        "_id": "3",
        "value": "gu",
        "name": "GUjrati",
    }]);

    const [apiReload, setApiReload] = useState(false);
    const [selectedItems, setSelectedItems] = useState({});
    const formDropDownSections = {};

    useEffect(() => {
        if (loanListData) {
            setIs_loading(true)
            loanDetails({ loan_id: loanListData?.id }).then((response) => {
                if (response?.status_code === Codes.SUCCESS) {
                    let responseDetails = response?.data?.loan_application;

                    setLoanDetailsData(responseDetails);
                    setIs_loading(false)
                } else {
                    setIs_loading(false)
                }
            })
        }
    }, [loanListData, apiReload]);

    var onChangeMobileNumber = (mobileNumber) => {
        setValue('mobile_number', mobileNumber)
        clearErrors('mobile_number', '')
    }

    var onChangeCountryCode = (countryCode) => {
        setValue('country_code', countryCode?.country_code)
        clearErrors('country_code', '')
    }

    const onSubmitData = async (data) => {
        try {
            dispatch(setLoader(true))
            let request = {
                registration_number: data[AstroInputTypesEnum.REGISTRATION_NUMBER],
                name: data[AstroInputTypesEnum.NAME],
                email: data[AstroInputTypesEnum.EMAIL],
                country_code: data[AstroInputTypesEnum.COUNTRYCODE] || '+91',
                mobile_number: data[AstroInputTypesEnum.MOBILE],
                gender: data[AstroInputTypesEnum.GENDER],
                dob: data[AstroInputTypesEnum.BIRTH_DATE],
                time_of_birth: data[AstroInputTypesEnum.TIME_OF_BIRTH],
                place_of_birth: data[AstroInputTypesEnum.PLACE_OF_BIRTH],
                curr_address: data[AstroInputTypesEnum.CURRENT_ADDRESH],
                city: data[AstroInputTypesEnum.CITY],
                pincode: data[AstroInputTypesEnum.PINCODE],
                // category: data[AstroInputTypesEnum.CATEGORY] || ['123'],
                // astro_language: data[AstroInputTypesEnum.LANGUAGE],
                experience: data[AstroInputTypesEnum.EXPERIANCE],
                price_per_min: data[AstroInputTypesEnum.PRICEMIN],
                discount_price_per_min: data[AstroInputTypesEnum.DISCOUNT_PERMIN],
                language: getCommaSeparatedNames(data?.language),
                skills: getCommaSeparatedNames(data?.skill),
                category: getCommaSeparatedNames(data?.Category),
                country: getCommaSeparatedNames(data?.country),
                availability_slotes: data?.slots?.map(slot => ({
                    start_time: slot.start_time,
                    end_time: slot.end_time,
                })) || []
            }
            if (loanListData) {
                request.request_type = 'edit';
                request.astrologer_id = loanListData._id;
                // EditAstrologer(request).then((response) => {
                //     if (response?.code === Codes.SUCCESS) {
                //         TOAST_SUCCESS(response?.message)
                //         navigation('/astrologer_list')
                //     } else {
                //         TOAST_ERROR(response.message)
                //     }
                // })
            } else {
                // AddAstrologer(request).then((response) => {
                //     if (response?.code === Codes.SUCCESS) {
                //         TOAST_SUCCESS(response?.message)
                //         navigation('/astrologer_list')
                //     } else {
                //         TOAST_ERROR(response.message)
                //     }
                // })
            }
            dispatch(setLoader(false))
        } catch (error) {
            TOAST_ERROR('Somthing went wrong')
        }
    }

    const handleImageChange = async (e) => {
        const image = e.target.files[0]
        setValue("category_image", image);
        clearErrors("category_image");
        setShowCategoryImage(URL.createObjectURL(image))
    }

    // astrologerDropDown?.forEach((item) => {
    //     const key = Object.keys(item)[0];
    //     const newData = item[key] || [];
    //     // Merge with existing data (remove duplicates if needed)
    //     formDropDownSections[key] = [
    //         ...(formDropDownSections[key] || []),
    //         ...newData
    //     ];
    // })

    const handleSelect = (type, selectedList) => {
        setSelectedItems(prev => ({ ...prev, [type]: selectedList }));
        setValue(type, selectedList);
    };

    const handleRemove = (type, selectedList) => {
        setSelectedItems(prev => ({ ...prev, [type]: selectedList }));
        setValue(type, selectedList);
    };

    const STATUS_CLASSES = {
        PENDING: "bg-warning text-white",
        UNDER_REVIEW: "bg-info text-white",
        ON_HOLD: "bg-warning white border-0",
        APPROVED: "bg-success text-white  border-0",
        REJECTED: "bg-danger text-white  border-0",
        DISBURSED: "bg-primary text-white",
        CLOSED: "bg-secondary text-white",
        CANCELLED: "bg-danger text-white"
    };

    const ALLSTATUS_LIST = [
        { key: "", value: "ALL STATUS" },
        { key: "PENDING", value: "PENDING" },
        { key: "UNDER_REVIEW", value: "UNDER REVIEW" },
        { key: "ON_HOLD", value: "ON HOLD" },
        { key: "APPROVED", value: "APPROVED" },
        { key: "REJECTED", value: "REJECTED" },
        { key: "DISBURSED", value: "DISBURSED" },
        { key: "CLOSED", value: "CLOSED" },
        { key: "CANCELLED", value: "CANCELLED" },
        { key: "USER_ACCEPTED", value: "USER ACCEPTED" },
    ];

    return (
        <>
            {<Spinner isActive={is_loding} message={'Please Wait'} />}
            <div className="container-fluid mw-100 ">
                <SubNavbar title={loanListData ? 'Loan Details' : 'Add Loan'} header={location?.pathname.includes('/loan_disbursement_list') ? 'Loan Disbursement' : 'Loan List'
                } subHeaderOnlyView={loanListData ? 'Loan Details' : 'Add Loan'} /> <div className="row">
                    <ul className="nav nav-pills user-profile-tab justify-content-end mt-2 border border-2 rounded-2 mb-3 " id="pills-tab" role="tablist">

                        {/* <li className="nav-item" role="presentation">
                            <button className="nav-link active position-relative rounded-0 d-flex align-items-center justify-content-center bg-transparent fs-3 py-6" id="pills-change-password-tab" data-bs-toggle="pill" data-bs-target="#pills-change-password" type="button" role="tab" aria-controls="pills-change-password" aria-selected="true">
                                <i className="ti ti-key me-2 fs-6"></i>
                                <span className="d-none d-md-block">Personal Details</span>
                            </button>
                        </li> */}

                        <li className="nav-item" role="presentation">
                            <button className="nav-link active position-relative rounded-0 d-flex align-items-center justify-content-center bg-transparent fs-3 py-6" id="pills-app-settings-tab" data-bs-toggle="pill" data-bs-target="#pills-app-settings" type="button" role="tab" aria-controls="pills-app-settings" aria-selected="false">
                                {/* <i className="ti ti-user-circle me-2 fs-6" />
                                 */}
                                <LuHandCoins className="fs-6 me-2" />
                                <span className="d-none d-md-block fs-4">Loan Details</span>
                            </button>
                        </li>
                        {
                            loanDetailsData?.loan_disbursement?.length > 0 &&
                            <li className="nav-item" role="presentation">
                                <button className="nav-link position-relative rounded-0 d-flex align-items-center justify-content-center bg-transparent fs-3 py-6" id="pills-chat-setting-tab" data-bs-toggle="pill" data-bs-target="#pills-chat-setting" type="button" role="tab" aria-controls="pills-chat-setting" aria-selected="false">
                                    {/* <i className="ti ti-settings me-2 fs-6" /> */}
                                    <MdPayments className='fs-6 me-2' />
                                    <span className="d-none d-md-block fs-4">Disbursement Details</span>
                                </button>
                            </li>
                        }
                        {
                            loanDetailsData?.documents?.length > 0 &&
                            <li className="nav-item" role="presentation">
                                <button className="nav-link position-relative rounded-0 d-flex align-items-center justify-content-center bg-transparent fs-3 py-6" id="pills-document-setting-tab" data-bs-toggle="pill" data-bs-target="#pills-document-setting" type="button" role="tab" aria-controls="pills-document-setting" aria-selected="false">
                                    {/* <i className="ti ti-user-circle me-2 fs-6" /> */}
                                    <IoDocumentTextOutline className='fs-6 me-2' />
                                    <span className="d-none d-md-block fs-4">Documents</span>
                                </button>
                            </li>
                        }
                        {
                            loanDetailsData?.emi_info?.schedule?.length > 0 && (loanDetailsData?.status === loanStatusKey?.DISBURSED || loanDetailsData?.status === loanStatusKey?.COMPLETED) &&
                            <li className="nav-item" role="presentation">
                                <button className="nav-link position-relative rounded-0 d-flex align-items-center justify-content-center bg-transparent fs-3 py-6" id="pills-Scedule-setting-tab" data-bs-toggle="pill" data-bs-target="#pills-scedule-setting" type="button" role="tab" aria-controls="pills-gallery" aria-selected="false">
                                    {/* <i className="ti ti-photo-plus me-2 fs-6" /> */}
                                    <RiMoneyRupeeCircleLine className='fs-6 me-2' />
                                    <span className="d-none d-md-block fs-4">EMI Scedule</span>
                                </button>
                            </li>
                        }
                        {
                            loanDetailsData?.status === loanStatusKey?.DISBURSED &&
                            < li className="nav-item" role="presentation">
                                <button className="nav-link position-relative rounded-0 d-flex align-items-center justify-content-center bg-transparent fs-3 py-6" id="pills-transection-setting-tab" data-bs-toggle="pill" data-bs-target="#pills-transection-setting" type="button" role="tab" aria-controls="pills-gallery" aria-selected="false">
                                    <FaMoneyBillTransfer className='fs-6 me-2' />
                                    <span className="d-none d-md-block fs-4">Transaction History</span>
                                </button>
                            </li>
                        }

                        {
                            loanDetailsData?.status === loanStatusKey?.COMPLETED &&
                            < li className="nav-item" role="presentation">
                                <button className="nav-link position-relative rounded-0 d-flex align-items-center justify-content-center bg-transparent fs-3 py-6" id="pills-transection-setting-tab" data-bs-toggle="pill" data-bs-target="#pills-transection-setting" type="button" role="tab" aria-controls="pills-gallery" aria-selected="false">
                                    <FaMoneyBillTransfer className='fs-6 me-2' />
                                    <span className="d-none d-md-block fs-4">Transaction History</span>
                                </button>
                            </li>
                        }
                        {
                            loanDetailsData?.status === loanStatusKey?.CLOSED &&
                            < li className="nav-item" role="presentation">
                                <button className="nav-link position-relative rounded-0 d-flex align-items-center justify-content-center bg-transparent fs-3 py-6" id="pills-transection-setting-tab" data-bs-toggle="pill" data-bs-target="#pills-transection-setting" type="button" role="tab" aria-controls="pills-gallery" aria-selected="false">
                                    <FaMoneyBillTransfer className='fs-6 me-2' />
                                    <span className="d-none d-md-block fs-4">Transaction History</span>
                                </button>
                            </li>
                        }
                        {/* <li className="nav-item" role="presentation">
                            <button className="nav-link position-relative rounded-0 d-flex align-items-center justify-content-center bg-transparent fs-3 py-6" id="pills-gallery-tab" data-bs-toggle="pill" data-bs-target="#pills-gallery" type="button" role="tab" aria-controls="pills-gallery" aria-selected="false">
                                <i className="ti ti-photo-plus me-2 fs-6" />
                                <span className="d-none d-md-block">Gallery</span>
                            </button>
                        </li> */}
                    </ul>

                    <div className="tab-content" id="pills-tabContent">
                        {/* <div className="tab-pane fade show active" id="pills-change-password" role="tabpanel" aria-labelledby="pills-change-password-tab">
                            <PersonalDetails loanDetailsData={loanDetailsData} />
                        </div> */}
                        <div className="tab-pane fade show active" id="pills-app-settings" role="tabpanel" aria-labelledby="pills-app-settings-tab">
                            <LoanDescription loanDetailsData={loanDetailsData} />
                        </div>
                        {
                            loanDetailsData?.loan_disbursement?.length > 0 &&
                            <div className="tab-pane fade" id="pills-chat-setting" role="tabpanel" aria-labelledby="pills-chat-setting-tab">
                                <Disbursement loanDetailsData={loanDetailsData} />
                            </div>
                        }
                        {
                            loanDetailsData?.documents?.length > 0 &&
                            <div className="tab-pane fade" id="pills-document-setting" role="tabpanel" aria-labelledby="pills-document-setting-tab">
                                <DocumentDetails loanDetailsData={loanDetailsData} setApiReload={setApiReload} />
                            </div>
                        }
                        {
                            loanDetailsData?.emi_info?.schedule?.length > 0 &&
                            <div className="tab-pane fade" id="pills-scedule-setting" role="tabpanel" aria-labelledby="pills-Scedule-setting-tab">
                                <EMIScedule loanDetailsData={loanDetailsData} />
                            </div>
                        }
                        {
                            loanDetailsData?.status === loanStatusKey?.DISBURSED &&
                            <div className="tab-pane fade" id="pills-transection-setting" role="tabpanel" aria-labelledby="pills-transection-setting-tab">
                                <TransectionHistory loanDetailsData={loanDetailsData} />
                            </div>
                        }
                        {
                            loanDetailsData?.status === loanStatusKey?.COMPLETED &&
                            <div className="tab-pane fade" id="pills-transection-setting" role="tabpanel" aria-labelledby="pills-transection-setting-tab">
                                <TransectionHistory loanDetailsData={loanDetailsData} />
                            </div>
                        }
                        {
                            loanDetailsData?.status === loanStatusKey?.CLOSED &&
                            <div className="tab-pane fade" id="pills-transection-setting" role="tabpanel" aria-labelledby="pills-transection-setting-tab">
                                <TransectionHistory loanDetailsData={loanDetailsData} />
                            </div>
                        }
                    </div>
                </div>
            </div >
        </>
    )
}
