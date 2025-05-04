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
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);

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

    // Function to render profile picture or default avatar
    const renderProfilePicture = () => {
        if (user?.profilePicture) {
            return (
                <img
                    src={user.profilePicture}
                    alt="Profile"
                    className="h-8 w-8 rounded-full object-cover border border-gray-100"
                />
            );
        }

        return (
            <div className="h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                <span className="font-medium text-sm">
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </span>
            </div>
        );
    };

    return (
        <nav className="bg-white">
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

                                {/* Profile dropdown */}
                                <div className="relative">
                                    <div
                                        className="flex items-center space-x-2 rounded-full cursor-pointer transition-all duration-200 hover:bg-gray-50 px-2 py-1"
                                        onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => e.key === 'Enter' && setShowProfileDropdown(!showProfileDropdown)}
                                    >
                                        {renderProfilePicture()}
                                        <div className="flex items-center">
                                            <span className="text-gray-700 font-medium ml-2">{user?.firstName}</span>
                                            <svg className="ml-1 h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                            </svg>
                                        </div>
                                    </div>

                                    {/* Dropdown menu */}
                                    {showProfileDropdown && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md py-1 z-10 shadow-lg border border-gray-100">

                                            <div className="border-t border-gray-100 my-1"></div>
                                            <div
                                                onClick={() => {
                                                    handleLogout();
                                                    setShowProfileDropdown(false);
                                                }}
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 cursor-pointer"
                                                role="button"
                                                tabIndex={0}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        handleLogout();
                                                        setShowProfileDropdown(false);
                                                    }
                                                }}
                                            >
                                                Sign out
                                            </div>
                                        </div>
                                    )}
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
                                    className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 hover:from-blue-600 hover:to-blue-800"
                                >
                                    Create Account
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center md:hidden">
                        <div
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-blue-600 hover:bg-blue-50 focus:outline-none transition-colors duration-200 cursor-pointer"
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => e.key === 'Enter' && setIsMenuOpen(!isMenuOpen)}
                            aria-label="Open main menu"
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
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile menu, show/hide based on menu state */}
            {isMenuOpen && (
                <div className="md:hidden bg-white shadow-lg rounded-b-lg">
                    <div className="px-3 pt-2 pb-3 space-y-1">
                        {isAuthenticated ? (
                            <>
                                <div className="px-4 py-3 border-b border-gray-100 flex items-center">
                                    {renderProfilePicture()}
                                    <div className="ml-3">
                                        <div className="text-base font-medium text-gray-700">
                                            {user.firstName} {user.lastName}
                                        </div>
                                        <div className="text-sm font-medium text-gray-500">
                                            {user.email}
                                        </div>
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
                                <div className="border-t border-gray-200 my-1"></div>
                                <div className="px-4 py-3">
                                    <div
                                        onClick={() => {
                                            handleLogout();
                                            setIsMenuOpen(false);
                                        }}
                                        className="flex items-center w-full text-left text-gray-700 hover:text-blue-600 font-medium cursor-pointer transition-colors duration-200"
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleLogout();
                                                setIsMenuOpen(false);
                                            }
                                        }}
                                    >
                                        <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                                        </svg>
                                        Sign out
                                    </div>
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
                                    className="bg-gradient-to-r from-blue-500 to-blue-700 text-white block px-4 py-3 rounded-md text-base font-medium my-2 mx-4 shadow-md"
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