import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import toast from 'react-hot-toast';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { user, token } = useSelector((state) => state.auth);
    const isAuthenticated = !!user && !!token;
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        dispatch(logout());
        toast.success('Logged out successfully');
        navigate('/login');
    };

    // Helper function to determine if a link is active
    const isActive = (path) => {
        return location.pathname === path
            ? 'text-blue-700 border-b-2 border-blue-500 font-medium'
            : 'text-gray-600 hover:text-blue-600 hover:border-b-2 hover:border-blue-300';
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center">
                            <div className="flex items-center justify-center h-8 w-8 bg-blue-600 text-white rounded">
                                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 12H20M12 4V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <span className="ml-2 text-xl font-bold text-gray-800">Leave Management</span>
                        </Link>
                    </div>

                    {/* Desktop navigation */}
                    <div className="hidden md:flex md:items-center md:space-x-4">
                        {isAuthenticated ? (
                            <div className="flex items-center space-x-6">
                                {user.roles && user.roles.includes('STAFF') && (
                                    <Link
                                        to="/dashboard"
                                        className={`${isActive('/dashboard')} transition-colors px-2 py-4 text-sm font-medium`}
                                    >
                                        Dashboard
                                    </Link>
                                )}
                                {user.roles && user.roles.includes('MANAGER') && (
                                    <Link
                                        to="/team-leaves"
                                        className={`${isActive('/team-leaves')} transition-colors px-2 py-4 text-sm font-medium`}
                                    >
                                        Team Leaves
                                    </Link>
                                )}
                                {user.roles && (user.roles.includes('ADMIN') || user.roles.includes('MANAGER')) && (
                                    <Link
                                        to="/admin"
                                        className={`${isActive('/admin')} transition-colors px-2 py-4 text-sm font-medium`}
                                    >
                                        Admin
                                    </Link>
                                )}
                                <div className="border-l border-gray-200 h-6 mx-2"></div>
                                <div className="flex items-center">
                                    <span className="text-gray-700 font-medium">{user.firstName}</span>
                                    <button
                                        onClick={handleLogout}
                                        className="ml-6 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors px-4 py-2 rounded-md text-sm font-medium flex items-center"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                                        </svg>
                                        Logout
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link
                                    to="/login"
                                    className={`${isActive('/login')} hover:text-blue-600 transition-colors px-3 py-2 text-sm font-medium`}
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
                                >
                                    Create Account
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                        >
                            <span className="sr-only">Open main menu</span>
                            {!isMenuOpen ? (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            ) : (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu, show/hide based on menu state */}
            {isMenuOpen && (
                <div className="md:hidden bg-white shadow-lg rounded-b-lg">
                    <div className="px-3 pt-2 pb-3 space-y-1">
                        {isAuthenticated ? (
                            <>
                                <div className="px-4 py-3 border-b border-gray-200">
                                    <div className="text-base font-medium text-gray-800">
                                        {user.firstName} {user.lastName}
                                    </div>
                                </div>
                                {user.roles && user.roles.includes('STAFF') && (
                                    <Link
                                        to="/dashboard"
                                        className={`${isActive('/dashboard').includes('border-b-2') ? 'bg-blue-50 text-blue-700' : 'text-gray-600'
                                            } hover:bg-blue-50 hover:text-blue-700 block px-4 py-3 rounded-md text-base font-medium`}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Dashboard
                                    </Link>
                                )}
                                {user.roles && user.roles.includes('MANAGER') && (
                                    <Link
                                        to="/team-leaves"
                                        className={`${isActive('/team-leaves').includes('border-b-2') ? 'bg-blue-50 text-blue-700' : 'text-gray-600'
                                            } hover:bg-blue-50 hover:text-blue-700 block px-4 py-3 rounded-md text-base font-medium`}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Team Leaves
                                    </Link>
                                )}
                                {user.roles && (user.roles.includes('ADMIN') || user.roles.includes('MANAGER')) && (
                                    <Link
                                        to="/admin"
                                        className={`${isActive('/admin').includes('border-b-2') ? 'bg-blue-50 text-blue-700' : 'text-gray-600'
                                            } hover:bg-blue-50 hover:text-blue-700 block px-4 py-3 rounded-md text-base font-medium`}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Admin
                                    </Link>
                                )}
                                <div className="px-4 py-3">
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsMenuOpen(false);
                                        }}
                                        className="flex items-center w-full text-left text-gray-700 hover:text-gray-900 font-medium"
                                    >
                                        <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                                        </svg>
                                        Sign out
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className={`${isActive('/login').includes('border-b-2') ? 'bg-blue-50 text-blue-700' : 'text-gray-600'
                                        } hover:bg-blue-50 hover:text-blue-700 block px-4 py-3 rounded-md text-base font-medium`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-blue-600 hover:bg-blue-700 text-white block px-4 py-3 rounded-md text-base font-medium my-2 mx-4"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Create Account
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;