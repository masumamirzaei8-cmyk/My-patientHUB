import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doctors, specialties } from '../data/doctors';
import { Search, MapPin, Clock, X } from 'lucide-react';
import SafeImage from '../components/SafeImage';

const FindDoctor = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const filtered = doctors.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.specialty.toLowerCase().includes(search.toLowerCase());
    const matchSpecialty = !specialty || d.specialty === specialty;
    return matchSearch && matchSpecialty;
  });

  const doctor = selectedDoctor ? doctors.find(d => d.id === selectedDoctor) : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search doctors by name or specialty..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm" />
        </div>
        <select value={specialty} onChange={e => setSpecialty(e.target.value)} className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm">
          <option value="">All Specialties</option>
          {specialties.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(d => (
          <div key={d.id} className="doctor-card">
            <div className="doctor-card-image">
              <SafeImage
                src={d.image}
                alt={d.name}
                fallback={<span className="flex items-center justify-center w-full h-full text-6xl">👨‍⚕️</span>}
              />
            </div>
            <div className="p-5">
              <div className="mb-3">
                <h3 className="font-bold text-gray-800 text-base">{d.name}</h3>
                <p className="text-sm text-pink-600 font-medium">{d.specialty}</p>
              </div>
              <div className="space-y-1.5 text-xs text-gray-500">
                <div className="flex items-center gap-2"><Clock className="w-3 h-3" /> {d.experience} years exp.</div>
                <div className="flex items-center gap-2"><MapPin className="w-3 h-3" /> {d.clinic}</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 font-bold text-gray-500">AF</span> {d.fee} consultation</div>
              </div>
            </div>
            <div className="border-t border-gray-100 p-3 flex gap-2">
              <button onClick={() => setSelectedDoctor(d.id)} className="flex-1 text-xs py-2 rounded-lg border border-gray-200 hover:bg-gray-50 font-medium text-gray-700 transition-colors">
                View Profile
              </button>
              <button onClick={() => navigate('/appointments')} className="flex-1 text-xs py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 text-white font-medium hover:opacity-90 transition-opacity">
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-gray-500">No doctors found matching your search.</p>
          <button onClick={() => { setSearch(''); setSpecialty(''); }} className="text-purple-600 text-sm mt-2 hover:underline">Clear filters</button>
        </div>
      )}

      {doctor && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Doctor Profile</h3>
              <button onClick={() => setSelectedDoctor(null)} className="p-2 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 overflow-hidden flex-shrink-0">
                <SafeImage
                  src={doctor.image}
                  alt={doctor.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center center' }}
                  fallback={<span className="flex items-center justify-center w-full h-full text-4xl">👨‍⚕️</span>}
                />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-800">{doctor.name}</h4>
                <p className="text-purple-600 font-medium">{doctor.specialty}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <h5 className="text-sm font-semibold text-gray-700 mb-1">About</h5>
                <p className="text-sm text-gray-600">{doctor.bio}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500">Experience</p>
                  <p className="text-sm font-bold text-gray-800">{doctor.experience} years</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500">Consultation Fee</p>
                  <p className="text-sm font-bold text-gray-800">AF {doctor.fee}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500">Availability</p>
                  <p className="text-sm font-bold text-gray-800">{doctor.availability}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500">Clinic</p>
                  <p className="text-sm font-bold text-gray-800">{doctor.clinic}</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <h5 className="text-sm font-semibold text-gray-700 mb-1">Languages</h5>
                <div className="flex flex-wrap gap-2">
                  {doctor.languages.map(l => <span key={l} className="px-2 py-1 bg-white rounded-lg text-xs text-gray-600 border border-gray-200">{l}</span>)}
                </div>
              </div>
            </div>
            <button onClick={() => { setSelectedDoctor(null); navigate('/appointments'); }} className="w-full btn-primary mt-6 py-3">
              Book Appointment with {doctor.name}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindDoctor;
