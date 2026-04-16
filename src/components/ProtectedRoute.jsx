import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getSession } from '../apiClient';

const ProtectedRoute = ({ children }) => {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkSession = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setSession(null);
                setLoading(false);
                return;
            }
            const data = await getSession();
            if (data.valid) {
                setSession(data.user);
            } else {
                localStorage.removeItem('token');
                setSession(null);
            }
            setLoading(false);
        };
        checkSession();
    }, []);

    if (loading) {
        return <div style={{
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: '#050505',
            color: 'rgba(255,255,255,0.5)'
        }}>Authorization Check...</div>;
    }

    if (!session) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
