import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { progressAPI, materialAPI, examAPI } from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState({ overall: 0, subjects: {} });
  const [materials, setMaterials] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [progressRes, materialRes, examRes] = await Promise.all([
        progressAPI.getProgress(),
        materialAPI.getAll({ limit: 5 }),
        examAPI.getAll({ isActive: true })
      ]);
      setProgress(progressRes.data.data);
      setMaterials(materialRes.data.data);
      setExams(examRes.data.data.slice(0, 5));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container"><p>Loading...</p></div>;

  return (
    <div className="container" style={{ paddingBottom: '60px' }}>
      <div style={{ marginBottom: '40px', marginTop: '30px' }}>
        <h1 style={{ fontSize: '36px', marginBottom: '8px' }}>Welcome, {user?.name}!</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '18px', fontWeight: '500' }}>Your personalized exam preparation dashboard.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        <div className="card" style={{ background: 'linear-gradient(135deg, #ffffff, #f0f4ff)', borderColor: '#e0e7ff' }}>
          <h3 style={{ fontSize: '15px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>Overall Preparation</h3>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '48px', fontWeight: '800', lineHeight: 1 }}>{progress.overall}%</span>
            <span style={{ fontSize: '14px', color: 'var(--success)', fontWeight: '700' }}>Ready</span>
          </div>
          <div className="progress-bar" style={{ marginTop: '20px', height: '12px' }}>
            <div className="progress-bar-fill" style={{ width: `${progress.overall}%` }}></div>
          </div>
        </div>

        <Link to="/materials" style={{ textDecoration: 'none' }}>
          <div className="card">
            <h3 style={{ fontSize: '15px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>Study Vault</h3>
            <div style={{ fontSize: '48px', fontWeight: '800', lineHeight: 1 }}>{materials.length}</div>
            <p style={{ fontSize: '15px', color: 'var(--text-muted)', marginTop: '12px', fontWeight: '500' }}>Premium study guides</p>
          </div>
        </Link>

        <Link to="/quiz" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ background: 'linear-gradient(135deg, var(--accent) 0%, var(--primary) 100%)', borderColor: 'transparent' }}>
            <h3 style={{ fontSize: '15px', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px', background: 'none', WebkitTextFillColor: 'white' }}>Performance Test</h3>
            <div style={{ fontSize: '32px', fontWeight: '800', color: 'white', lineHeight: 1 }}>Start Quiz</div>
            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.8)', marginTop: '16px', fontWeight: '500' }}>Challenge yourself</p>
          </div>
        </Link>

        <Link to="/timetable" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ background: '#fffbeb', borderColor: '#fef3c7' }}>
            <h3 style={{ fontSize: '15px', color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>Exam Calendar</h3>
            <div style={{ fontSize: '48px', fontWeight: '800', color: '#92400e', lineHeight: 1 }}>{exams.length}</div>
            <p style={{ fontSize: '15px', color: '#b45309', marginTop: '12px', fontWeight: '500' }}>Upcoming milestones</p>
          </div>
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px' }}>
        <div className="card">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '20px' }}>Subject Mastery</h3>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>BY TOPIC</span>
          </div>
          <div style={{ marginTop: '20px' }}>
            {Object.keys(progress.subjects).length > 0 ? (
              Object.entries(progress.subjects).map(([subject, data]) => (
                <div key={subject} style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: '700', fontSize: '15px', color: 'var(--text-main)' }}>{subject}</span>
                    <span style={{ fontWeight: '800', fontSize: '14px', color: 'var(--accent)' }}>{data.percentage}%</span>
                  </div>
                  <div className="progress-bar" style={{ height: '8px' }}>
                    <div className="progress-bar-fill" style={{ 
                      width: `${data.percentage}%`, 
                      background: data.percentage >= 75 ? 'var(--success)' : data.percentage >= 50 ? 'var(--warning)' : 'var(--error)' 
                    }}></div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: '40px', marginBottom: '16px' }}>📚</div>
                <p style={{ color: 'var(--text-muted)', fontWeight: '500' }}>No progress recorded yet. Start your journey today!</p>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '20px' }}>Exam Alerts</h3>
            <Link to="/timetable" style={{ fontSize: '13px', fontWeight: '700', color: 'var(--accent)' }}>VIEW ALL</Link>
          </div>
          <div style={{ marginTop: '10px' }}>
            {exams.length > 0 ? (
              exams.map(exam => (
                <div key={exam._id} style={{ padding: '16px 0', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: '700', color: 'var(--primary)', fontSize: '16px', marginBottom: '4px' }}>{exam.examName}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '500' }}>
                      {new Date(exam.examDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                  <span className="badge badge-info" style={{ borderRadius: '6px' }}>{exam.examType}</span>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: '40px', marginBottom: '16px' }}>🔔</div>
                <p style={{ color: 'var(--text-muted)', fontWeight: '500' }}>No active exam alerts at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
