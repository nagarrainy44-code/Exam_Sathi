import { useState, useEffect } from 'react';
import { materialAPI } from '../services/api';

const Materials = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ subject: '', examType: '' });

  const subjects = ['Mathematics', 'English', 'General Knowledge', 'Reasoning', 'Science', 'History', 'Geography', 'Polity'];
  const examTypes = ['UPSC', 'SSC', 'Banking', 'Railways', 'State PSC', 'Defense'];

  useEffect(() => {
    fetchMaterials();
  }, [filters]);

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const { data } = await materialAPI.getAll(filters);
      setMaterials(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (id, fileUrl) => {
    try {
      await materialAPI.incrementDownload(id);
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileUrl.split('/').pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  return (
    <div className="container">
      <h1 style={{ marginBottom: '24px' }}>Study Materials</h1>

      <div className="card" style={{ marginBottom: '32px', background: 'var(--bg-main)', border: '1px solid var(--border-light)', padding: '16px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {examTypes.map(type => (
            <button key={type} className="btn btn-sm" style={{ 
              backgroundColor: filters.examType === type ? 'var(--primary)' : 'transparent',
              color: filters.examType === type ? 'white' : 'var(--text-main)',
              borderRadius: 'var(--radius-sm)',
              fontWeight: '700',
              border: filters.examType === type ? 'none' : '1px solid var(--border-light)'
            }} onClick={() => setFilters({ ...filters, examType: type })}>{type}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <p>Loading materials...</p>
      ) : materials.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '32px' }}>
          {materials.map(material => (
            <div key={material._id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ 
                  background: 'rgba(99, 102, 241, 0.1)', 
                  color: 'var(--accent)', 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '10px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontWeight: '800',
                  fontSize: '12px'
                }}>
                  {material.fileType.toUpperCase()}
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <span className="badge badge-info" style={{ fontSize: '10px' }}>{material.subject}</span>
                </div>
              </div>
              
              <h3 style={{ fontSize: '18px', marginBottom: '12px', lineHeight: 1.4 }}>{material.title}</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px', flex: 1 }}>{material.description}</p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderTop: '1px solid var(--border-light)', marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)' }}>
                  📥 {material.downloads} Downloads
                </div>
                <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)' }}>
                  👁️ {material.views} Views
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => { materialAPI.getById(material._id); window.open(material.fileUrl, '_blank', 'noopener,noreferrer'); }} className="btn btn-outline btn-sm" style={{ flex: 1, borderRadius: 'var(--radius-md)' }}>View</button>
                <button onClick={() => handleDownload(material._id, material.fileUrl)} className="btn btn-primary btn-sm" style={{ flex: 1, borderRadius: 'var(--radius-md)' }}>Download</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: 'var(--text-muted)' }}>No materials found. Try adjusting your filters.</p>
        </div>
      )}
    </div>
  );
};

export default Materials;
