import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Signup = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', course: '', semester: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '450px', marginTop: '40px' }}>
      <div className="card">
        <div className="card-header">
          <h2 style={{ fontSize: '24px', margin: 0 }}>Sign Up</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: '4px 0 0' }}>Create your Exam Saathi account</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" className="form-control" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required placeholder="Enter your full name" />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input type="email" className="form-control" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required placeholder="Enter your email" />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input type="tel" className="form-control" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="Enter your phone number" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label>Course</label>
              <input type="text" className="form-control" value={formData.course} onChange={(e) => setFormData({ ...formData, course: e.target.value })} placeholder="e.g. B.Tech" />
            </div>

            <div className="form-group">
              <label>Semester</label>
              <input type="text" className="form-control" value={formData.semester} onChange={(e) => setFormData({ ...formData, semester: e.target.value })} placeholder="e.g. 4th" />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" className="form-control" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required minLength={6} placeholder="Minimum 6 characters" />
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px' }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
