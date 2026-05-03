import { useState, useEffect } from 'react';
import { examAPI } from '../services/api';

const Timetable = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const examTypes = ['All', 'UPSC', 'SSC', 'Banking', 'Railways', 'State PSC', 'Defense'];

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const { data } = await examAPI.getAll({ isActive: true });
      setExams(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredExams = filter === 'All' || filter === '' ? exams : exams.filter(e => e.examType === filter);

  const getStatus = (exam) => {
    const now = new Date();
    const appEnd = new Date(exam.applicationEnd);
    const examDate = new Date(exam.examDate);
    
    if (now > examDate) return { label: 'Completed', class: 'badge-success' };
    if (now > appEnd) return { label: 'Closed', class: 'badge-danger' };
    if (appEnd - now < 7 * 24 * 60 * 60 * 1000) return { label: 'Closing Soon', class: 'badge-danger' };
    return { label: 'Open', class: 'badge-success' };
  };

  return (
    <div className="container">
      <h1 style={{ marginBottom: '24px' }}>Exam Timetable</h1>

      <div className="card" style={{ marginBottom: '32px', background: 'var(--bg-main)', border: '1px solid var(--border-light)', padding: '16px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {examTypes.map(type => (
            <button key={type} className="btn btn-sm" style={{ 
              backgroundColor: filter === type ? 'var(--primary)' : 'transparent',
              color: filter === type ? 'white' : 'var(--text-main)',
              borderRadius: 'var(--radius-sm)',
              fontWeight: '700',
              border: filter === type ? 'none' : '1px solid var(--border-light)'
            }} onClick={() => setFilter(type)}>{type}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <p>Loading exams...</p>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Exam Name</th>
                <th>Type</th>
                <th>Application Start</th>
                <th>Application End</th>
                <th>Exam Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredExams.map(exam => {
                const status = getStatus(exam);
                return (
                  <tr key={exam._id}>
                    <td>
                      <div style={{ fontWeight: '600', color: 'var(--primary)' }}>{exam.examName}</div>
                      {exam.vacancies && <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Vacancies: {exam.vacancies}</div>}
                    </td>
                    <td><span className="badge badge-info">{exam.examType}</span></td>
                    <td>{exam.applicationStart ? new Date(exam.applicationStart).toLocaleDateString() : '-'}</td>
                    <td>{exam.applicationEnd ? new Date(exam.applicationEnd).toLocaleDateString() : '-'}</td>
                    <td>{exam.examDate ? new Date(exam.examDate).toLocaleDateString() : '-'}</td>
                    <td><span className={`badge ${status.class}`}>{status.label}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredExams.length === 0 && <p style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No exams found</p>}
        </div>
      )}
    </div>
  );
};

export default Timetable;
