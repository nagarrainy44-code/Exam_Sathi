import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '400px', marginTop: '60px' }}>
      <div className="card">
        <div className="card-header">
          <h2 style={{ fontSize: '24px', margin: 0 }}>Login</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: '4px 0 0' }}>Access your Exam Saathi account</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" className="form-control" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required placeholder="Enter your email" />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" className="form-control" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required placeholder="Enter your password" />
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px' }}>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
