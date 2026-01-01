import axios from 'axios';
import Constatnt, { Codes } from '../config/constant';
import { Decryption, Encryption, logoutRedirection, ManageTokan } from '../config/commonFunction';
import { TOAST_INFO } from '../config/common';

const AxiosClientApi = axios.create({
    baseURL: Constatnt.API_BASE_URL,
});

// request AxiosClient
AxiosClientApi.interceptors.request.use(function (request) {

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

AxiosClientApi.interceptors.response.use(
    async response => {
        const resData = response?.data;
        console.log('resData axios', response);

        // ✅ Token expired based on response code (not HTTP error)
        if (resData?.code == Codes.ACCESS_TOKEN_EXPIRE) {
            logoutRedirection();
        } else if (resData?.code == Codes.UNAUTHORIZED) {
            logoutRedirection();
        } else if (resData?.code == Codes.REFRESH_TOKEN_EXPIRED) {
            logoutRedirection();
        } else if (resData?.code == Codes.INTERNAL_ERROR) {
            // TOAST_INFO('Internal server error. Please try again later.');
        }

        return resData; // ✅ Return normal data if no retry
    },

    // ❌ Handle HTTP error status (like 401)
    async error => {
        // if (error?.response?.status === Codes.UNAUTHORIZED) {
        //     logoutRedirection();
        // }
        logoutRedirection();
        return Promise.reject(error);
    }
);

export default AxiosClientApi;
