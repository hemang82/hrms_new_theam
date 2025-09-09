import React, { useEffect, useState } from 'react';
// import './index.css'; // Add your wave-effect here if needed

// export const loanStatus = {
//   PENDING: "IN Progress",
//   UNDER_REVIEW: "UNDER REVIEW",
//   ON_HOLD: "ON HOLD",
//   APPROVED: "APPROVED",
//   REJECTED: "REJECTED",
//   DISBURSED: "DISBURSED",
//   DISBURSED_PENDING: "DISBURSEMENT PENDING",
//   CLOSED: "CLOSED",
//   CANCELLED: "CANCELLED",
//   USER_ACCEPTED: "User Accepted",
//   AADHAR_VERIFICATION: "Aadhar Verification",
//   AADHAR_PENDING: "Aadhar Pending",
//   USER_APPLIED: "User Applied",
//   BANK_VERIFICATION: "Bank Verification",
//   E_MENDATE: "E-Mendate",
//   COMPLETED: "Completed",
// }

// export const loanStatusKey = {
//   PENDING: "PENDING",
//   UNDER_REVIEW: "UNDER_REVIEW",
//   ON_HOLD: "ON_HOLD",
//   APPROVED: "APPROVED",
//   REJECTED: "REJECTED",
//   DISBURSED: "DISBURSED",
//   DISBURSED_PENDING: "DISBURSED",
//   CLOSED: "CLOSED",
//   CANCELLED: "CANCELLED",
//   USER_ACCEPTED: "USER_ACCEPTED",
//   USER_APPLIED: "USER_APPLIED",
//   AADHAR_VERIFICATION: "AADHAR_VERIFICATION",
//   AADHAR_PENDING: "AADHAR_PENDING",
//   BANK_VERIFICATION: "BANK_VERIFICATION",
//   E_MENDATE: "E_MENDATE",
//   COMPLETED: "COMPLETED",
// }

export const loanStatus = {

  APPLICATION_SUBMITTED: "Application Submitted",

  PENDING: "Loan Approval (Pending)",
  UNDER_REVIEW: "Loan Approval (Under Review)",
  ON_HOLD: "Loan Approval (On Hold)",
  APPROVED: "Loan Approval (Completed)",
  REJECTED: "Loan Approval (Rejected)",
  CANCELLED: "Loan Approval (Cancelled)",

  AADHAR_VERIFIED: "Aadhar Verified (Completed)",
  AADHAR_VERIFIED_PENDING: "Aadhar Verification (Pending)",

  BANK_VERIFIED: "Bank Verified (Completed)",
  BANK_VERIFIED_PENDING: "Bank Verification (Pending)",

  USER_ACCEPTED: "User Accepted (Completed)",
  USER_ACCEPTED_PENDING: "User Accepted (Pending)",

  E_MANDATE_GENERATED: "E-Mandate Setup (Completed)",
  E_MANDATE_GENERATED_PENDING: "E-Mandate Setup (Pending)",

  DISBURSEMENT_APPROVAL_PENDING: "Loan Disbursed (Pending)",
  DISBURSEMENT_APPROVED: "Loan Disbursed (Approved)",
  DISBURSED: "Loan Disbursed (Completed)",

  COMPLETED: "Loan Completed",
  COMPLETED_PENDING: "Loan Completion (Pending)",

  CLOSED: "Loan Closed",
}

export const loanStatusKey = {

  APPLICATION_SUBMITTED: "APPLICATION_SUBMITTED",
  PENDING: "PENDING",
  UNDER_REVIEW: "UNDER_REVIEW",
  ON_HOLD: "ON_HOLD",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",

  AADHAR_VERIFIED: "AADHAR_VERIFIED",
  AADHAR_VERIFIED_PENDING: "AADHAR_VERIFIED_PENDING",

  BANK_VERIFIED: "BANK_VERIFIED",
  BANK_VERIFIED_PENDING: "BANK_VERIFIED_PENDING",

  USER_ACCEPTED: "USER_ACCEPTED",
  USER_ACCEPTED_PENDING: "USER_ACCEPTED_PENDING",

  E_MANDATE_GENERATED: "E_MANDATE_GENERATED",
  E_MANDATE_GENERATED_PENDING: "E_MANDATE_GENERATED_PENDING",

  DISBURSEMENT_APPROVAL_PENDING: "DISBURSEMENT_APPROVAL_PENDING",
  DISBURSEMENT_APPROVED: "DISBURSEMENT_APPROVED",

  DISBURSED: "DISBURSED",
  COMPLETED: "COMPLETED",

  COMPLETED_PENDING: "COMPLETED_PENDING",

  CANCELLED: "CANCELLED",
  CLOSED: "CLOSED",

}

const ApplicationStatus = ({ loneDetails }) => {

  const [activeStep, setActiveStep] = useState(1);
  const [openStep, setOpenStep] = useState(null);

  const getFinalStatusKey = (status) => {

    const fallbackStatuses = [
      loanStatusKey.REJECTED,
      loanStatusKey.CANCELLED,
      loanStatusKey.CLOSED,
      loanStatusKey.UNDER_REVIEW,
      loanStatusKey.ON_HOLD,
    ];

    return fallbackStatuses.includes(status) ? status : loanStatusKey.APPROVED;

  };

  // const statusSteps = [
  //   { id: 1, key: loanStatusKey.USER_APPLIED, title: loanStatus.USER_APPLIED },
  //   { id: 2, key: loanStatusKey.AADHAR_VERIFICATION, title: loanStatus.AADHAR_VERIFICATION },
  //   {
  //     id: 3, key: loneDetails?.status === loanStatusKey.PENDING ? loanStatusKey.PENDING : loneDetails?.status === loanStatusKey.REJECTED ? loanStatusKey.REJECTED : loneDetails?.status === loanStatusKey.CANCELLED ? loanStatusKey.CANCELLED : loneDetails?.status === loanStatusKey.CLOSED ? loanStatusKey.CLOSED : loneDetails?.status === loanStatusKey?.UNDER_REVIEW ? loanStatusKey.UNDER_REVIEW : loneDetails?.status === loanStatusKey?.ON_HOLD ? loanStatusKey.ON_HOLD : loanStatusKey.APPROVED,
  //     title: loneDetails?.status === loanStatusKey.PENDING ? loanStatus.PENDING : loneDetails?.status === loanStatusKey.REJECTED ? loanStatus.REJECTED : loneDetails?.status === loanStatusKey.CANCELLED ? loanStatus.CANCELLED : loneDetails?.status === loanStatusKey.CLOSED ? loanStatus.CLOSED : loneDetails?.status === loanStatusKey?.UNDER_REVIEW ? loanStatus.UNDER_REVIEW : loneDetails?.status === loanStatusKey?.ON_HOLD ? loanStatus.ON_HOLD : loanStatus.APPROVED,
  //   },
  //   { id: 4, key: loanStatusKey.USER_ACCEPTED, title: loanStatus.USER_ACCEPTED },
  //   { id: 5, key: loanStatusKey.BANK_VERIFICATION, title: loanStatus.BANK_VERIFICATION },
  //   { id: 6, key: loanStatusKey.E_MENDATE, title: loanStatus.E_MENDATE },
  //   {
  //     id: 7, key: loneDetails?.status === loanStatusKey.DISBURSED ? loanStatusKey.DISBURSED : loneDetails?.status === loanStatusKey.COMPLETED ? loanStatusKey.COMPLETED : loanStatusKey.DISBURSED_PENDING,
  //     title: loneDetails?.status === loanStatusKey.DISBURSED ? loanStatus.DISBURSED : loneDetails?.status === loanStatusKey.COMPLETED ? loanStatusKey.COMPLETED : loanStatus.DISBURSED_PENDING,
  //   },
  // ];

  const statusSteps = [
    { id: 1, key: loanStatusKey.APPLICATION_SUBMITTED, title: loanStatus.APPLICATION_SUBMITTED },
    {
      id: 2, key: loneDetails?.status === loanStatusKey.AADHAR_VERIFIED || loneDetails?.aadhaar_verified ? loanStatusKey.AADHAR_VERIFIED : loanStatusKey.AADHAR_VERIFIED_PENDING,
      title: loneDetails?.status === loanStatusKey.AADHAR_VERIFIED || loneDetails?.aadhaar_verified ? loanStatus.AADHAR_VERIFIED : loanStatus.AADHAR_VERIFIED_PENDING
    },
    {
      id: 3, key: loneDetails?.status === loanStatusKey.APPROVED || loneDetails?.approval_details?.length > 0 ? loanStatusKey.APPROVED : loneDetails?.status === loanStatusKey.REJECTED ? loanStatusKey.REJECTED : loneDetails?.status === loanStatusKey.CANCELLED ? loanStatusKey.CANCELLED : loneDetails?.status === loanStatusKey?.UNDER_REVIEW ? loanStatusKey.UNDER_REVIEW : loneDetails?.status === loanStatusKey?.ON_HOLD ? loanStatusKey.ON_HOLD : loanStatusKey.PENDING,
      title: loneDetails?.status === loanStatusKey.APPROVED || loneDetails?.approval_details?.length > 0 ? loanStatus.APPROVED : loneDetails?.status === loanStatusKey.REJECTED ? loanStatus.REJECTED : loneDetails?.status === loanStatusKey.CANCELLED ? loanStatus.CANCELLED : loneDetails?.status === loanStatusKey?.UNDER_REVIEW ? loanStatus.UNDER_REVIEW : loneDetails?.status === loanStatusKey?.ON_HOLD ? loanStatus.ON_HOLD : loanStatus.PENDING,
    },
    {
      id: 4, key: loneDetails?.status === loanStatusKey.USER_ACCEPTED || loneDetails?.approval_details?.length > 0 ? loanStatusKey.USER_ACCEPTED : loanStatusKey.USER_ACCEPTED_PENDING,
      title: loneDetails?.status === loanStatusKey.USER_ACCEPTED || loneDetails?.approval_details?.length > 0 ? loanStatus.USER_ACCEPTED : loanStatus.USER_ACCEPTED_PENDING
    },
    {
      id: 5, key: loneDetails?.status === loanStatusKey.BANK_VERIFIED || loneDetails?.bank_accounts?.length > 0 ? loanStatusKey.BANK_VERIFIED : loanStatusKey.BANK_VERIFIED_PENDING,
      title: loneDetails?.status === loanStatusKey.BANK_VERIFIED || loneDetails?.bank_accounts?.length > 0 ? loanStatus.BANK_VERIFIED : loanStatus.BANK_VERIFIED_PENDING
    },
    {
      id: 6, key: loneDetails?.status === loanStatusKey?.E_MANDATE_GENERATED || loneDetails?.plan_details?.length > 0 || loneDetails?.status === loanStatusKey.DISBURSEMENT_APPROVAL_PENDING ? loanStatusKey?.E_MANDATE_GENERATED : loanStatusKey?.E_MANDATE_GENERATED_PENDING,
      title: loneDetails?.status === loanStatusKey?.E_MANDATE_GENERATED || loneDetails?.plan_details?.length > 0 || loneDetails?.status === loanStatusKey.DISBURSEMENT_APPROVAL_PENDING ? loanStatus?.E_MANDATE_GENERATED : loanStatus?.E_MANDATE_GENERATED_PENDING
    },
    {
      id: 7, key: loneDetails?.status === loanStatusKey.DISBURSED || loneDetails?.loan_disbursement?.length > 0 ? loanStatusKey.DISBURSED : loneDetails?.status === loanStatusKey.DISBURSEMENT_APPROVED ? loanStatusKey.DISBURSEMENT_APPROVED : loanStatusKey.DISBURSEMENT_APPROVAL_PENDING,
      title: loneDetails?.status === loanStatusKey.DISBURSED || loneDetails?.loan_disbursement?.length > 0 ? loanStatus.DISBURSED : loneDetails?.status === loanStatus.DISBURSEMENT_APPROVED ? loanStatus.DISBURSEMENT_APPROVED : loanStatus.DISBURSEMENT_APPROVAL_PENDING,
    },
    {
      id: 8, key: loneDetails?.status === loanStatusKey.COMPLETED ? loanStatusKey.COMPLETED : loneDetails?.status === loanStatusKey.CLOSED ? loanStatusKey.CLOSED : loanStatusKey.COMPLETED_PENDING,
      title: loneDetails?.status === loanStatusKey.COMPLETED ? loanStatus.COMPLETED : loneDetails?.status === loanStatusKey.CLOSED ? loanStatus.CLOSED : loanStatus.COMPLETED_PENDING
    },
  ];

  const getStepFromStatus = (statusKey) => {
    const match = statusSteps?.find((step) => step?.key === statusKey);
    console.log('matchmatch', statusSteps, statusKey, match);
    return match ? match.id : 1;
  };

  // useEffect(() => {
  //   let statusKey = "";
  //   if (loneDetails?.loan_uid && !loneDetails?.aadhaar_verified) {
  //     statusKey = loanStatusKey.APPLICATION_SUBMITTED;
  //   } else if (!loneDetails?.aadhaar_verified) {
  //     statusKey = loanStatusKey.AADHAR_VERIFIED;
  //   } else if (loneDetails?.status === loanStatusKey.PENDING) {
  //     statusKey = loanStatusKey.PENDING;
  //   } else if (loneDetails?.status === loanStatusKey.APPROVED) {
  //     statusKey = loanStatusKey.APPROVED;
  //   } else if (loneDetails?.status === loanStatusKey.USER_ACCEPTED && loneDetails?.bank_accounts?.length === 0) {
  //     statusKey = loanStatusKey.USER_ACCEPTED;
  //   } else if (loneDetails?.bank_accounts?.length > 0 && loneDetails?.status !== loanStatusKey.DISBURSED && loneDetails?.plan_details?.length === 0) {
  //     statusKey = loanStatusKey.BANK_VERIFIED;
  //   } else if (loneDetails?.plan_details?.length > 0 && loneDetails?.status !== loanStatusKey.DISBURSED && loneDetails?.status !== loanStatusKey.COMPLETED) {
  //     statusKey = loanStatusKey.BANK_VERIFIED;
  //   } else if (loneDetails?.status === loanStatusKey.DISBURSED) {
  //     statusKey = loanStatusKey.DISBURSED;
  //   } else if (loneDetails?.status === loanStatusKey.COMPLETED) {
  //     statusKey = loanStatusKey.E_MENDATE;
  //   } else {
  //     statusKey = loneDetails?.status;
  //   }
  //   setOpenStep(getStepFromStatus(statusKey));
  // }, [loneDetails]);

  useEffect(() => {
    let statusKey = "";
    if (loneDetails?.status === loanStatusKey.APPLICATION_SUBMITTED && !loneDetails?.aadhaar_verified) {
      statusKey = loanStatusKey.APPLICATION_SUBMITTED;
    } else if (loneDetails?.status === loanStatusKey.APPLICATION_SUBMITTED && loneDetails?.aadhaar_verified) {
      statusKey = loanStatusKey.AADHAR_VERIFIED;
    } else if (loneDetails?.status === loanStatusKey.PENDING) {
      statusKey = loanStatusKey.PENDING;
    } else if (loneDetails?.status === loanStatusKey.APPROVED) {
      statusKey = loanStatusKey.APPROVED;
    } else if (loneDetails?.status === loanStatusKey.USER_ACCEPTED && loneDetails?.bank_accounts?.length === 0) {
      statusKey = loanStatusKey.USER_ACCEPTED;
      // loneDetails?.status === loanStatusKey.BANK_VERIFIED &&
    } else if (loneDetails?.status === loanStatusKey.BANK_VERIFIED && loneDetails?.bank_accounts?.length > 0 && loneDetails?.status !== loanStatusKey.DISBURSED && loneDetails?.plan_details?.length === 0) {
      statusKey = loanStatusKey.BANK_VERIFIED;
      // loneDetails?.status === loanStatusKey.E_MANDATE_GENERATED &&
    } else if (loneDetails?.status === loanStatusKey.E_MANDATE_GENERATED_PENDING && loneDetails?.plan_details?.length > 0 && loneDetails?.status !== loanStatusKey.DISBURSED && loneDetails?.status !== loanStatusKey.COMPLETED) {
      statusKey = loanStatusKey.E_MANDATE_GENERATED;
    } else if (loneDetails?.status === loanStatusKey.DISBURSEMENT_APPROVAL_PENDING) {
      statusKey = loanStatusKey.E_MANDATE_GENERATED;
    } else if (loneDetails?.status === loanStatusKey.DISBURSED) {
      statusKey = loanStatusKey.DISBURSED;
    } else if (loneDetails?.status === loanStatusKey.COMPLETED) {
      statusKey = loanStatusKey.COMPLETED;
    } else if (loneDetails?.status === loanStatusKey.CLOSED) {
      statusKey = loanStatusKey.CLOSED;
    } else {
      statusKey = loneDetails?.status;
    }
    setOpenStep(getStepFromStatus(statusKey));
  }, [loneDetails]);

  if (!loneDetails) return null;

  return (
    <div className="justify-content-center mt-0">
      <div className='row justify-content-center '>
        <div className="card overflow-hidden chat-application ">
          <div className="p-md-4 p-2 row_2">

            <div className="p-9 py-3 border-bottom chat-meta-user d-flex align-items-center justify-content-between mb-4">
              <h5 className="text-secondary mb-0 fw-semibold fs-6">Loan Activity</h5>
              <ul className="list-unstyled mb-0 d-flex align-items-center">
              </ul>
            </div>
            <div class="container ">
              <div class="stepper-wrapper">

                {/* {statusSteps?.map((step, idx) => {

                  const isActive = step.id === openStep;
                  const isCompleted = step.id < openStep;
                  const isDisabled = ["rejected", "cancel"].includes(step?.title?.toLowerCase());

                  return (
                    <div
                      key={step.id}
                      // className={`stepper-item ${isCompleted || isActive ? 'active' : ''}`}
                      className={`stepper-item 
                   ${isCompleted || isActive ? "active" : ""} 
                  ${isDisabled ? "disabled" : ""}`}
                    >
                      <div className="step-counter">{step.id}</div>
                      <div className="step-label">
                        {step?.title?.charAt(0).toUpperCase() +
                          step?.title?.slice(1).toLowerCase()}
                      </div>
                    </div>
                  );
                })} */}

                {statusSteps?.map((step, idx) => {

                  const isActive = step.id === openStep;
                  const isCompleted = step.id < openStep;

                  const isRejectedForClass = ["rejected", "cancelled"].includes(step?.key?.toLowerCase());

                  const rejectedIndex = statusSteps.findIndex(s =>
                    ["rejected", "cancelled"].includes(s?.key?.toLowerCase())
                  );

                  const isDisabled = rejectedIndex !== -1 && idx > rejectedIndex;
                  const [main, extra] = step.title.split(" (");

                  return (
                    <div key={step.id} className={`stepper-item ${isCompleted || isActive ? "active" : ""} ${isDisabled ? "disabled" : ""}`} >
                      <div className={`step-counter ${isRejectedForClass ? "step-counter-rejected" : ""}`}>{step.id}</div>
                      <div className={`step-label font-semibold ${isRejectedForClass ? "step-label-rejected" : ""}`}>
                        {main?.toLowerCase()?.replace(/\b\w/g, (char) => char.toUpperCase())}
                        {extra && (
                          <span className="small text-muted"> ({extra.replace(")", "")})</span>
                        )}
                      </div>
                    </div>
                  );
                })}

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

};

export default ApplicationStatus;
