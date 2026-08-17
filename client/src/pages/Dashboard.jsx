import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const COLORS = ['#1e3a5f', '#3b82f6', '#f59e0b', '#10b981', '#ef4444'];

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [trends, setTrends] = useState([]);
  const [categories, setCategories] = useState([]);
  const [severity, setSeverity] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sumRes, trendRes, catRes, sevRes] = await Promise.all([
          api.get('/analytics/summary'),
          api.get('/analytics/trends'),
          api.get('/analytics/categories'),
          api.get('/analytics/severity')
        ]);
        setSummary(sumRes.data.data);
        setTrends(trendRes.data.data || []);
        setCategories(catRes.data.data || []);
        setSeverity(sevRes.data.data || []);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#6b7280' }}>Loading dashboard...</div>;

  return (
    <div style={{ padding: 24, maxWidth: 1400, margin: '0 auto' }}>
      <h2 style={{ fontSize: 24, marginBottom: 20 }}>📊 Dashboard</h2>

      {/* KPI Cards */}
      {summary && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
          <KpiCard label="Total Incidents" value={summary.totalIncidents} color="#1e3a5f" />
          <KpiCard label="Open" value={summary.openIncidents} color="#3b82f6" />
          <KpiCard label="Closed" value={summary.closedIncidents} color="#10b981" />
          <KpiCard label="Critical" value={summary.criticalIncidents} color="#ef4444" />
          <KpiCard label="Avg Resolution (days)" value={summary.avgResolutionDays} color="#f59e0b" />
        </div>
      )}

      {/* Charts */}
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

      <div style={cardStyle}>
        <h3 style={sectionTitle}>Severity Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={severity}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="count"
              nameKey="severity"
              label
            >
              {severity.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const KpiCard = ({ label, value, color }) => (
  <div
    onClick={() => { if (label === 'Open') window.location.href = '/incidents'; }}
    style={{
      backgroundColor: 'white',
      borderRadius: 12,
      padding: 20,
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      borderLeft: `4px solid ${color}`,
      cursor: 'pointer'
    }}
  >
    <div style={{ fontSize: 28, fontWeight: 'bold', color }}>{value ?? 0}</div>
    <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>{label}</div>
  </div>
);

const cardStyle = {
  backgroundColor: 'white',
  borderRadius: 12,
  padding: 20,
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
};

const sectionTitle = {
  fontSize: 16,
  fontWeight: 600,
  marginBottom: 16,
  color: '#1f2937'
};

export default Dashboard;