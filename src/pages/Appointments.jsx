import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { doctors } from '../data/doctors';
import { clinics } from '../data/clinics';
import { Search, Plus, X, Eye, Trash2, Calendar as CalendarIcon } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { formatDate, formatTime, isDateInPast } from '../utils/formatters';
import toast from 'react-hot-toast';

const Appointments = () => {
  const { appointments, addAppointment, cancelAppointment } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showBooking, setShowBooking] = useState(false);
  const [showDetail, setShowDetail] = useState(null);
  const [cancelConfirm, setCancelConfirm] = useState(null);
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({ doctorId: '', clinicId: '', date: '', time: '', notes: '' });
  const [formErrors, setFormErrors] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);

  const filtered = appointments.filter(a => {
    const matchSearch = a.doctorName.toLowerCase().includes(search.toLowerCase()) || a.specialty.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleBook = (e) => {
    e.preventDefault();
    const errors = {};
    if (!form.doctorId) errors.doctorId = 'Please select a doctor';
    if (!form.date) errors.date = 'Please select a date';
    if (!form.time) errors.time = 'Please select a time';
    if (form.date && isDateInPast(form.date)) errors.date = 'Cannot book past dates';
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const doctor = doctors.find(d => d.id === form.doctorId);
    const clinic = clinics.find(c => c.id === form.clinicId) || clinics[0];
    addAppointment({
      doctorId: form.doctorId, doctorName: doctor?.name || '', specialty: doctor?.specialty || '',
      clinicId: clinic.id, clinicName: clinic.name, date: form.date, time: form.time, notes: form.notes
    });
    setForm({ doctorId: '', clinicId: '', date: '', time: '', notes: '' });
    setShowBooking(false);
    toast.success('Appointment booked successfully!');
  };

  const handleCancel = (id) => {
    cancelAppointment(id);
    setCancelConfirm(null);
    toast.success('Appointment cancelled.');
  };

  const detail = showDetail ? appointments.find(a => a.id === showDetail) : null;
  const selectedDoctor = doctors.find(d => d.id === form.doctorId);

  const statusColors = {
    upcoming: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search appointments..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm" />
        </div>
        <div className="flex gap-2">
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm">
            <option value="all">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button onClick={() => setShowBooking(true)} className="btn-primary flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" /> Book New
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto responsive-table">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Doctor</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Specialty</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date & Time</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Clinic</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(apt => (
                <tr key={apt.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-800">{apt.doctorName}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <p className="text-sm text-gray-600">{apt.specialty}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-800">{formatDate(apt.date)}</p>
                    <p className="text-xs text-gray-500">{formatTime(apt.time)}</p>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <p className="text-sm text-gray-600">{apt.clinicName}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[apt.status]}`}>
                      {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => setShowDetail(apt.id)} className="p-1.5 rounded-lg hover:bg-purple-50 text-purple-600" title="View Details">
                        <Eye className="w-4 h-4" />
                      </button>
                      {apt.status === 'upcoming' && (
                        <button onClick={() => setCancelConfirm(apt.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500" title="Cancel">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No appointments found</p>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showBooking && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Book Appointment</h3>
              <button onClick={() => setShowBooking(false)} className="p-2 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleBook} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Doctor *</label>
                <select value={form.doctorId} onChange={e => { setForm({ ...form, doctorId: e.target.value }); setFormErrors({}); }}
                  className={`w-full px-3 py-2.5 border rounded-xl text-sm ${formErrors.doctorId ? 'border-red-300' : 'border-gray-200'}`}>
                  <option value="">Select a doctor</option>
                  {doctors.map(d => <option key={d.id} value={d.id}>{d.name} - {d.specialty}</option>)}
                </select>
                {formErrors.doctorId && <p className="text-red-500 text-xs mt-1">{formErrors.doctorId}</p>}
              </div>
              {selectedDoctor && (
                <div className="bg-purple-50 rounded-xl p-3 text-sm">
                  <p className="font-medium text-purple-800">{selectedDoctor.name}</p>
                  <p className="text-purple-600">{selectedDoctor.specialty} • {selectedDoctor.clinic}</p>
                  <p className="text-purple-600">Fee: ${selectedDoctor.fee} • Available: {selectedDoctor.availability}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Clinic</label>
                <select value={form.clinicId} onChange={e => setForm({ ...form, clinicId: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm">
                  <option value="">Auto-assigned</option>
                  {clinics.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                  <button
                    type="button"
                    onClick={() => setShowDatePicker(!showDatePicker)}
                    className={`w-full px-3 py-2.5 border rounded-xl text-sm text-left flex items-center justify-between ${formErrors.date ? 'border-red-300' : 'border-gray-200'} ${form.date ? 'text-gray-800' : 'text-gray-400'}`}
                  >
                    <span>{form.date ? format(new Date(form.date), 'MMM dd, yyyy') : 'Select date'}</span>
                    <CalendarIcon className="w-4 h-4" />
                  </button>
                  {showDatePicker && (
                    <div className="absolute z-50 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 p-3">
                      <DayPicker
                        mode="single"
                        selected={form.date ? new Date(form.date) : undefined}
                        onSelect={(date) => {
                          if (date) {
                            setForm({ ...form, date: format(date, 'yyyy-MM-dd') });
                            setShowDatePicker(false);
                          }
                        }}
                        disabled={{ before: new Date() }}
                        className="rdp"
                      />
                    </div>
                  )}
                  {formErrors.date && <p className="text-red-500 text-xs mt-1">{formErrors.date}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
                  <select value={form.time} onChange={e => setForm({ ...form, time: e.target.value })}
                    className={`w-full px-3 py-2.5 border rounded-xl text-sm ${formErrors.time ? 'border-red-300' : 'border-gray-200'}`}>
                    <option value="">Select time</option>
                    {['09:00','09:30','10:00','10:30','11:00','11:30','14:00','14:30','15:00','15:30','16:00','16:30'].map(t => (
                      <option key={t} value={t}>{formatTime(t)}</option>
                    ))}
                  </select>
                  {formErrors.time && <p className="text-red-500 text-xs mt-1">{formErrors.time}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3} placeholder="Describe your symptoms or reason for visit..."
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm resize-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowBooking(false)} className="flex-1 btn-secondary py-2.5">Cancel</button>
                <button type="submit" className="flex-1 btn-primary py-2.5">Book Appointment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detail && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Appointment Details</h3>
              <button onClick={() => setShowDetail(null)} className="p-2 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Doctor</span>
                <span className="text-sm font-medium">{detail.doctorName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Specialty</span>
                <span className="text-sm font-medium">{detail.specialty}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Date</span>
                <span className="text-sm font-medium">{formatDate(detail.date)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Time</span>
                <span className="text-sm font-medium">{formatTime(detail.time)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Clinic</span>
                <span className="text-sm font-medium">{detail.clinicName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Status</span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[detail.status]}`}>{detail.status}</span>
              </div>
              {detail.notes && (
                <div className="py-2">
                  <span className="text-sm text-gray-500">Notes:</span>
                  <p className="text-sm mt-1">{detail.notes}</p>
                </div>
              )}
            </div>
            <button onClick={() => setShowDetail(null)} className="w-full btn-primary mt-4 py-2.5">Close</button>
          </div>
        </div>
      )}

      {/* Cancel Confirm */}
      {cancelConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-7 h-7 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Cancel Appointment?</h3>
            <p className="text-sm text-gray-500 mb-6">This action cannot be undone. The appointment will be marked as cancelled.</p>
            <div className="flex gap-3">
              <button onClick={() => setCancelConfirm(null)} className="flex-1 btn-secondary py-2.5">Keep It</button>
              <button onClick={() => handleCancel(cancelConfirm)} className="flex-1 btn-danger py-2.5">Cancel It</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
