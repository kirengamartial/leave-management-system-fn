import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '../../utils/api';

export const applyForLeave = createAsyncThunk(
    'leave/applyForLeave',
    async (leaveData, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token;
            const formData = new FormData();

            const formatDate = (date) => {
                const d = new Date(date);
                const pad = (n) => n < 10 ? '0' + n : n;
                return (
                    d.getFullYear() +
                    '-' + pad(d.getMonth() + 1) +
                    '-' + pad(d.getDate()) +
                    'T' + pad(d.getHours()) +
                    ':' + pad(d.getMinutes()) +
                    ':' + pad(d.getSeconds())
                );
            };

            formData.append('leaveType', leaveData.leaveType);
            formData.append('startDate', formatDate(leaveData.startDate));
            formData.append('endDate', formatDate(leaveData.endDate));

            if (leaveData.reason) {
                formData.append('reason', leaveData.reason);
            }

            if (leaveData.files && leaveData.files.length > 0) {
                formData.append('file', leaveData.files[0]);
            }

            const data = await apiRequest('/api/v1/leaves/apply', {
                method: 'POST',
                body: formData,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return data;
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

export const fetchLeaveBalance = createAsyncThunk(
    'leave/fetchLeaveBalance',
    async (_, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token;
            const data = await apiRequest('/api/v1/leaves/balance', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return data;
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

export const fetchLeaveHistory = createAsyncThunk(
    'leave/fetchLeaveHistory',
    async (_, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token;
            const data = await apiRequest('/api/v1/leaves/my-leaves', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return data;
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

export const fetchTeamLeaves = createAsyncThunk(
    'leave/fetchTeamLeaves',
    async (_, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token;
            const data = await apiRequest('/api/v1/leaves/team', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return data;
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

export const approveLeave = createAsyncThunk(
    'leave/approveLeave',
    async (leaveId, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token;
            const data = await apiRequest(`/api/v1/leaves/${leaveId}/approve`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return data;
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

export const rejectLeave = createAsyncThunk(
    'leave/rejectLeave',
    async (leaveId, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token;
            const data = await apiRequest(`/api/v1/leaves/${leaveId}/reject`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return data;
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

const leaveSlice = createSlice({
    name: 'leave',
    initialState: {
        applyLoading: false,
        applyError: null,
        balance: {},
        balanceLoading: false,
        balanceError: null,
        history: [],
        historyLoading: false,
        historyError: null,
        teamLeaves: [],
        teamLoading: false,
        teamError: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(applyForLeave.pending, (state) => {
                state.applyLoading = true;
                state.applyError = null;
            })
            .addCase(applyForLeave.fulfilled, (state) => {
                state.applyLoading = false;
            })
            .addCase(applyForLeave.rejected, (state, action) => {
                state.applyLoading = false;
                state.applyError = action.payload || 'Failed to apply for leave';
            })
            .addCase(fetchLeaveBalance.pending, (state) => {
                state.balanceLoading = true;
                state.balanceError = null;
            })
            .addCase(fetchLeaveBalance.fulfilled, (state, action) => {
                state.balanceLoading = false;
                state.balance = action.payload;
            })
            .addCase(fetchLeaveBalance.rejected, (state, action) => {
                state.balanceLoading = false;
                if (action.payload && typeof action.payload === 'object') {
                    state.balanceError = action.payload.error || 'You are not authorized to view leave balance.';
                } else {
                    state.balanceError = action.payload || 'Failed to fetch leave balance';
                }
            })
            .addCase(fetchLeaveHistory.pending, (state) => {
                state.historyLoading = true;
                state.historyError = null;
            })
            .addCase(fetchLeaveHistory.fulfilled, (state, action) => {
                state.historyLoading = false;
                state.history = action.payload;
            })
            .addCase(fetchLeaveHistory.rejected, (state, action) => {
                state.historyLoading = false;
                state.historyError = action.payload || 'Failed to fetch leave history';
            })
            .addCase(fetchTeamLeaves.pending, (state) => {
                state.teamLoading = true;
                state.teamError = null;
            })
            .addCase(fetchTeamLeaves.fulfilled, (state, action) => {
                state.teamLoading = false;
                state.teamLeaves = action.payload;
            })
            .addCase(fetchTeamLeaves.rejected, (state, action) => {
                state.teamLoading = false;
                state.teamError = action.payload || 'Failed to fetch team leaves';
            })
            .addCase(approveLeave.pending, (state) => {
                state.teamLoading = true;
            })
            .addCase(approveLeave.fulfilled, (state) => {
                state.teamLoading = false;
            })
            .addCase(approveLeave.rejected, (state, action) => {
                state.teamLoading = false;
                state.teamError = action.payload || 'Failed to approve leave';
            })
            .addCase(rejectLeave.pending, (state) => {
                state.teamLoading = true;
            })
            .addCase(rejectLeave.fulfilled, (state) => {
                state.teamLoading = false;
            })
            .addCase(rejectLeave.rejected, (state, action) => {
                state.teamLoading = false;
                state.teamError = action.payload || 'Failed to reject leave';
            });
    },
});

export default leaveSlice.reducer;