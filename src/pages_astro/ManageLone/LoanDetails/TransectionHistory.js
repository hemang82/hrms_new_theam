import React, { useEffect, useState } from 'react'
import { formatDate, formatDateUNIX, formatIndianPrice, getStatus } from '../../../config/commonFunction';
import { DateFormat, emiTypes, STATUS_COLORS } from '../../../config/commonVariable';
import Constatnt, { Codes } from '../../../config/constant';
import { transectionHistory } from '../../../utils/api.services';

export const TransectionHistory = ({ loanDetailsData }) => {

    const [transectionList, setTransectionList] = useState([]);

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

    const loanSubscriptionId = loanDetailsData?.plan_details?.length > 0 && loanDetailsData?.plan_details[0]?.subscriptions[0]?.razorpay_subscription_id;

    useEffect(() => {
        transectionHistory({ subscription_id: loanSubscriptionId }).then((response) => {
            if (response?.status_code == Codes.SUCCESS) {
                console.log('response', response?.data);
                const transectionData = response?.data?.transactions?.length > 0 && response?.data?.transactions || [];
                const updatedList = transectionData?.length > 0 && transectionData?.map(item => ({
                    ...item,
                    is_emi_paid: item?.status === "paid" ? true : false,
                    is_emi_cancelled: item?.status === "cancelled" ? true : false
                }));
                console.log('transectionDatatransectionData', transectionData);

                setTransectionList(updatedList);
            } else {
                console.log("Failed to fetch transaction history");
            }
        })
    }, []);

    return (
        <>
            {/* <div className="justify-content-center mt-0">
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
            </div> */}

            <div className="col-12 justify-content-center">
                <div className='row justify-content-center '>
                    <div className="card overflow-hidden chat-application ">
                        {/* <div className="container p-4 border border-2"> */}
                        <div className="p-md-4 p-4 row_2">
                            <div className="p-9 py-3 border-bottom chat-meta-user d-flex align-items-center justify-content-between mb-4">
                                <h5 className="text-secondary mb-0 fw-semibold fs-6">Transaction History</h5>
                                <ul className="list-unstyled mb-0 d-flex align-items-center">
                                </ul>
                            </div>
                            <div className="row justify-content-center">
                                {transectionList?.length > 0 ? (<>
                                    <div className="col-lg-8">
                                        <div className="" id="accordionFlushExample">
                                            {transectionList?.map((transection, index) => (
                                                <div
                                                    className="transaction-card d-flex justify-content-between align-items-center flex-wrap p-3 mb-3  rounded-3 shadow-sm"
                                                    key={transection?.id}
                                                    style={{
                                                        borderLeft: `4px solid ${emiTypes[getStatus(transection?.status, transection?.paid_at)]?.border}`
                                                    }}
                                                >
                                                    <div className="d-flex flex-column">
                                                        <span className="fw-semibold text-muted fs-4 mb-1">
                                                            {formatDateUNIX(
                                                                transection?.invoice_data?.created_at,
                                                                DateFormat?.ABBREVIATED_FULL_DATE_FORMAT
                                                            )}
                                                        </span>

                                                        {/* Payment ID */}
                                                        <span className="fw-semibold text-dark fs-4 mb-2">
                                                            Payment Id: {transection?.razorpay_invoice_id || "-"}
                                                        </span>
                                                    </div>

                                                    <div className="d-flex flex-column text-end">
                                                        {/* Invoice + Status */}
                                                        <div className=" gap-2 mb-2">
                                                            <span className={`text-muted fs-3 me-2 badge rounded-3  ${emiTypes[transection?.invoice_type]?.color}`} style={{
                                                                border: `1px solid ${emiTypes[transection?.invoice_type]?.border}`,
                                                                backgroundColor: "#fff",
                                                            }}>
                                                                {emiTypes[transection?.invoice_type]?.label}</span>
                                                            <span className={`badge rounded-3 shadow-sm fs-3 ${emiTypes[getStatus(transection?.status, transection?.paid_at)]?.color} `}>{emiTypes[getStatus(transection?.status, transection?.paid_at)]?.label}</span>
                                                        </div>
                                                        <span
                                                            className="fw-semibold"
                                                            style={{ color: "#1F7494", fontSize: "1rem" }}
                                                        >
                                                            {formatIndianPrice(transection?.amount)}
                                                        </span>
                                                    </div>
                                                </div>

                                            ))}
                                        </div>
                                    </div></>) : (<>
                                        <div className="col-lg-12 flex items-center justify-center min-h-[300px]">
                                            <div className="flex flex-col items-center text-center">
                                                <h2 className="text-xl font-semibold text-gray-700">
                                                    No Transaction History
                                                </h2>
                                            </div>
                                        </div>
                                    </>)}

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
