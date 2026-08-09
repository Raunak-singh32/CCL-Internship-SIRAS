import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, hasRole } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
  };

  return (
    <nav style={{
      backgroundColor: '#1e3a5f',
      color: 'white',
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 56,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: 18 }}>
          SIRAS-CCL
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <NavLink to="/" active={isActive('/')} label="Dashboard" />

        {hasRole(['admin', 'safety-officer', 'mine-manager']) && (
          <NavLink to="/analytics" active={isActive('/analytics')} label="Analytics" />
        )}

        <NavLink to="/incidents" active={isActive('/incidents')} label="Incidents" />

        {hasRole(['admin', 'safety-officer', 'reporter']) && (
          <NavLink to="/report" active={isActive('/report')} label="Report Incident" />
        )}

        <NavLink to="/coming-soon" active={isActive('/coming-soon')} label="Roadmap" />

        <div style={{ position: 'relative', marginLeft: 12 }}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              color: 'white',
              padding: '6px 14px',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <span>👤</span>
            <span>{user?.name?.split(' ')[0] || 'Account'}</span>
            <span>▼</span>
          </button>

          {showDropdown && (
            <>
              <div
                style={{
                  position: 'fixed',
                  top: 0, left: 0, right: 0, bottom: 0,
                  zIndex: 10
                }}
                onClick={() => setShowDropdown(false)}
              />
              <div style={{
                position: 'absolute',
                right: 0,
                top: 44,
                backgroundColor: 'white',
                color: '#1f2937',
                borderRadius: 8,
                boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                minWidth: 160,
                zIndex: 20,
                overflow: 'hidden'
              }}>
                <div style={{ padding: '10px 16px', borderBottom: '1px solid #e5e7eb', fontSize: 13, color: '#6b7280' }}>
                  <div style={{ fontWeight: 600, color: '#1f2937' }}>{user?.name}</div>
                  <div>{user?.role?.replace('-', ' ')}</div>
                </div>
                <button
                  onClick={() => { setShowDropdown(false); navigate('/profile'); }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '10px 16px',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    fontSize: 14,
                    color: '#374151'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  My Profile
                </button>
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '10px 16px',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    fontSize: 14,
                    color: '#dc2626',
                    borderTop: '1px solid #e5e7eb'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#fef2f2'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, active, label }) => (
  <Link
    to={to}
    style={{
      color: 'white',
      textDecoration: 'none',
      padding: '6px 14px',
      borderRadius: 6,
      fontSize: 14,
      fontWeight: 500,
      backgroundColor: active ? 'rgba(255,255,255,0.2)' : 'transparent',
      transition: 'background-color 0.2s'
    }}
    onMouseEnter={(e) => { if (!active) e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'; }}
    onMouseLeave={(e) => { if (!active) e.target.style.backgroundColor = 'transparent'; }}
  >
    {label}
  </Link>
);

export default Navbar;