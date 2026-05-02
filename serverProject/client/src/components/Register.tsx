import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from "../api"

const Register: React.FC = () => {
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'teacher' | 'student'>('student');
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await API.post('/auth/register', { _id: id, name, password, email, role });
            alert('נרשמת בהצלחה! עכשיו אפשר להתחבר');
            navigate('/login');
        } catch (error: any) {
            console.error(error);
            const status = error.response?.status;
            const serverMsg = error.response?.data?.error || error.response?.data?.message || error.message;
            if (status === 500 && serverMsg && /duplicate key|E11000/i.test(serverMsg)) {
                alert('שגיאת שרת: נראה שסיסמה זו כבר קיימת במערכת — נסי סיסמה שונה');
            } else {
                alert('שגיאה בהרשמה: ' + (serverMsg || 'ודאי שהשרת עובד ושהפרטים תקינים'));
            }
        }
    };

    return (
        <div className="container">
            <div className="card">
                <h2>הרשמה למערכת</h2>
                <form onSubmit={handleRegister}>
                    <div className="form-group">
                        <input 
                            type="text" 
                            placeholder="תעודת זהות" 
                            value={id} 
                            onChange={(e) => setId(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <input 
                            type="text" 
                            placeholder="שם מלא" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <input 
                            type="email" 
                            placeholder='דוא"ל'
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <input 
                            type="password" 
                            placeholder="סיסמה" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <select value={role} onChange={(e) => setRole(e.target.value as 'teacher' | 'student')}>
                            <option value="student">סטודנט</option>
                            <option value="teacher">מורה</option>
                        </select>
                    </div>
                    <button type="submit" className="btn">הירשם</button>
                    <button 
                        type="button"
                        className="link-btn" 
                        onClick={() => navigate('/login')}
                    >
                        כבר רשום? לחץ כאן להתחברות
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;