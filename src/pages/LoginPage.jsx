import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { login, setUser } from '../features/auth/authSlice';
import toast from 'react-hot-toast';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [googleLoading, setGoogleLoading] = useState(false);
    const dispatch = useAppDispatch();
    const { loading, error, isAuthenticated, user } = useAppSelector((state) => state.auth);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const userId = params.get('userId');
        const email = params.get('email');
        const firstName = params.get('firstName');
        const lastName = params.get('lastName');
        const department = params.get('department');
        const profilePicture = params.get('profilePicture');
        const roles = params.get('roles');

        if (token && userId && email) {
            dispatch(setUser({
                user: {
                    userId,
                    email,
                    firstName,
                    lastName,
                    department,
                    profilePicture,
                    roles: [roles],
                },
                token,
            }));
            toast.success('Google login successful!');
            // Remove query params before navigating
            navigate('/dashboard', { replace: true });
        }
    }, [location.search, dispatch, navigate]);

    useEffect(() => {
        if (user && user.roles && user.roles.includes('STAFF')) {
            toast.success('Login successful!');
            navigate('/dashboard');
        } else if (user && user.roles && user.roles.includes('ADMIN')) {
            toast.success('Login successful!');
            navigate('/admin');
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(login({ email, password }));
    };

    const handleGoogleLogin = async () => {
        try {
            setGoogleLoading(true);
            const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
            const res = await fetch(`${baseUrl}/api/v1/auth/oauth2/google`);
            const data = await res.json();
            if (data.authUrl) {
                window.location.href = data.authUrl;
            } else {
                toast.error('Google login is not available.');
                setGoogleLoading(false);
            }
        } catch {
            toast.error('Google login is not available.');
            setGoogleLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md px-8 py-10 bg-white rounded-2xl shadow-xl">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-blue-600">Welcome back</h1>
                    <p className="mt-2 text-sm text-gray-500">Sign in to your Leave Management account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">Email address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                </svg>
                            </div>
                            <input
                                id="email"
                                type="email"
                                className="pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-600 bg-white"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-600">Password</label>
                            <Link to="/forgot-password" className="text-xs font-medium text-blue-500 hover:text-blue-400">
                                Forgot password?
                            </Link>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <input
                                id="password"
                                type="password"
                                className="pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-600 bg-white"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {error && <div className="py-2 px-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">{error}</div>}

                    <button
                        type="submit"
                        className="w-full py-2.5 px-4 bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-200 text-white font-medium rounded-lg transition duration-200"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Signing In...
                            </span>
                        ) : 'Sign In'}
                    </button>
                </form>

                <div className="mt-6 mb-6 relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                </div>

                <button
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-600 hover:bg-gray-50 font-medium transition duration-200"
                    disabled={googleLoading}
                >
                    {googleLoading ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Connecting to Google...
                        </span>
                    ) : (
                        <>
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M12 5c1.617 0 3.064.501 4.125 1.492l3.467-3.467C17.779 1.202 15.012 0 12 0 7.392 0 3.397 2.6 1.386 6.41l4.044 3.129C6.435 6.7 8.995 5 12 5z" />
                                <path fill="#34A853" d="M23.49 12.275c0-.815-.073-1.6-.21-2.352H12v4.448h6.47c-.279 1.521-1.128 2.811-2.402 3.673l3.716 2.875C21.644 18.893 23.49 15.881 23.49 12.275z" />
                                <path fill="#FBBC05" d="M5.413 14.402c-.301-1.009-.47-2.082-.47-3.402 0-1.32.17-2.393.47-3.402L1.386 4.41C.499 6.794 0 9.33 0 12s.499 5.206 1.386 7.59l4.027-3.188z" />
                                <path fill="#EA4335" d="M12 24c3.012 0 5.779-1.202 7.592-3.025l-3.716-2.875c-1.021.68-2.345 1.09-3.876 1.09-3.005 0-5.565-1.7-6.57-4.59L1.386 17.59C3.397 21.4 7.392 24 12 24z" />
                            </svg>
                            Sign in with Google
                        </>
                    )}
                </button>

                <p className="mt-8 text-center text-sm text-gray-500">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-medium text-blue-500 hover:text-blue-400">
                        Create an account
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;