import React, { useEffect, useState } from 'react'
import { formatDate, formatIndianPrice } from '../../../config/commonFunction';
import { DateFormat, emiTypes } from '../../../config/commonVariable';
import Constatnt, { Codes } from '../../../config/constant';
import { EMISchedule } from '../../../utils/api.services';

export const EMIScedule = ({ loanDetailsData }) => {

    // const SceduleList = loanDetailsData?.emi_info?.schedule?.map(item => ({
    //     ...item,
    //     // is_emi_bounce: true,
    //     // is_emi_paid: false
    // }));

    const [SceduleList, setSceduleList] = useState([]);

    const loanAprovedDetails = (loanDetailsData?.e_mandate_payment_track && typeof loanDetailsData.e_mandate_payment_track === "object") ? loanDetailsData.e_mandate_payment_track : {};

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const payBounceEMI = async (schedule) => {
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
            alert("Failed to load Razorpay SDK");
            return;
        }

        const options = {
            key: Constatnt.RAZORPAY_KEY,
            amount: Math.round(schedule.amount * 100),
            currency: "INR",
            name: "TruePay",
            description: `Pay EMI for ${schedule?.emi_date || ''}`,
            image: "/logo.png",
            handler: function (response) {
                console.log("Payment successful:", response);
            },
            prefill: {
                name: "Test Admin",
                email: "test@example.com",
                contact: "1234567890",
            },
            theme: { color: "#1F7494" },
        };

        const razor = new window.Razorpay(options);
        razor.open();
    };

    console.log('SceduleListSceduleList', SceduleList);

    useEffect(() => {
        EMISchedule({ loan_id: loanDetailsData?.id }).then((response) => {
            if (response.status_code === Codes.SUCCESS) {
                console.log('EMISchedule', response);
                const transectionData = response?.data?.schedule_data || [];
                const updatedList = transectionData?.length > 0 && transectionData?.map(item => ({
                    ...item,
                    is_emi_bounce: item?.status === "cancelled" ? true : false,
                    is_emi_paid: item?.status === "paid" ? true : false
                }));
                setSceduleList(updatedList)
            } else {
                setSceduleList([])
            }
        })
    }, [])

    console.log('SceduleListSceduleList', SceduleList);

    return (
        <>
            <div className="justify-content-center mt-0">
                <div className='row justify-content-center '>
                    <div className="card overflow-hidden chat-application ">
                        <div className="p-md-4 p-4 row_2">

                            <div className="p-9 py-3 border-bottom chat-meta-user d-flex align-items-center justify-content-between mb-4">
                                <h5 className="text-secondary mb-0 fw-semibold fs-6">EMI Details</h5>
                                <ul className="list-unstyled mb-0 d-flex align-items-center">
                                </ul>
                            </div>

                            <div className="row">
                                {[
                                    { label: "Start Date", value: `${formatDate(loanAprovedDetails?.start_at, DateFormat?.DATE_FORMAT)}` },
                                    { label: "End Date", value: `${formatDate(loanAprovedDetails?.end_at, DateFormat?.DATE_FORMAT)}` },
                                    { label: "Last EMI Paid On", value: loanAprovedDetails?.latest_paid_at ? `${formatDate(loanAprovedDetails?.latest_paid_at, DateFormat?.DATE_FORMAT)}` : '-' },
                                    { label: "Paid EMIs", value: loanAprovedDetails?.paid_count ? loanAprovedDetails?.paid_count : '-' },
                                    { label: "Remaining EMIs", value: loanAprovedDetails?.remaining_count ? loanAprovedDetails?.remaining_count : '-' },
                                    { label: "Total EMIs", value: loanAprovedDetails?.total_count ? loanAprovedDetails?.total_count : '-' },


                                    // loanDetailsData?.approval_details?.length > 0 && { label: "User Approved Amount", value: formatIndianPrice(loanAprovedDetails?.user_accepted_amount) },
                                    // loanDetailsData?.approval_details?.length > 0 && { label: "Interest Rate", value: `${loanAprovedDetails?.approved_interest_rate} %` },
                                    // loanDetailsData?.approval_details?.length > 0 && { label: "Tenure", value: loanAprovedDetails?.approved_tenure_months + ' Months' },
                                    // loanDetailsData?.approval_details?.length > 0 && { label: "Processing Fee", value: formatIndianPrice(loanDetailsData?.processing_fee_charge) || '-' },
                                    // loanDetailsData?.approval_details?.length > 0 && { label: "Other Charge", value: formatIndianPrice(loanDetailsData?.other_charges) },
                                    // loanDetailsData?.approval_details?.length > 0 && { label: "Final Amount", value: loanAprovedDetails?.disbursed_amount ? <span className="text-success">{formatIndianPrice(loanAprovedDetails?.disbursed_amount)}</span> : '-' },
                                    // loanDetailsData?.remarks && { label: "Remarks", value: loanDetailsData?.remarks },
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
            <div className="col-12 justify-content-center">
                <div className='row justify-content-center '>
                    <div className="card overflow-hidden chat-application ">
                        {/* <div className="container p-4 border border-2"> */}
                        <div className="p-md-4 p-4 row_2">
                            <div className="p-9 py-3 border-bottom chat-meta-user d-flex align-items-center justify-content-between mb-4">
                                <h5 className="text-secondary mb-0 fw-semibold fs-6">Repayment schedule</h5>
                                <ul className="list-unstyled mb-0 d-flex align-items-center">
                                </ul>
                            </div>
                            <div className="row justify-content-center ">
                                <div className="col-lg-8">
                                    <div className="accordion mb-3" id="accordionFlushExample">
                                        {SceduleList?.map((scedule, index) => (
                                            <div
                                                className="transaction-card justify-content-between align-items-center flex-wrap p-3 mb-3 rounded-3 shadow-sm"
                                                key={scedule.id}
                                                style={{
                                                    borderLeft:
                                                        scedule?.is_emi_paid && !scedule?.is_emi_bounce
                                                            ? "4px solid green"
                                                            : scedule?.is_emi_bounce && !scedule.is_emi_paid
                                                                ? "4px solid red"
                                                                : "4px solid #ffa500",
                                                }}
                                            >
                                                {/* Header */}
                                                <h2 className="accordion-header" id={`flush-heading${index}`}>
                                                    <button
                                                        className="accordion-button collapsed bg-white px-3 py-2 fs-6 fw-semibold"
                                                        type="button"
                                                        data-bs-toggle="collapse"
                                                        data-bs-target={`#flush-collapse${index}`}
                                                        aria-expanded="false"
                                                        aria-controls={`flush-collapse${index}`}
                                                        style={{ boxShadow: "none" }}
                                                    >
                                                        <div className="w-100 d-flex justify-content-between align-items-center flex-wrap">
                                                            <div className="d-flex justify-content-end align-items-center gap-2 mb-2">
                                                                <span className="fw-semibold text-dark">{scedule.month}</span>

                                                                <span className={`badge rounded-3 fs-3 shadow-sm ${emiTypes[scedule?.status]?.color} `}>{emiTypes[scedule?.status]?.label}</span>

                                                                <span className={`text-muted fs-3 badge rounded-3 ${emiTypes[scedule?.invoice_type]?.color}`} style={{
                                                                    border: `1px solid ${emiTypes[scedule?.invoice_type]?.border}`,
                                                                    backgroundColor: "#fff",
                                                                }}>
                                                                    {emiTypes[scedule?.invoice_type]?.label}</span>
                                                            </div>

                                                            <span
                                                                className="fw-semibold me-2"
                                                                style={{ color: "#1F7494", fontSize: "1.3rem" }}
                                                            >
                                                                {formatIndianPrice(scedule?.show_emi)}
                                                            </span>
                                                        </div>
                                                    </button>
                                                </h2>

                                                <div
                                                    id={`flush-collapse${index}`}
                                                    className="accordion-collapse collapse"
                                                    aria-labelledby={`flush-heading${index}`}
                                                    data-bs-parent="#accordionFlushExample"
                                                >
                                                    <div className="accordion-body p-3 ">
                                                        <div className="row g-3 text-center mb-4">
                                                            {/* Remaining Amount */}
                                                            <div className="col-12 col-md-4">
                                                                <div className="p-2 border rounded bg-white h-100 shadow-sm">
                                                                    <strong className="d-block text-muted fs-5">
                                                                        Remaining Amount
                                                                    </strong>
                                                                    <span
                                                                        className="fw-semibold"
                                                                        style={{
                                                                            color: "#1F7494",       // custom color
                                                                            fontSize: "1rem",       // override Bootstrap fs-5
                                                                        }}
                                                                    >
                                                                        {formatIndianPrice(scedule.show_balance)}
                                                                    </span>
                                                                </div>

                                                            </div>

                                                            {/* Principal Paid */}
                                                            <div className="col-12 col-md-4">
                                                                <div className="p-2 border rounded bg-white h-100 shadow-sm">
                                                                    <strong className="d-block text-muted fs-5 mb-1">
                                                                        Principal Paid
                                                                    </strong>
                                                                    <span
                                                                        className="fw-semibold"
                                                                        style={{
                                                                            color: "#1F7494",       // custom color
                                                                            fontSize: "1rem",       // override Bootstrap fs-5
                                                                        }}
                                                                    >
                                                                        {formatIndianPrice(scedule.show_principal_paid)}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            {/* Interest Paid */}
                                                            <div className="col-12 col-md-4">
                                                                <div className="p-2 border rounded bg-white h-100 shadow-sm">
                                                                    <strong className="d-block text-muted fs-5">
                                                                        Interest Paid
                                                                    </strong>
                                                                    <span
                                                                        className="fw-semibold"
                                                                        style={{
                                                                            color: "#1F7494",       // custom color
                                                                            fontSize: "1rem",       // override Bootstrap fs-5
                                                                        }}
                                                                    >
                                                                        {formatIndianPrice(scedule?.show_interest_paid)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Pay EMI Button */}
                                                        {scedule.is_emi_bounce && (
                                                            <div className="row mt-3">
                                                                <div className="col-12 text-center">
                                                                    <button
                                                                        className="btn btn-primary px-4 py-2 fw-semibold"
                                                                        onClick={() => payBounceEMI(scedule)}
                                                                    >
                                                                        Pay EMI
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}

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
        </>
    )
}
