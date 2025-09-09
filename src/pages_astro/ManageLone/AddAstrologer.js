import React, { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form';
import { Language, TOAST_ERROR, TOAST_SUCCESS, allowLettersAndSpaces } from '../../config/common';
import { addLoanDetails, loanDetails, updateLoanDetails } from '../../utils/api.services';
import SubNavbar from '../../layout/SubNavbar';
import { uploadImageOnAWS } from '../../utils/aws.service';
import { AwsFolder, Codes } from '../../config/constant';
import { formatDateDyjs, getFileNameFromUrl, textInputValidation, textValidation, validateFileType } from '../../config/commonFunction';
import { AstroInputTypesEnum, DateFormat, InputRegex, LOAN_TYPES } from '../../config/commonVariable';
import { useDispatch } from 'react-redux';
import { setLoader } from '../../Store/slices/MasterSlice';
import Spinner from '../../component/Spinner';
import dayjs from 'dayjs';
import { DatePicker } from 'antd';

export default function AddAstrologer() {

    const navigation = useNavigate();
    const dispatch = useDispatch();

    const location = useLocation();
    const [showPanCardImage, setShowPanCardImage] = useState(null);
    const [panCardFileName, setPanCardFileName] = useState('');
    const [showadhaarCardImage, setShowadhaarCardImage] = useState(null);
    const [adhaarCardFileName, setAdhaarCardFileName] = useState('');
    const [is_loding, setIs_loading] = useState(false);

    const dateFormat = 'YYYY-MM-DD';
    const [selectedDate, setSelectedDate] = useState(dayjs()); // Default to today
    const [proofTypeFileName, setProoftTypeFileName] = useState([]);
    const [proofTypeFileImage, setProoftTypeFileImage] = useState([]);

    const [propertyDocumentFileName, setPropertyDocumentFileName] = useState([]);
    const [propertyDocumentImage, setPropertyDocumentImage] = useState([]);

    var loanData = location?.state;

    const {
        register,
        handleSubmit,
        setValue,
        clearErrors,
        reset,
        watch,
        control,
        trigger,
        formState: { errors },
    } = useForm();


    const proof_type = [
        { value: "salaried", label: "Salaried" },
        { value: "self_employed", label: "Self Employed" },
    ]

    const document_type = [
        { label: "Salary slips", value: "SALARY_SLIP" },
        { label: "Bank statements", value: "BANK_STATEMENT" },
        { label: "Form 16", value: "FORM_16" },
    ]

    useEffect(() => {
        if (loanData) {
            dispatch(setLoader(true))
            loanDetails({ loan_id: loanData?.id })?.then((response) => {
                if (response?.status_code === Codes.SUCCESS) {
                    let responseDetails = response?.data?.loan_application;
                    console.log('responseDetailsresponseDetails', responseDetails);
                    setValue(AstroInputTypesEnum?.LOAN_TYPE, responseDetails?.loan_type);
                    setValue(AstroInputTypesEnum?.NAME, responseDetails?.name);
                    setValue(AstroInputTypesEnum?.EMAIL, responseDetails?.email);
                    setValue(AstroInputTypesEnum?.MOBILE, responseDetails?.phone_number);
                    setValue(AstroInputTypesEnum?.GENDER, responseDetails?.gender);

                    setValue(AstroInputTypesEnum?.CURRENT_ADDRESH, responseDetails?.address);
                    setValue(AstroInputTypesEnum?.COMPANY_NAME, responseDetails?.company_name);
                    setValue(AstroInputTypesEnum?.COMPANY_ADDRESS, responseDetails?.company_address);
                    setValue(AstroInputTypesEnum?.DESIGNATION, responseDetails?.designation);
                    setValue(AstroInputTypesEnum?.PURPOSE_OF_LOAN, responseDetails?.purpose_of_loan);
                    setValue(AstroInputTypesEnum?.DESIRED_LOAN_AMOUNT, responseDetails?.desired_loan);
                    setValue(AstroInputTypesEnum?.ANNUAL_INCOME, responseDetails?.annual_income);
                    setValue(AstroInputTypesEnum?.CREDIT_SCORE, responseDetails?.credit_score);

                    setValue(AstroInputTypesEnum?.PANCARD, responseDetails?.documents?.find(doc => doc.document_type === 'PAN')?.document_number);
                    setValue(AstroInputTypesEnum?.PANCARD_FILE, getFileNameFromUrl(responseDetails?.documents?.find(doc => doc.document_type === 'PAN')?.document_file) || '1234.jpg');

                    setPanCardFileName(getFileNameFromUrl(responseDetails?.documents?.find(doc => doc.document_type === 'PAN')?.document_file))
                    setShowPanCardImage(responseDetails?.documents?.find(doc => doc.document_type === 'PAN')?.document_file)

                    setValue(AstroInputTypesEnum?.ADHARCARD, responseDetails?.documents?.find(doc => doc.document_type === 'AADHAR')?.document_number);
                    setValue(AstroInputTypesEnum?.ADHARCARD_FILE, getFileNameFromUrl(responseDetails?.documents?.find(doc => doc.document_type === 'AADHAR')?.document_file || '1234.jpg'));

                    setAdhaarCardFileName(getFileNameFromUrl(responseDetails?.documents?.find(doc => doc.document_type === 'AADHAR')?.document_file))
                    setShowadhaarCardImage(responseDetails?.documents?.find(doc => doc.document_type === 'AADHAR')?.document_file)

                    setSelectedDate(responseDetails?.date_of_birth ? dayjs(responseDetails.date_of_birth) : null);

                    console.log('responseDetails?.documents', responseDetails?.documents);

                    const documnet_proof_type = responseDetails?.documents?.filter(
                        (doc) => doc.document_type !== 'AADHAR' && doc.document_type !== 'PAN' && doc.document_type !== 'PROPERTY_DOCUMENTS'
                    );

                    const proof_type = responseDetails?.documents?.filter(
                        (doc) => doc.document_type !== 'AADHAR' && doc.document_type !== 'PAN' && doc.document_type !== 'PROPERTY_DOCUMENTS'
                    );

                    const propertyType_type = responseDetails?.documents?.filter(
                        (doc) => doc.document_type == 'PROPERTY_DOCUMENTS'
                    );

                    // const propertyType_type = responseDetails?.documents?.filter(
                    //     (doc) => doc.document_type == 'property_document'
                    // );

                    setProoftTypeFileImage((proof_type?.length > 0 ? proof_type?.map(doc => doc.document_file) : []))
                    setProoftTypeFileName((proof_type?.length > 0 ? proof_type?.map(doc => getFileNameFromUrl(doc.document_file)) : []))

                    setPropertyDocumentImage((propertyType_type?.length > 0 ? propertyType_type?.map(doc => doc.document_file) : []))
                    setPropertyDocumentFileName((propertyType_type?.length > 0 ? propertyType_type?.map(doc => getFileNameFromUrl(doc.document_file)) : []))

                    setValue(AstroInputTypesEnum?.INCOME_PROOF, "salaried" /* documnet_proof_type[0]?.proof_type || */);
                    // setValue(AstroInputTypesEnum?.DOCUMENT_PROOF_TYPE, documnet_proof_type?.length > 0 && documnet_proof_type[0]?.document_type);
                    setValue(AstroInputTypesEnum?.DOCUMENT_PROOF_TYPE, documnet_proof_type?.length > 0 && documnet_proof_type[0]?.document_type ? documnet_proof_type[0].document_type.toUpperCase() : '');

                    // setValue(AstroInputTypesEnum?.PROPERTY_DOCUMENT_FILE, propertyType_type?.length > 0 && propertyType_type[0]?.document_type ? propertyType_type[0].document_type.toUpperCase() : '');

                    setIs_loading(false)
                    dispatch(setLoader(false))
                } else {
                    dispatch(setLoader(false))
                }
            }).catch(error => {
                setIs_loading(false)
                dispatch(setLoader(false))
            });
        }
    }, [loanData]);

    const onSubmitData = async (data) => {
        try {
            dispatch(setLoader(true))
            let panImage = showPanCardImage;
            if (panImage instanceof Blob) panImage = await uploadImageOnAWS(panImage, AwsFolder?.PAN_IMAGE);

            let adhaarImage = showadhaarCardImage;
            if (adhaarImage instanceof Blob) adhaarImage = await uploadImageOnAWS(adhaarImage, AwsFolder?.ADHAR_IMAGE);

            // ------------------------------------------ Upload Proof File Image Uploading --------------------------------------------------------------

            const blobFiles = [];
            const normalFiles = [];
            let finalDocumentImageArray = [];
            let uploadedBlobUrls = [];

            if (Array.isArray(proofTypeFileImage)) {
                for (const file of proofTypeFileImage) {
                    if (file instanceof Blob || file instanceof File) {
                        blobFiles.push(file);
                    } else {
                        normalFiles.push(file);
                    }
                }
            }

            if (blobFiles.length > 0) {
                uploadedBlobUrls = await Promise.all(
                    blobFiles.map((file) =>
                        uploadImageOnAWS(file, data[AstroInputTypesEnum.INCOME_PROOF])
                    )
                );
            }

            finalDocumentImageArray = [...normalFiles, ...uploadedBlobUrls];

            // ------------------------------------------ Upload Property File Image Uploading --------------------------------------------------------------
            const blobPropertyFiles = [];
            const normalPropertyFiles = [];
            let finalPropertyImageArray = [];
            let uploadedPropertyBlobUrls = [];

            if (Array.isArray(propertyDocumentImage)) {
                for (const file of propertyDocumentImage) {
                    if (file instanceof Blob || file instanceof File) {
                        blobPropertyFiles.push(file);
                    } else {
                        normalPropertyFiles.push(file);
                    }
                }
            }

            if (blobPropertyFiles.length > 0) {
                uploadedPropertyBlobUrls = await Promise.all(
                    blobPropertyFiles?.map((file) =>
                        uploadImageOnAWS(file, AwsFolder?.PROPERTY_DOCUMENT_IMAGE)
                    )
                );
            }

            finalPropertyImageArray = [...normalPropertyFiles, ...uploadedPropertyBlobUrls];

            let request = {
                loan_type: data[AstroInputTypesEnum.LOAN_TYPE],
                name: data[AstroInputTypesEnum.NAME],
                email: data[AstroInputTypesEnum.EMAIL],
                phone_number: data[AstroInputTypesEnum.MOBILE],
                annual_income: data[AstroInputTypesEnum.ANNUAL_INCOME],
                desired_loan: data[AstroInputTypesEnum.DESIRED_LOAN_AMOUNT],
                // desired_loan: parseInt(data[AstroInputTypesEnum.DESIRED_LOAN_AMOUNT], 10),
                date_of_birth: selectedDate ? formatDateDyjs(selectedDate, DateFormat.DATE_LOCAL_DASH_TIME_FORMAT) : null,
                gender: data[AstroInputTypesEnum.GENDER],
                address: data[AstroInputTypesEnum.CURRENT_ADDRESH],
                company_name: data[AstroInputTypesEnum.COMPANY_NAME],
                company_address: data[AstroInputTypesEnum.COMPANY_ADDRESS],
                designation: data[AstroInputTypesEnum.DESIGNATION],
                purpose_of_loan: data[AstroInputTypesEnum.PURPOSE_OF_LOAN],

                pan_number: data[AstroInputTypesEnum.PANCARD],
                aadhaar_number: data[AstroInputTypesEnum.ADHARCARD],
                aadhaar_file: adhaarImage,
                pan_file: panImage,

                document_type: data[AstroInputTypesEnum.DOCUMENT_PROOF_TYPE],
                proof_type: data[AstroInputTypesEnum.INCOME_PROOF],
                document_file: finalDocumentImageArray,
                property_document_file: finalPropertyImageArray.length > 0 ? finalPropertyImageArray : [],

                pan_verified: true,
                aadhaar_verified: true,
                credit_score: data[AstroInputTypesEnum.CREDIT_SCORE]
            }

            if (loanData) {
                request.loan_id = loanData.id;
                console.log('request', request);
                updateLoanDetails(request).then((response) => {
                    if (response?.status_code === Codes.SUCCESS) {
                        TOAST_SUCCESS(response?.message)
                        navigation('/loan_list')
                    } else {
                        TOAST_ERROR(response.message)
                    }
                })
            } else {
                addLoanDetails(request).then((response) => {
                    if (response?.status_code === Codes.SUCCESS) {
                        TOAST_SUCCESS(response?.message)
                        navigation('/loan_list')
                    } else {
                        TOAST_ERROR(response.message)
                    }
                })
            }

            dispatch(setLoader(false))
        } catch (error) {
            console.log('error', error);
            TOAST_ERROR('Somthing went wrong')
        }
    }

    const handlePanImageChange = (e) => {
        const image = e.target.files[0]
        setShowPanCardImage(image)
        setPanCardFileName(image?.name)
        clearErrors(AstroInputTypesEnum.PANCARD_FILE);
    };

    const handleAdhaarImageChange = async (e) => {
        const image = e.target.files?.[0];
        // setValue(AstroInputTypesEnum?.ADHARCARD_FILE, image);
        setShowadhaarCardImage(image)
        setAdhaarCardFileName(image.name)
        clearErrors(AstroInputTypesEnum?.ADHARCARD_FILE);
    }

    const handleInputChange = async (key, value) => {
        let filteredValue = value;
        if (key === AstroInputTypesEnum.PANCARD) {
            filteredValue = value.replace(InputRegex.ONCHANGE_PANNUMBER_REGEX, '');
        } else if (key === AstroInputTypesEnum.ADHARCARD) {
            filteredValue = value.replace(InputRegex.ONCHANGE_AADHAR_REGEX, '');
        } else if (key === AstroInputTypesEnum.MOBILE || AstroInputTypesEnum?.ANNUAL_INCOME || AstroInputTypesEnum?.DESIRED_LOAN_AMOUNT) {
            filteredValue = value.replace(InputRegex.ONCHANGE_MOBILE_REGEX, '');
        }
        else if (key === AstroInputTypesEnum.MOBILE || AstroInputTypesEnum?.ANNUAL_INCOME || AstroInputTypesEnum?.DESIRED_LOAN_AMOUNT) {
            filteredValue = value.replace(InputRegex.ONCHANGE_MOBILE_REGEX, '');
        }
        setValue(key, filteredValue)
        clearErrors(key);
        await trigger(key);
    };

    // ------------------------------- Date Picker ------------------------

    const handleMultipleFilesChange = (e) => {
        const newFiles = Array.from(e.target.files || []);

        const validFiles = [];
        const invalidFiles = [];

        newFiles.forEach((file) => {
            const actualFile = file.originFileObj || file;
            if (validateFileType(actualFile)) {
                validFiles.push(actualFile);
            } else {
                invalidFiles.push(actualFile);
            }
        });

        // Append new valid files to existing ones (do not remove old files)
        setProoftTypeFileImage((prev) => [...prev, ...validFiles]);
        clearErrors(AstroInputTypesEnum.PROOF_FILE);

        // Optionally append new file names
        setProoftTypeFileName((prev) => [
            ...prev,
            ...validFiles.map((file) => file.name),
        ]);

        // Handle invalid files (optional: show a message or alert)
        if (invalidFiles.length > 0) {
            alert("Some files were invalid and were not added.");
        }
    };

    const handleRemoveFile = (index) => {
        const newFiles = [...proofTypeFileImage];
        const newFilesName = [...proofTypeFileName];

        newFiles.splice(index, 1);
        newFilesName.splice(index, 1);
        setProoftTypeFileImage(newFiles);
        setProoftTypeFileName(newFilesName);
        setValue(AstroInputTypesEnum.PROOF_FILE, newFiles)
    };

    const handlePropertyDocumentChange = (e) => {
        const newFiles = Array.from(e.target.files || []);

        const validFiles = [];
        const invalidFiles = [];

        newFiles.forEach((file) => {
            const actualFile = file.originFileObj || file;
            if (validateFileType(actualFile)) {
                validFiles.push(actualFile);
            } else {
                invalidFiles.push(actualFile);
            }
        });

        clearErrors(AstroInputTypesEnum.PROPERTY_DOCUMENT_FILE);

        // Append new valid files to existing ones (do not remove old files)
        setPropertyDocumentImage((prev) => [...prev, ...validFiles]);

        // Optionally append new file names
        setPropertyDocumentFileName((prev) => [
            ...prev,
            ...validFiles.map((file) => file.name),
        ]);

        // Handle invalid files (optional: show a message or alert)
        if (invalidFiles.length > 0) {
            alert("Some files were invalid and were not added.");
        }
    };

    const handlePropertyDocumentRemoveFile = (index) => {
        const newFiles = [...propertyDocumentImage];
        const newFilesName = [...propertyDocumentFileName];
        newFiles.splice(index, 1);
        newFilesName.splice(index, 1);
        setValue(AstroInputTypesEnum.PROPERTY_DOCUMENT_FILE, newFiles)
        setPropertyDocumentImage(newFiles);
        setPropertyDocumentFileName(newFilesName);
    };

    return (
        <>
            {<Spinner isActive={is_loding} message={'Please Wait'} />}
            <div className="container-fluid mw-100">
                <SubNavbar title={loanData ? 'Edit Loan' : 'Add Loan'} header={'Loan List'} subHeaderOnlyView={loanData ? 'Edit Loan' : 'Add Loan'} />
                <div className="row m-2">
                    <div className="col-12 justify-content-center">
                        <div className='row justify-content-center '>
                            <form onSubmit={handleSubmit(onSubmitData)}>
                                <div className="card" >
                                    <div className="card-body">

                                        <div className="row justify-content-center">
                                            <div className="col-auto">
                                                <div className="card shadow-sm custom-card">

                                                </div>
                                            </div>
                                        </div>

                                        {/* <div className="p-9 py-3 border-bottom chat-meta-user d-flex align-items-center justify-content-between mb-4">
                                            <h5 className="text-secondary mb-0 fw-semibold">Personal Details</h5>
                                            <ul className="list-unstyled mb-0 d-flex align-items-center">
                                            </ul>
                                        </div> */}

                                        <div className='row'>
                                            <div className='col-md-6'>
                                                <div className="mb-4">
                                                    <label htmlFor="lastname" className="form-label fw-semibold">
                                                        Name<span className="text-danger ms-1">*</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <input
                                                            type="text"
                                                            className="form-control ps-2"
                                                            placeholder="Enter Name"
                                                            onKeyPress={allowLettersAndSpaces}
                                                            autoComplete='nope'
                                                            // {...register('category_en', { required: "Enter category" })}
                                                            {...register(AstroInputTypesEnum.NAME, textInputValidation(AstroInputTypesEnum.NAME, Language('Enter name')))}
                                                        />
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.NAME]?.message}
                                                    </label>
                                                </div>

                                                <div className="row mb-4 ">
                                                    <div className="col-12 col-md-6">
                                                        <label htmlFor="lastname" className="form-label fw-semibold">
                                                            Desired Loan Amount<span className="text-danger ms-1">*</span>
                                                        </label>
                                                        <div className="input-group border rounded-1">
                                                            <input
                                                                type="text"
                                                                className="form-control ps-2"
                                                                placeholder="Enter Desired Loan Amount"
                                                                autoComplete='nope'
                                                                // {...register('category_en', { required: "Enter category" })}
                                                                {...register(AstroInputTypesEnum.DESIRED_LOAN_AMOUNT, textInputValidation(AstroInputTypesEnum.DESIRED_LOAN_AMOUNT, Language('Enter desired loan amount')))}
                                                                onChange={(e) => handleInputChange(AstroInputTypesEnum.DESIRED_LOAN_AMOUNT, e.target.value)}
                                                                maxLength={10}
                                                            />
                                                        </div>
                                                        <label className="errorc ps-1 pt-1">
                                                            {errors[AstroInputTypesEnum.DESIRED_LOAN_AMOUNT]?.message}
                                                        </label>
                                                    </div>

                                                    <div className="col-12 col-md-6 mb-3 mb-md-0">
                                                        <label htmlFor="lastname" className="form-label fw-semibold">
                                                            Annual Income<span className="text-danger ms-1">*</span>
                                                        </label>
                                                        <div className="input-group border rounded-1">
                                                            <input
                                                                type="text"
                                                                className="form-control ps-2"
                                                                placeholder="Enter Annual Income"
                                                                autoComplete='nope'
                                                                // {...register('category_en', { required: "Enter category" })}
                                                                {...register(AstroInputTypesEnum.ANNUAL_INCOME, textInputValidation(AstroInputTypesEnum.ANNUAL_INCOME, Language('Enter annual income')))}
                                                                onChange={(e) => handleInputChange(AstroInputTypesEnum.ANNUAL_INCOME, e.target.value)}
                                                                maxLength={10}
                                                            />
                                                        </div>
                                                        <label className="errorc ps-1 pt-1">
                                                            {errors[AstroInputTypesEnum.ANNUAL_INCOME]?.message}
                                                        </label>
                                                    </div>
                                                </div>

                                                <div className="row mb-4 ">
                                                    <div className="col-12 col-md-6">
                                                        <label htmlFor="gender2" className="form-label fw-semibold">
                                                            Date of Birth <span className="text-danger ms-1">*</span>
                                                        </label>
                                                        <DatePicker
                                                            className="form-control custom-datepicker w-100"
                                                            format={dateFormat}
                                                            value={selectedDate}
                                                            onChange={(date) => {
                                                                setSelectedDate(date);
                                                            }}
                                                            allowClear={false} // prevent user from clearing the field (optional)
                                                            picker="date" // ensures it's only a single date picker
                                                        />
                                                        {/* <label className="errorc ps-1 pt-1">
                                                            {errors[AstroInputTypesEnum.GENDER]?.message}
                                                        </label> */}
                                                    </div>
                                                    <div className="col-12 col-md-6 mb-3 mb-md-0">
                                                        <label htmlFor="gender1" className="form-label fw-semibold">
                                                            Gender <span className="text-danger ms-1">*</span>
                                                        </label>
                                                        <div className="input-group border rounded-1">
                                                            <select
                                                                id="gender1"
                                                                className="form-control ps-2 p-2"
                                                                autoComplete="nope"
                                                                {...register(AstroInputTypesEnum.GENDER, {
                                                                    required: "Please Enter Gender",
                                                                })}
                                                            >
                                                                <option value="">Select Gender</option>
                                                                <option value="male">Male</option>
                                                                <option value="female">Female</option>
                                                                <option value="other">Other</option>
                                                            </select>
                                                        </div>
                                                        <label className="errorc ps-1 pt-1">
                                                            {errors[AstroInputTypesEnum.GENDER]?.message}
                                                        </label>
                                                    </div>
                                                </div>

                                                <div className="mb-4">
                                                    <label htmlFor="lastname" className="form-label fw-semibold">
                                                        Mobile Number <span className="text-danger ms-1">*</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <input
                                                            name={AstroInputTypesEnum.MOBILE}
                                                            type="text"
                                                            className="form-control ps-2"
                                                            placeholder="Enter Mobile Number"
                                                            autoComplete='nope'
                                                            {...register(AstroInputTypesEnum.MOBILE, textInputValidation(AstroInputTypesEnum.MOBILE, Language('Enter mobile number')))}
                                                            onChange={(e) => handleInputChange(AstroInputTypesEnum.MOBILE, e.target.value)}
                                                            maxLength={10}
                                                        />
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.MOBILE]?.message}
                                                    </label>
                                                </div>

                                                <div className="mb-4">
                                                    <label htmlFor="lastname" className="form-label fw-semibold">
                                                        Company Name <span className="text-danger ms-1">*</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <input
                                                            type="text"
                                                            className="form-control ps-2"
                                                            placeholder="Enter Company Name"
                                                            autoComplete='nope'
                                                            {...register(AstroInputTypesEnum.COMPANY_NAME, textInputValidation(AstroInputTypesEnum.COMPANY_NAME, Language('Enter company name')))}
                                                        />
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.COMPANY_NAME]?.message}
                                                    </label>
                                                </div>

                                                <div className="mb-4">
                                                    <label htmlFor="lastname" className="form-label fw-semibold">
                                                        PAN Card Number<span className="text-danger ms-1">*</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <input
                                                            type="text"
                                                            className="form-control ps-2"
                                                            placeholder="Enter PAN Card Number"
                                                            autoComplete='nope'
                                                            {...register(AstroInputTypesEnum.PANCARD, textValidation(AstroInputTypesEnum.PANCARD, Language('Enter PAN Card number')))}
                                                            onChange={(e) => handleInputChange(AstroInputTypesEnum.PANCARD, e.target.value.toUpperCase())}
                                                            maxLength={10}
                                                        />
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.PANCARD]?.message}
                                                    </label>
                                                </div>

                                                <div className="mb-4">
                                                    <label htmlFor="lastname" className="form-label fw-semibold">
                                                        Aadhaar Card Number<span className="text-danger ms-1">*</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <input
                                                            type="text"
                                                            className="form-control ps-2"
                                                            placeholder="Enter Aadhaar Card Number"
                                                            autoComplete='nope'
                                                            {...register(AstroInputTypesEnum.ADHARCARD, textValidation(AstroInputTypesEnum.ADHARCARD, Language('Enter Aadhaar Card number')))}
                                                            onChange={(e) => handleInputChange(AstroInputTypesEnum.ADHARCARD, e.target.value)}
                                                            maxLength={12}
                                                        />
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.ADHARCARD]?.message}
                                                    </label>
                                                </div>

                                                <div className="row  mb-4 ">
                                                    <div className="col-12 col-md-6">
                                                        <label htmlFor="gender1" className="form-label fw-semibold">
                                                            Income Proof Type<span className="text-danger ms-1">*</span>
                                                        </label>
                                                        <div className="input-group border rounded-1">
                                                            <select
                                                                id="gender1"
                                                                className="form-control ps-2 p-2"
                                                                autoComplete="nope"
                                                                {...register(AstroInputTypesEnum?.INCOME_PROOF, {
                                                                    required: "Please Income Proof",
                                                                })}
                                                            >
                                                                {proof_type?.map((option) => (
                                                                    <option key={option.value} value={option.value}>
                                                                        {option.label}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <label className="errorc ps-1 pt-1">
                                                            {errors[AstroInputTypesEnum.INCOME_PROOF]?.message}
                                                        </label>
                                                    </div>

                                                    <div className="col-12 col-md-6 mb-3 mb-md-0">
                                                        <label htmlFor="gender1" className="form-label fw-semibold">
                                                            Document Proof Type<span className="text-danger ms-1">*</span>
                                                        </label>
                                                        <div className="input-group border rounded-1">
                                                            <select
                                                                id="gender1"
                                                                className="form-control ps-2 p-2"
                                                                autoComplete="nope"
                                                                {...register(AstroInputTypesEnum?.DOCUMENT_PROOF_TYPE, {
                                                                    required: "Select Proof Type",
                                                                })}
                                                            >
                                                                {document_type?.map((option) => (
                                                                    <option key={option.value} value={option.value}>
                                                                        {option.label}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <label className="errorc ps-1 pt-1">
                                                            {errors[AstroInputTypesEnum.DOCUMENT_PROOF_TYPE]?.message}
                                                        </label>
                                                    </div>
                                                </div>

                                                <div className="mb-4">
                                                    <label htmlFor="lastname" className="form-label fw-semibold">
                                                        Upload Proof File<span className="text-danger ms-1">*</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <input
                                                            name={AstroInputTypesEnum.PROOF_FILE}
                                                            className="form-control ps-2"
                                                            type="file"
                                                            id="formFileMultiple"
                                                            accept=".pdf, image/jpeg, image/png"
                                                            multiple
                                                            {...register(AstroInputTypesEnum.PROOF_FILE, {
                                                                required: proofTypeFileName.length === 0 ? "Upload at least one file" : false,
                                                            })}
                                                            onChange={handleMultipleFilesChange}
                                                        />
                                                    </div>

                                                    {proofTypeFileName?.length > 0 && (
                                                        <ul className="text-muted mt-1 ps-3">
                                                            {proofTypeFileName.map((name, index) => (
                                                                <li key={index} className="d-flex justify-content-between align-items-center mt-1">
                                                                    {name}
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleRemoveFile(index)}
                                                                        className="btn btn-sm btn-danger ms-2"
                                                                    >
                                                                        Remove
                                                                    </button>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.PROOF_FILE]?.message}
                                                    </label>
                                                </div>
                                            </div>

                                            <div className='col-md-6'>
                                                <div className="mb-4">
                                                    <label htmlFor="gender1" className="form-label fw-semibold">
                                                        Loan Type <span className="text-danger ms-1">*</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <select
                                                            id="gender1"
                                                            className="form-control ps-2 p-2"
                                                            autoComplete="nope"
                                                            {...register(AstroInputTypesEnum.LOAN_TYPE, {
                                                                required: "Select Loan Type",
                                                            })}
                                                        >
                                                            <option value="">Select Loan Type</option>
                                                            <option value={LOAN_TYPES?.PERSONAL}>{LOAN_TYPES?.PERSONAL}</option>
                                                            <option value={LOAN_TYPES?.LAP}>{LOAN_TYPES?.LAP}</option>
                                                            <option value={LOAN_TYPES?.MSME}>{LOAN_TYPES?.MSME}</option>
                                                            <option value={LOAN_TYPES?.MICRO}>{LOAN_TYPES?.MICRO}</option>
                                                        </select>
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.LOAN_TYPE]?.message}
                                                    </label>
                                                </div>

                                                <div className="mb-4">
                                                    <label htmlFor="lastname" className="form-label fw-semibold">
                                                        Purpose of Loan<span className="text-danger ms-1">*</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <input
                                                            type="text"
                                                            className="form-control ps-2"
                                                            placeholder="Enter Purpose of Loan"
                                                            autoComplete='nope'
                                                            // {...register('category_en', { required: "Enter category" })}
                                                            {...register(AstroInputTypesEnum.PURPOSE_OF_LOAN, textInputValidation(AstroInputTypesEnum.PURPOSE_OF_LOAN, Language('Enter purpose of loan')))}
                                                        />
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.PURPOSE_OF_LOAN]?.message}
                                                    </label>
                                                </div>

                                                <div className="mb-4">
                                                    <label htmlFor="lastname" className="form-label fw-semibold">
                                                        Designation<span className="text-danger ms-1">*</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <input
                                                            type="text"
                                                            className="form-control ps-2"
                                                            placeholder="Enter Designation"
                                                            autoComplete='nope'
                                                            // {...register('category_en', { required: "Enter category" })}
                                                            {...register(AstroInputTypesEnum.DESIGNATION, textInputValidation(AstroInputTypesEnum.DESIGNATION, Language('Enter designation')))}
                                                        />
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.DESIGNATION]?.message}
                                                    </label>
                                                </div>

                                                <div className="mb-4">
                                                    <label htmlFor="lastname" className="form-label fw-semibold">
                                                        Email Address<span className="text-danger ms-1">*</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <input
                                                            name={AstroInputTypesEnum.EMAIL}
                                                            type="text"
                                                            className="form-control ps-2"
                                                            placeholder="Enter Email Address"
                                                            autoComplete='nope'
                                                            {...register(AstroInputTypesEnum.EMAIL, textValidation(AstroInputTypesEnum.EMAIL, Language('Enter email address')))}
                                                        // onChange={(e) => handleInputChange(AstroInputTypesEnum.EMAIL, e.target.value)}
                                                        />
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.EMAIL]?.message}
                                                    </label>
                                                </div>

                                                <div className="mb-4">
                                                    <label htmlFor="lastname" className="form-label fw-semibold">
                                                        Company Address <span className="text-danger ms-1">*</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <input
                                                            type="text"
                                                            className="form-control ps-2"
                                                            placeholder="Enter Company Address"
                                                            autoComplete='nope'
                                                            {...register(AstroInputTypesEnum.COMPANY_ADDRESS, textInputValidation(AstroInputTypesEnum.COMPANY_ADDRESS, Language('Enter company address')))}
                                                        />
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.COMPANY_ADDRESS]?.message}
                                                    </label>
                                                </div>

                                                <div className="mb-4">
                                                    <label htmlFor="lastname" className="form-label fw-semibold">
                                                        PAN Card File<span className="text-danger ms-1">*</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <input
                                                            name={AstroInputTypesEnum.PANCARD_FILE}
                                                            className="form-control ps-2"
                                                            type="file"
                                                            id="formFileMultiple"
                                                            accept=".pdf, image/jpeg, image/png"
                                                            {...register(AstroInputTypesEnum.PANCARD_FILE, {
                                                                required: !panCardFileName ? "Upload your PAN Card file" : false,
                                                                // validate: {
                                                                //     fileType: (value) => {
                                                                //         const file = value && value.length > 0 ? value.item(0) : null;
                                                                //         return file && /pdf|image\/(jpeg|png)/.test(file.type)
                                                                //             ? true
                                                                //             : "Only PDF, JPG, or PNG files are allowed";
                                                                //     },
                                                                // },
                                                            })}
                                                            onChange={handlePanImageChange}
                                                        />
                                                    </div>
                                                    {panCardFileName && (
                                                        <small className="text-muted mt-1 d-block">
                                                            Selected file: {panCardFileName}
                                                        </small>
                                                    )}

                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.PANCARD_FILE]?.message}
                                                    </label>
                                                </div>

                                                <div className="mb-4">
                                                    <label htmlFor="lastname" className="form-label fw-semibold">
                                                        Aadhaar Card File<span className="text-danger ms-1">*</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <input
                                                            className="form-control ps-2"
                                                            type="file"
                                                            id="formFileMultiple"
                                                            accept=".pdf, image/jpeg, image/png"
                                                            {...register(AstroInputTypesEnum.ADHARCARD_FILE, {
                                                                required: !adhaarCardFileName ? "Upload your Aadhaar Card file" : false,
                                                                // validate: {
                                                                //     fileType: (value) =>
                                                                //         value[0]?.type.match(/pdf|image\/(jpeg|png)/)
                                                                //             ? true
                                                                //             : "Only PDF, JPG, or PNG files are allowed",
                                                                // },
                                                            })}
                                                            onChange={handleAdhaarImageChange}
                                                        />
                                                    </div>

                                                    {adhaarCardFileName && (
                                                        <small className="text-muted mt-1 d-block">
                                                            Selected file: {adhaarCardFileName}
                                                        </small>
                                                    )}
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.ADHARCARD_FILE]?.message}
                                                    </label>
                                                </div>

                                                <div className="mb-2">
                                                    <label htmlFor="product_name" className="form-label fw-semibold">
                                                        Address <span className="text-danger ms-1">*</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <textarea
                                                            className="form-control ps-2"
                                                            placeholder="Enter Address"
                                                            autoComplete="off"
                                                            {...register(
                                                                AstroInputTypesEnum.CURRENT_ADDRESH,
                                                                textInputValidation(
                                                                    AstroInputTypesEnum.CURRENT_ADDRESH,
                                                                    Language('Enter address')
                                                                )
                                                            )}
                                                        />
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.CURRENT_ADDRESH]?.message}
                                                    </label>
                                                </div>

                                                <div className="mb-4">
                                                    <label htmlFor="lastname" className="form-label fw-semibold">
                                                        Credit Score<span className="text-danger ms-1">*</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <input
                                                            type="number"
                                                            className="form-control ps-2"
                                                            placeholder="Enter credit score"
                                                            autoComplete="nope"
                                                            {...register(AstroInputTypesEnum.CREDIT_SCORE, {
                                                                required: "Enter credit score",
                                                                min: {
                                                                    value: 300,
                                                                    message: "Credit score must be at least 300",
                                                                },
                                                                max: {
                                                                    value: 900,
                                                                    message: "Credit score cannot exceed 900",
                                                                },
                                                            })}
                                                        />
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.CREDIT_SCORE]?.message}
                                                    </label>
                                                </div>
                                                {watch(AstroInputTypesEnum.LOAN_TYPE) === LOAN_TYPES?.LAP && (
                                                    <div className="mb-4">
                                                        <label htmlFor="lastname" className="form-label fw-semibold">
                                                            Upload Property Documents<span className="text-danger ms-1">*</span>
                                                        </label>
                                                        <div className="input-group border rounded-1">
                                                            <input
                                                                name={AstroInputTypesEnum.PROPERTY_DOCUMENT_FILE}
                                                                className="form-control ps-2"
                                                                type="file"
                                                                id="formFileMultiple"
                                                                multiple
                                                                {...register(AstroInputTypesEnum.PROPERTY_DOCUMENT_FILE, {
                                                                    required: propertyDocumentFileName.length === 0 ? "Upload at least one Property Document" : false,
                                                                })}
                                                                onChange={handlePropertyDocumentChange}
                                                            />
                                                        </div>

                                                        {propertyDocumentFileName?.length > 0 && (
                                                            <ul className="text-muted mt-1 ps-3">
                                                                {propertyDocumentFileName.map((name, index) => (
                                                                    <li key={index} className="d-flex justify-content-between align-items-center mt-1">
                                                                        {name}
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handlePropertyDocumentRemoveFile(index)}
                                                                            className="btn btn-sm btn-danger ms-2"
                                                                        >
                                                                            Remove
                                                                        </button>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        )}
                                                        <label className="errorc ps-1 pt-1">
                                                            {errors[AstroInputTypesEnum.PROPERTY_DOCUMENT_FILE]?.message}
                                                        </label>

                                                    </div>
                                                )}
                                            </div>

                                            <div className="modal-footer justify-content-center mb-3">
                                                <button type='button' className="btn btn-danger m-2" onClick={() => { loanData ? navigation('/loan_list') : reset() }}>Cancel</button>
                                                <button type='submit' className="btn btn-primary" >Submit</button>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                {/* </div > */}
            </div >

        </>
    )
}
