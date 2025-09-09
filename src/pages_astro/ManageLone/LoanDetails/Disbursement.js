import React from 'react'
import { MdOutlineFileDownload, MdOutlineRemoveRedEye } from 'react-icons/md';
import { formatDate, formatIndianPrice, getPaymentStatusObject } from '../../../config/commonFunction';
import { DateFormat } from '../../../config/commonVariable';

export const Disbursement = ({ loanDetailsData }) => {
    const loanAprovedDetails = loanDetailsData?.approval_details?.length > 0 && loanDetailsData?.approval_details[0];
    const loanDisbursement = loanDetailsData?.loan_disbursement?.length > 0 && loanDetailsData?.loan_disbursement[0];

    console.log(`loanDisbursementloanDisbursement`, loanDisbursement);

    return (
        <>
            <div className="col-12 justify-content-center">
                <div className='row justify-content-center '>
                    <div className="card overflow-hidden chat-application ">
                        <div className="p-md-4 p-4 row_2">
                            <div className="p-9 py-3 border-bottom chat-meta-user d-flex align-items-center justify-content-between mb-4">
                                <h5 className="text-secondary mb-0 fw-semibold fs-6">Disbursement Details</h5>
                                <ul className="list-unstyled mb-0 d-flex align-items-center">
                                </ul>
                            </div>
                            <div className="row">
                                {
                                    loanDisbursement && (<>
                                        <div className="col-md-4 mb-4">
                                            <p className="mb-1 fs-4">Payment Date</p>
                                            <h6 className="fw-semibold mb-0 fs-5 text-capitalize">{formatDate(loanDisbursement?.payment_date, DateFormat?.DATE_DOT_TIME_FORMAT)}</h6>
                                        </div>
                                        <div className="col-md-4 mb-4">
                                            <p className="mb-1 fs-4">Payment Type</p>
                                            <h6 className="fw-semibold mb-0 fs-5 text-capitalize ">{getPaymentStatusObject(loanDisbursement?.payment_type)?.value}</h6>
                                        </div>
                                        <div className="col-md-4 mb-4">
                                            <p className="mb-1 fs-4">Transferred Amount</p>
                                            <h6 className="fw-semibold mb-0 fs-5 text-capitalize">{formatIndianPrice(loanDisbursement?.transferred_amount)}</h6>
                                        </div>
                                        {
                                            loanDisbursement?.account_number && <>
                                                <div className="col-md-4 mb-4">
                                                    <p className="mb-1 fs-4">Account Holder Name</p>
                                                    <h6 className="fw-semibold mb-0 fs-5 text-capitalize ">{loanDisbursement?.account_holder_name}</h6>
                                                </div>
                                                <div className="col-md-4 mb-4">
                                                    <p className="mb-1 fs-4">Bank Name</p>
                                                    <h6 className="fw-semibold mb-0 fs-5 text-capitalize">{loanDisbursement?.bank_name}</h6>
                                                </div>
                                                <div className="col-md-4 mb-4">
                                                    <p className="mb-1 fs-4">Account Number</p>
                                                    <h6 className="fw-semibold mb-0 fs-5 text-capitalize ">{loanDisbursement?.account_number}</h6>
                                                </div>
                                                <div className="col-md-4 mb-4">
                                                    <p className="mb-1 fs-4">IFSC Code</p>
                                                    <h6 className="fw-semibold mb-0 fs-5 text-capitalize">{loanDisbursement?.ifsc_code}</h6>
                                                </div>
                                            </>
                                        }
                                        {
                                            loanDisbursement?.upi_id && <>
                                                <div className="col-md-4 mb-4">
                                                    <p className="mb-1 fs-4">UPI ID</p>
                                                    <h6 className="fw-semibold mb-0 fs-5 text-capitalize">{loanDisbursement?.upi_id}</h6>
                                                </div>
                                                <div className="col-md-4 mb-4">
                                                    <p className="mb-1 fs-4">Transaction Number</p>
                                                    <h6 className="fw-semibold mb-0 fs-5 text-capitalize">{loanDisbursement?.transaction_id}</h6>
                                                </div>
                                            </>
                                        }
                                        {
                                            loanDisbursement?.cheque_number &&
                                            <div className="col-12 mb-7">
                                                <p className="mb-1 fs-4">CHEQUE Number</p>
                                                <h6 className="fw-semibold mb-0 fs-5 text-capitalize">{loanDisbursement?.cheque_number}</h6>
                                            </div>
                                        }
                                        {
                                            loanDisbursement?.remarks &&
                                            <div className="col-12 mb-7">
                                                <p className="mb-1 fs-4">Remarks</p>
                                                <h6 className="fw-semibold mb-0 fs-5 text-capitalize">{loanDisbursement?.remarks}</h6>
                                            </div>
                                        }
                                    </>)
                                }

                            </div>
                            {
                                loanDisbursement?.payment_file &&
                                <div className="col-4 mb-3">
                                    <div className="d-flex align-items-center justify-content-between pt-2 border-bottom pb-3">
                                        <h6 className="fw-semibold mb-0 fs-5 text-capitalize">Payment Proof</h6>
                                        <a
                                            href={loanDisbursement?.payment_file}
                                            download
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="d-flex align-items-center gap-2 text-decoration-none me-4"
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
                                                    backgroundColor: "#1A237E", // Deep blue like screenshot
                                                    color: "#fff",
                                                }}
                                            >
                                                <MdOutlineRemoveRedEye size={15} />
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
