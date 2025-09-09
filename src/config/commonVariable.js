
//  date formate 
export const DateFormat = {
    DATE_FORMAT: "DD-MM-YYYY", // 2024-06-12
    ABBREVIATED_DATE_FORMAT: "D MMM", // 12 Jun
    ABBREVIATED_FULL_DATE_FORMAT: "DD MMM YYYY", // 12 Jun, 2024
    DATE_SLASH_FORMAT: "DD/MM/YYYY", // 12/06/2024
    DATE_YEAR_WISE_SLASH_TIME_FORMAT: "DD/MM/YYYY h:mm A", // 2024-06-12 3:45 PM
    DATE_TIME_FORMAT: "DD MMM YYYY, hh:mm A", // 12 Jun 2024, 03:45 PM
    DATE_TIME_MONTH_WISE_FORMAT: "MMM DD YYYY, hh:mm A", // Jun 12 2024, 03:45 PM
    DATE_DASH_TIME_FORMAT: "YYYY-DD-MM", // 12-6-2024 3:45 PM
    DATE_LOCAL_DASH_TIME_FORMAT: "YYYY-MM-DD", // 2024-06-12T15:45
    DATE_DOT_TIME_FORMAT: "DD-MM-YYYY H:mm", // 12.06.2024 15:45
    DATE_WEEK_MONTH_NAME_FORMAT: "DD-MM-YYYY , ddd",
    DATE_WEEK_NAME_FORMAT: "dddd",
};

// Time Formats
export const TimeFormat = {
    TIME_12_HOUR_FORMAT: "hh:mm A", // 06:43 PM
    TIME_24_HOUR_FORMAT: "HH:mm", // 18:43
    TIME_WITH_SECONDS_12_HOUR_FORMAT: "hh:mm:ss A", // 06:43:54 PM
    TIME_WITH_SECONDS_24_HOUR_FORMAT: "HH:mm:ss", // 18:43:54
    DATE_FORMAT_SHORT: "MM/DD/YYYY", // 07/02/2024
    DATE_FORMAT_LONG: "MMMM D, YYYY", // July 2, 2024
    DATE_TIME_12_HOUR_FORMAT: "h:mm A", // July 2, 2024 6:43 PM
    DATE_TIME_24_HOUR_FORMAT: "MMMM D, YYYY HH:mm", // July 2, 2024 18:43
    FULL_DATE_TIME_12_HOUR_FORMAT: "dddd, MMMM D, YYYY h:mm A", // Tuesday, July 2, 2024 6:43 PM
    FULL_DATE_TIME_24_HOUR_FORMAT: "dddd, MMMM D, YYYY HH:mm" // Tuesday, July 2, 2024 18:43
};

// Form Input enums
export const InputTypesEnum = {

    FIRSTNAME: 'firstName',
    LASTNAME: 'lastName',
    NAME: 'name',
    EMAIL: 'email',
    MOBILE: 'mobile_number',
    COUNTRYCODE: 'country_code',

    PASSWORD: 'password',
    OLDPASSWORD: 'old_password',
    NEWPASSWORD: 'new_password',
    CONFIRM_PASSWORD: 'confirm_password',

    PROFILE_IMAGE: 'profile_image',
    CATEGORY_IMAGE: 'category_image',

    CATEGORY_EN: 'category_en',
    SUB_CATEGORY_EN: 'sub_category_en',
    CATEGORY_AR: 'category_ar',
    SUB_CATEGORY_AR: 'sub_category_ar',
    SUB_CATEGORY_TOKEN: 'sub_category_token',

    NAME_EN: 'name_en',
    NAME_AR: 'name_ar',
    DESCRIPTION_EN: 'description_en',
    DESCRIPTION_AR: 'description_ar',
    TOKEN: 'token',

    ONCHANGEPASSWORD: 'onChangePassword',
    ONCHANGEEMAIL: 'onChangeEmail',
    ADDRESS: 'address',
    CITY: 'city',
    COUNTRY: 'country',
    ZIPCODE: 'zipCode',
    EXPERIENCE: 'experience',
    // ------------------------------------------------------
    TITLE: 'title',
    LINK: 'link',
    BLANK: '',
    THUMBNAIL: 'thumbnail',
    IMAGE: 'image',
    BLOGTITLEGU: 'blog_gu',
    BLOGTITLE: 'blog',
    BLOGTITLEHI: 'blog_en',
    BLOGDESGU: 'blog_des_gu',
    BLOGDESHI: 'blog_des_hi',
    BLOGDES: 'blog_des',
    CATEGORYHI: 'caltegory_hi',
    CATEGORY_IMG: 'category_img',
    GENDER: 'gender',
    EXPERIANCE: 'experiance',
    PRICEMIN: 'price_per_min',
    ADDRESS: 'address',
    CITY: 'city',
    PINCODE: 'pincode',
    CATEGORY: 'category',
    LANGUAGE: 'language',
    PROFILE: 'profile_image',
    BANERTITLEHI: 'bannertitle_hi',
    BANERTITLEGU: 'bannertitle_gu',
    BANERTITLE: 'bannertitle',
    DISCOUNTTYPE: 'discount_type',
    CODE: 'code',
    MAXDIS: 'max_discount',
    MINORDER: 'min_order_amount',
    VALIDFROM: 'valid_from',
    DISCOUNT: 'discount',
    DISTYPE: 'discount_type',
    USAGELIMIT: 'usage_limit',
    VALIDTO: 'valid_to',
    TITLEHI: 'hi_title',
    TITLEGU: 'gu_title',
    CREATEDAT: 'created_at',
    BLOGDES: 'description',
    BLOGDESHI: 'hi_description',
    BLOGDESGU: "gu_description",
};

export const AstroInputTypesEnum = {

    CATEGORY_EN: 'category_en',
    CATEGORY_GU: 'category_gu',
    CATEGORY_HI: 'category_hi',
    CATEGORY_IMAGE: 'category_image',

    PASSWORD: 'password',
    PROFILE_IMAGE: 'aadhaar_file',


    BANNER_EN: 'banner_en',
    BANNER_GU: 'banner_gu',
    BANNER_HI: 'banner_hi',
    BANNER_IMAGE: 'banner_image',

    CODE_NAME: 'code_name',
    CODE: 'code',
    DISCOUNT_TYPE: 'discount_type',
    DISCOUNT: 'discount',
    USAGE_LIMIT: 'usage_limit',
    MAX_DISCOUNT: 'max_discount',
    MIN_ORDER_AMOUNT: 'min_order_amount',
    FROM_DATE: 'from_date',
    TO_DATE: 'to_date',
    LEAVE_TYPE: 'leave_type',
    LEAVE_DAY: 'leave_day',
    HALF_DAY_TYPE: 'half_day_type',
    REASON: 'reason',

    LEAVE_BALANCE: 'leave_balance',
    EMPLOYEE: 'employee',
    BLOG_TITLE_EN: 'blog_title_en',
    BLOG_TITLE_GU: 'blog_title_gu',
    BLOG_TITLE_HI: 'blog_title_hi',
    BLOG_DESC_EN: 'blog_desc_en',
    BLOG_DESC_GU: 'blog_desc_gu',
    BLOG_DESC_HI: 'blog_desc_hi',
    BLOG_IMAGE: 'blog_image',

    NEWS_TITLE_EN: 'news_title_en',
    NEWS_TITLE_GU: 'news_title_gu',
    NEWS_TITLE_HI: 'news_title_hi',
    NEWS_DESC_EN: 'news_desc_en',
    NEWS_DESC_GU: 'news_desc_gu',
    NEWS_DESC_HI: 'news_desc_hi',

    REGISTRATION_NUMBER: 'registration_number',
    NAME: 'name',
    DEPARTMENT: 'department',
    NO_OF_EMPLOYEE: 'no_of_employee',

    DESIGNATION: 'designation',
    MONTHLY_SALARY: "monthly_salary",
    SENIOR_NAME: 'senior_name',
    DATE: 'date',
    EMPLOYEE_ID: 'employee_id',

    BANK_NAME: 'bank_name',
    BANK_BRANCH: 'bank_branch',
    IFSC_CODE: 'ifsc_code',
    ACCOUNT_NUMBER: 'account_number',
    ACCOUNT_HOLDER_NAME: 'account_holder_name',



    EMAIL: 'email',
    MOBILE: 'mobile_number',
    COUNTRYCODE: 'country_code',
    LOAN_TYPE: 'loan_type',
    PAYMENT_CHARGE_TYPE: 'charge_type',
    GENDER: 'gender',
    TIME_OF_BIRTH: 'time_of_birth',
    PLACE_OF_BIRTH: "place_of_birth",
    BIRTH_DATE: "birth_date",
    CURRENT_ADDRESH: 'curr_address',
    CITY: 'city',
    PINCODE: 'pincode',
    EXPERIANCE: 'expriance',
    PRICEMIN: 'price_per_min',
    DISCOUNT_PERMIN: 'discount_per_min',
    LANGUAGE: 'language',
    CATEGORY: 'category',
    TYPE: 'type',
    VALUE: 'value',
    DURETION: 'duretion',
    EXPIRY_COUNT: 'expiry_count',
    OFFER: 'offer',
    PRICE: 'price',

    TITLE: 'title',
    LINK: 'link',
    THUMBNAIL: 'thumb_nail',
    IMAGE: 'image',
    PANCARD: 'pancard',
    PANCARD_FILE: 'pancard_file',
    PROOF_FILE: 'proof_file',
    PROPERTY_DOCUMENT_FILE: 'property_document_file',



    ANNUAL_INCOME: 'annual_income',
    PURPOSE_OF_LOAN: 'purpose_of_loan',
    DESIGNATION: 'designation',
    DESIRED_LOAN_AMOUNT: 'desired_loan_amount',
    AMOUNT: 'amount',

    ADHARCARD: 'aadhaarcard',
    ADHARCARD_FILE: 'aadhaar_file',
    COMPANY_NAME: 'company_name',
    COMPANY_ADDRESS: 'company_address',
    INCOME_PROOF: 'income_proof',
    DOCUMENT_PROOF_TYPE: 'document_proof_type',
    LABEL: 'label',
    MIN_SCORE: 'min_score',
    MAX_SCORE: 'max_score',
    INTREST_PERCENTAGE: 'rate_percentage',
    CREDIT_SCORE: 'credit_score',
    EMI_SCHEDULE_DATE: 'emi_schedule_date',
    MIN_FEE_PERCENTAGE: 'min_fee_percentage',
    MAX_FEE_PERCENTAGE: 'max_fee_percentage',
    LOAN_COMPLETION_FILE: 'loan_completion_file',


};

// all rgex
export const InputRegex = {
    CHAR_REGEX: /^[A-Za-z\s]*$/,
    NUMBER_REGEX: /^[0-9]{0,10}$/,
    FIRSTNAME_REGEX: /^[A-Za-z]*$/,
    LASTNAME_REGEX: /^[A-Za-z]*$/,
    EMAIL_REGEX: /^[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
    ONCHANGEEMAIL_REGEX: /^[A-Z0-9a-z.@]+$/,
    MOBILE_REGEX: /^\d{10}$/,
    ONCHANGE_MOBILE_REGEX: /[^0-9]/g,

    PAN_NUMBER_REGEX: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
    ONCHANGE_PANNUMBER_REGEX: /[^A-Z0-9]/gi,

    AADHAR_NUMBER_REGEX: /^\d{12}$/,
    ONCHANGE_AADHAR_REGEX: /[^0-9]/g,

    PASSWORD_REGEX: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&<>*~:`-]).{8,}$/,
    ADDRESS_REGEX: /^[A-Za-z0-9, ]+$/,
};

export const AwsFolder = {
    CAREGIVER_INTRO: 'caregiver_intro',
    CAREGIVER_PHOTOS: 'caregiver_photos',
    CATEGORY_IMAGE: 'category_image',
    CERTIFICATIONS_DOCS: 'certifications_docs',
    CHAT_MEDIA: 'chat_media',
    CHILDCARE_RESOURCES: 'childcare_resources',
    CHILDREN_PROFILE: 'children_profile',
    COMMUNITY_MEDIA: 'community_media',
    COMMUNITY_PROFILE: 'community_profile',
    PHOTO_SHARE: 'photo_share',
    PROFILE_IMAGE: 'profile_image',
    SPOTLIGHT: 'spotlight',
};

export const ModelName = {
    POST_MODEL: 'POSTMODEL',
    DELETE_MODEL: 'DELETEMODEL',
    FAQ_MODEL: 'FAQMODEL',
    LOGOUT_MODEL: 'LOGOUTMODEL',
};

export const allowedTypes = [
    "application/pdf",
    "image/png",
    "image/jpeg",
    "image/jpg",
];

export const browserOptions = [
    { value: 'firefox', label: 'Firefox' },
    { value: 'safari', label: 'Safari' },
    { value: 'opera', label: 'Opera' },
    { value: 'chrome', label: 'Chrome' },
    { value: 'IE', label: 'Internet Explorer' }
];

export const countryListData = [
    {
        "name": "Afghanistan",
        "code": "AF",
        "dial_code": "+93",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/AF.svg"
    },
    {
        "name": "Åland Islands",
        "code": "AX",
        "dial_code": "+358",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/AX.svg"
    },
    {
        "name": "Albania",
        "code": "AL",
        "dial_code": "+355",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/AL.svg"
    },
    {
        "name": "Algeria",
        "code": "DZ",
        "dial_code": "+213",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/DZ.svg"
    },
    {
        "name": "American Samoa",
        "code": "AS",
        "dial_code": "+1684",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/AS.svg"
    },
    {
        "name": "Andorra",
        "code": "AD",
        "dial_code": "+376",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/AD.svg"
    },
    {
        "name": "Angola",
        "code": "AO",
        "dial_code": "+244",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/AO.svg"
    },
    {
        "name": "Anguilla",
        "code": "AI",
        "dial_code": "+1264",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/AI.svg"
    },
    {
        "name": "Antarctica",
        "code": "AQ",
        "dial_code": "+672",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/AQ.svg"
    },
    {
        "name": "Argentina",
        "code": "AR",
        "dial_code": "+54",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/AR.svg"
    },
    {
        "name": "Armenia",
        "code": "AM",
        "dial_code": "+374",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/AM.svg"
    },
    {
        "name": "Aruba",
        "code": "AW",
        "dial_code": "+297",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/AW.svg"
    },
    {
        "name": "Australia",
        "code": "AU",
        "dial_code": "+61",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/AU.svg"
    },
    {
        "name": "Austria",
        "code": "AT",
        "dial_code": "+43",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/AT.svg"
    },
    {
        "name": "Azerbaijan",
        "code": "AZ",
        "dial_code": "+994",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/AZ.svg"
    },
    {
        "name": "Bahamas",
        "code": "BS",
        "dial_code": "+1242",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/BS.svg"
    },
    {
        "name": "Bahrain",
        "code": "BH",
        "dial_code": "+973",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/BH.svg"
    },
    {
        "name": "Bangladesh",
        "code": "BD",
        "dial_code": "+880",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/BD.svg"
    },
    {
        "name": "Barbados",
        "code": "BB",
        "dial_code": "+1246",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/BB.svg"
    },
    {
        "name": "Belarus",
        "code": "BY",
        "dial_code": "+375",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/BY.svg"
    },
    {
        "name": "Belgium",
        "code": "BE",
        "dial_code": "+32",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/BE.svg"
    },
    {
        "name": "Belize",
        "code": "BZ",
        "dial_code": "+501",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/BZ.svg"
    },
    {
        "name": "Benin",
        "code": "BJ",
        "dial_code": "+229",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/BJ.svg"
    },
    {
        "name": "Bermuda",
        "code": "BM",
        "dial_code": "+1441",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/BM.svg"
    },
    {
        "name": "Bhutan",
        "code": "BT",
        "dial_code": "+975",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/BT.svg"
    },
    {
        "name": "Botswana",
        "code": "BW",
        "dial_code": "+267",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/BW.svg"
    },
    {
        "name": "Bouvet Island",
        "code": "BV",
        "dial_code": "+47",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/BV.svg"
    },
    {
        "name": "Brazil",
        "code": "BR",
        "dial_code": "+55",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/BR.svg"
    },
    {
        "name": "British Indian Ocean Territory",
        "code": "IO",
        "dial_code": "+246",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/IO.svg"
    },
    {
        "name": "Bulgaria",
        "code": "BG",
        "dial_code": "+359",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/BG.svg"
    },
    {
        "name": "Burkina Faso",
        "code": "BF",
        "dial_code": "+226",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/BF.svg"
    },
    {
        "name": "Burundi",
        "code": "BI",
        "dial_code": "+257",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/BI.svg"
    },
    {
        "name": "Cambodia",
        "code": "KH",
        "dial_code": "+855",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/KH.svg"
    },
    {
        "name": "Cameroon",
        "code": "CM",
        "dial_code": "+237",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/CM.svg"
    },
    {
        "name": "Canada",
        "code": "CA",
        "dial_code": "+1",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/CA.svg"
    },
    {
        "name": "Cape Verde",
        "code": "CV",
        "dial_code": "+238",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/CV.svg"
    },
    {
        "name": "Cayman Islands",
        "code": "KY",
        "dial_code": "+345",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/KY.svg"
    },
    {
        "name": "Central African Republic",
        "code": "CF",
        "dial_code": "+236",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/CF.svg"
    },
    {
        "name": "Chad",
        "code": "TD",
        "dial_code": "+235",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/TD.svg"
    },
    {
        "name": "Chile",
        "code": "CL",
        "dial_code": "+56",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/CL.svg"
    },
    {
        "name": "China",
        "code": "CN",
        "dial_code": "+86",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/CN.svg"
    },
    {
        "name": "Christmas Island",
        "code": "CX",
        "dial_code": "+61",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/CX.svg"
    },
    {
        "name": "Cocos (Keeling) Islands",
        "code": "CC",
        "dial_code": "+61",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/CC.svg"
    },
    {
        "name": "Colombia",
        "code": "CO",
        "dial_code": "+57",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/CO.svg"
    },
    {
        "name": "Comoros",
        "code": "KM",
        "dial_code": "+269",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/KM.svg"
    },
    {
        "name": "Cook Islands",
        "code": "CK",
        "dial_code": "+682",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/CK.svg"
    },
    {
        "name": "Costa Rica",
        "code": "CR",
        "dial_code": "+506",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/CR.svg"
    },
    {
        "name": "Croatia",
        "code": "HR",
        "dial_code": "+385",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/HR.svg"
    },
    {
        "name": "Cuba",
        "code": "CU",
        "dial_code": "+53",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/CU.svg"
    },
    {
        "name": "Cyprus",
        "code": "CY",
        "dial_code": "+357",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/CY.svg"
    },
    {
        "name": "Denmark",
        "code": "DK",
        "dial_code": "+45",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/DK.svg"
    },
    {
        "name": "Djibouti",
        "code": "DJ",
        "dial_code": "+253",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/DJ.svg"
    },
    {
        "name": "Dominica",
        "code": "DM",
        "dial_code": "+1767",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/DM.svg"
    },
    {
        "name": "Dominican Republic",
        "code": "DO",
        "dial_code": "+1849",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/DO.svg"
    },
    {
        "name": "Ecuador",
        "code": "EC",
        "dial_code": "+593",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/EC.svg"
    },
    {
        "name": "Egypt",
        "code": "EG",
        "dial_code": "+20",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/EG.svg"
    },
    {
        "name": "El Salvador",
        "code": "SV",
        "dial_code": "+503",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/SV.svg"
    },
    {
        "name": "Equatorial Guinea",
        "code": "GQ",
        "dial_code": "+240",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/GQ.svg"
    },
    {
        "name": "Eritrea",
        "code": "ER",
        "dial_code": "+291",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/ER.svg"
    },
    {
        "name": "Estonia",
        "code": "EE",
        "dial_code": "+372",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/EE.svg"
    },
    {
        "name": "Ethiopia",
        "code": "ET",
        "dial_code": "+251",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/ET.svg"
    },
    {
        "name": "Faroe Islands",
        "code": "FO",
        "dial_code": "+298",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/FO.svg"
    },
    {
        "name": "Fiji",
        "code": "FJ",
        "dial_code": "+679",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/FJ.svg"
    },
    {
        "name": "Finland",
        "code": "FI",
        "dial_code": "+358",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/FI.svg"
    },
    {
        "name": "France",
        "code": "FR",
        "dial_code": "+33",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/FR.svg"
    },
    {
        "name": "French Guiana",
        "code": "GF",
        "dial_code": "+594",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/GF.svg"
    },
    {
        "name": "French Polynesia",
        "code": "PF",
        "dial_code": "+689",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/PF.svg"
    },
    {
        "name": "French Southern Territories",
        "code": "TF",
        "dial_code": "+262",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/TF.svg"
    },
    {
        "name": "Gabon",
        "code": "GA",
        "dial_code": "+241",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/GA.svg"
    },
    {
        "name": "Gambia",
        "code": "GM",
        "dial_code": "+220",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/GM.svg"
    },
    {
        "name": "Georgia",
        "code": "GE",
        "dial_code": "+995",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/GE.svg"
    },
    {
        "name": "Germany",
        "code": "DE",
        "dial_code": "+49",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/DE.svg"
    },
    {
        "name": "Ghana",
        "code": "GH",
        "dial_code": "+233",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/GH.svg"
    },
    {
        "name": "Gibraltar",
        "code": "GI",
        "dial_code": "+350",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/GI.svg"
    },
    {
        "name": "Greece",
        "code": "GR",
        "dial_code": "+30",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/GR.svg"
    },
    {
        "name": "Greenland",
        "code": "GL",
        "dial_code": "+299",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/GL.svg"
    },
    {
        "name": "Grenada",
        "code": "GD",
        "dial_code": "+1473",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/GD.svg"
    },
    {
        "name": "Guadeloupe",
        "code": "GP",
        "dial_code": "+590",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/GP.svg"
    },
    {
        "name": "Guam",
        "code": "GU",
        "dial_code": "+1671",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/GU.svg"
    },
    {
        "name": "Guatemala",
        "code": "GT",
        "dial_code": "+502",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/GT.svg"
    },
    {
        "name": "Guernsey",
        "code": "GG",
        "dial_code": "+44",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/GG.svg"
    },
    {
        "name": "Guinea",
        "code": "GN",
        "dial_code": "+224",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/GN.svg"
    },
    {
        "name": "Guinea-Bissau",
        "code": "GW",
        "dial_code": "+245",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/GW.svg"
    },
    {
        "name": "Guyana",
        "code": "GY",
        "dial_code": "+592",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/GY.svg"
    },
    {
        "name": "Haiti",
        "code": "HT",
        "dial_code": "+509",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/HT.svg"
    },
    {
        "name": "Honduras",
        "code": "HN",
        "dial_code": "+504",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/HN.svg"
    },
    {
        "name": "Hungary",
        "code": "HU",
        "dial_code": "+36",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/HU.svg"
    },
    {
        "name": "Iceland",
        "code": "IS",
        "dial_code": "+354",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/IS.svg"
    },
    {
        "name": "India",
        "code": "IN",
        "dial_code": "+91",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/IN.svg"
    },
    {
        "name": "Indonesia",
        "code": "ID",
        "dial_code": "+62",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/ID.svg"
    },
    {
        "name": "Iraq",
        "code": "IQ",
        "dial_code": "+964",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/IQ.svg"
    },
    {
        "name": "Ireland",
        "code": "IE",
        "dial_code": "+353",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/IE.svg"
    },
    {
        "name": "Isle of Man",
        "code": "IM",
        "dial_code": "+44",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/IM.svg"
    },
    {
        "name": "Israel",
        "code": "IL",
        "dial_code": "+972",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/IL.svg"
    },
    {
        "name": "Italy",
        "code": "IT",
        "dial_code": "+39",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/IT.svg"
    },
    {
        "name": "Jamaica",
        "code": "JM",
        "dial_code": "+1876",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/JM.svg"
    },
    {
        "name": "Japan",
        "code": "JP",
        "dial_code": "+81",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/JP.svg"
    },
    {
        "name": "Jersey",
        "code": "JE",
        "dial_code": "+44",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/JE.svg"
    },
    {
        "name": "Jordan",
        "code": "JO",
        "dial_code": "+962",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/JO.svg"
    },
    {
        "name": "Kazakhstan",
        "code": "KZ",
        "dial_code": "+7",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/KZ.svg"
    },
    {
        "name": "Kenya",
        "code": "KE",
        "dial_code": "+254",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/KE.svg"
    },
    {
        "name": "Kiribati",
        "code": "KI",
        "dial_code": "+686",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/KI.svg"
    },
    {
        "name": "Kosovo",
        "code": "XK",
        "dial_code": "+383",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/XK.svg"
    },
    {
        "name": "Kuwait",
        "code": "KW",
        "dial_code": "+965",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/KW.svg"
    },
    {
        "name": "Kyrgyzstan",
        "code": "KG",
        "dial_code": "+996",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/KG.svg"
    },
    {
        "name": "Laos",
        "code": "LA",
        "dial_code": "+856",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/LA.svg"
    },
    {
        "name": "Latvia",
        "code": "LV",
        "dial_code": "+371",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/LV.svg"
    },
    {
        "name": "Lebanon",
        "code": "LB",
        "dial_code": "+961",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/LB.svg"
    },
    {
        "name": "Lesotho",
        "code": "LS",
        "dial_code": "+266",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/LS.svg"
    },
    {
        "name": "Liberia",
        "code": "LR",
        "dial_code": "+231",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/LR.svg"
    },
    {
        "name": "Liechtenstein",
        "code": "LI",
        "dial_code": "+423",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/LI.svg"
    },
    {
        "name": "Lithuania",
        "code": "LT",
        "dial_code": "+370",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/LT.svg"
    },
    {
        "name": "Luxembourg",
        "code": "LU",
        "dial_code": "+352",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/LU.svg"
    },
    {
        "name": "Madagascar",
        "code": "MG",
        "dial_code": "+261",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/MG.svg"
    },
    {
        "name": "Malawi",
        "code": "MW",
        "dial_code": "+265",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/MW.svg"
    },
    {
        "name": "Malaysia",
        "code": "MY",
        "dial_code": "+60",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/MY.svg"
    },
    {
        "name": "Maldives",
        "code": "MV",
        "dial_code": "+960",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/MV.svg"
    },
    {
        "name": "Mali",
        "code": "ML",
        "dial_code": "+223",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/ML.svg"
    },
    {
        "name": "Malta",
        "code": "MT",
        "dial_code": "+356",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/MT.svg"
    },
    {
        "name": "Marshall Islands",
        "code": "MH",
        "dial_code": "+692",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/MH.svg"
    },
    {
        "name": "Martinique",
        "code": "MQ",
        "dial_code": "+596",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/MQ.svg"
    },
    {
        "name": "Mauritania",
        "code": "MR",
        "dial_code": "+222",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/MR.svg"
    },
    {
        "name": "Mauritius",
        "code": "MU",
        "dial_code": "+230",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/MU.svg"
    },
    {
        "name": "Mayotte",
        "code": "YT",
        "dial_code": "+262",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/YT.svg"
    },
    {
        "name": "Mexico",
        "code": "MX",
        "dial_code": "+52",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/MX.svg"
    },
    {
        "name": "Moldova",
        "code": "MD",
        "dial_code": "+373",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/MD.svg"
    },
    {
        "name": "Monaco",
        "code": "MC",
        "dial_code": "+377",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/MC.svg"
    },
    {
        "name": "Mongolia",
        "code": "MN",
        "dial_code": "+976",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/MN.svg"
    },
    {
        "name": "Montenegro",
        "code": "ME",
        "dial_code": "+382",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/ME.svg"
    },
    {
        "name": "Montserrat",
        "code": "MS",
        "dial_code": "+1664",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/MS.svg"
    },
    {
        "name": "Morocco",
        "code": "MA",
        "dial_code": "+212",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/MA.svg"
    },
    {
        "name": "Mozambique",
        "code": "MZ",
        "dial_code": "+258",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/MZ.svg"
    },
    {
        "name": "Namibia",
        "code": "NA",
        "dial_code": "+264",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/NA.svg"
    },
    {
        "name": "Nauru",
        "code": "NR",
        "dial_code": "+674",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/NR.svg"
    },
    {
        "name": "Nepal",
        "code": "NP",
        "dial_code": "+977",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/NP.svg"
    },
    {
        "name": "Netherlands",
        "code": "NL",
        "dial_code": "+31",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/NL.svg"
    },
    {
        "name": "New Caledonia",
        "code": "NC",
        "dial_code": "+687",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/NC.svg"
    },
    {
        "name": "New Zealand",
        "code": "NZ",
        "dial_code": "+64",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/NZ.svg"
    },
    {
        "name": "Nicaragua",
        "code": "NI",
        "dial_code": "+505",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/NI.svg"
    },
    {
        "name": "Niger",
        "code": "NE",
        "dial_code": "+227",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/NE.svg"
    },
    {
        "name": "Nigeria",
        "code": "NG",
        "dial_code": "+234",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/NG.svg"
    },
    {
        "name": "Niue",
        "code": "NU",
        "dial_code": "+683",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/NU.svg"
    },
    {
        "name": "Norfolk Island",
        "code": "NF",
        "dial_code": "+672",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/NF.svg"
    },
    {
        "name": "Northern Mariana Islands",
        "code": "MP",
        "dial_code": "+1670",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/MP.svg"
    },
    {
        "name": "Norway",
        "code": "NO",
        "dial_code": "+47",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/NO.svg"
    },
    {
        "name": "Oman",
        "code": "OM",
        "dial_code": "+968",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/OM.svg"
    },
    {
        "name": "Pakistan",
        "code": "PK",
        "dial_code": "+92",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/PK.svg"
    },
    {
        "name": "Palau",
        "code": "PW",
        "dial_code": "+680",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/PW.svg"
    },
    {
        "name": "Panama",
        "code": "PA",
        "dial_code": "+507",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/PA.svg"
    },
    {
        "name": "Papua New Guinea",
        "code": "PG",
        "dial_code": "+675",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/PG.svg"
    },
    {
        "name": "Paraguay",
        "code": "PY",
        "dial_code": "+595",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/PY.svg"
    },
    {
        "name": "Peru",
        "code": "PE",
        "dial_code": "+51",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/PE.svg"
    },
    {
        "name": "Philippines",
        "code": "PH",
        "dial_code": "+63",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/PH.svg"
    },
    {
        "name": "Poland",
        "code": "PL",
        "dial_code": "+48",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/PL.svg"
    },
    {
        "name": "Portugal",
        "code": "PT",
        "dial_code": "+351",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/PT.svg"
    },
    {
        "name": "Puerto Rico",
        "code": "PR",
        "dial_code": "+1939",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/PR.svg"
    },
    {
        "name": "Qatar",
        "code": "QA",
        "dial_code": "+974",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/QA.svg"
    },
    {
        "name": "Romania",
        "code": "RO",
        "dial_code": "+40",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/RO.svg"
    },
    {
        "name": "Russia",
        "code": "RU",
        "dial_code": "+7",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/RU.svg"
    },
    {
        "name": "Rwanda",
        "code": "RW",
        "dial_code": "+250",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/RW.svg"
    },
    {
        "name": "Samoa",
        "code": "WS",
        "dial_code": "+685",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/WS.svg"
    },
    {
        "name": "San Marino",
        "code": "SM",
        "dial_code": "+378",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/SM.svg"
    },
    {
        "name": "Saudi Arabia",
        "code": "SA",
        "dial_code": "+966",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/SA.svg"
    },
    {
        "name": "Senegal",
        "code": "SN",
        "dial_code": "+221",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/SN.svg"
    },
    {
        "name": "Serbia",
        "code": "RS",
        "dial_code": "+381",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/RS.svg"
    },
    {
        "name": "Seychelles",
        "code": "SC",
        "dial_code": "+248",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/SC.svg"
    },
    {
        "name": "Sierra Leone",
        "code": "SL",
        "dial_code": "+232",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/SL.svg"
    },
    {
        "name": "Singapore",
        "code": "SG",
        "dial_code": "+65",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/SG.svg"
    },
    {
        "name": "Slovakia",
        "code": "SK",
        "dial_code": "+421",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/SK.svg"
    },
    {
        "name": "Slovenia",
        "code": "SI",
        "dial_code": "+386",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/SI.svg"
    },
    {
        "name": "Solomon Islands",
        "code": "SB",
        "dial_code": "+677",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/SB.svg"
    },
    {
        "name": "Somalia",
        "code": "SO",
        "dial_code": "+252",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/SO.svg"
    },
    {
        "name": "South Africa",
        "code": "ZA",
        "dial_code": "+27",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/ZA.svg"
    },
    {
        "name": "South Sudan",
        "code": "SS",
        "dial_code": "+211",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/SS.svg"
    },
    {
        "name": "Spain",
        "code": "ES",
        "dial_code": "+34",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/ES.svg"
    },
    {
        "name": "Sri Lanka",
        "code": "LK",
        "dial_code": "+94",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/LK.svg"
    },
    {
        "name": "Sudan",
        "code": "SD",
        "dial_code": "+249",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/SD.svg"
    },
    {
        "name": "Suriname",
        "code": "SR",
        "dial_code": "+597",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/SR.svg"
    },
    {
        "name": "Eswatini",
        "code": "SZ",
        "dial_code": "+268",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/SZ.svg"
    },
    {
        "name": "Sweden",
        "code": "SE",
        "dial_code": "+46",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/SE.svg"
    },
    {
        "name": "Switzerland",
        "code": "CH",
        "dial_code": "+41",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/CH.svg"
    },
    {
        "name": "Taiwan",
        "code": "TW",
        "dial_code": "+886",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/TW.svg"
    },
    {
        "name": "Tajikistan",
        "code": "TJ",
        "dial_code": "+992",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/TJ.svg"
    },
    {
        "name": "Thailand",
        "code": "TH",
        "dial_code": "+66",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/TH.svg"
    },
    {
        "name": "Timor-Leste",
        "code": "TL",
        "dial_code": "+670",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/TL.svg"
    },
    {
        "name": "Togo",
        "code": "TG",
        "dial_code": "+228",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/TG.svg"
    },
    {
        "name": "Tokelau",
        "code": "TK",
        "dial_code": "+690",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/TK.svg"
    },
    {
        "name": "Tonga",
        "code": "TO",
        "dial_code": "+676",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/TO.svg"
    },
    {
        "name": "Tunisia",
        "code": "TN",
        "dial_code": "+216",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/TN.svg"
    },
    {
        "name": "Turkey",
        "code": "TR",
        "dial_code": "+90",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/TR.svg"
    },
    {
        "name": "Turkmenistan",
        "code": "TM",
        "dial_code": "+993",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/TM.svg"
    },
    {
        "name": "Tuvalu",
        "code": "TV",
        "dial_code": "+688",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/TV.svg"
    },
    {
        "name": "Uganda",
        "code": "UG",
        "dial_code": "+256",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/UG.svg"
    },
    {
        "name": "Ukraine",
        "code": "UA",
        "dial_code": "+380",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/UA.svg"
    },
    {
        "name": "United Arab Emirates",
        "code": "AE",
        "dial_code": "+971",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/AE.svg"
    },
    {
        "name": "United Kingdom",
        "code": "GB",
        "dial_code": "+44",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/GB.svg"
    },
    {
        "name": "United States",
        "code": "US",
        "dial_code": "+1",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/US.svg"
    },
    {
        "name": "Uruguay",
        "code": "UY",
        "dial_code": "+598",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/UY.svg"
    },
    {
        "name": "Uzbekistan",
        "code": "UZ",
        "dial_code": "+998",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/UZ.svg"
    },
    {
        "name": "Vanuatu",
        "code": "VU",
        "dial_code": "+678",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/VU.svg"
    },
    {
        "name": "Vietnam",
        "code": "VN",
        "dial_code": "+84",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/VN.svg"
    },
    {
        "name": "Yemen",
        "code": "YE",
        "dial_code": "+967",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/YE.svg"
    },
    {
        "name": "Zambia",
        "code": "ZM",
        "dial_code": "+260",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/ZM.svg"
    },
    {
        "name": "Zimbabwe",
        "code": "ZW",
        "dial_code": "+263",
        "flag": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/ZW.svg"
    }
]

export const LOAN_TYPES = {
    PERSONAL: 'PERSONAL',
    LAP: 'LAP',
    MSME: 'MSME',
    MICRO: 'MICRO'
}


export const PAYMENT_CHARGE_TYPES = {
    BOUNCE_CHARGE: 'BOUNCE_CHARGE',
    FORECLOSURE_CHARGE: 'FORECLOSURE_CHARGE',
    PENALTY: 'PENALTY',
}

// export const ALL_LOAN_STATUS_LIST = [
//     { key: "PENDING", value: "PENDING", color: "bg-warning text-white" },           // Yellow bg, dark text
//     { key: "UNDER_REVIEW", value: "UNDER REVIEW", color: "bg-primary-blue text-white" }, // Blue bg, white text
//     { key: "ON_HOLD", value: "ON HOLD", color: "bg-secondary text-white" },         // Grey bg, white text
//     { key: "APPROVED", value: "APPROVED", color: "bg-success text-white" },         // Green bg, white text
//     { key: "REJECTED", value: "REJECTED", color: "bg-danger text-white" },          // Red bg, white text
//     { key: "DISBURSED", value: "DISBURSED", color: "bg-info text-white" },           // Light blue bg, dark text
//     { key: "CLOSED", value: "CLOSED", color: "bg-dark text-white" },                // Black bg, white text
//     { key: "CANCELLED", value: "CANCELLED", color: "bg-danger text-white" },        // Red bg, white text
//     { key: "USER_ACCEPTED", value: "USER ACCEPTED", color: "bg-success text-white" }, // Green bg, white text
//     { key: "COMPLETED", value: "COMPLETED", color: "bg-success text-white" } // Green bg, white text
// ];

// export const STATUS_COLORS = {
//     BLUE: "status-blue",           // custom CSS (primary blue shade)
//     WARNING: "bg-warning text-white",
//     INFO: "bg-info text-white",
//     SUCCESS: "bg-success text-white",
//     DANGER: "bg-danger text-white"
// };

export const STATUS_COLORS = {
    BLUE: "status-blue fw-semibold",
    WARNING: "status-warning fw-semibold",
    YELLOW: "status-yellow fw-semibold",
    INFO: "status-info fw-semibold",
    SUCCESS: "status-success fw-semibold",
    DANGER: "status-danger fw-semibold",
    GREY: "status-grey fw-semibold",
    PURPULE: "status-bounce fw-semibold"
};

// export const ALL_LOAN_STATUS_LIST = [
//     { key: "APPLICATION_SUBMITTED", value: "APPLICATION SUBMITTED", color: "status-blue" },
//     { key: "PENDING", value: "PENDING", color: "bg-warning text-white" },
//     { key: "UNDER_REVIEW", value: "UNDER REVIEW", color: "bg-info text-white" },
//     { key: "ON_HOLD", value: "ON HOLD", color: "bg-warning text-white" },
//     { key: "APPROVED", value: "APPROVED", color: "bg-success text-white" },
//     { key: "REJECTED", value: "REJECTED", color: "bg-danger text-white" },
//     { key: "AADHAR_VERIFIED", value: "AADHAR VERIFIED", color: "status-blue" },
//     { key: "BANK_VERIFIED", value: "BANK VERIFIED", color: "status-blue" },
//     { key: "USER_ACCEPTED", value: "USER ACCEPTED", color: "status-blue" },
//     { key: "E_MANDATE_GENERATED", value: "E-MANDATE GENERATED", color: "status-blue" },
//     { key: "DISBURSEMENT_APPROVAL_PENDING", value: "DISBURSEMENT APPROVAL PENDING", color: "bg-warning text-white" },
//     { key: "DISBURSEMENT_APPROVED", value: "DISBURSEMENT APPROVED", color: "bg-success text-white" },
//     { key: "DISBURSED", value: "DISBURSED", color: "bg-info text-white" },
//     { key: "COMPLETED", value: "COMPLETED", color: "bg-success text-white" },
//     { key: "CANCELLED", value: "CANCELLED", color: "bg-danger text-white" },
//     { key: "CLOSED", value: "CLOSED", color: "bg-danger text-white" },
// ];


const getStatusColor = (status) => {

    // Common groups
    const blueStatuses = new Set([
    ]);

    const orangeStatuses = new Set([
        "Aadhar Verification Pending",
        "Admin Approval Pending",
        "Under Review",
        "On Hold",
        "User Accepted Pending",
        "Bank Verified Pending",
        "E MANDATE Setup Pending",
        "Disbursement Approval Pending",
        "Disbursement Approval Pending"
    ]);
    const greenStatuses = new Set([
        "Completed",
        "Disbursed",
        "Closed",
    ]);
    const redStatuses = new Set([
        "Rejected",
        "Cancelled",
    ]);
    if (blueStatuses.has(status)) {
        return "text-[#1F7494] bg-[#f1f3ff]";
    }
    if (greenStatuses.has(status)) {
        return "text-green-600 bg-[#e6ffec]";
    }
    if (redStatuses.has(status)) {
        return "text-red-600 bg-[#ffeeee]";
    }
    if (orangeStatuses.has(status)) {
        return "text-[#ffa500] bg-[#fff9ef]"
    }

    return "text-[#1F7494] bg-[#f1f3ff]";
};

export const ALL_STATUS = [
    { key: "APPLICATION_SUBMITTED", value: "APPLICATION SUBMITTED", color: STATUS_COLORS.BLUE },
    { key: "PENDING", value: "LOAN PENDING", color: STATUS_COLORS.WARNING },
    { key: "UNDER_REVIEW", value: "UNDER REVIEW", color: STATUS_COLORS.WARNING },
    { key: "ON_HOLD", value: "LOAN ON HOLD", color: STATUS_COLORS.WARNING },
    { key: "APPROVED", value: "LOAN APPROVED", color: STATUS_COLORS.SUCCESS },
    { key: "REJECTED", value: "LOAN REJECTED", color: STATUS_COLORS.DANGER },
    { key: "AADHAR_VERIFIED", value: "AADHAR VERIFIED", color: STATUS_COLORS.BLUE },
    { key: "BANK_VERIFIED", value: "BANK VERIFIED", color: STATUS_COLORS.BLUE },
    { key: "USER_ACCEPTED", value: "USER ACCEPTED", color: STATUS_COLORS.BLUE },
    { key: "E_MANDATE_GENERATED", value: "E-MANDATE GENERATED", color: STATUS_COLORS.BLUE },
    { key: "DISBURSEMENT_APPROVAL_PENDING", value: "DISBURSEMENT PENDING", color: STATUS_COLORS.WARNING },
    { key: "DISBURSEMENT_APPROVED", value: "DISBURSEMENT APPROVED", color: STATUS_COLORS.SUCCESS },
    { key: "DISBURSED", value: "DISBURSED", color: STATUS_COLORS.SUCCESS },
    { key: "COMPLETED", value: "LOAN COMPLETED", color: STATUS_COLORS.SUCCESS },
    { key: "CANCELLED", value: "LOAN CANCELLED", color: STATUS_COLORS.DANGER },
    { key: "CLOSED", value: "LOAN CLOSED", color: STATUS_COLORS.SUCCESS }
];

export const ALL_DOCUMENT_STATUS_LIST = [
    { key: "PAN", value: "PAN Card", color: 'text-warning' },     // Important ID
    { key: "AADHAR", value: "Aadhaar Card", color: 'text-success' },     // Verified ID
    { key: "PASSPORT", value: "Passport", color: 'text-primary' },       // International ID
    { key: "VOTER_ID", value: "Voter ID", color: 'text-success' },       // Verified ID
    { key: "DRIVING_LICENSE", value: "Driving License", color: 'text-primary' }, // Govt-issued ID
    { key: "ADDRESS_PROOF", value: "Address Proof", color: 'text-secondary' },   // Utility/Lease
    { key: "BANK_STATEMENT", value: "Bank Statement", color: 'text-info' },      // Financial doc
    { key: "SALARY_SLIP", value: "Salary Slip", color: 'text-info' },            // Income proof
    { key: "ITR", value: "Income Tax Return (ITR)", color: 'text-success' },     // Verified income
    { key: "FORM_16", value: "Form 16", color: 'text-success' },                 // Tax proof
    { key: "PROPERTY_DOCUMENTS", value: "Property Documents", color: 'text-dark' }, // Asset proof
];

export const ALL_LOAN_TYPE_LIST = [
    { key: 'PERSONAL', value: 'Personal Loan' },
    { key: 'LAP', value: 'Loan Against Property (LAP)' },
    { key: 'MSME', value: 'MSME Loan' },
    { key: 'MICRO', value: 'Micro Loan' },
];

export const PAYMENT_STATUS = [
    // { key: "", value: "SELECT PAYMENT" },
    { key: "BANK_TRANSFER", value: "BANK TRANSFER" },
    { key: "CASH", value: "CASH" },
    { key: "CHEQUE", value: "CHEQUE" },
    { key: "UPI", value: "UPI" },
];

export const LEAVE_TYPE_LIST = [
    { key: "", value: "Select type" },
    { key: "casual", value: "Casual Leave" },
    { key: "compoff", value: "Comp off" },
    { key: "LWP", value: "LWP" },
    { key: "birthday", value: "Birthday / Annivarsary" },
];

export const LEAVE_DAY = [
    { key: "", value: "Select Day" },
    { key: "full", value: "Full Day" },
    { key: "half", value: "Half Day" },
];

export const HALF_DAY_TYPE = [
    { key: "", value: "Select Type" },
    { key: "1", value: "First Half" },
    { key: "2", value: "Second Half" },

];

export const emiTypes = {
    pre_payment: {
        label: "Pre Payment",
        color: STATUS_COLORS.WARNING, // amber
        border: '#ffa500',
    },
    // forclosure: {
    //     label: "Foreclosure",
    //     color: STATUS_COLORS.DANGER, // red
    //     border: '#c82333',
    // },
    emi: {
        label: "EMI",
        color: STATUS_COLORS.SUCCESS, // green
        border: '#1d8149',
    },
    foreclosure: {
        label: "Foreclosure",
        color: STATUS_COLORS.SUCCESS, // green
        border: '#1d8149',
    },
    due_payment: {
        label: "Due Payment",
        color: STATUS_COLORS.DANGER, // red
        border: '#c82333',
    },

    // Razorpay Statuses
    created: {
        label: "Created",
        color: STATUS_COLORS.GREY, // gray
        border: "#6b7280",
    },
    authorized: {
        label: "Authorized",
        color: STATUS_COLORS.BLUE, // BLUE
        border: '#1F7494',
    },
    authenticated: {
        label: "Authenticated",
        color: STATUS_COLORS.BLUE, // BLUE
        border: '#1F7494',
    },
    active: {
        label: "Active",
        color: STATUS_COLORS.SUCCESS, // green
        border: '#1d8149',
    },
    paid: {
        label: "Paid",
        color: STATUS_COLORS.SUCCESS, // green
        border: '#1d8149',
    },
    due: {
        label: "Due",
        color: STATUS_COLORS.DANGER, // red
        border: '#c82333',
    },
    Due: {
        label: "Due",
        color: STATUS_COLORS.DANGER, // red
        border: '#c82333',
    },
    partially_paid: {
        label: "Partially Paid",
        color: STATUS_COLORS.WARNING, // amber
        border: '#ffa500',
    },
    pending: {
        label: "Pending",
        color: STATUS_COLORS.WARNING, // amber
        border: '#ffa500',
    },
    failed: {
        label: "Failed",
        color: STATUS_COLORS.DANGER, // red
        border: '#c82333',
    },
    expired: {
        label: "Expired",
        color: STATUS_COLORS.GREY, // amber
        border: "#6b7280",
    },
    cancelled: {
        label: "Cancelled",
        color: STATUS_COLORS.WARNING, // amber
        border: '#ffa500',
    },
    chargeback: {
        label: "Chargeback",
        color: STATUS_COLORS.DANGER, // red
        border: '#c82333',
    },
    due: {
        label: "Due",
        color: STATUS_COLORS.WARNING, // amber
        border: '#ffa500',
    },
    overdue: {
        label: "Overdue",
        color: STATUS_COLORS.DANGER, // red
        border: '#c82333',
    },
    unpaid: {
        label: "Unpaid",
        border: STATUS_COLORS.WARNING,
        border: '#ffa500',
    },
    bounce: {
        label: "Bounced",
        border: STATUS_COLORS.PURPULE,
        border: STATUS_COLORS.PURPULE,
    },
    issued: {
        label: "Issued",
        color: STATUS_COLORS.BLUE, // blue
        border: STATUS_COLORS.BLUE,
    },
};


export const getStatus = (status) => {
    return status == "present" ? "Present" :
        status == "absent" ? "Absent" :
            status == "holiday" ? "Holiday" :
                status == "off" ? "off" :
                    status == "casual leave" ? "Casual leave" :
                        status === "half-day" ? "Half Day" :
                            status === "half-day leave" ? "Half leave" :
                                status === "on leave" ? 'Leave' :
                                    status === "on leave(LWP)" ? "LWP" :
                                        status === 'on leave(birthday)' ? "BirthDay leave" :
                                            status === 'on leave(compoff)' ? 'Compoff leave' :
                                                status === 'on leave(casual)' ? 'Casual leave' :
                                                    status === 'half-day work and half-day leave (LWP)' ? 'Half work Half LWP' :
                                                        status === 'half-day work and half-day leave (casual)' ? 'Half work Half Casual' :
                                                            status === 'half-day work and half-day leave (compoff)' ? 'Half work Half Compoff' :
                                                                status == "working" ? "Working" :
                                                                    "-"
};

export const getAttendanceStatusColor = (status) => {
    return status == "present" ? STATUS_COLORS.SUCCESS :
        status === "absent" ? STATUS_COLORS.DANGER :
            status === "holiday" ? STATUS_COLORS.YELLOW :
                status === "off" ? STATUS_COLORS.WARNING :
                    status === "half-day" ? STATUS_COLORS.YELLOW :
                        status === "half-day leave" ? STATUS_COLORS.YELLOW :
                            status === "on leave(LWP)" ? STATUS_COLORS.DANGER :
                                status === "on leave(birthday)" ? STATUS_COLORS.SUCCESS :
                                    status === 'on leave(casual)' ? STATUS_COLORS.SUCCESS :
                                        status === 'on leave(compoff)' ? STATUS_COLORS.SUCCESS :
                                            status === "on leave" ? STATUS_COLORS.DANGER :
                                                status === 'half-day work and half-day leave (LWP)' ? STATUS_COLORS.DANGER :
                                                    status === 'half-day work and half-day leave (casual)' ? STATUS_COLORS.SUCCESS :
                                                        status === 'half-day work and half-day leave (compoff)' ? STATUS_COLORS.SUCCESS :
                                                            status == "working" ? STATUS_COLORS.SUCCESS :
                                                                STATUS_COLORS.WARNING
};

export const AttendanceStatus = {
    present: {
        label: "Pre Payment",
        color: STATUS_COLORS.SUCCESS, // green
        border: '#1d8149',
    },
    absent: {
        label: "Absent",
        color: STATUS_COLORS.SUCCESS, // green
        border: '#1d8149',
    },
    holiday: {
        label: "Holiday",
        color: STATUS_COLORS.BLUE, // BLUE
        border: '#1F7494',
    },
    off: {
        label: "Off",
        color: STATUS_COLORS.WARNING, // amber
        border: '#ffa500',
    },
    ['casual leave']: {
        label: "Casual leave",
        color: STATUS_COLORS.WARNING, // amber
        border: '#ffa500',
    },
    ['half-day']: {
        label: "Half Day",
        color: STATUS_COLORS.WARNING, // amber
        border: '#ffa500',
    },
    ['half-day leave']: {
        label: "Half Day",
        color: STATUS_COLORS.WARNING, // amber
        border: '#ffa500',
    },
    ['on leave']: {
        label: "On Leave",
        color: STATUS_COLORS.DANGER, // red
        border: '#c82333',
    },


};

export const AttendanceType = {
    pre_payment: {
        label: "Pre Payment",
        color: STATUS_COLORS.WARNING, // amber
        border: '#ffa500',
    },
    // forclosure: {
    //     label: "Foreclosure",
    //     color: STATUS_COLORS.DANGER, // red
    //     border: '#c82333',
    // },
    emi: {
        label: "EMI",
        color: STATUS_COLORS.SUCCESS, // green
        border: '#1d8149',
    },
    foreclosure: {
        label: "Foreclosure",
        color: STATUS_COLORS.SUCCESS, // green
        border: '#1d8149',
    },
    due_payment: {
        label: "Due Payment",
        color: STATUS_COLORS.DANGER, // red
        border: '#c82333',
    },

};