import React, { useState } from 'react';
import { login } from '../apiClient';
import { useNavigate } from 'react-router-dom';
import '../styles/Admin.css'; // Reusing admin styles for consistent theme

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const data = await login(email, password);

        if (data.error) {
            setError(data.error);
        } else {
            navigate('/admin');
        }
        setLoading(false);
    };

    return (
        <div className="admin-page-wrapper" style={{ justifyContent: 'center', alignItems: 'center' }}>
            <div className="card shadow-glass" style={{ width: '400px', padding: '40px' }}>
                <div className="sidebar-brand" style={{ justifyContent: 'center', marginBottom: '30px' }}>
                    <span className="brand-dot"></span>
                    <h2 style={{ fontSize: '20px' }}>ADMIN ACCESS</h2>
                </div>

                <form onSubmit={handleLogin} className="admin-form-enhanced" style={{ padding: 0 }}>
                    <div className="input-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="admin@tiesverse.com"
                        />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                        />
                    </div>

                    {error && <div style={{ color: '#ff4d4d', fontSize: '12px', textAlign: 'center' }}>{error}</div>}

                    <button type="submit" className="btn-save" disabled={loading}>
                        {loading ? 'Authenticating...' : 'ENTER CONTROL CENTER'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
