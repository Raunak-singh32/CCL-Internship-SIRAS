import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data.data || res.data);
    } catch (err) {
      alert('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: '#4a5568' }}>Loading profile...</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#f7fafc', padding: '24px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ margin: '0 0 20px 0', color: '#1e3a5f', fontSize: '22px' }}>My Profile</h2>
        
        <div style={{ background: '#fff', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', padding: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px', fontSize: '15px' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#718096', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>Name</div>
              <div style={{ color: '#2d3748', fontWeight: 600 }}>{user?.name || 'N/A'}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#718096', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>Email</div>
              <div style={{ color: '#2d3748', fontWeight: 600 }}>{user?.email || 'N/A'}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#718096', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>Role</div>
              <div style={{ 
                display: 'inline-block', 
                padding: '4px 12px', 
                borderRadius: '999px', 
                fontSize: '12px', 
                fontWeight: 600, 
                backgroundColor: '#1e3a5f', 
                color: '#fff',
                textTransform: 'capitalize'
              }}>
                {user?.role || 'User'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#718096', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>Employee ID</div>
              <div style={{ color: '#2d3748', fontWeight: 600 }}>{user?.employeeId || 'N/A'}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#718096', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>Department</div>
              <div style={{ color: '#2d3748', fontWeight: 600 }}>{user?.department || 'N/A'}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#718096', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>Mine</div>
              <div style={{ color: '#2d3748', fontWeight: 600 }}>{user?.mine || 'N/A'}</div>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <div style={{ fontSize: '12px', color: '#718096', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>Joined</div>
              <div style={{ color: '#2d3748', fontWeight: 600 }}>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN') : 'N/A'}</div>
            </div>
          </div>

          <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
            <button
              onClick={() => navigate('/')}
              style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #cbd5e0', background: '#fff', color: '#4a5568', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}