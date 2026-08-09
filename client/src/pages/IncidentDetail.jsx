import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const badge = (text, bg, color = '#fff') => ({
  display: 'inline-block',
  padding: '4px 12px',
  borderRadius: '999px',
  fontSize: '12px',
  fontWeight: 600,
  backgroundColor: bg,
  color,
  textTransform: 'capitalize',
});

const sectionBox = {
  background: '#fff',
  borderRadius: '10px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  padding: '20px',
  marginBottom: '16px',
};

const sectionTitle = {
  fontSize: '16px',
  fontWeight: 700,
  color: '#1e3a5f',
  marginBottom: '14px',
  borderBottom: '2px solid #e2e8f0',
  paddingBottom: '8px',
};

const label = {
  fontWeight: 600,
  color: '#4a5568',
};

export default function IncidentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIncident();
  }, [id]);

  const fetchIncident = async () => {
    try {
      const res = await api.get(`/incidents/${id}`);
      setIncident(res.data.data || res.data);
    } catch (err) {
      alert('Failed to load incident details');
      navigate('/incidents');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this incident? This action cannot be undone.');
    if (!confirmed) return;
    try {
      await api.delete(`/incidents/${id}`);
      alert('Incident deleted successfully');
      navigate('/incidents');
    } catch (err) {
      alert('Failed to delete incident');
    }
  };

  const downloadPDF = async () => {
    try {
      const res = await api.get(`/reports/export/pdf/${id}`, { responseType: 'blob' });
      const blob = new Blob([res.data]);
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `incident-${incident?.incidentId || id}.pdf`;
      link.click();
      window.URL.revokeObjectURL(link.href);
    } catch (err) {
      alert('Failed to download PDF');
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return '#742a2a';
      case 'high': return '#e53e3e';
      case 'medium': return '#dd6b20';
      case 'low': return '#38a169';
      default: return '#718096';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'open': return '#3182ce';
      case 'in-progress': return '#d69e2e';
      case 'closed': return '#38a169';
      default: return '#718096';
    }
  };

  const getActionColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return '#38a169';
      case 'in-progress': return '#d69e2e';
      case 'pending': return '#e53e3e';
      default: return '#718096';
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: '#4a5568' }}>Loading incident details...</div>;
  if (!incident) return <div style={{ padding: '40px', textAlign: 'center', color: '#4a5568' }}>Incident not found</div>;

  const mineName = incident.mineLocation || incident.location?.mineName || incident.mine || 'N/A';

  return (
    <div style={{ minHeight: '100vh', background: '#f7fafc', padding: '24px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        {/* Header Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <button
            onClick={() => navigate('/incidents')}
            style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #cbd5e0', background: '#fff', color: '#4a5568', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
          >
            ← Back to Incidents
          </button>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {hasRole(['admin', 'safety-officer']) && (
              <button
                onClick={() => navigate(`/incidents/${id}/edit`)}
                style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: '#3182ce', color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
              >
                ✎ Edit
              </button>
            )}
            <button
              onClick={downloadPDF}
              style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: '#c53030', color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
            >
              📕 PDF
            </button>
            {hasRole(['admin', 'safety-officer']) && (
              <button
                onClick={handleDelete}
                style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: '#e53e3e', color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
              >
                🗑 Delete
              </button>
            )}
          </div>
        </div>

        {/* Title Card */}
        <div style={sectionBox}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: '#1a202c' }}>{incident.title}</h1>
              <p style={{ margin: '6px 0 0 0', color: '#718096', fontSize: '13px' }}>ID: {incident.incidentId || incident._id}</p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={badge(incident.severity, getSeverityColor(incident.severity))}>{incident.severity}</span>
              <span style={badge(incident.status, getStatusColor(incident.status))}>{incident.status}</span>
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div style={sectionBox}>
          <h2 style={sectionTitle}>Basic Information</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 24px', fontSize: '14px' }}>
            <div><span style={label}>Category:</span> {incident.category || 'N/A'}</div>
            <div><span style={label}>Type:</span> {incident.type || 'N/A'}</div>
            <div><span style={label}>Date:</span> {incident.date ? new Date(incident.date).toLocaleDateString('en-IN') : 'N/A'}</div>
            <div><span style={label}>Time:</span> {incident.time || 'N/A'}</div>
            <div><span style={label}>Mine Location:</span> {mineName}</div>
            <div><span style={label}>Department:</span> {incident.department || 'N/A'}</div>
            <div style={{ gridColumn: '1 / -1' }}><span style={label}>Description:</span> {incident.description || 'N/A'}</div>
          </div>
        </div>

        {/* Injury / Impact */}
        <div style={sectionBox}>
          <h2 style={sectionTitle}>Injury & Impact Details</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px 24px', fontSize: '14px' }}>
            <div><span style={label}>Injury Type:</span> {incident.injuryType || 'N/A'}</div>
            <div><span style={label}>Body Part:</span> {incident.bodyPart || 'N/A'}</div>
            <div><span style={label}>Days Lost:</span> {incident.daysLost || 0}</div>
            <div><span style={label}>Persons Involved:</span> {incident.personsInvolved?.length ? incident.personsInvolved.join(', ') : 'None'}</div>
            <div><span style={label}>Equipment:</span> {incident.equipmentInvolved?.length ? incident.equipmentInvolved.join(', ') : 'None'}</div>
          </div>
        </div>

        {/* DGMS */}
        <div style={sectionBox}>
          <h2 style={sectionTitle}>DGMS Information</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px 24px', fontSize: '14px' }}>
            <div><span style={label}>DGMS Reportable:</span> {incident.dgmsReportable ? 'Yes' : 'No'}</div>
            <div><span style={label}>Regulation:</span> {incident.dgmsRegulation || 'N/A'}</div>
            <div><span style={label}>Notice Number:</span> {incident.noticeNumber || 'N/A'}</div>
          </div>
        </div>

        {/* Root Cause */}
        <div style={sectionBox}>
          <h2 style={sectionTitle}>Root Cause Analysis</h2>
          <div style={{ fontSize: '14px', lineHeight: 1.6 }}>
            <div style={{ marginBottom: '8px' }}><span style={label}>Immediate Cause:</span> {incident.immediateCause || 'N/A'}</div>
            <div><span style={label}>Root Cause:</span> {incident.rootCause || 'N/A'}</div>
          </div>
        </div>

        {/* Corrective Action */}
        <div style={sectionBox}>
          <h2 style={sectionTitle}>Corrective Action</h2>
          <div style={{ fontSize: '14px', lineHeight: 1.6 }}>
            <div style={{ marginBottom: '8px' }}><span style={label}>Description:</span> {incident.correctiveAction?.description || 'N/A'}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px 24px' }}>
              <div><span style={label}>Assigned To:</span> {incident.correctiveAction?.assignedTo || 'N/A'}</div>
              <div><span style={label}>Deadline:</span> {incident.correctiveAction?.deadline ? new Date(incident.correctiveAction.deadline).toLocaleDateString('en-IN') : 'N/A'}</div>
              <div>
                <span style={label}>Status:</span>{' '}
                <span style={badge(incident.correctiveAction?.status || 'pending', getActionColor(incident.correctiveAction?.status))}>
                  {incident.correctiveAction?.status || 'Pending'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Reporter */}
        <div style={sectionBox}>
          <h2 style={sectionTitle}>Reporter Information</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 24px', fontSize: '14px' }}>
            <div><span style={label}>Name:</span> {incident.reportedBy?.name || incident.reporter?.name || 'N/A'}</div>
            <div><span style={label}>Email:</span> {incident.reportedBy?.email || incident.reporter?.email || 'N/A'}</div>
            <div><span style={label}>Phone:</span> {incident.reportedBy?.phone || incident.reporter?.phone || 'N/A'}</div>
            <div><span style={label}>Designation:</span> {incident.reportedBy?.designation || incident.reporter?.department || 'N/A'}</div>
          </div>
        </div>

      </div>
    </div>
  );
}