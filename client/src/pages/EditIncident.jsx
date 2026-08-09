import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const initialFormState = {
  title: '',
  description: '',
  category: '',
  severity: 'Low',
  status: 'Open',
  date: '',
  time: '',
  location: '',
  mine: '',
  personsInvolved: [],
  equipmentInvolved: [],
  injuryType: '',
  bodyPart: '',
  daysLost: 0,
  dgmsReportable: false,
  dgmsRegulation: '',
  noticeNumber: '',
  correctiveAction: {
    description: '',
    assignedTo: '',
    deadline: '',
    status: 'Pending'
  },
  reporter: {
    name: '',
    email: '',
    phone: '',
    department: ''
  }
};

export default function EditIncident() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialFormState);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchIncident();
  }, [id]);

  const fetchIncident = async () => {
    try {
      const res = await api.get(`/incidents/${id}`);
      const data = res.data;
      if (data.date) {
        data.date = new Date(data.date).toISOString().split('T')[0];
      }
      if (data.correctiveAction?.deadline) {
        data.correctiveAction.deadline = new Date(data.correctiveAction.deadline).toISOString().split('T')[0];
      }
      setForm({ ...initialFormState, ...data });
    } catch (err) {
      alert('Failed to load incident');
      navigate('/incidents');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setForm(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: type === 'checkbox' ? checked : value }
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const handleArrayChange = (field, index, value) => {
    setForm(prev => {
      const arr = [...prev[field]];
      arr[index] = value;
      return { ...prev, [field]: arr };
    });
  };

  const addArrayItem = (field) => {
    setForm(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeArrayItem = (field, index) => {
    setForm(prev => {
      const arr = prev[field].filter((_, i) => i !== index);
      return { ...prev, [field]: arr };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/incidents/${id}`, form);
      alert('Incident updated successfully');
      navigate(`/incidents/${id}`);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update incident');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-600">Loading incident...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Edit Incident</h2>
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Basic Information */}
          <section>
            <h3 className="text-lg font-semibold text-slate-700 mb-3 border-b pb-2">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input type="text" name="title" value={form.title} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select name="category" value={form.category} onChange={handleChange} required className="w-full border rounded px-3 py-2">
                  <option value="">Select Category</option>
                  <option value="Fall of Roof">Fall of Roof</option>
                  <option value="Machinery Breakdown">Machinery Breakdown</option>
                  <option value="Fire">Fire</option>
                  <option value="Explosion">Explosion</option>
                  <option value="Gas Leak">Gas Leak</option>
                  <option value="Drowning">Drowning</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                <select name="severity" value={form.severity} onChange={handleChange} className="w-full border rounded px-3 py-2">
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select name="status" value={form.status} onChange={handleChange} className="w-full border rounded px-3 py-2">
                  <option value="Open">Open</option>
                  <option value="In-Progress">In-Progress</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input type="date" name="date" value={form.date} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <input type="time" name="time" value={form.time} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input type="text" name="location" value={form.location} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mine</label>
                <input type="text" name="mine" value={form.mine} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="w-full border rounded px-3 py-2" />
            </div>
          </section>

          {/* Persons Involved */}
          <section>
            <h3 className="text-lg font-semibold text-slate-700 mb-3 border-b pb-2">Persons Involved</h3>
            {form.personsInvolved.map((person, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input type="text" value={person} onChange={(e) => handleArrayChange('personsInvolved', idx, e.target.value)} placeholder="Name / Designation" className="flex-1 border rounded px-3 py-2" />
                <button type="button" onClick={() => removeArrayItem('personsInvolved', idx)} className="px-3 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200">Remove</button>
              </div>
            ))}
            <button type="button" onClick={() => addArrayItem('personsInvolved')} className="text-sm text-blue-600 hover:underline">+ Add Person</button>
          </section>

          {/* Equipment Involved */}
          <section>
            <h3 className="text-lg font-semibold text-slate-700 mb-3 border-b pb-2">Equipment Involved</h3>
            {form.equipmentInvolved.map((eq, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input type="text" value={eq} onChange={(e) => handleArrayChange('equipmentInvolved', idx, e.target.value)} placeholder="Equipment name" className="flex-1 border rounded px-3 py-2" />
                <button type="button" onClick={() => removeArrayItem('equipmentInvolved', idx)} className="px-3 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200">Remove</button>
              </div>
            ))}
            <button type="button" onClick={() => addArrayItem('equipmentInvolved')} className="text-sm text-blue-600 hover:underline">+ Add Equipment</button>
          </section>

          {/* Injury Details */}
          <section>
            <h3 className="text-lg font-semibold text-slate-700 mb-3 border-b pb-2">Injury Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Injury Type</label>
                <input type="text" name="injuryType" value={form.injuryType} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Body Part</label>
                <input type="text" name="bodyPart" value={form.bodyPart} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Days Lost</label>
                <input type="number" name="daysLost" value={form.daysLost} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
            </div>
          </section>

          {/* DGMS Information */}
          <section>
            <h3 className="text-lg font-semibold text-slate-700 mb-3 border-b pb-2">DGMS Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <input type="checkbox" name="dgmsReportable" checked={form.dgmsReportable} onChange={handleChange} className="w-4 h-4" />
                <label className="text-sm font-medium text-gray-700">DGMS Reportable</label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">DGMS Regulation</label>
                <input type="text" name="dgmsRegulation" value={form.dgmsRegulation} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notice Number</label>
                <input type="text" name="noticeNumber" value={form.noticeNumber} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
            </div>
          </section>

          {/* Corrective Action */}
          <section>
            <h3 className="text-lg font-semibold text-slate-700 mb-3 border-b pb-2">Corrective Action</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea name="correctiveAction.description" value={form.correctiveAction.description} onChange={handleChange} rows={2} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                <input type="text" name="correctiveAction.assignedTo" value={form.correctiveAction.assignedTo} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                <input type="date" name="correctiveAction.deadline" value={form.correctiveAction.deadline} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Action Status</label>
                <select name="correctiveAction.status" value={form.correctiveAction.status} onChange={handleChange} className="w-full border rounded px-3 py-2">
                  <option value="Pending">Pending</option>
                  <option value="In-Progress">In-Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
          </section>

          {/* Reporter Information */}
          <section>
            <h3 className="text-lg font-semibold text-slate-700 mb-3 border-b pb-2">Reporter Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" name="reporter.name" value={form.reporter.name} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" name="reporter.email" value={form.reporter.email} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input type="text" name="reporter.phone" value={form.reporter.phone} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <input type="text" name="reporter.department" value={form.reporter.department} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
            </div>
          </section>

          <div className="flex gap-4 pt-4">
            <button type="submit" disabled={saving} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
              {saving ? 'Saving...' : 'Update Incident'}
            </button>
            <button type="button" onClick={() => navigate(`/incidents/${id}`)} className="px-6 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}