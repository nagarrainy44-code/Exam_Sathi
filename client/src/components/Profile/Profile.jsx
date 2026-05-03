import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: user?.name || '', course: user?.course || '', semester: user?.semester || '' });
  const [message, setMessage] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await authAPI.updateProfile(formData);
      updateUser(data.data);
      setEditing(false);
      setMessage('Profile updated successfully');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Update failed');
    }
  };

  if (!user) return null;

  return (
    <div className="container" style={{ maxWidth: '600px' }}>
      <h1 style={{ marginBottom: '24px' }}>My Profile</h1>

      {message && <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>{message}</div>}

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 'bold' }}>
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '24px' }}>{user.name}</h2>
              <p style={{ color: 'var(--text-muted)', margin: 0 }}>{user.email}</p>
            </div>
          </div>
          {!editing && <button className="btn btn-outline btn-sm" onClick={() => setEditing(true)}>Edit</button>}
        </div>

        {editing ? (
          <form onSubmit={handleUpdate}>
            <div className="form-group">
              <label>Name</label>
              <input type="text" className="form-control" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>Course</label>
                <input type="text" className="form-control" value={formData.course} onChange={(e) => setFormData({ ...formData, course: e.target.value })} placeholder="e.g. B.Tech" />
              </div>

              <div className="form-group">
                <label>Semester</label>
                <input type="text" className="form-control" value={formData.semester} onChange={(e) => setFormData({ ...formData, semester: e.target.value })} placeholder="e.g. 4th" />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" className="btn btn-primary">Save Changes</button>
              <button type="button" className="btn btn-outline" onClick={() => { setEditing(false); setFormData({ name: user.name, course: user.course, semester: user.semester }); }}>Cancel</button>
            </div>
          </form>
        ) : (
          <div>
            <div style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Phone</span>
              <p style={{ margin: '4px 0 0', fontWeight: '500' }}>{user.phone || 'Not provided'}</p>
            </div>
            <div style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Course</span>
              <p style={{ margin: '4px 0 0', fontWeight: '500' }}>{user.course || 'Not provided'}</p>
            </div>
            <div style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Semester</span>
              <p style={{ margin: '4px 0 0', fontWeight: '500' }}>{user.semester || 'Not provided'}</p>
            </div>
            <div style={{ padding: '12px 0' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Role</span>
              <p style={{ margin: '4px 0 0', fontWeight: '500' }}><span className="badge badge-info">{user.role}</span></p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
