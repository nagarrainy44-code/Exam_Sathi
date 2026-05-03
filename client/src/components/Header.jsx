import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header style={{ 
      background: 'rgba(255, 255, 255, 0.8)', 
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      color: 'var(--text-main)', 
      boxShadow: 'var(--shadow-sm)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      borderBottom: '1px solid var(--border-light)'
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '14px', color: 'var(--primary)' }}>
          <div style={{ 
            width: '44px', 
            height: '44px', 
            background: 'linear-gradient(135deg, var(--primary), var(--primary-light))', 
            borderRadius: '12px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontWeight: '800', 
            color: 'white',
            fontSize: '18px',
            boxShadow: 'var(--shadow-md)'
          }}>
            ES
          </div>
          <div>
            <h1 style={{ fontSize: '22px', margin: 0, color: 'var(--primary)', letterSpacing: '-0.03em' }}>Exam Saathi</h1>
            <p style={{ fontSize: '12px', margin: 0, color: 'var(--text-muted)', fontWeight: '500' }}>Premium Exam Prep</p>
          </div>
        </Link>

        <button className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ display: 'none', background: 'none', border: 'none', color: 'var(--primary)', fontSize: '24px', cursor: 'pointer' }}>
          &#9776;
        </button>

        <nav style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
          {user ? (
            <>
              <Link to="/dashboard" style={{ color: 'var(--text-main)', fontWeight: '600', fontSize: '15px' }}>Dashboard</Link>
              <Link to="/materials" style={{ color: 'var(--text-main)', fontWeight: '600', fontSize: '15px' }}>Materials</Link>
              <Link to="/quiz" style={{ color: 'var(--text-main)', fontWeight: '600', fontSize: '15px' }}>Quiz</Link>
              <Link to="/timetable" style={{ color: 'var(--text-main)', fontWeight: '600', fontSize: '15px' }}>Timetable</Link>
              {user.role === 'admin' && <Link to="/admin" style={{ color: 'var(--secondary-dark)', fontWeight: '700', fontSize: '15px' }}>Admin</Link>}
              <div style={{ width: '1px', height: '24px', background: 'var(--border)' }}></div>
              <Link to="/profile" style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '15px' }}>{user.name}</Link>
              <button onClick={handleLogout} className="btn btn-outline btn-sm" style={{ padding: '8px 16px', borderRadius: 'var(--radius-full)' }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: 'var(--text-main)', fontWeight: '600' }}>Login</Link>
              <Link to="/signup" className="btn btn-primary btn-sm" style={{ borderRadius: 'var(--radius-full)' }}>Get Started</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
