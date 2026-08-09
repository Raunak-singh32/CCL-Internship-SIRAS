import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Incidents = () => {
  const [incidents, setIncidents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { hasRole } = useAuth();

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    try {
      const res = await api.get('/incidents');
      setIncidents(res.data.data);
      setFiltered(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let data = incidents;
    if (statusFilter !== 'All') {
      data = data.filter((i) => i.status === statusFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (i) =>
          i.title?.toLowerCase().includes(q) ||
          i.category?.toLowerCase().includes(q) ||
          i.mineLocation?.toLowerCase().includes(q) ||
          i.incidentId?.toLowerCase().includes(q)
      );
    }
    setFiltered(data);
  }, [search, statusFilter, incidents]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this incident?')) return;
    try {
      await api.delete(`/incidents/${id}`);
      fetchIncidents();
    } catch (err) {
      alert('Failed to delete incident');
    }
  };

  const exportCSV = async () => {
    try {
      const res = await api.get('/reports/export/csv', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'incidents.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Export failed');
    }
  };

  const exportPDF = async () => {
    try {
      const res = await api.get('/reports/export/pdf', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'incidents.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Export failed');
    }
  };

  // DB stores lowercase — handle both cases safely
  const severityColor = (s) => {
    const val = (s || '').toLowerCase();
    switch (val) {
      case 'critical': return '#dc2626';
      case 'high': return '#ea580c';
      case 'medium': return '#ca8a04';
      case 'low': return '#16a34a';
      default: return '#6b7280';
    }
  };

  const statusColor = (s) => {
    const val = (s || '').toLowerCase();
    switch (val) {
      case 'open': return '#dbeafe';
      case 'under-investigation': return '#fef3c7';
      case 'closed': return '#d1fae5';
      default: return '#f3f4f6';
    }
  };

  const statusTextColor = (s) => {
    const val = (s || '').toLowerCase();
    switch (val) {
      case 'open': return '#1e40af';
      case 'under-investigation': return '#92400e';
      case 'closed': return '#065f46';
      default: return '#374151';
    }
  };

  // Display label map: DB value → pretty label
  const statusOptions = [
    { label: 'All', value: 'All' },
    { label: 'Open', value: 'open' },
    { label: 'Under Investigation', value: 'under-investigation' },
    { label: 'Closed', value: 'closed' }
  ];

  const formatDate = (d) => {
    if (!d) return '—';
    const date = new Date(d);
    return isNaN(date.getTime()) ? '—' : date.toLocaleDateString('en-IN');
  };

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#6b7280' }}>Loading incidents...</div>;

  return (
    <div style={{ padding: 24, maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ margin: 0, fontSize: 24 }}>🚨 All Incidents</h2>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button onClick={exportCSV} style={btnStyle('#1e3a5f')}>📥 CSV</button>
          <button onClick={exportPDF} style={btnStyle('#1e3a5f')}>📄 PDF</button>
          {hasRole(['admin', 'safety-officer', 'reporter']) && (
            <button onClick={() => navigate('/report')} style={btnStyle('#16a34a')}>+ Report Incident</button>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search by title, category, mine, or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1, minWidth: 250, padding: '10px 14px', borderRadius: 8,
            border: '1px solid #d1d5db', fontSize: 14, outline: 'none'
          }}
        />
        {statusOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setStatusFilter(opt.value)}
            style={{
              padding: '8px 16px', borderRadius: 20, border: '1px solid #d1d5db',
              backgroundColor: statusFilter === opt.value ? '#1e3a5f' : 'white',
              color: statusFilter === opt.value ? 'white' : '#374151',
              cursor: 'pointer', fontSize: 13, fontWeight: 500
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Title</th>
              <th style={thStyle}>Category</th>
              <th style={thStyle}>Severity</th>
              <th style={thStyle}>Mine</th>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Action</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((inc) => (
              <tr
                key={inc._id}
                onClick={() => navigate(`/incidents/${inc._id}`)}
                style={{ borderBottom: '1px solid #f3f4f6', cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f9fafb')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'white')}
              >
                <td style={tdStyle}><code style={{ background: '#f3f4f6', padding: '2px 6px', borderRadius: 4, fontSize: 12 }}>{inc.incidentId}</code></td>
                <td style={tdStyle}><strong>{inc.title}</strong></td>
                <td style={tdStyle}>{inc.category}</td>
                <td style={tdStyle}>
                  <span style={{
                    backgroundColor: severityColor(inc.severity) + '20',
                    color: severityColor(inc.severity),
                    padding: '4px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600, textTransform: 'capitalize'
                  }}>
                    {inc.severity}
                  </span>
                </td>
                <td style={tdStyle}>{inc.mineLocation}</td>
                <td style={tdStyle}>{formatDate(inc.dateOfIncident)}</td>
                <td style={tdStyle}>
                  <span style={{
                    backgroundColor: statusColor(inc.status),
                    color: statusTextColor(inc.status),
                    padding: '4px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600, textTransform: 'capitalize'
                  }}>
                    {(inc.status || '').replace(/-/g, ' ')}
                  </span>
                </td>
                <td style={tdStyle}>
                  <span style={{
                    backgroundColor: inc.correctiveAction?.status === 'Completed' ? '#d1fae5' : '#fef3c7',
                    color: inc.correctiveAction?.status === 'Completed' ? '#065f46' : '#92400e',
                    padding: '4px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600
                  }}>
                    {inc.correctiveAction?.status || 'Pending'}
                  </span>
                </td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', gap: 6 }} onClick={(e) => e.stopPropagation()}>
                    {hasRole(['admin', 'safety-officer']) && (
                      <>
                        <button
                          onClick={() => navigate(`/incidents/${inc._id}/edit`)}
                          style={{ ...actionBtnStyle, backgroundColor: '#dbeafe', color: '#1e40af' }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(inc._id)}
                          style={{ ...actionBtnStyle, backgroundColor: '#fee2e2', color: '#dc2626' }}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: '#9ca3af' }}>No incidents found.</div>
        )}
      </div>
    </div>
  );
};

const btnStyle = (bg) => ({
  backgroundColor: bg,
  color: 'white',
  border: 'none',
  padding: '10px 18px',
  borderRadius: 8,
  cursor: 'pointer',
  fontSize: 14,
  fontWeight: 500
});

const thStyle = {
  textAlign: 'left',
  padding: '14px 16px',
  fontSize: 12,
  fontWeight: 600,
  color: '#6b7280',
  textTransform: 'uppercase',
  letterSpacing: 0.5
};

const tdStyle = {
  padding: '14px 16px',
  color: '#374151'
};

const actionBtnStyle = {
  border: 'none',
  padding: '6px 12px',
  borderRadius: 6,
  cursor: 'pointer',
  fontSize: 12,
  fontWeight: 500
};

export default Incidents;