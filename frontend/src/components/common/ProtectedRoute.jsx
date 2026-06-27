import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'

export const ProtectedRoute = ({ allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className='flex justify-center p-25'>
                <div className='loader'></div>
            </div>
        )
    }

    const isGuestAllowed = allowedRoles?.includes(undefined);

    if (!user) {
        if (isGuestAllowed) {
            return <Outlet />;
        }
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        if (user.role === 'admin')
            return <Navigate to="/admin-dashboard" replace />;
        if (user.role === 'seller')
            return <Navigate to='/dashboard' replace />;
        return <Navigate to='/' replace />;
    }

    return <Outlet />;
}

// public route
export const PublicRoute = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className='flex justify-center p-25'>
                <div className='loader'></div>
            </div>
        )
    }

    if (user) {
        if (user.role === 'admin')
            return <Navigate to="/admin-dashboard" replace />;
        if (user.role === 'seller')
            return <Navigate to='/dashboard' replace />;
        return <Navigate to='/' replace />;
    }

    return <Outlet />;
}