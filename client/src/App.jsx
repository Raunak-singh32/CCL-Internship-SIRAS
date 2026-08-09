import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Incidents from './pages/Incidents';
import IncidentDetail from './pages/IncidentDetail';
import EditIncident from './pages/EditIncident';
import ReportIncident from './pages/ReportIncident';
import Login from './pages/Login';
import Profile from './pages/Profile';
import ComingSoon from './pages/ComingSoon';

const RoleRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 50, color: '#6b7280' }}>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 50, color: '#6b7280' }}>Loading...</div>;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const location = useLocation();
  const hideNavbar = location.pathname === '/login';

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/login" element={
          <PublicRoute><Login /></PublicRoute>
        } />

        <Route path="/" element={
          <RoleRoute allowedRoles={['admin', 'safety-officer', 'mine-manager', 'reporter']}>
            <Dashboard />
          </RoleRoute>
        } />

        <Route path="/analytics" element={
          <RoleRoute allowedRoles={['admin', 'safety-officer', 'mine-manager']}>
            <Analytics />
          </RoleRoute>
        } />

        <Route path="/incidents" element={
          <RoleRoute allowedRoles={['admin', 'safety-officer', 'mine-manager', 'reporter']}>
            <Incidents />
          </RoleRoute>
        } />

        <Route path="/incidents/:id" element={
          <RoleRoute allowedRoles={['admin', 'safety-officer', 'mine-manager', 'reporter']}>
            <IncidentDetail />
          </RoleRoute>
        } />

        <Route path="/incidents/:id/edit" element={
          <RoleRoute allowedRoles={['admin', 'safety-officer']}>
            <EditIncident />
          </RoleRoute>
        } />

        <Route path="/report" element={
          <RoleRoute allowedRoles={['admin', 'safety-officer', 'reporter']}>
            <ReportIncident />
          </RoleRoute>
        } />

        <Route path="/profile" element={
          <RoleRoute allowedRoles={['admin', 'safety-officer', 'mine-manager', 'reporter']}>
            <Profile />
          </RoleRoute>
        } />

        <Route path="/coming-soon" element={
          <RoleRoute allowedRoles={['admin', 'safety-officer', 'mine-manager', 'reporter']}>
            <ComingSoon />
          </RoleRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;