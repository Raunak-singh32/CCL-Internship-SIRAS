import { useState, useEffect } from 'react';
import api from '../services/api';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const COLORS = ['#1e3a5f', '#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'];

const Analytics = () => {
  const [summary, setSummary] = useState(null);
  const [trends, setTrends] = useState([]);
  const [categories, setCategories] = useState([]);
  const [severity, setSeverity] = useState([]);
  const [locations, setLocations] = useState([]);
  const [riskHeatmap, setRiskHeatmap] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   const fetchAll = async () => {
  try {
    const [sumRes, trendRes, catRes, sevRes, locRes, riskRes] = await Promise.all([
      api.get('/analytics/summary'),
      api.get('/analytics/trends'),
      api.get('/analytics/categories'),
      api.get('/analytics/severity'),
      api.get('/analytics/locations'),
      api.get('/analytics/risk-heatmap')
    ]);

    setSummary(sumRes.data.data);

    // Fix trends
    const monthNames = ['','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const formattedTrends = (trendRes.data.data || [])
      .map(t => ({
        month: `${monthNames[t._id.month]} ${t._id.year}`,
        count: t.count
      }))
      .reverse();
    setTrends(formattedTrends);

    // Fix categories
    setCategories((catRes.data.data || []).map(c => ({
      category: c._id,
      count: c.count
    })));

    // Fix severity
    setSeverity((sevRes.data.data || []).map(s => ({
      severity: s._id,
      count: s.count
    })));

    // Fix locations
    setLocations((locRes.data.data || []).map(l => ({
      location: l._id,
      total: l.count,
      critical: l.critical || 0
    })));

    // Fix risk heatmap
    setRiskHeatmap((riskRes.data.data || []).map(r => ({
      category: r.mineLocation || r._id,
      low: r.low || 0,
      medium: r.medium || 0,
      high: r.high || 0,
      critical: r.critical || 0
    })));

  } catch (err) {
    console.error('Analytics fetch error:', err);
  } finally {
    setLoading(false);
  }
};
    fetchAll();
  }, []);

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#6b7280' }}>Loading analytics...</div>;

  return (
    <div style={{ padding: 24, maxWidth: 1400, margin: '0 auto' }}>
      <h2 style={{ fontSize: 24, marginBottom: 20 }}>📊 Analytics Dashboard</h2>

      {summary && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
          <SummaryCard label="Total Incidents" value={summary.totalIncidents} color="#1e3a5f" />
          <SummaryCard label="Open" value={summary.openIncidents} color="#3b82f6" />
          <SummaryCard label="Closed" value={summary.closedIncidents} color="#10b981" />
          <SummaryCard label="Critical" value={summary.criticalIncidents} color="#ef4444" />
          <SummaryCard label="Avg Resolution (days)" value={summary.avgResolutionDays} color="#f59e0b" />
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24, marginBottom: 32 }}>
        <div style={cardStyle}>
          <h3 style={sectionTitle}>Monthly Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#1e3a5f" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={cardStyle}>
          <h3 style={sectionTitle}>Incidents by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categories}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24, marginBottom: 32 }}>
        <div style={cardStyle}>
          <h3 style={sectionTitle}>Severity Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={severity} cx="50%" cy="50%" outerRadius={100} dataKey="count" nameKey="severity" label>
                {severity.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={cardStyle}>
          <h3 style={sectionTitle}>Incidents by Location</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                <th style={tableTh}>Mine / Location</th>
                <th style={tableTh}>Total</th>
                <th style={tableTh}>Critical</th>
              </tr>
            </thead>
            <tbody>
              {locations.map((loc, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={tableTd}>{loc.location}</td>
                  <td style={tableTd}>{loc.total}</td>
                  <td style={tableTd}><span style={{ color: '#ef4444', fontWeight: 600 }}>{loc.critical}</span></td>
                </tr>
              ))}
              {locations.length === 0 && (
                <tr><td colSpan={3} style={{ textAlign: 'center', padding: 20, color: '#9ca3af' }}>No data</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div style={cardStyle}>
        <h3 style={sectionTitle}>Risk Heatmap (Severity × Category)</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                <th style={tableTh}>Category</th>
                <th style={tableTh}>Low</th>
                <th style={tableTh}>Medium</th>
                <th style={tableTh}>High</th>
                <th style={tableTh}>Critical</th>
              </tr>
            </thead>
            <tbody>
              {riskHeatmap.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={tableTd}><strong>{row.category}</strong></td>
                  <td style={tableTd}>{row.low || 0}</td>
                  <td style={tableTd}>{row.medium || 0}</td>
                  <td style={tableTd}>{row.high || 0}</td>
                  <td style={tableTd}><span style={{ color: '#ef4444', fontWeight: 600 }}>{row.critical || 0}</span></td>
                </tr>
              ))}
              {riskHeatmap.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: 20, color: '#9ca3af' }}>No data</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const SummaryCard = ({ label, value, color }) => (
  <div style={{ backgroundColor: 'white', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderLeft: `4px solid ${color}` }}>
    <div style={{ fontSize: 28, fontWeight: 'bold', color }}>{value ?? 0}</div>
    <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>{label}</div>
  </div>
);

const cardStyle = { backgroundColor: 'white', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' };
const sectionTitle = { fontSize: 16, fontWeight: 600, marginBottom: 16, color: '#1f2937' };
const tableTh = { textAlign: 'left', padding: '10px 12px', fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' };
const tableTd = { padding: '10px 12px', color: '#374151' };

export default Analytics;