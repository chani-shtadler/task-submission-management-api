import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

interface Assignment {
    Id: string;
    title: string;
    description: string;
    dueDate: string;
}

interface Submission {
    _id: string;
    assignmentId: string;
    studentId: string;
    githubLink: string;
    partnerId?: string;
    grade?: number;
    feedback?: string;
    submissionDate: string;
}

const TeacherDashboard = () => {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [selectedAssignment, setSelectedAssignment] = useState('');
    const [newAssignment, setNewAssignment] = useState({ Id: '', title: '', description: '', dueDate: '' });
    const [gradeData, setGradeData] = useState({ studentId: '', assignmentId: '', grade: '', feedback: '' });
    const [averageData, setAverageData] = useState({ studentId: '', average: null });
    const [activeTab, setActiveTab] = useState('assignments');
    const navigate = useNavigate();

    const fetchSubmissions = async (assignmentId: string) => {
        try {
            const res = await API.get(`/teacher/submissions/${assignmentId}`);
            setSubmissions(res.data);
        } catch (err) {
            alert("לא נמצאו הגשות");
        }
    };

    const createAssignment = async () => {
        try {
            await API.post('/teacher/assignments', newAssignment);
            alert('מטלה נוצרה בהצלחה!');
            setNewAssignment({ Id: '', title: '', description: '', dueDate: '' });
        } catch (err) {
            alert('שגיאה ביצירת מטלה');
        }
    };

    const submitGrade = async () => {
        try {
            await API.put(`/teacher/submissions/${gradeData.studentId}/${gradeData.assignmentId}`, {
                grade: gradeData.grade,
                feedback: gradeData.feedback
            });
            alert('ציון ומשוב נשמרו בהצלחה!');
            setGradeData({ studentId: '', assignmentId: '', grade: '', feedback: '' });
            if (selectedAssignment) fetchSubmissions(selectedAssignment);
        } catch (err) {
            alert('שגיאה בשמירת ציון');
        }
    };

    const getAverage = async () => {
        if (!averageData.studentId) {
            alert('אנא הכנס תעודת זהות של סטודנט');
            return;
        }
        try {
            // ננסה עם POST כי GET עם body לא עובד
            const res = await API.post('/teacher/stats/averages', {
                studentId: averageData.studentId
            });
            setAverageData({ ...averageData, average: res.data });
            alert('ממוצע הסטודנט: ' + res.data);
        } catch (err: any) {
            alert('שגיאה בקבלת ממוצע: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
        navigate('/login');
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3>לוח בקרה מורה</h3>
                    <button className="btn" onClick={handleLogout} style={{ width: 'auto', padding: '10px 20px' }}>
                        התנתקות
                    </button>
                </div>
                
                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                    <button 
                        className={`btn ${activeTab === 'assignments' ? '' : 'btn-secondary'}`}
                        onClick={() => setActiveTab('assignments')}
                        style={{ width: 'auto', padding: '10px 20px' }}
                    >
                        מטלות
                    </button>
                    <button 
                        className={`btn ${activeTab === 'submissions' ? '' : 'btn-secondary'}`}
                        onClick={() => setActiveTab('submissions')}
                        style={{ width: 'auto', padding: '10px 20px' }}
                    >
                        הגשות
                    </button>
                    <button 
                        className={`btn ${activeTab === 'grading' ? '' : 'btn-secondary'}`}
                        onClick={() => setActiveTab('grading')}
                        style={{ width: 'auto', padding: '10px 20px' }}
                    >
                        מתן ציונים
                    </button>
                    <button 
                        className={`btn ${activeTab === 'stats' ? '' : 'btn-secondary'}`}
                        onClick={() => setActiveTab('stats')}
                        style={{ width: 'auto', padding: '10px 20px' }}
                    >
                        סטטיסטיקות
                    </button>
                </div>

                {activeTab === 'assignments' && (
                    <div>
                        <h4 style={{ marginBottom: '15px', color: '#4a5568' }}>יצירת מטלה חדשה</h4>
                        <div className="form-group">
                            <input 
                                placeholder="קוד מטלה" 
                                value={newAssignment.Id}
                                onChange={e => setNewAssignment({...newAssignment, Id: e.target.value})} 
                            />
                        </div>
                        <div className="form-group">
                            <input 
                                placeholder="כותרת המטלה" 
                                value={newAssignment.title}
                                onChange={e => setNewAssignment({...newAssignment, title: e.target.value})} 
                            />
                        </div>
                        <div className="form-group">
                            <input 
                                placeholder="תיאור המטלה" 
                                value={newAssignment.description}
                                onChange={e => setNewAssignment({...newAssignment, description: e.target.value})} 
                            />
                        </div>
                        <div className="form-group">
                            <input 
                                type="date" 
                                placeholder="תאריך הגשה" 
                                value={newAssignment.dueDate}
                                onChange={e => setNewAssignment({...newAssignment, dueDate: e.target.value})} 
                            />
                        </div>
                        <button className="btn btn-secondary" onClick={createAssignment}>
                            צור מטלה
                        </button>
                    </div>
                )}

                {activeTab === 'submissions' && (
                    <div>
                        <div className="search-section">
                            <input 
                                placeholder="קוד מטלה לחיפוש" 
                                value={selectedAssignment}
                                onChange={e => setSelectedAssignment(e.target.value)} 
                            />
                            <button className="btn btn-secondary" onClick={() => fetchSubmissions(selectedAssignment)}>
                                הצג הגשות
                            </button>
                        </div>
                        
                        {submissions.length > 0 && (
                            <div>
                                <h4 style={{ marginBottom: '15px', color: '#4a5568' }}>הגשות שנמצאו:</h4>
                                <ul className="submissions-list">
                                    {submissions.map((s: any) => (
                                        <li key={s._id} className="submission-item">
                                            <div>
                                                <div><strong>סטודנט:</strong> {s.studentId}</div>
                                                {s.partnerId && <div><strong>שותף:</strong> {s.partnerId}</div>}
                                                <div><strong>תאריך הגשה:</strong> {new Date(s.submissionDate).toLocaleDateString('he-IL')}</div>
                                                {s.grade && <div><strong>ציון:</strong> {s.grade}</div>}
                                                {s.feedback && <div><strong>משוב:</strong> {s.feedback}</div>}
                                            </div>
                                            <a href={s.githubLink} target="_blank" rel="noopener noreferrer">
                                                צפה בקוד
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'grading' && (
                    <div>
                        <h4 style={{ marginBottom: '15px', color: '#4a5568' }}>מתן ציון ומשוב</h4>
                        <div className="form-group">
                            <input 
                                placeholder="תעודת זהות סטודנט" 
                                value={gradeData.studentId}
                                onChange={e => setGradeData({...gradeData, studentId: e.target.value})} 
                            />
                        </div>
                        <div className="form-group">
                            <input 
                                placeholder="קוד מטלה" 
                                value={gradeData.assignmentId}
                                onChange={e => setGradeData({...gradeData, assignmentId: e.target.value})} 
                            />
                        </div>
                        <div className="form-group">
                            <input 
                                type="number" 
                                placeholder="ציון (0-100)" 
                                min="0" 
                                max="100"
                                value={gradeData.grade}
                                onChange={e => setGradeData({...gradeData, grade: e.target.value})} 
                            />
                        </div>
                        <div className="form-group">
                            <textarea 
                                placeholder="משוב למטלה" 
                                value={gradeData.feedback}
                                onChange={e => setGradeData({...gradeData, feedback: e.target.value})}
                                style={{ minHeight: '100px', resize: 'vertical' }}
                            />
                        </div>
                        <button className="btn btn-secondary" onClick={submitGrade}>
                            שמור ציון ומשוב
                        </button>
                    </div>
                )}

                {activeTab === 'stats' && (
                    <div>
                        <h4 style={{ marginBottom: '15px', color: '#4a5568' }}>סטטיסטיקות סטודנט</h4>
                        <div className="search-section">
                            <input 
                                placeholder="תעודת זהות סטודנט" 
                                value={averageData.studentId}
                                onChange={e => setAverageData({...averageData, studentId: e.target.value})} 
                            />
                            <button className="btn btn-secondary" onClick={getAverage}>
                                הצג ממוצע
                            </button>
                        </div>
                        
                        {averageData.average !== null && (
                            <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(72, 187, 120, 0.1)', borderRadius: '10px' }}>
                                <h5 style={{ color: '#4a5568' }}>ממוצע הסטודנט: {averageData.average}</h5>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeacherDashboard;