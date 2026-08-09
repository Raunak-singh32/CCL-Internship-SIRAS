import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../services/api'

function ReportIncident() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [form, setForm] = useState({
    incidentId: '',
    title: '',
    description: '',
    type: 'accident',
    category: 'fall-of-ground',
    severity: 'medium',
    mineLocation: '',
    department: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    reportedBy: { name: '', employeeId: '', designation: '', contactNumber: '' },
    immediateCause: '',
    rootCause: '',
    correctiveAction: { description: '', assignedTo: '', deadline: '', status: 'pending' },
    dgmsReportable: false,
    dgmsReference: ''
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setForm(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: type === 'checkbox' ? checked : value }
      }))
    } else {
      setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await API.post('/incidents', form)
      setSuccess('Incident reported successfully!')
      setTimeout(() => navigate('/incidents'), 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to report incident')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid #d1d5db',
    borderRadius: 8,
    fontSize: 14,
    boxSizing: 'border-box'
  }

  const labelStyle = {
    display: 'block',
    marginBottom: 6,
    fontSize: 14,
    fontWeight: 500,
    color: '#374151'
  }

  const grid2 = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: 16
  }

  return (
    <div style={{ padding: 24, fontFamily: 'system-ui, sans-serif', maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ marginBottom: 24 }}>➕ Report New Incident</h1>

      {error && (
        <div style={{ background: '#fee2e2', color: '#dc2626', padding: 12, borderRadius: 8, marginBottom: 16 }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{ background: '#dcfce7', color: '#16a34a', padding: 12, borderRadius: 8, marginBottom: 16 }}>
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ background: '#fff', padding: 28, borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        
        {/* Basic Info */}
        <h3 style={{ marginTop: 0, marginBottom: 16, color: '#1e3a5f', borderBottom: '2px solid #e5e7eb', paddingBottom: 8 }}>
          Basic Information
        </h3>
        <div style={grid2}>
          <div>
            <label style={labelStyle}>Incident ID *</label>
            <input name="incidentId" value={form.incidentId} onChange={handleChange} required style={inputStyle} placeholder="CCL-2026-XXXX" />
          </div>
          <div>
            <label style={labelStyle}>Title *</label>
            <input name="title" value={form.title} onChange={handleChange} required style={inputStyle} placeholder="Brief title" />
          </div>
          <div>
            <label style={labelStyle}>Type *</label>
            <select name="type" value={form.type} onChange={handleChange} style={inputStyle}>
              <option value="accident">Accident</option>
              <option value="near-miss">Near Miss</option>
              <option value="hazard">Hazard</option>
              <option value="violation">Violation</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Category *</label>
            <select name="category" value={form.category} onChange={handleChange} style={inputStyle}>
              <option value="fall-of-ground">Fall of Ground</option>
              <option value="machinery-breakdown">Machinery Breakdown</option>
              <option value="fire">Fire</option>
              <option value="explosion">Explosion</option>
              <option value="electrical">Electrical</option>
              <option value="transportation">Transportation</option>
              <option value="drowning">Drowning</option>
              <option value="gas-leak">Gas Leak</option>
              <option value="personal-injury">Personal Injury</option>
              <option value="environmental">Environmental</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Severity *</label>
            <select name="severity" value={form.severity} onChange={handleChange} style={inputStyle}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Mine Location *</label>
            <input name="mineLocation" value={form.mineLocation} onChange={handleChange} required style={inputStyle} placeholder="e.g. Barka Sayal" />
          </div>
          <div>
            <label style={labelStyle}>Department</label>
            <input name="department" value={form.department} onChange={handleChange} style={inputStyle} placeholder="e.g. Mining" />
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Date *</label>
              <input type="date" name="date" value={form.date} onChange={handleChange} required style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Time</label>
              <input type="time" name="time" value={form.time} onChange={handleChange} style={inputStyle} />
            </div>
          </div>
        </div>

        {/* Description */}
        <h3 style={{ marginTop: 24, marginBottom: 16, color: '#1e3a5f', borderBottom: '2px solid #e5e7eb', paddingBottom: 8 }}>
          Description
        </h3>
        <div style={{ marginBottom: 16 }}>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={4}
            style={{ ...inputStyle, resize: 'vertical' }}
            placeholder="Detailed description of the incident..."
          />
        </div>

        {/* Reported By */}
        <h3 style={{ marginTop: 24, marginBottom: 16, color: '#1e3a5f', borderBottom: '2px solid #e5e7eb', paddingBottom: 8 }}>
          Reported By
        </h3>
        <div style={grid2}>
          <div>
            <label style={labelStyle}>Name *</label>
            <input name="reportedBy.name" value={form.reportedBy.name} onChange={handleChange} required style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Employee ID</label>
            <input name="reportedBy.employeeId" value={form.reportedBy.employeeId} onChange={handleChange} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Designation</label>
            <input name="reportedBy.designation" value={form.reportedBy.designation} onChange={handleChange} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Contact Number</label>
            <input name="reportedBy.contactNumber" value={form.reportedBy.contactNumber} onChange={handleChange} style={inputStyle} />
          </div>
        </div>

        {/* Cause Analysis */}
        <h3 style={{ marginTop: 24, marginBottom: 16, color: '#1e3a5f', borderBottom: '2px solid #e5e7eb', paddingBottom: 8 }}>
          Cause Analysis
        </h3>
        <div style={grid2}>
          <div>
            <label style={labelStyle}>Immediate Cause</label>
            <input name="immediateCause" value={form.immediateCause} onChange={handleChange} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Root Cause</label>
            <input name="rootCause" value={form.rootCause} onChange={handleChange} style={inputStyle} />
          </div>
        </div>

        {/* Corrective Action */}
        <h3 style={{ marginTop: 24, marginBottom: 16, color: '#1e3a5f', borderBottom: '2px solid #e5e7eb', paddingBottom: 8 }}>
          Corrective Action
        </h3>
        <div style={grid2}>
          <div>
            <label style={labelStyle}>Action Description</label>
            <input name="correctiveAction.description" value={form.correctiveAction.description} onChange={handleChange} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Assigned To</label>
            <input name="correctiveAction.assignedTo" value={form.correctiveAction.assignedTo} onChange={handleChange} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Deadline</label>
            <input type="date" name="correctiveAction.deadline" value={form.correctiveAction.deadline} onChange={handleChange} style={inputStyle} />
          </div>
        </div>

        {/* DGMS */}
        <h3 style={{ marginTop: 24, marginBottom: 16, color: '#1e3a5f', borderBottom: '2px solid #e5e7eb', paddingBottom: 8 }}>
          DGMS Compliance
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <input type="checkbox" name="dgmsReportable" checked={form.dgmsReportable} onChange={handleChange} id="dgms" />
          <label htmlFor="dgms" style={{ fontSize: 14, color: '#374151' }}>Reportable to DGMS?</label>
        </div>
        {form.dgmsReportable && (
          <div style={{ maxWidth: 300 }}>
            <label style={labelStyle}>DGMS Reference</label>
            <input name="dgmsReference" value={form.dgmsReference} onChange={handleChange} style={inputStyle} placeholder="DGMS/RAN/2026/XXX" />
          </div>
        )}

        {/* Submit */}
        <div style={{ marginTop: 32, display: 'flex', gap: 12 }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px 32px',
              background: loading ? '#93c5fd' : '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Submitting...' : 'Submit Incident'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/incidents')}
            style={{
              padding: '12px 32px',
              background: '#f3f4f6',
              color: '#374151',
              border: '1px solid #d1d5db',
              borderRadius: 8,
              fontSize: 16,
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default ReportIncident