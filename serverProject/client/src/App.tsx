import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './styles/global.css';
import Login from './login';      // ודאי שיש לך קובץ כזה בתיקיית src
import RegisterPage from './register'; // דף רישום חדש
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* דף ההתחברות */}
        <Route path="/login" element={<Login />} />
        
        {/* דף ההרשמה */}
        <Route path="/register" element={<RegisterPage />} />

        {/* דפי לוח בקרה לפי תפקיד */}
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/student" element={<StudentDashboard />} />

        {/* ברירת מחדל: אם המשתמש נכנס לנתיב לא מוכר, הוא יופנה ל-Login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;