import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from './api';

const Login = () => {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await API.post('/auth/login', { _id: id, password });
            const { token, role } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('role', role);
            localStorage.setItem('userId', id);
            if (role === 'teacher') {
                navigate('/teacher');
            } else {
                navigate('/student');
            }
        } catch (err: any) {
            alert("שגיאה בהתחברות: " + (err.response?.data?.error || err.response?.data?.message || "בדקי שרת"));
        }
    };

    return (
        <div className="container">
            <div className="card">
                <h2>התחברות למערכת</h2>
                <div className="form-group">
                    <input 
                        placeholder="תעודת זהות" 
                        value={id}
                        onChange={(e) => setId(e.target.value)} 
                    />
                </div>
                <div className="form-group">
                    <input 
                        type="password" 
                        placeholder="סיסמה" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                </div>
                <button className="btn" onClick={handleLogin}>התחבר</button>
                <button 
                    className="link-btn" 
                    onClick={() => navigate('/register')}
                >
                    עדיין לא נרשמת? לחץ כאן להרשמה
                </button>
            </div>
        </div>
    );
};

export default Login;