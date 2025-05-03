import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '../../utils/api';

const persistedAuth = JSON.parse(localStorage.getItem('auth')) || {};

const initialState = {
    user: persistedAuth.user || null,
    token: persistedAuth.token || null,
    isAuthenticated: !!(persistedAuth.user && persistedAuth.token),
    loading: false,
    error: null,
};

export const login = createAsyncThunk(
    'auth/login',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const data = await apiRequest('/api/v1/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            });
            return data;

        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

export const register = createAsyncThunk(
    'auth/register',
    async (payload, { rejectWithValue }) => {
        try {
            const data = await apiRequest('/api/v1/auth/register', {
                method: 'POST',
                body: JSON.stringify(payload),
            });
            return data;
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            localStorage.setItem('auth', JSON.stringify({ user: state.user, token: state.token }));
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('auth');
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
                state.user = {
                    userId: action.payload.userId,
                    email: action.payload.email,
                    firstName: action.payload.firstName,
                    lastName: action.payload.lastName,
                    department: action.payload.department,
                    profilePicture: action.payload.profilePicture,
                    roles: action.payload.roles,
                };
                state.isAuthenticated = true;
                localStorage.setItem('auth', JSON.stringify({ user: state.user, token: state.token }));
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Login failed';
            })
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
                state.user = {
                    userId: action.payload.userId,
                    email: action.payload.email,
                    firstName: action.payload.firstName,
                    lastName: action.payload.lastName,
                    department: action.payload.department,
                    profilePicture: action.payload.profilePicture,
                    roles: action.payload.roles,
                };
                localStorage.setItem('auth', JSON.stringify({ user: state.user, token: state.token }));
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Registration failed';
            })
            .addCase(logout, (state) => {
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
                localStorage.removeItem('auth');
            });
    },
});

export const { setUser, logout, setLoading, setError } = authSlice.actions;
export default authSlice.reducer; 