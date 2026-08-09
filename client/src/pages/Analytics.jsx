import { useEffect, useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import api from '../services/api';

const COLORS = ['#1e3a5f', '#3182ce', '#38a169', '#dd6b20', '#e53e3e', '#805ad5', '#d69e2e'];

const Card = ({ title, value, color }) => (
  <div style={{
    background: '#fff',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    borderLeft: `4px solid ${color}`,
    minWidth: '160px',
    flex: 1
  }}>
    <div style={{ fontSize: '12px', color: '#718096', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}>{title}</div>
    <div style={{ fontSize: '28px', fontWeight: 700, color: '#1e3a5f' }}>{value}</div>
  </div>
);

const ChartBox = ({ title, children, height = 300 }) => (
  <div style={{
    background: '#fff',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    marginBottom: '20px'
  }}>
    <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#1e3a5f', fontWeight: 700 }}>{title}</h3>
    <ResponsiveContainer width="100%" height={height}>
      {children}
    </ResponsiveContainer>
  </div>
);

const Analytics = () => {
  const [summary, setSummary] = useState(null);
  const [trends, setTrends] = useState([]);
  const [categories, setCategories] = useState([]);
  const [severity, setSeverity] = useState([]);
  const [locations, setLocations] = useState([]);
  const [corrective, setCorrective] = useState([]);
  const [heatmap, setHeatmap] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [s, t, c, sev, l, ca, h] = await Promise.all([
          api.get('/analytics/summary'),
          api.get('/analytics/trends'),
          api.get('/analytics/categories'),
          api.get('/analytics/severity'),
          api.get('/analytics/locations'),
          api.get('/analytics/corrective-actions'),
          api.get('/analytics/risk-heatmap'),
        ]);
        setSummary(s.data.data || s.data);
        setTrends(t.data.data || t.data);
        setCategories(c.data.data || c.data);
        setSeverity(sev.data.data || sev.data);
        setLocations(l.data.data || l.data);
        setCorrective(ca.data.data || ca.data);
        setHeatmap(h.data.data || h.data);
      } catch (err) {
        console.error('Analytics fetch error', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: '#4a5568' }}>Loading analytics...</div>;

  const total = summary?.totalIncidents || 0;
  const open = summary?.openIncidents || 0;
  const closed = summary?.closedIncidents || 0;
  const critical = summary?.criticalIncidents || 0;

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <h2 style={{ margin: '0 0 20px 0', color: '#1e3a5f', fontSize: '24px' }}>Analytics & Insights</h2>

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
        <Card title="Total Incidents" value={total} color="#1e3a5f" />
        <Card title="Open" value={open} color="#3182ce" />
        <Card title="Closed / Resolved" value={closed} color="#38a169" />
        <Card title="Critical" value={critical} color="#e53e3e" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '20px' }}>
        <ChartBox title="Monthly Trends" height={280}>
          <LineChart data={trends}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#3182ce" strokeWidth={3} dot={{ r: 4 }} name="Incidents" />
          </LineChart>
        </ChartBox>

        <ChartBox title="Incidents by Category" height={280}>
          <BarChart data={categories}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="category" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="count" fill="#1e3a5f" radius={[6, 6, 0, 0]} name="Incidents" />
          </BarChart>
        </ChartBox>

        <ChartBox title="Severity Distribution" height={300}>
          <PieChart>
            <Pie
              data={severity}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={4}
              dataKey="count"
              nameKey="severity"
            >
              {severity.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ChartBox>

        <ChartBox title="Corrective Action Status" height={300}>
          <PieChart>
            <Pie
              data={corrective}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={4}
              dataKey="count"
              nameKey="status"
            >
              {corrective.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ChartBox>

        <ChartBox title="Incidents by Location (Mine)" height={300}>
          <BarChart data={locations} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis type="number" tick={{ fontSize: 12 }} />
            <YAxis dataKey="location" type="category" width={120} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="count" fill="#dd6b20" radius={[0, 6, 6, 0]} name="Incidents" />
          </BarChart>
        </ChartBox>

        <ChartBox title="Risk Heatmap (Severity × Category)" height={300}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', paddingTop: '20px' }}>
            {heatmap.map((item, idx) => (
              <div
                key={idx}
                style={{
                  width: '100px',
                  height: '80px',
                  borderRadius: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '13px',
                  backgroundColor:
                    item.riskScore >= 8 ? '#c53030' :
                    item.riskScore >= 5 ? '#dd6b20' :
                    item.riskScore >= 3 ? '#d69e2e' : '#38a169'
                }}
                title={`${item.category} - ${item.severity}: ${item.count} incidents`}
              >
                <span style={{ fontSize: '10px', opacity: 0.9, textTransform: 'uppercase' }}>{item.category}</span>
                <span style={{ fontSize: '20px' }}>{item.count}</span>
                <span style={{ fontSize: '10px', opacity: 0.8 }}>{item.severity}</span>
              </div>
            ))}
          </div>
        </ChartBox>
      </div>
    </div>
  );
};

export default Analytics;