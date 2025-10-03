import { Encryption } from "../config/common";
import AxiosClientApi from "./axios.services";

/*==================================================== 
    Auth Routers                                                                              
====================================================== */

const CATEGORY = "category";

const BANNER = "banner";
const COMMON = "common";

// ----------------------- LONE ---------------------------------- 
const ADMIN = "admin";

const AUTH = "auth";
const USER = "user";
const LOAN = "loan";
const DASHBOARD = 'dashboard'
const CREDIT = 'credit'
const LOAN_DISBURSEMENT = 'loan-disbursement'
const CONTACT_US = 'contact-us';
const EMI_SCHEDULE_DATE = 'emi-schedule-date';
const CHARGE = 'charge';
const RAZORPAY = 'razorpay';

// ----------------------- HRMS --------------------------------------------

const AUTH_AUTH = "admin_auth";
const AUTH_DASHBOARD = "admin_dashboard";
const ADMIN_EMPLOYEE = "admin_employee";
const ADMIN_DEPARTMENT = "admin_department";
const ADMIN_HOLIDAYS = "admin_holidays";
const ADMIN_EMP_LEAVE = "admin_emp_leave";
const ADMIN_EMP_ATTENDANCE = "admin_emp_attendence";
const ADMIN_DAILY_TASK = "admin_daily_task";

// ----------------------- HRMS --------------------------------------------

export function DashboardCount(request) {
    return AxiosClientApi.post(`/${AUTH_DASHBOARD}/dashboard_count`, request, true)
}

export function login(request) {
    return AxiosClientApi.post(`/${AUTH_AUTH}/login`, request, true)
}

// ----------------------- LONE Auth --------------------------------------------

export function uploadFile(request) {
    return AxiosClientApi.post(`/${LOAN}/upload-file`, request, true)
}

// ----------------------- Customer ------------------------------------------------

export function CustomerList(request) {
    return AxiosClientApi.post(`/${ADMIN_EMPLOYEE}/emp_listing`, request, true)
}

export function AddUser(request) {
    return AxiosClientApi.post(`/${ADMIN_EMPLOYEE}/add_employee`, request, true)
}

export function EditUser(request) {
    return AxiosClientApi.post(`/${ADMIN_EMPLOYEE}/edit_employee`, request)
}

export function CustomerDetails(request) {
    return AxiosClientApi.post(`/${ADMIN_EMPLOYEE}/emp_details`, request, true)
}

export function DeleteUser(request) {
    return AxiosClientApi.delete(`/${ADMIN}/${USER}/delete-user/${request?.user_id}`, request)
}

// ---------------------------- Daily Work update  ------------------------------------------------------- 

export function DailyTaskList(request) {
    return AxiosClientApi.post(`/${ADMIN_DAILY_TASK}/daily_work_update_listing`, request, true)
}

export function AddDailyTask(request) {
    return AxiosClientApi.post(`/${ADMIN_DAILY_TASK}/add_daily_work`, request, true)
}

export function DeleteDailyWork(request) {
    return AxiosClientApi.post(`/${ADMIN_DAILY_TASK}/delete_daily_work`, request)
}

export function EditDailyWork(request) {
    return AxiosClientApi.post(`/${ADMIN_DAILY_TASK}/edit_daily_work`, request)
}

// ---------------------------- Leave Module  ------------------------------------------------------- 


export function listLeaves(request) {
    return AxiosClientApi.post(`/${ADMIN_EMP_LEAVE}/emp_leave_listing`, request)
}

export function addLeaves(request) {
    return AxiosClientApi.post(`/${ADMIN_EMP_LEAVE}/add_leave`, request)
}

export function addEmployeeLeaves(request) {
    return AxiosClientApi.post(`/${ADMIN_EMP_LEAVE}/admin_add_leave`, request)
}

export function addEmployeeLeavesNew(request) {
    return AxiosClientApi.post(`/${ADMIN_EMP_LEAVE}/admin_emp_leave_add`, request)
}

export function approvedRejectLeaves(request) {
    return AxiosClientApi.post(`/${ADMIN_EMP_LEAVE}/approve_reject_leave`, request)
}

export function listEmpLeaveBalance(request) {
    return AxiosClientApi.post(`/${ADMIN_EMP_LEAVE}/all_emp_leave_balance`, request)
}

// ---------------------------- Attendance Module  ------------------------------------------------------- 

export function listAttendance(request) {
    return AxiosClientApi.post(`/${ADMIN_EMP_ATTENDANCE}/admin_emp_attedence_list`, request)
}

export function addAttendance(request) {
    return AxiosClientApi.post(`/${ADMIN_EMP_ATTENDANCE}/admin_add_attendence`, request)
}

export function editAttendance(request) {
    return AxiosClientApi.post(`/${ADMIN_EMP_ATTENDANCE}/admin_edit_attendence`, request)
}

// ---------------------------- Bank Details Module  ------------------------------------------------------- 

export function addBankDetails(request) {
    return AxiosClientApi.post(`/${AUTH_AUTH}/add_bank_details`, request)
}

export function listBankDetails(request) {
    return AxiosClientApi.post(`/${AUTH_AUTH}/bank_details_listing`, request)
}

export function deleteBankDetails(request) {
    return AxiosClientApi.post(`/${AUTH_AUTH}/delete_bank_details`, request)
}

// ---------------------------- Salary Module  ------------------------------------------------------- 

export function listSalary(request) {
    return AxiosClientApi.post(`/${ADMIN_EMP_ATTENDANCE}/salary_count`, request)
}

// ---------------------------- Departnment Module  ------------------------------------------------------- 

export function departnmentList(request) {
    return AxiosClientApi.post(`/${ADMIN_DEPARTMENT}/departments_listing`, request, true)
}

export function addDepartnment(request) {
    return AxiosClientApi.post(`/${ADMIN_DEPARTMENT}/add_departments`, request, true)
}

export function editDepartnment(request) {
    return AxiosClientApi.post(`/${ADMIN_DEPARTMENT}/edit_departments`, request, true)
}

export function deleteDepartnment(request) {
    return AxiosClientApi.post(`/${ADMIN_DEPARTMENT}/delete_departments`, request, true)
}

// ---------------------------- Saturday Module  ------------------------------------------------------- 

export function saturdayList(request) {
    return AxiosClientApi.post(`/${COMMON}/week_off_listing`, request, true)
}

export function editSaturday(request) {
    return AxiosClientApi.post(`/${COMMON}/edit_week_off`, request, true)
}

// ---------------------------- Project Module  ------------------------------------------------------- 

export function listProject(request) {
    return AxiosClientApi.post(`/${ADMIN_DAILY_TASK}/project_listing`, request, true)
}

export function addProject(request) {
    return AxiosClientApi.post(`/${ADMIN_DAILY_TASK}/create_project`, request, true)
}

export function editProject(request) {
    return AxiosClientApi.post(`/${ADMIN_DAILY_TASK}/update_project`, request, true)
}

export function deleteProject(request) {
    return AxiosClientApi.post(`/${ADMIN_DAILY_TASK}/delete_project`, request, true)
}

// ---------------------------- Task Module  ------------------------------------------------------- 

export function listAssignTask(request) {
    return AxiosClientApi.post(`/${ADMIN_DAILY_TASK}/assign_task_listing`, request, true)
}

export function addAssignTask(request) {
    return AxiosClientApi.post(`/${ADMIN_DAILY_TASK}/assign_task`, request, true)
}

export function editAssignTask(request) {
    return AxiosClientApi.post(`/${ADMIN_DAILY_TASK}/update_assign_task`, request, true)
}

export function deleteAssignTask(request) {
    return AxiosClientApi.post(`/${ADMIN_DAILY_TASK}/delete_assign_task`, request, true)
}

// ---------------------------- Ticket Module  ------------------------------------------------------- 

export function listTicket(request) {
    return AxiosClientApi.post(`/${ADMIN_DAILY_TASK}/ticket_listing`, request, true)
}

export function addTicket(request) {
    return AxiosClientApi.post(`/${ADMIN_DAILY_TASK}/create_ticket`, request, true)
}

export function editTicket(request) {
    return AxiosClientApi.post(`/${ADMIN_DAILY_TASK}/update_ticket`, request, true)
}

export function deleteTicket(request) {
    return AxiosClientApi.post(`/${ADMIN_DAILY_TASK}/delete_ticket`, request, true)
}

// ---------------------------- LOAN  ------------------------------------------------------- 

export function listAllLoan(request) {

    let filter = ``

    if (request?.limit && request?.offset) {
        filter += `&offset=${request?.offset || null}&limit=${request?.limit || null}`
    }

    if (request?.start_date && request?.end_date) {
        // filter += `&start_date=${request?.start_date || null}&end_date=${request?.end_date || null}&limit=${request?.limit || 10}&offset=${request?.offset || 1}`
        filter += `&start_date=${request?.start_date || null}&end_date=${request?.end_date || null}`
    }

    if (request?.status_filter) {
        filter += `&status_filter=${request?.status_filter}`
    }

    if (request?.order_by) {
        // filter += `&order_by=${request?.order_by}&order_direction=${request?.order_direction}&status_filter=${request?.status_filter}&limit=${request?.limit || 10}&offset=${request?.offset || 1}`
        filter += `&order_by=${request?.order_by}&order_direction=${request?.order_direction}`
        // filter += `&limit=${request?.limit || 10}&offset=${request?.offset || 1}`
    }
    return AxiosClientApi.get(`/${ADMIN}/${LOAN}/get-all-loans?search=${request?.search || ""}${filter}`, request, true)
}

export function listDisbursedLoan(request) {

    let filter = ``

    if (request?.limit && request?.offset) {
        filter += `&offset=${request?.offset || null}&limit=${request?.limit || null}`
    }
    if (request?.start_date && request?.end_date) {
        // filter += `&start_date=${request?.start_date || null}&end_date=${request?.end_date || null}&limit=${request?.limit || 10}&offset=${request?.offset || 1}`
        filter += `&start_date=${request?.start_date || null}&end_date=${request?.end_date || null}`
    }

    if (request?.status_filter) {
        filter += `&status_filter=${request?.status_filter}`
    }

    if (!request?.status_filter) {
        filter += `&status_filter=DISBURSEMENT_APPROVAL_PENDING&status_filter=DISBURSED`
    }

    if (request?.order_by) {
        // filter += `&order_by=${request?.order_by}&order_direction=${request?.order_direction}&status_filter=${request?.status_filter}&limit=${request?.limit || 10}&offset=${request?.offset || 1}`
        filter += `&order_by=${request?.order_by}&order_direction=${request?.order_direction}`
        // filter += `&limit=${request?.limit || 10}&offset=${request?.offset || 1}`
    }
    // "{{local}}/admin/loan/get-all-user-approved-loans?status_filter=USER_ACCEPTED&limit=10&search=&offset=1&status_filter=DISBURSED"
    return AxiosClientApi.get(`/${ADMIN}/${LOAN}/get-all-user-approved-loans?search=${request?.search || ""}${filter}`, request, true)
}

export function addDisbursementLoan(request) {
    return AxiosClientApi.post(`/${ADMIN}/${LOAN_DISBURSEMENT}/add-disbursement-payment-history`, request, true)
}

// {{local}}/admin/loan-disbursement/add-disbursement-payment-history

export function updateLoanStatus(request) {
    return AxiosClientApi.put(`/${ADMIN}/${LOAN}/update-loan-status/${request.loan_id}`, request, true)
}

export function loanDetails(request) {
    return AxiosClientApi.get(`/${ADMIN}/${LOAN}/get-loan-details/${request.loan_id}`, request, true)
}

export function addLoanDetails(request) {
    return AxiosClientApi.post(`/${ADMIN}/${LOAN}/create-loan-application`, request, true)
}

export function updateLoanDetails(request) {
    return AxiosClientApi.put(`/${ADMIN}/${LOAN}/update-loan-application/${request.loan_id}`, request, true)
}

export function transectionHistory(request) {
    return AxiosClientApi.get(`/${RAZORPAY}/get-subscription-actual-invoices/${request.subscription_id}`, request, true)
}

export function EMISchedule(request) {
    return AxiosClientApi.get(`/${RAZORPAY}/get-schedule-data/${request?.loan_id}`, request, true)
}


// ---------------------------- LOAN Interest ------------------------------------------------------- 

export function interestList(request) {
    return AxiosClientApi.get(`/${ADMIN}/${CREDIT}/credit-score-interest`, request, true)
}

export function interestAdd(request) {
    //     {
    //   "label": "string",
    //   "min_score": 0,
    //   "max_score": 0,
    //   "rate_percentage": 0,
    //   "loan_type": "PERSONAL"
    // }
    return AxiosClientApi.post(`/${ADMIN}/${CREDIT}/add-credit-interest`, request, true)
}

export function interestUpdate(request) {
    //  {
    //   "label": "string",
    //   "min_score": 0,
    //   "max_score": 0,
    //   "rate_percentage": 0
    // }
    return AxiosClientApi.put(`/${ADMIN}/${CREDIT}/update-credit-interest/${request?.credit_id}`, request, true)
}

export function interestDetails(request) {
    return AxiosClientApi.get(`/${ADMIN}/${CREDIT}/credit-score-interest/${request?.credit_id}`, request, true)
}

// ---------------------------- LOAN Processing ------------------------------------------------------- 

export function processingFeeList(request) {
    return AxiosClientApi.get(`/${ADMIN}/${CREDIT}/get-all-processing-fee`, request, true)
}

export function processingFeeAdd(request) {
    return AxiosClientApi.post(`/${ADMIN}/${CREDIT}/add-processing-fee`, request, true)
}

export function processingFeeUpdate(request) {
    return AxiosClientApi.put(`/${ADMIN}/${CREDIT}/update-processing-fee/${request?.fee_id}`, request, true)
}

export function processingFeeDetails(request) {
    return AxiosClientApi.get(`/${ADMIN}/${CREDIT}/get-processing-fee-details/${request?.fee_id}`, request, true)
}

// ----------------------------------------------- Contact US Api  -------------------------------------------------

export function listContactUs(request) {
    return AxiosClientApi.get(`/${CONTACT_US}/get-all-contact-messages${request?.search ? `?search=${request?.search}` : ""}`, request)
}

// ----------------------------------------------- Holidays Api  -------------------------------------------------

export function addHolidays(request) {
    return AxiosClientApi.post(`/${ADMIN_HOLIDAYS}/add_holidays`, request, true)
}

export function updateHolidays(request) {
    return AxiosClientApi.post(`/${ADMIN_HOLIDAYS}/edit_holidays`, request, true)
}

// holiday_id
export function deleteHolidays(request) {
    return AxiosClientApi.post(`/${ADMIN_HOLIDAYS}/delete_holidays`, request, true)
}


export function listHolidays(request) {
    return AxiosClientApi.post(`/${ADMIN_HOLIDAYS}/holidays_listing`, request, true)
}

// ----------------------------------------------- EMI Payment Charge Api  -------------------------------------------------

export function addEMICharge(request) {
    return AxiosClientApi.post(`/${ADMIN}/${CHARGE}/add-charge`, request, true)
}

export function updateEMICharge(request) {
    return AxiosClientApi.put(`/${ADMIN}/${CHARGE}/update-charge/${request?.charge_id}`, request, true)
}

export function detailsEMICharge(request) {
    return AxiosClientApi.post(`/${ADMIN}/${CHARGE}/get-charge-details/${request?.charge_id}`, request, true)
}

export function listEMICharge(request) {
    return AxiosClientApi.get(`/${ADMIN}/${CHARGE}/get-all-charges`, request, true)
}

// ----------------------------------------------- Loan Comaplate Document Api  ---------------------------------------

export function addLoanComplateDocument(request) {
    return AxiosClientApi.post(`/${ADMIN}/${LOAN}/add-approved-document`, request, true)
}

export function updateLoanComplateDocument(request) {
    return AxiosClientApi.put(`/${ADMIN}/${LOAN}/update-approved-document/${request?.document_id}`, request, true)
}

export function deleteLoanComplateDocument(request) {
    return AxiosClientApi.delete(`/${ADMIN}/${LOAN}/delete-approved-document/${request?.document_id}`, request, true)
}

// ---------------------------------------------------- old apis for replace -----------------------------------

export function ChangePassword(request) {
    return AxiosClientApi.post(`/${AUTH}/change_password`, request, true)
}

export function editStaticContent(request) {
    return AxiosClientApi.post(`/${ADMIN}/${COMMON}/edit_static_content`, request)
}

export function listStaticContent(request) {
    return AxiosClientApi.post(`/${ADMIN}/${COMMON}/static_content_listing`, request)
}

export function editCmsPages(request) {
    return AxiosClientApi.post(`/${ADMIN}/${COMMON}/edit_cms_page`, request)
}

export function detailsCmsPages(request) {
    return AxiosClientApi.post(`/${ADMIN}/${COMMON}/list_pages`, request)
}
