import { useState, useEffect } from 'react'
import API from '../services/api'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'

function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [trends, setTrends] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, trendsRes, categoriesRes] = await Promise.all([
          API.get('/analytics/summary'),
          API.get('/analytics/trends'),
          API.get('/analytics/categories')
        ])

        setSummary(summaryRes.data.data)
        setTrends(trendsRes.data.data.reverse()) // oldest first for chart
        setCategories(categoriesRes.data.data)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading dashboard...</div>
  if (error) return <div style={{ padding: 40, color: 'red' }}>{error}</div>

  const cards = [
    { label: 'Total Incidents', value: summary.totalIncidents, color: '#2563eb' },
    { label: 'Near Misses', value: summary.totalNearMisses, color: '#f59e0b' },
    { label: 'Accidents', value: summary.totalAccidents, color: '#dc2626' },
    { label: 'Pending Actions', value: summary.pendingActions, color: '#7c3aed' },
    { label: 'This Month', value: summary.thisMonthIncidents, color: '#059669' },
  ]

  const COLORS = ['#2563eb', '#dc2626', '#f59e0b', '#059669', '#7c3aed', '#ec4899', '#6366f1', '#14b8a6']

  return (
    <div style={{ padding: 24, fontFamily: 'system-ui, sans-serif', background: '#f3f4f6', minHeight: '100vh' }}>
      <h1 style={{ marginBottom: 24 }}>📊 SIRAS Dashboard</h1>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
        {cards.map((card) => (
          <div
            key={card.label}
            style={{
              background: '#fff',
              borderRadius: 12,
              padding: 20,
              borderLeft: `5px solid ${card.color}`,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 8 }}>{card.label}</div>
            <div style={{ fontSize: 32, fontWeight: 'bold', color: card.color }}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24 }}>
        
        {/* Monthly Trends */}
        <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginBottom: 16 }}>📈 Monthly Incident Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={(d) => `${d._id.month}/${d._id.year}`} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2} name="Incidents" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* By Category */}
        <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginBottom: 16 }}>📂 Incidents by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categories}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" angle={-30} textAnchor="end" height={80} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" name="Count">
                {categories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Pie Chart */}
        <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginBottom: 16 }}>🥧 Category Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categories}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ _id, percent }) => `${_id}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
                nameKey="_id"
              >
                {categories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  )
}

export default Dashboard