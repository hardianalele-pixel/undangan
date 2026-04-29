import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export function ProtectedRoute() {
    const isAuthenticated = localStorage.getItem('lathe_auth') === 'true';

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
