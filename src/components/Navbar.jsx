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
        return location.pathname === path ? 'text-blue-600 font-medium' : 'text-gray-500';
    };

    return (
        <nav className="bg-white shadow-sm border-b border-gray-100">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center">
                            <svg className="h-8 w-8 text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 12H20M12 4V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span className="ml-2 text-xl font-semibold text-blue-600">Leave Management</span>
                        </Link>
                    </div>

                    {/* Desktop navigation */}
                    <div className="hidden md:flex md:items-center md:space-x-6">
                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/dashboard"
                                    className={`${isActive('/dashboard')} hover:text-blue-600 transition-colors px-3 py-2 rounded-md text-sm font-medium`}
                                >
                                    Dashboard
                                </Link>
                                {user.roles && user.roles.includes('MANAGER') && (
                                    <Link
                                        to="/team-leaves"
                                        className={`${isActive('/team-leaves')} hover:text-blue-600 transition-colors px-3 py-2 rounded-md text-sm font-medium`}
                                    >
                                        Team Leaves
                                    </Link>
                                )}
                                {user.roles && (user.roles.includes('ADMIN') || user.roles.includes('MANAGER')) && (
                                    <Link
                                        to="/admin"
                                        className={`${isActive('/admin')} hover:text-blue-600 transition-colors px-3 py-2 rounded-md text-sm font-medium`}
                                    >
                                        Admin
                                    </Link>
                                )}
                                <div className="relative ml-3">
                                    <div>
                                        <button 
                                            className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            onClick={() => navigate('/profile')}
                                        >
                                            <span className="sr-only">Open user menu</span>
                                            {user.profilePicture ? (
                                                <img className="h-8 w-8 rounded-full" src={user.profilePicture} alt="User profile" />
                                            ) : (
                                                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                                                    {user.firstName && user.firstName[0]}
                                                    {user.lastName && user.lastName[0]}
                                                </div>
                                            )}
                                            <span className="ml-2 text-gray-700">{user.firstName}</span>
                                        </button>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-50 text-red-600 hover:bg-red-100 transition-colors px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className={`${isActive('/login')} hover:text-blue-600 transition-colors px-3 py-2 rounded-md text-sm font-medium`}
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    Create Account
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
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
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/dashboard"
                                    className={`${isActive('/dashboard')} hover:bg-gray-50 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Dashboard
                                </Link>
                                {user.roles && user.roles.includes('MANAGER') && (
                                    <Link
                                        to="/team-leaves"
                                        className={`${isActive('/team-leaves')} hover:bg-gray-50 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium`}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Team Leaves
                                    </Link>
                                )}
                                {user.roles && (user.roles.includes('ADMIN') || user.roles.includes('MANAGER')) && (
                                    <Link
                                        to="/admin"
                                        className={`${isActive('/admin')} hover:bg-gray-50 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium`}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Admin
                                    </Link>
                                )}
                                <div className="px-3 py-2 flex items-center">
                                    {user.profilePicture ? (
                                        <img className="h-8 w-8 rounded-full mr-2" src={user.profilePicture} alt="User profile" />
                                    ) : (
                                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium mr-2">
                                            {user.firstName && user.firstName[0]}
                                            {user.lastName && user.lastName[0]}
                                        </div>
                                    )}
                                    <Link
                                        to="/profile"
                                        className={`${isActive('/profile')} hover:bg-gray-50 hover:text-blue-600 block px-2 rounded-md text-base font-medium`}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Profile
                                    </Link>
                                </div>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setIsMenuOpen(false);
                                    }}
                                    className="text-red-600 bg-red-50 hover:bg-red-100 block w-full text-left px-3 py-2 rounded-md text-base font-medium"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className={`${isActive('/login')} hover:bg-gray-50 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 block rounded-md text-base font-medium"
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