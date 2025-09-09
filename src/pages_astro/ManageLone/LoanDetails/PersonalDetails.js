import React from 'react'
import { formatDate } from '../../../config/common';
import { DateFormat } from '../../../config/commonVariable';
import { ALLSTATUS_LIST, formatIndianPrice, STATUS_CLASSES } from '../../../config/commonFunction';
import pdfThmbnail from "../../../assets/ProfileImage/PDF_Thmbnail.png";


export const PersonalDetails = ({ loanDetailsData }) => {

    const loanAprovedDetails = loanDetailsData?.approval_details?.length > 0 && loanDetailsData?.approval_details[0];
    const loanBankDetails = loanDetailsData?.bank_accounts?.length > 0 && loanDetailsData?.bank_accounts[0];

    return (
        <div>
            <div className="col-12 justify-content-center">
                <div className='row justify-content-center '>
                    <div className="card overflow-hidden chat-application ">

                        <div className="d-flex w-100">
                            <div className="d-flex w-100">
                                <div className="w-100">
                                    <div className="chat-container">
                                        <div className="chat-box-inner-part h-100">
                                            <div className="chatting-box app-email-chatting-box">

                                                <div className="position-relative overflow-hidden">
                                                    <div className="position-relative">
                                                        <div className="chat-box p-9">
                                                            <div className="chat-list chat active-chat" >

                                                                <div className="row">

                                                                    <div className="p-9 py-3 border-bottom chat-meta-user d-flex align-items-center justify-content-between mb-4">
                                                                        <h5 className="text-secondary mb-0 fw-semibold">Personal Details</h5>
                                                                        <ul className="list-unstyled mb-0 d-flex align-items-center">
                                                                        </ul>
                                                                    </div>

                                                                    <div className="col-7 mb-7">
                                                                        <p className="mb-1 fs-3">Name</p>
                                                                        <h6 className="fw-semibold mb-0 fs-4 text-capitalize">{loanDetailsData?.name}</h6>
                                                                    </div>
                                                                    <div className="col-5 mb-7">
                                                                        <p className="mb-1 fs-3">Gender</p>
                                                                        <h6 className="fw-semibold mb-0 fs-4 text-capitalize">{loanDetailsData?.gender}</h6>
                                                                    </div>
                                                                    <div className="col-7 mb-7">
                                                                        <p className="mb-1 fs-3">Mobile Number</p>
                                                                        <h6 className="fw-semibold mb-0 fs-4">{loanDetailsData?.phone_number}</h6>
                                                                    </div>
                                                                    <div className="col-5 mb-7">
                                                                        <p className="mb-1 fs-3">Email address</p>
                                                                        <h6 className="fw-semibold mb-0 fs-4">{loanDetailsData?.email}</h6>
                                                                    </div>
                                                                    <div className="col-7 mb-7">
                                                                        <p className="mb-1 fs-3">Date Of Birth</p>
                                                                        <h6 className="fw-semibold mb-0 fs-4">{formatDate(loanDetailsData?.date_of_birth, DateFormat?.DATE_FORMAT)}</h6>
                                                                    </div>
                                                                    <div className="col-5 mb-7 d-flex">
                                                                        <div>
                                                                            <p className="mb-1 fs-3">Status</p>
                                                                            <h6 className="fw-semibold mb-0 fs-4">{ALLSTATUS_LIST?.find(itemm => itemm.key == loanDetailsData?.status)?.value}</h6>
                                                                        </div>
                                                                    </div>

                                                                    <div className="col-7 mb-7">
                                                                        <p className="mb-1 fs-3">Credit score</p>
                                                                        <h6 className="fw-semibold mb-0 fs-4">{loanDetailsData?.credit_score}</h6>
                                                                    </div>
                                                                    <div className="col-12 mb-9">
                                                                        <p className="mb-1 fs-3">Address</p>
                                                                        <h6 className="fw-semibold mb-0 ">{loanDetailsData?.address}</h6>
                                                                    </div>

                                                                    <div className="p-9 py-3 border-bottom chat-meta-user d-flex align-items-center justify-content-between mb-4">
                                                                        <h5 className="text-secondary mb-0 fw-semibold">Loan Details</h5>
                                                                        <ul className="list-unstyled mb-0 d-flex align-items-center">
                                                                        </ul>
                                                                    </div>

                                                                    <div className="col-5 mb-7">
                                                                        <p className="mb-1 fs-3">Company Name</p>
                                                                        <h6 className="fw-semibold mb-0 fs-4 text-capitalize">{loanDetailsData?.company_name}</h6>
                                                                    </div>

                                                                    <div className="col-7 mb-7">
                                                                        <p className="mb-1 fs-3">Company Address</p>
                                                                        <h6 className="fw-semibold mb-0 fs-4">{loanDetailsData?.company_address}</h6>
                                                                    </div>

                                                                    <div className="col-5 mb-7">
                                                                        <p className="mb-1 fs-3">Designation</p>
                                                                        <h6 className="fw-semibold mb-0 fs-4 text-capitalize">{loanDetailsData?.designation}</h6>
                                                                    </div>

                                                                    <div className="col-7 mb-7">
                                                                        <p className="mb-1 fs-3">Purpose Of Loan</p>
                                                                        <h6 className="fw-semibold mb-0 fs-4">{loanDetailsData?.purpose_of_loan}</h6>
                                                                    </div>

                                                                    <div className="col-5 mb-7">
                                                                        <p className="mb-1 fs-3">Annual Income</p>
                                                                        <h6 className="fw-semibold mb-0 fs-4">{formatIndianPrice(loanDetailsData?.annual_income)}</h6>
                                                                    </div>

                                                                    {/* <div className="col-7 mb-7">
                                                                                <p className="mb-1 fs-3">Desired Loan</p>
                                                                                <h6 className="fw-semibold mb-0 fs-4">{formatIndianPrice(loanDetailsData?.desired_loan)}</h6>
                                                                            </div> */}

                                                                    {loanDetailsData?.approval_details && loanDetailsData?.approval_details?.length > 0 && (<>

                                                                        {/* <div className="col-7 mb-7">
                                                                                <p className="mb-1 fs-3">Credit score</p>
                                                                                <h6 className="fw-semibold mb-0 fs-4">{loanDetailsData?.credit_score}</h6>
                                                                            </div> */}

                                                                        <div className="col-7 mb-7">
                                                                            <p className="mb-1 fs-3">Desired Loan</p>
                                                                            <h6 className="fw-semibold mb-0 fs-4">{formatIndianPrice(loanDetailsData?.desired_loan)}</h6>
                                                                        </div>


                                                                        <div className="col-5 mb-7 ">
                                                                            <p className="mb-1 fs-3">Interest Rate</p>
                                                                            <h6 className="fw-semibold mb-0 fs-4">{loanAprovedDetails?.approved_interest_rate} %</h6>
                                                                        </div>
                                                                        <div className="col-7 mb-7">
                                                                            <p className="mb-1 fs-3">Processing Fee</p>
                                                                            <h6 className="fw-semibold mb-0 fs-4">{loanDetailsData?.processing_fee_charge ? loanDetailsData?.processing_fee_charge : '-'}</h6>
                                                                        </div>
                                                                        <div className="col-5 mb-7 ">
                                                                            <p className="mb-1 fs-3">Other Charge</p>
                                                                            <h6 className="fw-semibold mb-0 fs-4">{Number(loanDetailsData?.other_charges).toFixed(2)}</h6>
                                                                        </div>
                                                                        <div className="col-7 mb-7 ">
                                                                            <p className="mb-1 fs-3">Tenure Months</p>
                                                                            <h6 className="fw-semibold mb-0 fs-4">{loanAprovedDetails?.approved_tenure_months}</h6>
                                                                        </div>
                                                                        <div className="col-5 mb-7">
                                                                            <p className="mb-1 fs-3">Desired Amount</p>
                                                                            <h6 className="fw-semibold mb-0 fs-4 ">{formatIndianPrice(loanDetailsData?.desired_loan)}</h6>
                                                                        </div>
                                                                        <div className="col-7 mb-7">
                                                                            <p className="mb-1 fs-3">Admin Approved Amount</p>
                                                                            <h6 className="fw-semibold mb-0 fs-4 ">{formatIndianPrice(loanDetailsData?.approved_loan)}</h6>
                                                                        </div>
                                                                        <div className="col-5 mb-7">
                                                                            <p className="mb-1 fs-3">User Approved Amount</p>
                                                                            <h6 className="fw-semibold mb-0 fs-4">{formatIndianPrice(loanAprovedDetails?.user_accepted_amount)}</h6>
                                                                        </div>
                                                                        <div className="col-7 mb-7">
                                                                            <p className="mb-1 fs-3">Finel Disbursed Amount</p>
                                                                            {loanAprovedDetails?.disbursed_amount ? <h6 className="fw-semibold mb-0 fs-4 text-success">{formatIndianPrice(loanAprovedDetails?.disbursed_amount)}</h6> : '-'}
                                                                        </div>
                                                                        <div className="col-8 mb-7">
                                                                            <p className="mb-1 fs-3">Remarks</p>
                                                                            <h6 className="fw-semibold mb-0 fs-4">{loanDetailsData?.remarks}</h6>
                                                                        </div>

                                                                    </>
                                                                    )}

                                                                    {
                                                                        loanBankDetails && (<>
                                                                            <div className="p-9 py-3 border-bottom chat-meta-user d-flex align-items-center justify-content-between mb-4">
                                                                                <h5 className="text-secondary mb-0 fw-semibold">Bank Account Details</h5>
                                                                                <ul className="list-unstyled mb-0 d-flex align-items-center">
                                                                                </ul>
                                                                            </div>

                                                                            <div className="col-5 mb-7">
                                                                                <p className="mb-1 fs-3">Account Holder Name</p>
                                                                                <h6 className="fw-semibold mb-0 fs-4 ">{loanBankDetails?.account_holder_name}</h6>
                                                                            </div>
                                                                            <div className="col-7 mb-7">
                                                                                <p className="mb-1 fs-3">Bank Name</p>
                                                                                <h6 className="fw-semibold mb-0 fs-4">{loanBankDetails?.bank_name}</h6>
                                                                            </div>
                                                                            <div className="col-5 mb-7">
                                                                                <p className="mb-1 fs-3">Account Number</p>
                                                                                <h6 className="fw-semibold mb-0 fs-4 ">{loanBankDetails?.account_number}</h6>
                                                                            </div>
                                                                            <div className="col-7 mb-7">
                                                                                <p className="mb-1 fs-3">IFSC Code</p>
                                                                                <h6 className="fw-semibold mb-0 fs-4">{loanBankDetails?.ifsc_code}</h6>
                                                                            </div>
                                                                        </>)
                                                                    }

                                                                    {
                                                                        loanDetailsData?.documents?.length > 0 && <>
                                                                            <div className="p-9 py-3 border-bottom chat-meta-user d-flex align-items-center justify-content-between mb-4">
                                                                                <h5 className="text-secondary mb-0 fw-semibold">Document Details</h5>
                                                                                <ul className="list-unstyled mb-0 d-flex align-items-center">
                                                                                </ul>
                                                                            </div>
                                                                        </>
                                                                    }
                                                                    {loanDetailsData?.documents?.map((item, index) => (
                                                                        <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-2" key={index}>
                                                                            <div className="card h-90">

                                                                                {/* Display image if it's a PNG/JPG, else show a PDF icon */}
                                                                                <img
                                                                                    src={item.document_file.endsWith(".pdf") ? pdfThmbnail : item?.document_file
                                                                                    }
                                                                                    alt={`${item?.document_type} document`}
                                                                                    className="card-img-top"
                                                                                    style={{ height: "200px", objectFit: "cover" }}
                                                                                />

                                                                                <div className="card-body d-flex flex-column">
                                                                                    <h5 className="card-title text-capitalize">
                                                                                        {item?.document_type.replace("_", " ")}
                                                                                    </h5>

                                                                                    <p className="card-text">
                                                                                        {item.document_number && <>
                                                                                            <strong>Document Number:</strong>
                                                                                            {item.document_number || "N/A"}
                                                                                        </>}
                                                                                    </p>

                                                                                    <div className="mt-2 d-flex flex-column flex-sm-row gap-2">
                                                                                        {/* Status Button - smaller height */}
                                                                                        <button
                                                                                            type="button"
                                                                                            className={`btn btn-sm text-light fw-bold ${STATUS_CLASSES[item?.status]} w-100 w-sm-auto`}
                                                                                            disabled
                                                                                            style={{ cursor: "pointer", height: "auto" }} // adjust height as needed
                                                                                        >
                                                                                            {ALLSTATUS_LIST?.find(itemm => itemm.key == item?.status)?.value}
                                                                                        </button>

                                                                                        {/* View Document Button - normal height */}
                                                                                        <button
                                                                                            type="button"
                                                                                            className="btn btn-primary w-100 w-sm-auto"
                                                                                            style={{ height: "auto" }}
                                                                                            onClick={() => window.open(item?.document_file, "_blank")}
                                                                                        >
                                                                                            View Document
                                                                                        </button>
                                                                                    </div>


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
                        </div>
                    </div>
                </div>
            </div></div>
    )
}
