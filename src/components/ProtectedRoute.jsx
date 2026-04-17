import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
<<<<<<< HEAD
import { supabase } from '../supabaseClient';
=======
import { getSession } from '../apiClient';
>>>>>>> node-krisjscott

const ProtectedRoute = ({ children }) => {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
<<<<<<< HEAD
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
=======
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
>>>>>>> node-krisjscott
    }, []);

    if (loading) {
        return <div style={{
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: '#050505',
<<<<<<< HEAD
            color: '#rgba(255,255,255,0.5)'
=======
            color: 'rgba(255,255,255,0.5)'
>>>>>>> node-krisjscott
        }}>Authorization Check...</div>;
    }

    if (!session) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
