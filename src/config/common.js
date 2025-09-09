import Constatnt from "./constant";
import CryptoJS from 'crypto-js';
// import { toast } from "react-toastify";
import { toast } from "sonner";
import Swal from "sweetalert2";
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { getCountryListApiCall } from "../Store/slices/MasterSlice";
import dayjs from "dayjs";
import ExcelJS from 'exceljs';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const KEY = CryptoJS.enc.Utf8.parse(Constatnt.KEY);
const IV = CryptoJS.enc.Utf8.parse(Constatnt.IV);

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
    return decryptedData;
}

// export function LoginRedirection(response) {
//     const navigate = useNavigate();
//     localStorage.setItem('auth', JSON.stringify(response.data));
//     localStorage.setItem('token', response.data.token);
//     navigate('/home');
// }

// export const loginRedirection = (data) => {
//     // const navigate = useNavigate();
//     localStorage.setItem(Constatnt.LOGIN_KEY, true);
//     localStorage.setItem(Constatnt.USER_ROLE_KEY, data?.role);
//     localStorage.setItem(Constatnt.TOKEN_KEY, data.token);
//     localStorage.setItem(Constatnt.AUTH_KEY, JSON.stringify(data));
// }

// export const logoutRedirection = () => {
//     // const navigate = useNavigate();
//     localStorage.removeItem(Constatnt.LOGIN_KEY);
//     localStorage.removeItem(Constatnt.USER_ROLE_KEY);
//     localStorage.removeItem(Constatnt.TOKEN_KEY);
//     localStorage.removeItem(Constatnt.AUTH_KEY);
//     // navigate('/login');
// }

export const Translate = (keyword) => {
    const { t, i18n } = useTranslation();
    return t(keyword)
}

const capitalizeWords = (str) => {
    const hyphenIndex = str.indexOf("-");
    if (hyphenIndex !== -1) {
        const words = str.split("-");
        const capitalizedWords = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1));
        return capitalizedWords.join(" ");
    } else {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
};

const formatDate = (date, format) => {
    return dayjs(date).format(format);
};

const SWIT_SUCCESS = (message) => {
    return Swal.fire({
        position: 'top-center',
        icon: 'success',
        title: message,
        showConfirmButton: false,
        timer: 1800
    })
};

export const SWIT_FAILED = (message) => {
    return Swal.fire({
        position: 'top-center',
        icon: 'error', // or 'warning' for pending
        title: message,
        showConfirmButton: true,
        confirmButtonText: 'OK',
        confirmButtonColor: '#1F7494',
        customClass: {
            title: 'swal2-title-sm'
        }
    });
};

const SWIT_DELETE = (message) => {
    return Swal.fire({
        title: 'Are you sure?',
        text: message ? message : "",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#bd30d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    })
};

const SWIT_DELETE_SUCCESS = (message) => {
    return Swal.fire({
        position: 'top-center',
        icon: 'success',
        title: message ? message : 'Your data has been deleted.',
        showConfirmButton: false,
        timer: 1500
    })
};

const TOAST_SUCCESS = (message) => {
    return toast.success(message);
};

const TOAST_INFO = (message) => {
    return toast.info(message);
};

const TOAST_ERROR = (message) => {
    return toast.error(message);
};

const TOAST_WARNING = (message) => {
    return toast.warning(message);
};

const SWIT_LOGOUT = (message) => {
    return Swal.fire({
        title: 'Are you sure logout?',
        text: message ? message : "",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#5d87ff',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, logout it!'
    })
};

export const WARNING_MODEL = () => {

    return (
        <div className="modal fade" id="al-danger-alert" tabIndex={-1} aria-labelledby="vertical-center-modal" aria-hidden="true">
            <div className="modal-dialog modal-sm">
                <div className="modal-content modal-filled bg-light-danger">
                    <div className="modal-body p-4">
                        <div className="text-center text-danger">
                            <i className="ti ti-hexagon-letter-x fs-7" />
                            <h4 className="mt-2">Oh snap!</h4>
                            <p className="mt-3">
                                Cras mattis consectetur purus sit amet
                                fermentum.Cras justo odio, dapibus ac
                                facilisis in, egestas eget quam.
                            </p>
                            <button type="button" className="btn btn-light my-2" data-bs-dismiss="modal">
                                Continue
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
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

export const Language = (keyword) => {
    const { t, i18n } = useTranslation();
    return t(keyword)
}

const MOBILE_VALIDATION = () => {
    return ({ required: "Please enter mobile number", pattern: { value: /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/i, message: "Please enter valid mobile number", }, maxLength: { value: 10, message: "Mobile number should not exceed 10 characters" }, minLength: { value: 8, message: "Please enter atleast 8 digits for mobile number" } })
};

const EMAIL_VALIDATION = () => {
    return ({ required: "Enter your email address", pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Please enter valid email address", }, })
};

const PASSWORD_VALIDATION = () => {
    return ({ required: "Enter password", pattern: { value: /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/, message: "Password must contain at least 8 characters, one uppercase, one number and one special case character", }, })
};

const CONFIRM_PASSWORD_VALIDATION = (value) => {
    return ({ required: "Please enter confirm password", pattern: { value: /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/, message: "Confirm password must contain at least 8 characters, one uppercase, one number and one special case character", }, validate: (v) => v === value || "Password do not match" })
};

const FIRST_NAME_VALIDATION = () => {
    return ({
        required: "Please enter first name",
        minLength: {
            value: 2,
            message: "Invalid first name."
        },
        pattern: {
            value: /^[A-Za-z]+$/,
            message: "First name should only contain letters"
        }
    })
};

const TEXT_VALIDATION = (fieldName) => {
    return ({
        required: "Please enter " + fieldName,
        minLength: {
            value: 2,
            message: `Invalid ${fieldName}.`
        },
        pattern: {
            value: /^[A-Za-z]+$/,
            message: `${fieldName} should only contain letters`
        }
    })
};

const NUMBER_VALIDATION = (fieldName, minLength = false, maxLength = false) => {
    return ({
        required: "Please enter " + fieldName,
        ...(minLength && {
            minLength: {
                value: minLength,
                message: `Invalid ${fieldName}.`
            },
        }),
        ...(maxLength && {
            maxLength: {
                value: maxLength,
                message: `${fieldName} should not exceed ${maxLength} numbers`
            },
        }),
        pattern: {
            value: /^[0-9]+$/,
            message: `${fieldName} should only contain numbers`
        }
    })
};

const LAST_NAME_VALIDATION = () => {
    return ({
        required: "Please enter last name",
        minLength: {
            value: 2,
            message: "Invalid last name."
        },
        pattern: {
            value: /^[A-Za-z]+$/,
            message: "Last name should only contain letters"
        }
    })
};

const ExportToCSV = (data, fileName) => {
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

const ExportToExcel = (data, fileName) => {
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

const ExportToPdf = (data, fileName, header) => {
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

const allowLettersAndSpaces = (event) => {
    const input = String.fromCharCode(event.which);
    if (!/^[A-Za-z]*$/.test(input) && input !== ' ') { // Adding check for space character
        event.preventDefault();
    }
};

export const handleFullscreenClick = () => {
    if (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement) {
        // If already in fullscreen, exit fullscreen
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    } else {
        // If not in fullscreen, request fullscreen
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
        }
    }
};

export { capitalizeWords, allowLettersAndSpaces, PASSWORD_VALIDATION, formatDate, SWIT_SUCCESS, SWIT_DELETE, SWIT_DELETE_SUCCESS, TOAST_SUCCESS, TOAST_INFO, TOAST_ERROR, TOAST_WARNING, SWIT_LOGOUT, FIRST_NAME_VALIDATION, TEXT_VALIDATION, NUMBER_VALIDATION, LAST_NAME_VALIDATION, EMAIL_VALIDATION, MOBILE_VALIDATION, ExportToCSV, ExportToExcel, ExportToPdf };

