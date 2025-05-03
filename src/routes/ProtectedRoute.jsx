import React from 'react';
import { useAppSelector } from '../app/hooks';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, roles }) => {
    const { isAuthenticated, user } = useAppSelector((state) => state.auth);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (roles && user && user.roles) {
        const hasRole = user.roles.some((role) => roles.includes(role));
        if (!hasRole) {
            return <div className="text-center text-red-500 mt-10">Unauthorized: You do not have access to this page.</div>;
        }
    }

    return children;
};

export default ProtectedRoute; 