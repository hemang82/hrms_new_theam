import axios from 'axios';
import Constatnt, { Codes } from '../config/constant';
import { Decryption, Encryption, logoutRedirection, ManageTokan } from '../config/commonFunction';
import { TOAST_INFO } from '../config/common';

const AxiosClientApi = axios.create({
    baseURL: Constatnt.API_BASE_URL,
});

// request AxiosClient
AxiosClientApi.interceptors.request.use(function (request) {

    // request.headers['token'] = localStorage.getItem(Constatnt?.ACCESS_TOKEN_KEY) || 'bjrr8m04xkdvj521f0sub0qnl2q47xmv52l0lcv7eysynul7so04ybfmhpfmtmb1';

    const token = localStorage.getItem(Constatnt.ACCESS_TOKEN_KEY);
    if (token) {
        request.headers['Authorization'] = `${token}`;
    }
    request.headers['content-type'] = Constatnt.CONTENT_TYPE;

    // request.headers['accept-language'] = Constatnt.LANGUAGE;
    // request.headers['role'] = Constatnt.ROLE;
    request.headers['api-key'] = Constatnt.API_KEY;
    // request.headers['content-type'] = Constatnt.CONTENT_TYPE;
    // request.headers['is_encript'] = Constatnt.IS_ENCREPT;

    return request;
});

// // Response AxiosClient
// AxiosClientApi.interceptors.response.use(
//     function (response) {
//         if (response?.data?.code === Codes?.UNAUTHORIZED) {
//             ManageTokan();
//         }
//         return response.data;
//     },
//     function (error) {
//         if (error?.response?.status === 401) {
//             logoutRedirection();
//         }
//         return Promise.reject(error); // Ensure the error is passed to the caller
//     }
// );

AxiosClientApi.interceptors.response.use(
    async response => {
        const resData = response?.data;
        // ✅ Token expired based on response code (not HTTP error)
        if (resData?.status_code === Codes.ACCESS_TOKEN_EXPIRE) {
            logoutRedirection();
        } else if (resData?.status_code === Codes.UNAUTHORIZED) {
            logoutRedirection();
        } else if (resData?.status_code === Codes.REFRESH_TOKEN_EXPIRED) {
            logoutRedirection();
        } else if (resData?.status_code === Codes.INTERNAL_ERROR) {
            // TOAST_INFO('Internal server error. Please try again later.');
        }
        return resData; // ✅ Return normal data if no retry
    },

    // ❌ Handle HTTP error status (like 401)
    async error => {
        // if (error?.response?.status === Codes.UNAUTHORIZED) {
        //     logoutRedirection();
        // }
        return Promise.reject(error);
    }
);

export default AxiosClientApi;
