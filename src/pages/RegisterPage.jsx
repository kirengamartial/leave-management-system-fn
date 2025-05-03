import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { register } from '../features/auth/authSlice';
import toast from 'react-hot-toast';

const RegisterPage = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [department, setDepartment] = useState('');
    const [notification, setNotification] = useState('');
    const [showNotification, setShowNotification] = useState(false);

    const dispatch = useAppDispatch();
    const { loading, error, token } = useAppSelector((state) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            navigate('/dashboard');
        }
    }, [token, navigate]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    // Handle notification display and auto-dismiss
    useEffect(() => {
        if (notification) {
            setShowNotification(true);
            const timer = setTimeout(() => {
                setShowNotification(false);
                setTimeout(() => {
                    setNotification('');
                }, 300); // Clear message after fade out animation
            }, 5000); // Show for 5 seconds

            return () => clearTimeout(timer);
        }
    }, [notification]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const resultAction = await dispatch(register({ firstName, lastName, email, password, department }));
            if (register.fulfilled.match(resultAction)) {
                setNotification(resultAction.payload.message);
            } else {
                toast.error('Something went wrong.');
            }
        } catch {
            toast.error('Something went wrong.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-lg px-8 py-10 bg-white rounded-2xl shadow-xl">
                <div className="mb-6 text-center">
                    <h1 className="text-3xl font-bold text-blue-600">Create your account</h1>
                    <p className="mt-2 text-sm text-gray-500">Join the Leave Management system</p>
                </div>

                {/* Notification banner */}
                {showNotification && (
                    <div
                        className={`mb-6 py-3 px-4 rounded-lg bg-green-50 border border-green-200 text-green-700 flex items-center justify-between transition-all duration-300 ${showNotification ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-2'}`}
                    >
                        <div className="flex items-center">
                            <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <p className="text-sm font-medium">{notification}</p>
                        </div>
                        <button
                            onClick={() => setShowNotification(false)}
                            className="text-green-600 hover:text-green-800 focus:outline-none"
                        >
                            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="flex gap-4">
                        <div className="w-1/2">
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-600 mb-1">First Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <input
                                    id="firstName"
                                    type="text"
                                    className="pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-600 bg-white"
                                    placeholder="John"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="w-1/2">
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-600 mb-1">Last Name</label>
                            <input
                                id="lastName"
                                type="text"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-600 bg-white"
                                placeholder="Doe"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

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
                        <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-1">Password</label>
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

                    <div>
                        <label htmlFor="department" className="block text-sm font-medium text-gray-600 mb-1">Department</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4zm3 1h6v4H7V5zm8 8v2h1v1H4v-1h1v-2H4v-1h16v1h-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <input
                                id="department"
                                type="text"
                                className="pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-600 bg-white"
                                placeholder="e.g. Engineering"
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
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
                                Creating Account...
                            </span>
                        ) : 'Create Account'}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;