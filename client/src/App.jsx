import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Header from './components/Header';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Dashboard from './pages/Dashboard';
import Materials from './pages/Materials';
import Quiz from './pages/Quiz';
import Timetable from './pages/Timetable';
import Profile from './components/Profile/Profile';
import AdminDashboard from './components/Admin/AdminDashboard';

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="container"><p>Loading...</p></div>;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" />;
  
  return children;
};

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <Header />
      <main style={{ minHeight: 'calc(100vh - 160px)', padding: '20px 0' }}>
        <Routes>
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/materials" element={<PrivateRoute><Materials /></PrivateRoute>} />
          <Route path="/quiz" element={<PrivateRoute><Quiz /></PrivateRoute>} />
          <Route path="/timetable" element={<PrivateRoute><Timetable /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute adminOnly><AdminDashboard /></PrivateRoute>} />
        </Routes>
      </main>
      <footer style={{ background: 'var(--bg-main)', color: 'var(--text-muted)', padding: '40px 0', textAlign: 'center', borderTop: '1px solid var(--border-light)' }}>
        <div className="container">
          <p style={{ fontWeight: '600', fontSize: '14px', letterSpacing: '0.02em' }}>&copy; 2024 Exam Saathi &bull; Premium Education Platform</p>
          <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '13px', fontWeight: '500' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Contact Us</span>
          </div>
        </div>
      </footer>
    </Router>
  );
}

export default App;
