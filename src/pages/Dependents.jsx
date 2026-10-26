import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Edit, Trash2, X, Users, Eye } from 'lucide-react';
import { formatDate } from '../utils/formatters';

const Dependents = () => {
  const { dependents, addDependent, updateDependent, deleteDependent } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [form, setForm] = useState({ name: '', relationship: '', dob: '', phone: '', notes: '' });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  const openAdd = () => { setForm({ name: '', relationship: '', dob: '', phone: '', notes: '' }); setEditing(null); setShowForm(true); setErrors({}); };
  const openEdit = (dep) => { setForm({ name: dep.name, relationship: dep.relationship, dob: dep.dob, phone: dep.phone || '', notes: dep.notes || '' }); setEditing(dep); setShowForm(true); setErrors({}); };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.relationship.trim()) errs.relationship = 'Relationship is required';
    if (!form.dob) errs.dob = 'Date of birth is required';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    if (editing) {
      updateDependent(editing.id, form);
      setSuccess('Dependent updated successfully!');
    } else {
      addDependent(form);
      setSuccess('Dependent added successfully!');
    }
    setShowForm(false);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleDelete = (id) => {
    deleteDependent(id);
    setDeleteConfirm(null);
    setSuccess('Dependent removed.');
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="space-y-6">
      {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm animate-fadeIn">{success}</div>}

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">My Dependents</h2>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Add Dependent
        </button>
      </div>

      {dependents.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-2">No dependents added yet</p>
          <button onClick={openAdd} className="text-purple-600 text-sm hover:underline">Add your first dependent</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dependents.map(dep => (
            <div key={dep.id} className="dependent-card">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center text-lg font-bold text-purple-700">
                    {dep.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{dep.name}</h3>
                    <p className="text-xs text-gray-500">{dep.relationship}</p>
                  </div>
                </div>
              </div>
              <div className="mt-3 space-y-1 text-xs text-gray-500">
                <p>DOB: {formatDate(dep.dob)}</p>
                {dep.phone && <p>Phone: {dep.phone}</p>}
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => setViewing(dep)} className="flex-1 text-xs py-2 rounded-lg border border-gray-200 hover:bg-gray-50 font-medium flex items-center justify-center gap-1">
                  <Eye className="w-3 h-3" /> View
                </button>
                <button onClick={() => openEdit(dep)} className="flex-1 text-xs py-2 rounded-lg border border-gray-200 hover:bg-gray-50 font-medium flex items-center justify-center gap-1">
                  <Edit className="w-3 h-3" /> Edit
                </button>
                <button onClick={() => setDeleteConfirm(dep.id)} className="text-xs py-2 px-3 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 font-medium">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">{editing ? 'Edit' : 'Add'} Dependent</h3>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className={`w-full px-3 py-2.5 border rounded-xl text-sm ${errors.name ? 'border-red-300' : 'border-gray-200'}`} />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Relationship *</label>
                <select value={form.relationship} onChange={e => setForm({ ...form, relationship: e.target.value })}
                  className={`w-full px-3 py-2.5 border rounded-xl text-sm ${errors.relationship ? 'border-red-300' : 'border-gray-200'}`}>
                  <option value="">Select relationship</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Child">Child</option>
                  <option value="Parent">Parent</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Other">Other</option>
                </select>
                {errors.relationship && <p className="text-red-500 text-xs mt-1">{errors.relationship}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
                <input type="date" value={form.dob} onChange={e => setForm({ ...form, dob: e.target.value })}
                  className={`w-full px-3 py-2.5 border rounded-xl text-sm ${errors.dob ? 'border-red-300' : 'border-gray-200'}`} />
                {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input type="text" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Optional"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} placeholder="Optional notes..."
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm resize-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 btn-secondary py-2.5">Cancel</button>
                <button type="submit" className="flex-1 btn-primary py-2.5">{editing ? 'Update' : 'Add'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Dependent Details</h3>
              <button onClick={() => setViewing(null)} className="p-2 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="text-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center text-2xl font-bold text-purple-700 mx-auto mb-2">
                {viewing.name.charAt(0)}
              </div>
              <h4 className="font-bold text-gray-800">{viewing.name}</h4>
              <p className="text-sm text-gray-500">{viewing.relationship}</p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-gray-500">Date of Birth</span><span className="font-medium">{formatDate(viewing.dob)}</span></div>
              {viewing.phone && <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-gray-500">Phone</span><span className="font-medium">{viewing.phone}</span></div>}
              {viewing.notes && <div className="py-2"><span className="text-gray-500">Notes:</span><p className="mt-1">{viewing.notes}</p></div>}
            </div>
            <button onClick={() => setViewing(null)} className="w-full btn-primary mt-4 py-2.5">Close</button>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-7 h-7 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Remove Dependent?</h3>
            <p className="text-sm text-gray-500 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 btn-secondary py-2.5">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 btn-danger py-2.5">Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dependents;
