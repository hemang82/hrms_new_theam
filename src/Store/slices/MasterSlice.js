import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as API from '../../utils/api.services';

// ----------------------------------------------------------- Loan Slice -------------------------------------------------------

export const getCustomerListThunk = createAsyncThunk("customerList", async (submitData, { dispatch }) => {
    try {
        dispatch(setLoader(true));
        const { data } = await API.CustomerList(submitData);
        return data;
    } catch (error) {
        throw error;
    } finally {
        dispatch(setLoader(false));
    }
});

export const getDailyTaskListThunk = createAsyncThunk("DailyTaskList", async (submitData, { dispatch }) => {
    try {
        dispatch(setLoader(true))
        const { data } = await API.DailyTaskList(submitData);
        dispatch(setLoader(false))
        return data;
    } catch (error) {
        throw error;
    }
});

export const getlistAttendanceThunk = createAsyncThunk("listAttendance", async (submitData, { dispatch }) => {
    try {
        dispatch(setLoader(true))
        const { data } = await API.listAttendance(submitData);
        dispatch(setLoader(false))
        return data?.length > 0 ? data : [];
    } catch (error) {
        throw error;
    }
});

export const getlistLeavesThunk = createAsyncThunk("listLeaves", async (submitData, { dispatch }) => {
    try {
        dispatch(setLoader(true))
        const { data } = await API.listLeaves(submitData);
        dispatch(setLoader(false))
        return data;
    } catch (error) {
        throw error;
    }
});

export const getlistLeavesRequestThunk = createAsyncThunk("listLeavesRequest", async (submitData, { dispatch }) => {
    try {
        // dispatch(setLoader(true))
        const { data } = await API.listLeavesRequest(submitData);
        // dispatch(setLoader(false))
        return data;
    } catch (error) {
        throw error;
    }
});

export const getEmpLeaveBalanceListThunk = createAsyncThunk("empLeaveBalanceList", async (submitData, { dispatch }) => {
    try {
        dispatch(setLoader(true))
        const { data } = await API.listEmpLeaveBalance(submitData);
        dispatch(setLoader(false))
        return data;
    } catch (error) {
        throw error;
    }
});

export const getListBankDetailsThunk = createAsyncThunk("listBankDetails", async (submitData, { dispatch }) => {
    try {
        dispatch(setLoader(true))
        const { data } = await API.listBankDetails(submitData);
        dispatch(setLoader(false))
        return data;
    } catch (error) {
        throw error;
    }
});

export const getListDepartnmentThunk = createAsyncThunk("ListDepartnment", async (submitData, { dispatch }) => {
    try {
        // dispatch(setLoader(true))
        const { data } = await API.departnmentList(submitData);
        // dispatch(setLoader(false))
        return data;
    } catch (error) {
        throw error;
    }
});

export const getSaturdayListThunk = createAsyncThunk("SaturdayList", async (submitData, { dispatch }) => {
    try {
        dispatch(setLoader(true))
        const { data } = await API.saturdayList(submitData);
        dispatch(setLoader(false))
        return data;
    } catch (error) {
        throw error;
    }
});

export const getSalaryListThunk = createAsyncThunk("SalaryList", async (submitData, { dispatch }) => {
    try {
        dispatch(setLoader(true))
        const { data } = await API.listSalary(submitData);
        dispatch(setLoader(false))
        return data?.results;
    } catch (error) {
        throw error;
    }
});

export const getListContactUsThunk = createAsyncThunk("listContactUs", async (submitData, { dispatch }) => {
    try {
        // dispatch(setLoader(true))
        const { data } = await API.listContactUs(submitData);
        // dispatch(setLoader(false))
        return data;
    } catch (error) {
        throw error;
    }
});


export const getHolidayListThunk = createAsyncThunk("HolidayList", async (submitData, { dispatch }) => {
    try {
        dispatch(setLoader(true))
        const { data } = await API.listHolidays(submitData);
        dispatch(setLoader(false))
        return data;
    } catch (error) {
        throw error;
    }
});

export const getProjectListThunk = createAsyncThunk("ProjectList", async (submitData, { dispatch }) => {
    try {
        dispatch(setLoader(true))
        const { data } = await API.listProject(submitData);
        dispatch(setLoader(false))
        return data;
    } catch (error) {
        throw error;
    }
});

export const getAssignTaskListThunk = createAsyncThunk("AssignTaskList", async (submitData, { dispatch }) => {
    try {
        !submitData?.loader && dispatch(setLoader(true))
        const { data } = await API.listAssignTask(submitData);
        !submitData?.loader && dispatch(setLoader(false))
        return data;
    } catch (error) {
        throw error;
    }
});

export const getListTicketThunk = createAsyncThunk("listTicket", async (submitData, { dispatch }) => {
    try {
        !submitData?.loader && dispatch(setLoader(true))
        const { data } = await API.listTicket(submitData);
        !submitData?.loader && dispatch(setLoader(false))
        return data;
    } catch (error) {
        throw error;
    }
});

export const getBirthdayAndAnnivarsaryListThunk = createAsyncThunk("birthdayAndAnnivarsary", async (submitData, { dispatch }) => {
    try {
        // dispatch(setLoader(true))
        const { data } = await API.birthdayAndAnnivarsary(submitData);
        // dispatch(setLoader(false))
        return data
    } catch (error) {
        throw error;
    }
});

const initialState = {
    isLoading: false,

    customerList: {
        data: [],
        error: null,
    },
    birthdayAndAnnivarsary: {
        data: [],
        error: null,
    },
    dailyTaskList: {
        data: [],
        error: null,
    },
    holidayList: {
        data: [],
        error: null,
    },
    leaveList: {
        data: [],
        error: null,
    },
    leaveRequestList: {
        data: [],
        error: null,
    },
    empLeaveBalanceList: {
        data: [],
        error: null,
    },
    attendanceList: {
        data: [],
        error: null,
    }, salaryList: {
        data: [],
        error: null,
    },
    bankDetailsList: {
        data: [],
        error: null,
    },
    departnmentList: {
        data: [],
        error: null,
    },
    saturdayList: {
        data: [],
        error: null,
    },
    projectList: {
        data: [],
        error: null,
    },
    assignTaskList: {
        data: [],
        error: null,
    }, ticketList: {
        data: [],
        error: null,
    },
    customModel: {
        isOpen: false,
        modalType: ''
    },
    contactUsList: {
        data: [],
        error: null,
    },

    slidebarToggle: true,
    pageScroll: false
}

const masterSlice = createSlice({
    name: 'masterslice',
    initialState,
    reducers: {
        setLoader: (state, action) => {
            state.isLoading = action.payload;
        },
        updateSlidebarToggle: (state, action) => {
            state.slidebarToggle = action.payload;
        },
        updateDailyTaskList: (state, action) => {
            state.dailyTaskList.data = action.payload;
        },
        setModalStatus: (state, action) => {
            const { modalType, isOpen, data } = action.payload;
            state.customModel.modalType = modalType;
            state.customModel.isOpen = isOpen;
        },
        updateLeaveRequestList: (state, action) => {
            state.leaveRequestList.data = action.payload;
        },

        // ---------------------- HRMS -----------------------------

        updateIntrestList: (state, action) => {
            state.salaryList.data = action.payload;
        },

        updateCustomerList: (state, action) => {
            state.customerList.data = action.payload;
        },
        updateAttendanceList: (state, action) => {
            state.attendanceList.data = action.payload;
        },

        updateProcessingFeeList: (state, action) => {
            state.salaryList.data = action.payload;
        },
        updateHolidayList: (state, action) => {
            state.holidayList.data = action.payload;
        },
        updateLeaveList: (state, action) => {
            state.leaveList.data = action.payload;
        },
        updateLeaveBalanceList: (state, action) => {
            state.empLeaveBalanceList.data = action.payload;
        },
        updateBankDetailsList: (state, action) => {
            state.empLeaveBalanceList.data = action.payload;
        },
        updateDepartnmentList: (state, action) => {
            state.departnmentList.data = action.payload;
        },
        updateSaterdayList: (state, action) => {
            state.saturdayList.data = action.payload;
        },
        updateProjectList: (state, action) => {
            state.projectList.data = action.payload;
        },
        updateAssignTaskList: (state, action) => {
            state.assignTaskList.data = action.payload;
        },

        // ✅ SOFT UPDATE one task's status in the list
        updateAssignTaskStatus: (state, action) => {
            const { taskId, taskStatus } = action.payload;
            if (!state.assignTaskList?.data?.length) return;

            state.assignTaskList.data = state.assignTaskList.data.map((task) =>
                task.task_id == taskId
                    ? { ...task, task_status: taskStatus }
                    : task
            );
        },

        updateTicketStatus: (state, action) => {
            const { ticketId, status } = action.payload;
            if (!state.ticketList?.data?.length) return;
            state.ticketList.data = state.ticketList.data.map((ticket) =>
                ticket.ticket_id == ticketId ? { ...ticket, status: status } : ticket
            );
        },

        updateTicketList: (state, action) => {
            state.ticketList.data = action.payload;
        },

        updatePageScroll: (state, action) => {
            state.pageScroll = action.payload;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(getCustomerListThunk.fulfilled, (state, action) => {
                state.customerList.data = action.payload;
            })
            .addCase(getCustomerListThunk.rejected, (state, action) => {
                state.customerList.error = action.error.message;
            })


            .addCase(getDailyTaskListThunk.fulfilled, (state, action) => {
                state.dailyTaskList.data = action.payload;
            })
            .addCase(getDailyTaskListThunk.rejected, (state, action) => {
                state.dailyTaskList.error = action.error.message;
            })

            .addCase(getlistLeavesThunk.fulfilled, (state, action) => {
                state.leaveList.data = action.payload;
            })
            .addCase(getlistLeavesThunk.rejected, (state, action) => {
                state.leaveList.error = action.error.message;
            })

            .addCase(getEmpLeaveBalanceListThunk.fulfilled, (state, action) => {
                state.empLeaveBalanceList.data = action.payload;
            })
            .addCase(getEmpLeaveBalanceListThunk.rejected, (state, action) => {
                state.empLeaveBalanceList.error = action.error.message;
            })

            .addCase(getListBankDetailsThunk.fulfilled, (state, action) => {
                state.bankDetailsList.data = action.payload;
            })
            .addCase(getListBankDetailsThunk.rejected, (state, action) => {
                state.bankDetailsList.error = action.error.message;
            })

            .addCase(getListDepartnmentThunk.fulfilled, (state, action) => {
                state.departnmentList.data = action.payload;
            })
            .addCase(getListDepartnmentThunk.rejected, (state, action) => {
                state.departnmentList.error = action.error.message;
            })


            .addCase(getSaturdayListThunk.fulfilled, (state, action) => {
                state.saturdayList.data = action.payload;
            })
            .addCase(getSaturdayListThunk.rejected, (state, action) => {
                state.saturdayList.error = action.error.message;
            })

            .addCase(getlistLeavesRequestThunk.fulfilled, (state, action) => {
                state.leaveRequestList.data = action.payload;
            })
            .addCase(getlistLeavesRequestThunk.rejected, (state, action) => {
                state.leaveRequestList.error = action.error.message;
            })

            .addCase(getlistAttendanceThunk.fulfilled, (state, action) => {
                state.attendanceList.data = action.payload || [];
            })
            .addCase(getlistAttendanceThunk.rejected, (state, action) => {
                state.attendanceList.error = action.error.message;
            })

            .addCase(getSalaryListThunk.fulfilled, (state, action) => {
                state.salaryList.data = action.payload;
            })
            .addCase(getSalaryListThunk.rejected, (state, action) => {
                state.salaryList.error = action.error.message;
            })


            .addCase(getListContactUsThunk.fulfilled, (state, action) => {
                state.contactUsList.data = action.payload;
            }).addCase(getListContactUsThunk.rejected, (state, action) => {
                state.contactUsList.error = action.error.message;
            })

            .addCase(getHolidayListThunk.fulfilled, (state, action) => {
                state.holidayList.data = action.payload;
            }).addCase(getHolidayListThunk.rejected, (state, action) => {
                state.holidayList.error = action.error.message;
            })

            .addCase(getProjectListThunk.fulfilled, (state, action) => {
                state.projectList.data = action.payload;
            }).addCase(getProjectListThunk.rejected, (state, action) => {
                state.projectList.error = action.error.message;
            })

            .addCase(getAssignTaskListThunk.fulfilled, (state, action) => {
                state.assignTaskList.data = action.payload;
            }).addCase(getAssignTaskListThunk.rejected, (state, action) => {
                state.assignTaskList.error = action.error.message;
            })

            .addCase(getListTicketThunk.fulfilled, (state, action) => {
                state.ticketList.data = action.payload;
            }).addCase(getListTicketThunk.rejected, (state, action) => {
                state.ticketList.error = action.error.message;
            })

            .addCase(getBirthdayAndAnnivarsaryListThunk.fulfilled, (state, action) => {
                state.birthdayAndAnnivarsary.data = action.payload;
            })
            .addCase(getBirthdayAndAnnivarsaryListThunk.rejected, (state, action) => {
                state.birthdayAndAnnivarsary.error = action.error.message;
            })


    },
});

export const { setLoader, setModalStatus, updatePostList, updateAttendanceList, updateLeaveRequestList, updateTicketList, updateTicketStatus, updateAssignTaskList, updateAssignTaskStatus, updateProjectList, updateDailyTaskList, updateSaterdayList, updateDepartnmentList, updateLeaveBalanceList, updateBankDetailsList, updateHolidayList, updateSlidebarToggle, updateLeaveList, updateIntrestList, updateCustomerList, updateBannerList, updateCelebrityList, updateNewsList, updateWalletOfferList, updateContactUsList, updateNewsLatterList, updatePageScroll, updateProcessingFeeList } = masterSlice.actions;
export default masterSlice.reducer;