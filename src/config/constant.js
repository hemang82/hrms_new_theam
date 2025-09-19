import LOGO from '../assets/Images/hrmslogo.png';
export const PRODUCTION = false;

const Constatnt = {

    APP_NAME: process.env.APP_NAME,
    API_KEY: process.env.REACT_APP_API_KEY,
    CONTENT_TYPE: process.env.REACT_CONTENT_TYPE || 'Application/json',
    API_BASE_URL: PRODUCTION ? process.env.REACT_APP_LIVE_API_BASE_URL : process.env.REACT_APP_LOCAL_API_BASE_URL,
    IS_ENCREPT: false,

    RAZORPAY_KEY: process.env.REACT_APP_RAZORPAY_KEY,

    // # ----------------------------- Encreption keys --------------------------------------

    KEY: process.env.REACT_APP_KEY,
    IV: process.env.REACT_APP_IV,

    BASE_URL: 'assets/images/page-images/',
    LANGUAGE: localStorage.getItem('language') == 'gu' ? localStorage.getItem('language') : 'en',
    per_page: 10,
    POET_LOGO: 'https://sha3ri-dev.s3.me-south-1.amazonaws.com/profile_image/1726821004260.png',
    APP_LOGO: LOGO,
    DEFAULT_IMAGE: "https://jain-fintech-assets.s3.us-east-1.amazonaws.com/profile_image/1747048240510.webp",

    // --------------------------- Code manage ---------------------------------------

    SUCCESS: '1',
    INVALID_OR_FAIL: '0',
    NO_DATA_FOUND: '2',
    DELETE_ACCOUNT: '3',
    USER_SESSION_EXPIRE: '-1',

    // --------------------------local storage creandtials-----------------------------------------

    LOGIN_KEY: "ADMIN_is_login",
    AUTH_KEY: 'ADMIN_auth',
    ACCESS_TOKEN_KEY: 'ADMIN_access_token',
    REFRESH_TOKEN_KEY: 'ADMIN_refresh_token',
    LANGUAGE_KEY: 'ADMIN_language',
    ROLE_KEY: 'ADMIN_role',
    THEME_KEY: 'ADMIN_theme',

    ROLE: 'admin',
}

// # ----------------------------- S3 bucket keys --------------------------------------

export const PUBLIC_URL = process.env.PUBLIC_URL;
export const AWS_STORAGE_BUCKET_NAME = process.env.REACT_APP_AWS_STORAGE_BUCKET_NAME;
export const AWS_ACCESS_KEY_ID = process.env.REACT_APP_AWS_ACCESS_KEY_ID;
export const AWS_SECRET_ACCESS_KEY = process.env.REACT_APP_AWS_SECRET_ACCESS_KEY;
export const AWS_S3_REGION_NAME = process.env.REACT_APP_AWS_S3_REGION_NAME;

export const SEARCH_DELAY = 500;
export const PER_PAGE_DATA = 10;
export const COUNT_PER_PAGE = 10;

export const AwsFolder = {
    PROFILE_IMAGE: 'profile_image',
    PAN_IMAGE: 'pan_card',
    ADHAR_IMAGE: 'aadhar_card',
    PROPERTY_DOCUMENT_IMAGE: 'property_documents',
    PAYMENT_PROOF_DOCUMENT: 'payment_proof_documents',
    LOAN_COMPLETE_DOCUMENT: 'loan_complete_document',

    // class UploadFileType(str, Enum):
    // salaried = "salaried"
    // self_employed = "self_employed"
    // aadhar_card = "aadhar_card"
    // pan_card = "pan_card"
    // profile_image = "profile_image"
    // property_documents = "property_documents"
    // income_proof = "income_proof"
}

// PROFILE_IMAGE: `${process.env.s3_URL}Profileimage/`,
// BLOG_IMAGE:`${process.env.s3_URL}blogs/`,
// CELEBRITY_IMAGE:`${process.env.s3_URL}celebrity/`,
// CELEBRITY_THUMBNAIL:`${process.env.s3_URL}celebrity/`,

export const ModelName = {
    POST_MODEL: 'POSTMODEL',
    DELETE_MODEL: 'DELETEMODEL',
    FAQ_MODEL: 'FAQMODEL',
    LOGOUT_MODEL: 'LOGOUTMODEL',
};

// export const Codes = {
//     SUCCESS: 1,
//     INTERNAL_ERROR: 0,
//     VALIDATION_ERROR: 0,
//     UNAUTHORIZED: -1,
//     EXPIRE: -2,
//     INACTIVE: 3,
//     NOT_FOUND: 2,
//     ERROR: 0
// }

export const Codes = {
    SUCCESS: 1,
    VALIDATION_ERROR: 400,
    ACCESS_TOKEN_EXPIRE: 403,
    INACTIVE: 423,
    NOT_FOUND: 2,
    ERROR: 0,
    INTERNAL_ERROR: 500,
    UNAUTHORIZED: 401,
    REFRESH_TOKEN_EXPIRED: 410,
};


export default Constatnt