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

const StudentDashboard = () => {
    const [assignmentId, setAssignmentId] = useState('');
    const [githubLink, setGithubLink] = useState('');
    const [partnerId, setPartnerId] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [openAssignments, setOpenAssignments] = useState<Assignment[]>([]);
    const [mySubmissions, setMySubmissions] = useState<Submission[]>([]);
    const [activeTab, setActiveTab] = useState('submit');
    const navigate = useNavigate();
    const studentId = localStorage.getItem('userId') || 'me';

    useEffect(() => {
        fetchOpenAssignments();
        fetchMySubmissions();
    }, []);

    const fetchOpenAssignments = async () => {
        try {
            const res = await API.get('/student/assignment');
            setOpenAssignments(res.data);
        } catch (err) {
            console.error('שגיאה בטעינת מטלות פתוחות');
        }
    };

    const fetchMySubmissions = async () => {
        try {
            const res = await API.get('/student/submissions/me');
            if (res.data && res.data.submissions) {
                setMySubmissions(res.data.submissions);
            } else {
                setMySubmissions([]);
            }
        } catch (err: any) {
            setMySubmissions([]);
        }
    };

    const handleSubmit = async () => {
        if (!assignmentId || !githubLink) {
            alert('אנא מלא את כל השדות החובה');
            return;
        }
        
        setIsSubmitting(true);
        try {
            const response = await API.post('/student/submissions', { 
                assignmentId, 
                githubLink, 
                partnerId: partnerId || undefined 
            });
            alert("המטלה הוגשה בהצלחה!");
            setAssignmentId('');
            setGithubLink('');
            setPartnerId('');
            // רענון ההגשות מיד אחרי הגשה
            await fetchMySubmissions();
        } catch (err: any) {
            alert("שגיאה בהגשה: " + (err.response?.data?.error || 'שגיאה כללית'));
        } finally {
            setIsSubmitting(false);
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
                    <h3>לוח בקרה סטודנט</h3>
                    <button className="btn" onClick={handleLogout} style={{ width: 'auto', padding: '10px 20px' }}>
                        התנתקות
                    </button>
                </div>
                
                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                    <button 
                        className={`btn ${activeTab === 'submit' ? '' : 'btn-secondary'}`}
                        onClick={() => setActiveTab('submit')}
                        style={{ width: 'auto', padding: '10px 20px' }}
                    >
                        הגשת מטלה
                    </button>
                    <button 
                        className={`btn ${activeTab === 'assignments' ? '' : 'btn-secondary'}`}
                        onClick={() => setActiveTab('assignments')}
                        style={{ width: 'auto', padding: '10px 20px' }}
                    >
                        מטלות פתוחות
                    </button>
                    <button 
                        className={`btn ${activeTab === 'mySubmissions' ? '' : 'btn-secondary'}`}
                        onClick={() => setActiveTab('mySubmissions')}
                        style={{ width: 'auto', padding: '10px 20px' }}
                    >
                        ההגשות שלי
                    </button>
                </div>

                {activeTab === 'submit' && (
                    <div>
                        <h4 style={{ marginBottom: '15px', color: '#4a5568' }}>הגשת מטלה חדשה</h4>
                        
                        <div className="form-group">
                            <input 
                                placeholder="קוד מטלה" 
                                value={assignmentId}
                                onChange={e => setAssignmentId(e.target.value)} 
                            />
                        </div>
                        
                        <div className="form-group">
                            <input 
                                placeholder="קישור לגיטהאב" 
                                value={githubLink}
                                onChange={e => setGithubLink(e.target.value)} 
                            />
                        </div>
                        
                        <div className="form-group">
                            <input 
                                placeholder="תעודת זהות שותף (אופציונלי)" 
                                value={partnerId}
                                onChange={e => setPartnerId(e.target.value)} 
                            />
                        </div>
                        
                        <button 
                            className="btn btn-secondary" 
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'שולח...' : 'שלח מטלה'}
                        </button>
                        
                        <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(102, 126, 234, 0.1)', borderRadius: '10px' }}>
                            <h4 style={{ color: '#4a5568', marginBottom: '10px' }}>הוראות:</h4>
                            <ul style={{ textAlign: 'right', color: '#666' }}>
                                <li>הכנס את קוד המטלה שקיבלת מהמורה</li>
                                <li>הדבק קישור מלא למשתוף הגיטהאב שלך</li>
                                <li>אם עובד בצוות, הכנס את תעודת הזהות של השותף</li>
                                <li>ודא שהמשתוף ציבורי ונגיש</li>
                            </ul>
                        </div>
                    </div>
                )}

                {activeTab === 'assignments' && (
                    <div>
                        <h4 style={{ marginBottom: '15px', color: '#4a5568' }}>מטלות פתוחות להגשה</h4>
                        {openAssignments.length > 0 ? (
                            <ul className="submissions-list">
                                {openAssignments.map((assignment) => (
                                    <li key={assignment.Id} className="submission-item">
                                        <div>
                                            <div><strong>קוד:</strong> {assignment.Id}</div>
                                            <div><strong>כותרת:</strong> {assignment.title}</div>
                                            <div><strong>תיאור:</strong> {assignment.description}</div>
                                            <div><strong>תאריך הגשה:</strong> {new Date(assignment.dueDate).toLocaleDateString('he-IL')}</div>
                                        </div>
                                        <button 
                                            className="btn btn-secondary" 
                                            onClick={() => {
                                                setAssignmentId(assignment.Id);
                                                setActiveTab('submit');
                                            }}
                                            style={{ width: 'auto', padding: '8px 16px' }}
                                        >
                                            הגש
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p style={{ textAlign: 'center', color: '#666' }}>אין מטלות פתוחות כרגע</p>
                        )}
                    </div>
                )}

                {activeTab === 'mySubmissions' && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <h4 style={{ color: '#4a5568', margin: 0 }}>ההגשות שלי</h4>
                            <button 
                                className="btn btn-secondary" 
                                onClick={fetchMySubmissions}
                                style={{ width: 'auto', padding: '8px 16px' }}
                            >
                                רענן
                            </button>
                        </div>
                        <div style={{ marginBottom: '10px', fontSize: '14px', color: '#666' }}>
                            סה"כ הגשות: {mySubmissions.length}
                        </div>
                        {mySubmissions.length > 0 ? (
                            <ul className="submissions-list">
                                {mySubmissions.map((submission) => (
                                    <li key={submission._id} className="submission-item">
                                        <div>
                                            <div><strong>קוד מטלה:</strong> {submission.assignmentId}</div>
                                            {submission.partnerId && <div><strong>שותף:</strong> {submission.partnerId}</div>}
                                            <div><strong>תאריך הגשה:</strong> {new Date(submission.submissionDate).toLocaleDateString('he-IL')}</div>
                                            {submission.grade !== undefined && submission.grade !== null ? (
                                                <div style={{ color: submission.grade >= 60 ? '#38a169' : '#e53e3e' }}>
                                                    <strong>ציון:</strong> {submission.grade}
                                                </div>
                                            ) : (
                                                <div style={{ color: '#f6ad55' }}>
                                                    <strong>סטטוס:</strong> ממתין בדיקה
                                                </div>
                                            )}
                                            {submission.feedback && (
                                                <div style={{ marginTop: '10px', padding: '10px', background: 'rgba(102, 126, 234, 0.1)', borderRadius: '5px' }}>
                                                    <strong>משוב מהמורה:</strong><br/>
                                                    {submission.feedback}
                                                </div>
                                            )}
                                        </div>
                                        <a href={submission.githubLink} target="_blank" rel="noopener noreferrer">
                                            צפה בקוד
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p style={{ textAlign: 'center', color: '#666' }}>עדיין לא הגשת מטלות</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;