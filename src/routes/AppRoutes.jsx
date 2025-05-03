import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import TeamLeavesPage from '../pages/TeamLeavesPage';
import ProtectedRoute from './ProtectedRoute';
import AdminDashboard from '../components/admin/AdminDashboard';
import UserProfile from '../components/UserProfile';
import TeamLeaves from '../components/TeamLeaves';
import Navbar from '../components/Navbar';

const AppRoutesInner = () => {
    const location = useLocation();
    const hideNavbar = ['/login', '/register'].includes(location.pathname);
    return (
        <>
            <Toaster position="top-right" />
            {!hideNavbar && <Navbar />}
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/dashboard" element={
                    <ProtectedRoute roles={['STAFF']}>
                        <DashboardPage />
                    </ProtectedRoute>
                } />
                <Route path="/team-leaves" element={
                    <ProtectedRoute roles={['MANAGER', 'ADMIN']}>
                        <TeamLeavesPage />
                    </ProtectedRoute>
                } />
                <Route path="/admin/*" element={
                    <ProtectedRoute roles={['ADMIN', 'MANAGER']}>
                        <AdminDashboard />
                    </ProtectedRoute>
                } />
                <Route path="/profile" element={
                    <ProtectedRoute>
                        <UserProfile />
                    </ProtectedRoute>
                } />
                <Route path="/team-leaves-direct" element={
                    <ProtectedRoute roles={['MANAGER', 'ADMIN']}>
                        <TeamLeaves />
                    </ProtectedRoute>
                } />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </>
    );
};

const AppRoutes = () => (
    <Router>
        <AppRoutesInner />
    </Router>
);

export default AppRoutes; 