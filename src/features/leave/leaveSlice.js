import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '../../utils/api';

export const applyForLeave = createAsyncThunk(
    'leave/applyForLeave',
    async (leaveData, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token;
            let body, headers;
            if (leaveData.files && leaveData.files.length > 0) {
                body = new FormData();
                body.append('leaveType', leaveData.leaveType);
                body.append('startDate', leaveData.startDate);
                body.append('endDate', leaveData.endDate);
                body.append('reason', leaveData.reason);
                leaveData.files.forEach((file, idx) => {
                    body.append('supportingDocuments', file);
                });
                headers = { Authorization: `Bearer ${token}` };
            } else {
                body = JSON.stringify({
                    leaveType: leaveData.leaveType,
                    startDate: leaveData.startDate,
                    endDate: leaveData.endDate,
                    reason: leaveData.reason,
                });
                headers = {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                };
            }
            const data = await apiRequest('/api/v1/leaves/apply', {
                method: 'POST',
                body,
                headers,
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