

import Constatnt, { Codes } from "./constant";
import CryptoJS from 'crypto-js';
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCountryListApiCall, setModalStatus } from "../Store/slices/MasterSlice";
import ExcelJS from 'exceljs';
import moment from 'moment';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { data } from "jquery";
import { ALL_DOCUMENT_STATUS_LIST, ALL_STATUS, ALL_LOAN_TYPE_LIST, allowedTypes, AstroInputTypesEnum, InputRegex, InputTypesEnum, PAYMENT_STATUS } from "./commonVariable";
import { Language, TOAST_ERROR } from "./common";
import { updateToken } from "../utils/api.services";
import dayjs from 'dayjs';
import utc from "dayjs/plugin/utc";
import parse from "html-react-parser";

dayjs.extend(utc);

const KEY = CryptoJS.enc.Utf8.parse(Constatnt.KEY);
const IV = CryptoJS.enc.Utf8.parse(Constatnt.IV);

// ------------------------------------------------------- Encryption Decreption ---------------------------------------------------------------------------

export const Encryption = (request = {}, isStringify) => {
    const requestData = isStringify ? JSON.stringify(request) : request;
    let encrypted = CryptoJS.AES.encrypt(requestData, KEY, { iv: IV }).toString();
    return encrypted
}

export const Decryption = async (response) => {
    // console.log('Decreption response', response);
    let decrypted = await CryptoJS.AES.decrypt(response.toString(), KEY, { iv: IV });
    let decryptedData = await JSON.parse(decrypted.toString(CryptoJS.enc.Utf8))
    if (decryptedData?.code === '0') {
        TOAST_ERROR(decryptedData?.message);
    }
    if (decryptedData?.code === -1) {
        logoutRedirection();
    }
    return decryptedData;
}

// export const ManageTokan = async (response) => {
//     const refresh_token = localStorage.getItem(Constatnt?.REFRESH_TOKEN_KEY);
//     if (refresh_token) {
//         updateToken({ refresh_token: refresh_token }).then((response) => {
//             console.log('response updateToken', response);
//             if (response?.code === Codes.SUCCESS) {
//                 localStorage.setItem(Constatnt.ACCESS_TOKEN_KEY, response?.data?.accessToken);
//             } else if (response?.code === Codes?.EXPIRE) {
//                 logoutRedirection()
//             } else {
//                 logoutRedirection()
//             }
//         })
//     } else {
//         logoutRedirection()
//     }
// }

// export const ManageTokan = async response => {
//     try {

//         const refresh_token = localStorage.getItem(Constatnt?.REFRESH_TOKEN_KEY)
//         if (!refresh_token) {
//             logoutRedirection()
//             return false
//         }

//         const res = await updateToken({ refresh_token: refresh_token })
//         if (res?.status_code === Codes.SUCCESS) {
//             localStorage.setItem(Constatnt.ACCESS_TOKEN_KEY, res?.data?.access_token)
//             localStorage.setItem(Constatnt.REFRESH_TOKEN_KEY, refresh_token)
//             return true
//         } else if (res?.status_code === Codes.REFRESH_TOKEN_EXPIRED) {

//             logoutRedirection()
//             return false
//         } else {
//             logoutRedirection()
//             return false
//         }
//     } catch (error) {
//         console.error('Error while managing token:', error)
//         logoutRedirection()
//         return false
//     }
// }

export const getFileNameFromUrl = (url) => {
    return url ? url.split('/').pop() : "";
};

// export const formatDate = (dateString, formatPattern) => {
//     return moment(dateString).format(formatPattern);
// };

export const formatDate = (dateString, formatPattern) => {
    return moment.utc(dateString).local().format(formatPattern);
};

export const formatDateUNIX = (dateInput, formatPattern = "DD MMM YYYY") => {
    if (!dateInput) return "";
    const date = typeof dateInput === "number"
        ? moment.unix(dateInput)
        : moment.utc(dateInput);
    return date.local().format(formatPattern).toUpperCase();
};

export const formatDateDyjs = (dateString, formatPattern) => {
    return dayjs(dateString).format(formatPattern);
};

export const formatDateIncommingDyjs = (dateString, incommingFormate, formatPattern) => {
    return dayjs(dateString, incommingFormate).format(formatPattern);
};
export const getArrayFromCommaSeparated = (str) => {
    return str.split(',');
};

export const getCommaSeparatedNames = (list) => {
    return Array.isArray(list) ? list.map(item => item.name).join(', ') : '';
};

// ------------------------------------------------------- Login/Logout Redirection -----------------------------------------------------------------------

export const loginRedirection = (data) => {

    // const navigate = useNavigate();
    // localStorage.setItem(Constatnt.LOGIN_KEY, true);
    // localStorage.setItem(Constatnt.ACCESS_TOKEN_KEY, data?.accessToken);
    // localStorage.setItem(Constatnt.REFRESH_TOKEN_KEY, data?.refreshToken);
    // localStorage.setItem(Constatnt.AUTH_KEY, JSON.stringify(data));

    localStorage.setItem(Constatnt.LOGIN_KEY, true);
    localStorage.setItem(Constatnt.ROLE_KEY, data?.role)

    localStorage.setItem(Constatnt.ACCESS_TOKEN_KEY, data?.access_token)
    localStorage.setItem(Constatnt.REFRESH_TOKEN_KEY, data?.refresh_token)
    localStorage.setItem(Constatnt.AUTH_KEY, JSON.stringify(data))

}

export const logoutRedirection = () => {
    // const navigate = useNavigate();
    localStorage.removeItem(Constatnt.LOGIN_KEY);
    localStorage.removeItem(Constatnt.ROLE_KEY);
    localStorage.removeItem(Constatnt.ACCESS_TOKEN_KEY);
    localStorage.removeItem(Constatnt.REFRESH_TOKEN_KEY);
    localStorage.removeItem(Constatnt.AUTH_KEY);
    // navigate('/login');
}

// export function formatIndianPrice(price) {
//     return '₹' + price?.toLocaleString('en-IN');
// }

export function formatIndianPrice(price) {
    try {
        let number = 0;

        if (typeof price === "string") {
            number = parseFloat(price) || 0;
        } else if (typeof price === "number") {
            number = price;
        }

        return number.toLocaleString("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2,
        });
    } catch (e) {
        return "₹0";
    }
}

export const validateFileType = (file) => {
    const isAllowed = allowedTypes.includes(file.type);
    return isAllowed || false;
};

export const truncateWords = (text, wordLimit = 3) => {
    if (!text) return '-';
    const words = text.split(' ');
    return words.length > wordLimit
        ? words.slice(0, wordLimit).join(' ') + '...'
        : text;
};

export const ExportToCSV = (data, fileName) => {
    try {
        let csvContent = '';
        if (Array.isArray(data) && data.length > 0) {
            if (Array.isArray(data[0])) {
                csvContent = data.map(row => row.join(",")).join("\n");
            } else if (typeof data[0] === 'object') {
                const headers = Object.keys(data[0]);
                csvContent += headers.join(",") + "\n";
                csvContent += data.map(row =>
                    headers.map(header => row[header]).join(",")
                ).join("\n");
            }
        }
        const blob = new Blob([csvContent], { type: 'text/csv' });

        if (window.navigator.msSaveBlob) {
            window.navigator.msSaveBlob(blob, `${fileName}.csv`);
        } else {
            const link = document.createElement("a");
            if (link.download !== undefined) {
                const url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", `${fileName}.csv`);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            } else {
                TOAST_ERROR('Your browser does not support downloading files');
            }
        }
    } catch (error) {
        TOAST_ERROR(error);
    }
};

export const ExportToExcel = (data, fileName) => {
    try {
        const columns = Object.keys(data[0])?.map(item => item?.replace('_', ' ')?.toUpperCase());
        const columns1 = Object.keys(data[0]);

        const wb = new ExcelJS.Workbook();
        const ws = wb.addWorksheet('Sheet 1');

        ws.addRow(columns);

        data.forEach(item => {
            const row = [];
            columns1.forEach(column => {
                row.push(item[column]);
            });
            ws.addRow(row);
        });
        wb.xlsx.writeBuffer().then(buffer => {
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.setAttribute('download', `${fileName}.xlsx`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    } catch (error) {
        TOAST_ERROR(error);
    }
};

export const ExportToPdf = (data, fileName, header) => {
    try {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text(header, 14, 10);
        doc.setLineWidth(0.5);
        doc.line(14, 12, 196, 12);
        doc.setFontSize(18);

        const columns = Object.keys(data[0])?.map(item => item?.replace('_', ' ')?.toUpperCase());
        const tableData = data.map(item => Object.values(item));
        doc.autoTable(columns, tableData);
        doc.save(`${fileName}.pdf`);
    } catch (error) {
        TOAST_ERROR(error);
    }
};

export const convertToBase64 = async (file) => {
    if (file.type.includes("video")) return URL.createObjectURL(file);
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onload = () => {
            resolve(fileReader.result);
        };
        fileReader.onerror = reject;
        file && fileReader.readAsDataURL(file);
    });
};

export const addArray = (oldArray, addObject) => {
    const uniqueId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newObject = { ...addObject, id: uniqueId };
    const updatedArray = [...oldArray, newObject];

    return updatedArray;
}

export const updateArray = (oldArray, updateObject, id) => {

    const updatedImages = oldArray.map(data => {
        if (data.id === id) {
            // Update the selected image object with new data
            return updateObject;
        }
        return data;
    });

    return updatedImages
}

export const removeArray = (oldArray, id) => {
    const updatedData = oldArray.filter(data => data.id !== id);
    return updatedData

}

export const findIndexArray = (oldArray, id) => {
    const indexToEdit = oldArray.findIndex(data => data.id === id);
    if (indexToEdit !== -1) {
        return true;
    } else {
        return false;
    }
}

export const selectOptionCustomer = (option, name) => {
    const optionData = option?.map((option, index) => (
        <option key={option.id} value={option.id}>
            {
                option.name
            }
        </option>
    ))
    return optionData;
}

export const selectOption = (option, name) => {
    const optionData = option?.map((option, index) => (
        <option key={option.key} value={option.key}>
            {
                option.value
            }
        </option>
    ))
    return optionData;
}

export const closeModel = (dispatch) => {
    dispatch(setModalStatus({ modalType: '', isOpen: false, }))
}

export const openModel = (dispatch, type) => {
    dispatch(setModalStatus({ modalType: type, isOpen: true, }))
}

export const momentTimeFormate = (time, timeFormat) => {
    if (!time) return "-";
    return moment.utc(time, timeFormat ? timeFormat : "HH:mm:ss").local().format(timeFormat);
};

export const convertToUTC = (date, time, formate) => {
    return moment.tz(`${date} ${time}`, 'Asia/Kolkata').utc().format(formate);
};

export const momentDateFormat = (date, dateFormat) => {
    return date ? moment.utc(date).format(dateFormat) : "";
};

export const momentNormalDateFormat = (date, inDateFormate, outDateFormat) => {
    return date ? moment(date, inDateFormate).format(outDateFormat) : "";
};

export const dayjsDateFormat = (date, dateFormat) => {
    return date ? dayjs.utc(date).format(dateFormat) : "";
};

export const dayjsNormalDateFormat = (date, dateFormat) => {
    return date ? dayjs(date).format(dateFormat) : "";
};

// export const getWorkingHours = (startTime, endTime, breakMinutes = 0) => {

//     console.log('startTime', startTime, 'endTime', endTime, 'breakMinutes', breakMinutes);

//     if (!startTime) return 0;
//     const start = moment.utc(startTime, "HH:mm:ss");
//     let end;

//     if (endTime) {
//         end = moment.utc(endTime, "HH:mm:ss");
//         if (end.isBefore(start)) {
//             end.add(1, "day");
//         }
//     } else {
//         end = moment.utc();
//     }

//     // Total duration
//     let duration = moment.duration(end.diff(start));

//     // Subtract break minutes
//     duration = moment.duration(duration.asMinutes() - breakMinutes, "minutes");

//     const hours = Math.floor(duration.asHours());
//     const minutes = duration.minutes();

//     return `${hours}h ${minutes}m`;
// };


export const getWorkingHours = (
    checkInTimes = [],
    checkOutTimes = [],
    breakMinutes = 0
) => {
    if (!Array.isArray(checkInTimes) || !Array.isArray(checkOutTimes)) {
        return "-";
    }

    let totalMinutes = 0;

    checkInTimes.forEach((checkIn, index) => {
        if (!checkIn) return;

        const checkOut = checkOutTimes[index];

        const start = moment.utc(checkIn, "HH:mm:ss");

        // ✅ If checkout missing → use current time
        let end = checkOut
            ? moment.utc(checkOut, "HH:mm:ss")
            : moment.utc();

        // 🌙 Handle next-day case
        if (end.isBefore(start)) {
            end.add(1, "day");
        }

        const diffMinutes = moment
            .duration(end.diff(start))
            .asMinutes();

        totalMinutes += diffMinutes;
    });

    // ➖ Subtract break minutes
    totalMinutes -= breakMinutes;

    if (totalMinutes <= 0) return "0h 0m";

    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.round(totalMinutes % 60);

    return `${hours}h ${minutes}m`;
};


export const getBreakMinutes = (breaks = []) => {

    if (!Array.isArray(breaks)) return 0;

    return breaks.reduce((total, b) => {
        if (!b.start || !b.end) return total;

        const start = moment(b.start, "HH:mm:ss");
        let end = moment(b.end, "HH:mm:ss");

        // If end < start → it means next day
        if (end.isBefore(start)) {
            end.add(1, "day");
        }

        const diff = moment.duration(end.diff(start)).asMinutes();

        // Round to nearest whole minute
        return total + Math.round(diff);
    }, 0);
};

export const getCheckInOutMinutes = (checkInTimes = [], checkOutTimes = []) => {

    if (!Array.isArray(checkInTimes) || !Array.isArray(checkOutTimes)) {
        return 0;
    }

    return checkInTimes.reduce((total, checkIn, index) => {
        const checkOut = checkOutTimes[index];
        // ❌ If checkout not available, skip (still checked-in)
        if (!checkIn || !checkOut) return total;

        const start = moment(checkIn, "HH:mm:ss");
        let end = moment(checkOut, "HH:mm:ss");

        // 🌙 Handle next-day checkout
        if (end.isBefore(start)) {
            end.add(1, "day");
        }

        const diffMinutes = moment.duration(end.diff(start)).asMinutes();

        return total + Math.round(diffMinutes);
    }, 0);
};

export function getSaturdayOrdinal(date) {
    // Parse the given date
    let dateMoment = moment(date);

    // Check if it's a Saturday
    if (dateMoment.day() !== 6) {
        return 'The given date is not a Saturday.';
    }

    // Get the first Saturday of the month
    let firstSaturday = moment(dateMoment).startOf('month').day(6);

    // If the first Saturday is in the previous month (it may happen), move it forward
    if (firstSaturday.date() > 7) {
        firstSaturday = firstSaturday.add(1, 'week');
    }

    // Count the Saturdays
    let saturdayCount = 1;
    while (firstSaturday.isBefore(dateMoment)) {
        saturdayCount++;
        firstSaturday.add(1, 'week');
    }

    return saturdayCount; // Return the ordinal (1st, 2nd, 3rd, 4th, etc.)
}
// --------------------------------- Input validation ------------------------------------

export const handelInputText = (event) => {
    const { value, name } = event.target;
    console.log('-----------------  name  --------------------->', name);
    const input = String.fromCharCode(event.which);
    isValidInput(name, input, event)
}

export const isValidInput = (inputType, text, event) => {

    var pattern = /^[A-Za-z]+$/;

    if (inputType === InputTypesEnum.FIRSTNAME || inputType === InputTypesEnum.LASTNAME) {

        pattern = InputRegex.FIRSTNAME_REGEX;
    } else if (inputType === InputTypesEnum.EMAIL) {

        pattern = InputRegex.EMAIL_REGEX;

    } else if (inputType === InputTypesEnum.ONCHANGEEMAIL) {

        pattern = InputRegex.ONCHANGEEMAIL_REGEX;

    } else if (inputType === InputTypesEnum.MOBILE) {

        pattern = InputRegex.MOBILE_REGEX;

    } else if (inputType === InputTypesEnum.PASSWORD || InputTypesEnum.OLDPASSWORD || InputTypesEnum.NEWPASSWORD) {

        pattern = InputRegex.PASSWORD_REGEX;

    } else if (inputType === InputTypesEnum.ONCHANGEPASSWORD) {

        pattern = /^[A-Za-z0-9!@#$%&*]+$/;

    } else if (inputType === InputTypesEnum.ADDRESS) {

        pattern = InputRegex.ADDRESS_REGEX;

    } else if (inputType === InputTypesEnum.CITY || inputType === InputTypesEnum.COUNTRY || inputType === InputTypesEnum.NAME) {

        pattern = InputRegex.CHAR_REGEX;

    } else if (inputType === InputTypesEnum.ZIPCODE) {

        pattern = InputRegex.NUMBER_REGEX;
    }

    if (pattern.test(text) && text !== ' ') {
        return pattern.test(text);
    } else {
        event.preventDefault();
    }
};

export const textValidation = (inputType, value) => {

    if (inputType == InputTypesEnum.NAME) {
        return ({
            required: "Enter name",
            minLength: {
                value: 2,
                message: "Invalid name."
            },
        })
    }

    if (inputType == InputTypesEnum.MOBILE) {
        return ({
            required: "Enter mobile number",
        })
    }

    if (inputType === InputTypesEnum.LASTNAME) {
        return ({
            required: "Enter last name",
            minLength: {
                value: 2,
                message: "Invalid last name."
            },
            pattern: {
                value: InputRegex.FIRSTNAME_REGEX,
                message: "Last name should only contain letters"
            }
        })
    }

    if (inputType === InputTypesEnum.EMAIL) {

        return ({ required: Language('enterEmailAddress'), pattern: { value: InputRegex.EMAIL_REGEX, message: Language('enterValidEmail'), }, })
    }

    if (inputType === InputTypesEnum.PASSWORD) {
        return ({
            required: Language('enterPassword'),
            // pattern: {
            //     value: InputRegex.PASSWORD_REGEX,
            //     message: Language('passwordValidation'),
            // },
        })
    }

    if (inputType === InputTypesEnum.EMPLOYEE) {
        return ({
            required: "Enter Employee ID.",
            // pattern: {
            //     value: InputRegex.PASSWORD_REGEX,
            //     message: Language('passwordValidation'),
            // },
        })
    }

    if (inputType === InputTypesEnum.OLDPASSWORD) {
        return ({
            required: "Enter old password",
            pattern: {
                value: InputRegex.PASSWORD_REGEX,
                message: Language('passwordValidation'),
            },
        })
    }

    if (inputType === InputTypesEnum.NEWPASSWORD) {
        return ({
            required: "Enter new password",
            pattern: {
                value: InputRegex.PASSWORD_REGEX,
                message: Language('passwordValidation'),
            },
        })
    }

    if (inputType === InputTypesEnum.CONFIRM_PASSWORD) {
        return ({
            required: "Enter confirm password",
            pattern: {
                value: InputRegex.PASSWORD_REGEX,
                message: Language('passwordValidation'),
            },
            validate: (v) => v === value || "Password do not match"
        })
    }

    if (inputType === AstroInputTypesEnum.ADHARCARD) {
        return ({
            required: "Enter Adhar Card number",
            pattern: {
                value: InputRegex.AADHAR_NUMBER_REGEX,
                message: 'Enter valid Adhar Card number',
            },
        })
    }

    if (inputType === AstroInputTypesEnum.PANCARD) {
        return ({
            required: "Enter Pan Card number",
            pattern: {
                value: InputRegex.PAN_NUMBER_REGEX,
                message: 'Enter valid Pan Card number',
            },
        })
    }

}

// export const textInputValidation = (inputType, error) => {

//     if (inputType === InputTypesEnum.CATEGORY_EN
//         || inputType === InputTypesEnum.CATEGORY_AR ||
//         inputType === InputTypesEnum.SUB_CATEGORY_AR || inputType === InputTypesEnum.SUB_CATEGORY_EN || inputType === InputTypesEnum.SUB_CATEGORY_TOKEN || inputType === InputTypesEnum.NAME_EN || inputType === InputTypesEnum.NAME_AR || inputType === InputTypesEnum.TOKEN || inputType === InputTypesEnum.DESCRIPTION_EN || inputType === InputTypesEnum.DESCRIPTION_AR) {
//         return ({
//             required: error,
//         })
//     }
// }

export const textInputValidation = (inputType, error) => {

    if (inputType === InputTypesEnum.MOBILE) {
        return ({
            required: error,
            pattern: {
                value: /^[0-9]{10}$/,
                message: 'Mobile number must be 10 digits',
            },
        });
    } else if (inputType === AstroInputTypesEnum.PANCARD) {
        return {
            required: error,
            pattern: {
                value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                message: "Enter a valid PAN card number (e.g. ABCDE1234F)",
            },
        };
    } else if (inputType === InputTypesEnum.TITLE || inputType === InputTypesEnum.LINK || inputType === InputTypesEnum.THUMBNAIL || InputTypesEnum.IMAGE) {
        return ({
            required: error,
        })
    }
}

export const ALLSTATUS_LIST = [
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

export const STATUS_CLASSES = {
    PENDING: "bg-warning text-white",
    UNDER_REVIEW: "bg-info text-white",
    ON_HOLD: "bg-warning white border-0",
    APPROVED: "bg-success text-white  border-0",
    REJECTED: "bg-danger text-white  border-0",
    DISBURSED: "bg-primary text-white",
    CLOSED: "bg-secondary text-white",
    CANCELLED: "bg-danger text-white"
};

export const getLoanTypeObject = (loan_type) => {
    return ALL_LOAN_TYPE_LIST.find(item => item.key === loan_type)
};

export const getAllStatusObject = (status) => {
    return ALL_STATUS.find(item => item.key === status)
};
export const getLoanStatusObject = (status) => {
    return ALL_STATUS.find(item => item.key === status)
};

export const getDocumentStatusObject = (status) => {
    return ALL_DOCUMENT_STATUS_LIST.find(item => item.key === status)
};

export const getPaymentStatusObject = (status) => {
    return PAYMENT_STATUS.find(item => item.key === status)
};

export const getStatus = (status, paid_at) => {
    if (!status) return "";
    return status === "issued" && paid_at === null ? "Due" : status;
};

export const QuillContentRowWise = (content) => {
    return (
        <div className="quill-output">
            {content ? parse(content) : <span>No description</span>}
        </div>
    );
};

// Disable future dates (only past & today allowed)
export const disableFutureDates = (current) => {
    return current && current > dayjs().endOf("day");
};

// Disable past dates (only today & future allowed)
export const disablePastDates = (current) => {
    return current && current < dayjs().startOf("day");
};

// Disable dates between two ranges
export const disableBeforeStartDate = (startDate) => (current) => {
    return current && current < dayjs(startDate).startOf("day");
};

export const getLocalStorageItem = (key) => {
    return localStorage.getItem(key);
};