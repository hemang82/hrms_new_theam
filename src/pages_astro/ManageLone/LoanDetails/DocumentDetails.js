import React, { useState } from 'react'
import { MdDelete, MdEdit, MdOutlineFileDownload, MdOutlineInsertDriveFile, MdOutlineRemoveRedEye } from 'react-icons/md'
import { getDocumentStatusObject, getFileNameFromUrl, getLoanTypeObject } from '../../../config/commonFunction'
import { useForm } from 'react-hook-form';
import { AstroInputTypesEnum } from '../../../config/commonVariable';
import { uploadImageOnAWS } from '../../../utils/aws.service';
import { AwsFolder, Codes } from '../../../config/constant';
import { TOAST_ERROR, TOAST_SUCCESS } from '../../../config/common';
import { addLoanComplateDocument, deleteLoanComplateDocument, updateLoanComplateDocument } from '../../../utils/api.services';

export const DocumentDetails = ({ loanDetailsData, setApiReload }) => {

    const { register, handleSubmit, setValue, clearErrors, reset, watch, control, formState: { errors } } = useForm();
    const [loanCompletionModel, setLoanCompletionModel] = useState(false);
    const [loanCompletionFileName, setLoanCompletionFileName] = useState('');
    const [showLoanCompletionImage, setShowLoanCompletionImage] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [editData, setEditData] = useState(null);

    const onSubmitData = async (data) => {
        let completionImage = showLoanCompletionImage;
        if (completionImage instanceof Blob) completionImage = await uploadImageOnAWS(completionImage, AwsFolder?.ADHAR_IMAGE);
        setApiReload(true)
        const sendRequest = {
            applicant_id: loanDetailsData?.id,
            document_name: data[AstroInputTypesEnum.TITLE],
            document_file: completionImage,
        }
        if (isEdit) {
            sendRequest.document_id = editData?.id;
            updateLoanComplateDocument(sendRequest).then((response) => {
                if (response?.status_code === Codes.SUCCESS) {
                    TOAST_SUCCESS(response?.message);
                    setLoanCompletionModel(false)
                    setLoanCompletionFileName(null);
                    setApiReload(false)
                    reset()
                } else {
                    setApiReload(false)
                    TOAST_ERROR(response?.message)
                    setLoanCompletionModel(false)
                    reset()
                }
            })
        } else {
            addLoanComplateDocument(sendRequest).then((response) => {
                if (response?.status_code === Codes.SUCCESS) {
                    setApiReload(true)
                    TOAST_SUCCESS(response?.message);
                    setLoanCompletionModel(false)
                    setApiReload(false)
                    reset()
                } else {
                    TOAST_ERROR(response?.message)
                    reset()
                    setLoanCompletionModel(false)
                }
            })

        }
    }

    const handleAdhaarImageChange = async (e) => {
        const image = e.target.files?.[0];
        // setValue(AstroInputTypesEnum?.LOAN_COMPLETION_FILE, image);
        setShowLoanCompletionImage(image)
        setLoanCompletionFileName(image.name)
        clearErrors(AstroInputTypesEnum?.LOAN_COMPLETION_FILE);
    }

    const handleEditDocument = (data) => {
        setValue(AstroInputTypesEnum.TITLE, data?.document_name);
        setLoanCompletionFileName(getFileNameFromUrl(data?.document_file))
        setShowLoanCompletionImage(data?.document_file)
        setLoanCompletionModel(true)
        setIsEdit(true)
        setEditData(data)
    }

    const handleDeleteDocument = (data) => {
        const sendRequest = {
            document_id: data?.id
        }
        deleteLoanComplateDocument(sendRequest).then((response) => {
            if (response?.status_code === Codes.SUCCESS) {
                setApiReload(true)
                TOAST_SUCCESS(response?.message);
                setApiReload(false)
                reset()
            } else {
                TOAST_ERROR(response?.message)
            }
        })
    }

    return (
        <>
            <div className="col-12 justify-content-center">
                <div className="row justify-content-center">
                    <div className="card overflow-hidden chat-application">
                        <div className="p-md-4 p-4 row_2">
                            <div className="p-9 py-3 border-bottom chat-meta-user d-flex align-items-center justify-content-between mb-4">
                                <h5 className="text-secondary mb-0 fw-semibold fs-6">Loan Document Details</h5>
                                <ul className="list-unstyled mb-0 d-flex align-items-center">
                                </ul>
                            </div>
                        </div>
                        <div className="p-4 d-grid row_2 gap-5">
                            {loanDetailsData?.documents?.length > 0 &&
                                loanDetailsData?.documents.map((item, index) => (
                                    <div
                                        key={index}
                                        className="d-flex flex-wrap align-items-center justify-content-between py-3 border-bottom"
                                    >
                                        <div className="d-flex flex-column">
                                            <h6 className="fw-semibold mb-1 fs-5">
                                                {getDocumentStatusObject(item?.document_type)?.value}
                                            </h6>

                                            {/* {item?.document_number && ( */}
                                            {
                                                item.document_number &&
                                                <small className="text-muted fs-4 fw-semibold">
                                                    Document No: {item.document_number || ' NA'}
                                                </small>
                                            }
                                            {/* )} */}
                                        </div>

                                        {item?.document_file && (
                                            <a
                                                href={item.document_file}
                                                download
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="d-flex align-items-center gap-2 text-decoration-none"
                                            >
                                                <span
                                                    style={{
                                                        color: "#1A237E",
                                                        fontWeight: "500",
                                                        fontSize: "15px",
                                                    }}
                                                >
                                                    View
                                                </span>
                                                <div
                                                    className="d-flex align-items-center justify-content-center rounded-circle me-3"
                                                    style={{
                                                        width: "30px",
                                                        height: "30px",
                                                        backgroundColor: "#1A237E",
                                                        color: "#fff",
                                                    }}
                                                >
                                                    <MdOutlineRemoveRedEye size={15} />
                                                </div>

                                            </a>
                                        )}
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            </div>
            {
                loanDetailsData?.status === "DISBURSED" && <div className="col-12 justify-content-center">
                    <div className="row justify-content-center">
                        <div className="card overflow-hidden chat-application">
                            <div className="p-md-4 p-4 row_2">
                                <div className="p-9 py-3 border-bottom chat-meta-user row align-items-center mb-4">
                                    {/* Title */}
                                    <div className="col-12 col-md-8">
                                        <h5 className="text-secondary mb-0 fw-semibold fs-6">
                                            Upload Loan Document
                                        </h5>
                                    </div>

                                    {/* Button */}
                                    <div className="col-12 col-md-4 text-md-end mt-3 mt-md-0">
                                        <button
                                            type="button"
                                            className="btn btn-primary btn-md p-2"
                                            onClick={() => { setLoanCompletionModel(true) }}
                                        >
                                            Add Document
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {loanDetailsData?.loan_approved_document?.length > 0 ?
                                <div className="p-4 d-grid row_2 gap-5">
                                    {loanDetailsData?.loan_approved_document?.map((item, index) => (
                                        <div
                                            key={index}
                                            className="d-flex flex-wrap align-items-center justify-content-between py-3 border-bottom"
                                        >
                                            {/* Left Side - Document Info */}
                                            <div className="d-flex flex-column">
                                                <h6 className="fw-semibold mb-1 fs-5">
                                                    {item?.document_name}
                                                </h6>
                                                {/* <small className="text-muted fs-4">
                                                Document No: {item.document_number || ' NA'}
                                            </small> */}
                                            </div>
                                            {/* Right Side - Actions */}
                                            <div className="d-flex align-items-center gap-3 mt-3 mt-md-0 flex-shrink-0">

                                                {/* Download */}
                                                {item?.document_file && (
                                                    <a
                                                        href={item.document_file}
                                                        download
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="d-flex flex-column align-items-center text-decoration-none"
                                                        style={{ minWidth: "60px" }}
                                                    >

                                                        <small
                                                            style={{
                                                                color: "#1A237E",
                                                                fontWeight: "500",
                                                                fontSize: "12px",
                                                                marginTop: "4px",
                                                            }}
                                                        >
                                                            View
                                                        </small>
                                                        <div
                                                            className="d-flex align-items-center justify-content-center rounded-circle me-3"
                                                            style={{
                                                                width: "40px",
                                                                height: "40px",
                                                                backgroundColor: "#1A237E",
                                                                color: "#fff",
                                                            }}
                                                        >
                                                            <MdOutlineRemoveRedEye size={25} />
                                                        </div>
                                                    </a>
                                                )}

                                                {/* Edit */}
                                                <button
                                                    type="button"
                                                    className="d-flex flex-column align-items-center border-0 bg-transparent p-0"
                                                    style={{ minWidth: "60px" }}
                                                    onClick={() => handleEditDocument(item)}
                                                >
                                                    <div
                                                        className="d-flex align-items-center justify-content-center rounded-circle"
                                                        style={{
                                                            width: "40px",
                                                            height: "40px",
                                                            backgroundColor: "#1A237E",
                                                            color: "#fff",
                                                        }}
                                                    >
                                                        <MdEdit size={25} />
                                                    </div>
                                                    <small
                                                        style={{
                                                            color: "#1A237E",
                                                            fontWeight: "500",
                                                            fontSize: "12px",
                                                            marginTop: "4px",
                                                        }}
                                                    >
                                                        Edit
                                                    </small>
                                                </button>

                                                {/* Delete */}
                                                <button
                                                    type="button"
                                                    className="d-flex flex-column align-items-center border-0 bg-transparent p-0"
                                                    style={{ minWidth: "60px" }}
                                                    onClick={() => handleDeleteDocument(item)}
                                                >
                                                    <div
                                                        className="d-flex align-items-center justify-content-center rounded-circle"
                                                        style={{
                                                            width: "40px",
                                                            height: "40px",
                                                            backgroundColor: "#B71C1C", // Red for delete
                                                            color: "#fff",
                                                        }}
                                                    >
                                                        <MdDelete size={25} />
                                                    </div>
                                                    <small
                                                        style={{
                                                            color: "#B71C1C",
                                                            fontWeight: "500",
                                                            fontSize: "12px",
                                                            marginTop: "4px",
                                                        }}
                                                    >
                                                        Delete
                                                    </small>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div> :
                                <div className="text-center py-5">
                                    <div className="d-flex flex-column align-items-center justify-content-center"
                                        style={{ color: "#6c757d" }} >
                                        <p style={{ fontSize: "16px", fontWeight: "500" }}>No Document Found</p>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            }


            <div className={`modal custom-modal  ${loanCompletionModel ? "fade show d-block " : "d-none"}`}
                id="addnotesmodal" tabIndex={-1} role="dialog" aria-labelledby="addnotesmodalTitle" aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-centered" role="document" >

                    <div className="modal-content border-0">
                        <div className="modal-header bg-primary " style={{ borderRadius: '10px 10px 0px 0px' }}>
                            <h6 className="modal-title text-dark fs-5">{isEdit ? "Edit" : "Add"} Completion Document</h6>
                            <button type="button" className="btn-close btn-close-dark" data-bs-dismiss="modal" aria-label="Close" onClick={() => { setLoanCompletionModel(false); setLoanCompletionFileName(null); setIsEdit(false); setEditData(null); reset() }} />
                        </div>

                        <div className="modal-body">
                            <form onSubmit={handleSubmit(onSubmitData)}>
                                <div className="col-lg-12">
                                    <div className="card-body p-4">
                                        <div className='row d-flex gap-3'>
                                            <div className='col'>
                                                <div className="mb-4">
                                                    <label htmlFor="question" className="form-label fw-semibold">Document Name <span className="text-danger ms-1"> *</span></label>
                                                    <input type="text" className="form-control ps-2" placeholder="Enter document name" {...register(AstroInputTypesEnum.TITLE, { required: "Enter document name" })} />
                                                    <label className="errorc ps-1 pt-1">{errors[AstroInputTypesEnum.TITLE]?.message}</label>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <label htmlFor="lastname" className="form-label fw-semibold">
                                                Loan Completion File<span className="text-danger ms-1">*</span>
                                            </label>
                                            <div className="input-group border rounded-1">
                                                <input
                                                    className="form-control ps-2"
                                                    type="file"
                                                    id="formFileMultiple"
                                                    accept=".pdf, image/jpeg, image/png"
                                                    {...register(AstroInputTypesEnum.LOAN_COMPLETION_FILE, {
                                                        required: !loanCompletionFileName ? "Upload your loan completion file" : false,
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

                                            {loanCompletionFileName && (
                                                <small className="text-muted mt-1 d-block">
                                                    Selected file: {loanCompletionFileName}
                                                </small>
                                            )}
                                            <label className="errorc ps-1 pt-1">
                                                {errors[AstroInputTypesEnum.LOAN_COMPLETION_FILE]?.message}
                                            </label>
                                        </div>

                                        <div className="modal-footer justify-content-center">
                                            <button type="button" className="btn btn-danger" onClick={() => { setLoanCompletionModel(false); setIsEdit(false); setLoanCompletionFileName(null); setEditData(null); reset() }}>Cancel</button>
                                            <button type="submit" className="btn btn-primary">{isEdit ? "Update" : "Submit"}</button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div >
            {
                loanCompletionModel && (
                    <div className="modal-backdrop fade show"></div>
                )
            }
        </>
    )
}
