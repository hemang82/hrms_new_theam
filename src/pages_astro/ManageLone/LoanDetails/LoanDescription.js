import React from 'react'
import { formatDate, formatIndianPrice, getDocumentStatusObject, getLoanStatusObject, getLoanTypeObject } from '../../../config/commonFunction'
import { DateFormat } from '../../../config/commonVariable';
import ApplicationStatus from './ApplicationStatus';

export const LoanDescription = ({ loanDetailsData }) => {

    const loanAprovedDetails = loanDetailsData?.approval_details?.length > 0 && loanDetailsData?.approval_details[0];
    const loanBankDetails = loanDetailsData?.bank_accounts?.length > 0 && loanDetailsData?.bank_accounts[0];

    return (
        <>
            <ApplicationStatus loneDetails={loanDetailsData} />
            <div className="justify-content-center">
                <div className='row justify-content-center '>
                    <div className="card overflow-hidden chat-application ">

                        <div className="p-md-4 p-4 row_2">

                            <div className="p-8 py-3 border-bottom chat-meta-user d-flex align-items-center justify-content-between mb-4">
                                <h5 className="text-secondary mb-0 fw-semibold fs-6">Loan Details</h5>
                                {/* <span
                                    className={`badge px-3 py-2 rounded-pill fs-5 text-white ${getLoanStatusObject(loanDetailsData?.status)?.color || "bg-secondary"}`}
                                >
                                    {getLoanStatusObject(loanDetailsData?.status)?.value || "Unknown"}
                                </span> */}
                            </div>
                            {/* Loan Details Grid */}
                            <div className="row">
                                {[
                                    { label: "Loan ID", value: loanDetailsData?.loan_uid },
                                    { label: "Loan Type", value: getLoanTypeObject(loanDetailsData?.loan_type)?.value },
                                    { label: "Name", value: loanDetailsData?.name },
                                    { label: "Gender", value: loanDetailsData?.gender },
                                    { label: "Apply Date", value: formatDate(loanDetailsData?.created_at, DateFormat?.DATE_DOT_TIME_FORMAT) || '-' },
                                    { label: "CIBIL Score", value: loanDetailsData?.credit_score },
                                    { label: "Mobile Number", value: loanDetailsData?.phone_number },
                                    { label: "Email Address", value: loanDetailsData?.email },
                                    { label: "Date Of Birth", value: formatDate(loanDetailsData?.date_of_birth, DateFormat?.DATE_FORMAT) },
                                    { label: "Company Name", value: loanDetailsData?.company_name },
                                    { label: "Company Address", value: loanDetailsData?.company_address },
                                    { label: "Designation", value: loanDetailsData?.designation },
                                    { label: "Purpose Of Loan", value: loanDetailsData?.purpose_of_loan },
                                    { label: "Address", value: loanDetailsData?.address },
                                ].map((item, index) => (
                                    <div key={index} className="col-md-4 mb-4">
                                        <p className="mb-1 fs-4">{item.label}</p>
                                        <h6 className={`fw-semibold mb-0 fs-5 ${item.label === "Email Address" ? "" : "text-capitalize"}`}>{item.value}</h6>
                                    </div>
                                ))}
                            </div>

                            {/* </div> */}
                        </div>
                    </div>
                </div>
            </div>
            <div className="justify-content-center mt-0">
                <div className='row justify-content-center '>
                    <div className="card overflow-hidden chat-application ">
                        <div className="p-md-4 p-4 row_2">

                            <div className="p-9 py-3 border-bottom chat-meta-user d-flex align-items-center justify-content-between mb-4">
                                <h5 className="text-secondary mb-0 fw-semibold fs-6">Loan Calculation</h5>
                                <ul className="list-unstyled mb-0 d-flex align-items-center">
                                </ul>
                            </div>

                            <div className="row">
                                {[
                                    { label: "Annual Income", value: `${formatIndianPrice(loanDetailsData?.annual_income)}` },
                                    { label: "Desired Loan", value: formatIndianPrice(loanDetailsData?.desired_loan) },
                                    { label: "Admin Approved Amount", value: loanDetailsData?.approved_loan ? `${formatIndianPrice(loanDetailsData?.approved_loan)}` : null },
                                    loanDetailsData?.approval_details?.length > 0 && { label: "User Approved Amount", value: formatIndianPrice(loanAprovedDetails?.user_accepted_amount) },
                                    loanDetailsData?.approval_details?.length > 0 && { label: "Interest Rate", value: `${loanAprovedDetails?.approved_interest_rate} %` },
                                    loanDetailsData?.approval_details?.length > 0 && { label: "Tenure", value: loanAprovedDetails?.approved_tenure_months + ' Months' },
                                    loanDetailsData?.approval_details?.length > 0 && { label: "Processing Fee", value: formatIndianPrice(loanDetailsData?.processing_fee_charge) || '-' },
                                    loanDetailsData?.approval_details?.length > 0 && { label: "Other Charge", value: formatIndianPrice(loanDetailsData?.other_charges) },
                                    loanDetailsData?.approval_details?.length > 0 && { label: "Final Amount", value: loanAprovedDetails?.disbursed_amount ? <span className="text-success">{formatIndianPrice(loanAprovedDetails?.disbursed_amount)}</span> : '-' },
                                    loanDetailsData?.remarks && { label: "Remarks", value: loanDetailsData?.remarks },
                                ]
                                    .filter(Boolean).map((item, index) => (
                                        <>
                                            {item.value && (
                                                <div
                                                    key={index}
                                                    className={`mb-4 ${item.label === "Remarks" ? "col-md-12" : "col-md-4"}`}
                                                >
                                                    <p className="mb-1 fs-5">{item.label}</p>
                                                    <h6 className="fw-semibold mb-0 fs-6">{item.value}</h6>
                                                </div>
                                            )}
                                        </>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
