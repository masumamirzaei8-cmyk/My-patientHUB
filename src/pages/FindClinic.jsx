import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clinics } from '../data/clinics';
import { doctors } from '../data/doctors';
import { Search, MapPin, Phone, Clock, Star, X, Users } from 'lucide-react';
import AfghanistanMap from '../components/AfghanistanMap';
import SafeImage from '../components/SafeImage';

const FindClinic = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [showMap, setShowMap] = useState(true);

  const filtered = clinics.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.specialties.some(s => s.toLowerCase().includes(search.toLowerCase())) ||
    c.address.toLowerCase().includes(search.toLowerCase())
  );

  const clinic = selectedClinic ? clinics.find(c => c.id === selectedClinic) : null;
  const clinicDoctors = clinic ? doctors.filter(d => d.clinicId === clinic.id) : [];

  return (
    <div className="space-y-6">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" placeholder="Search clinics by name, specialty, or location..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm" />
      </div>

      {/* Afghanistan Map */}
      {showMap && (
        <div className="relative">
          <button onClick={() => setShowMap(false)} className="absolute top-2 right-2 z-10 bg-white rounded-lg p-1.5 shadow-md hover:bg-gray-50" title="Hide map">
            <X className="w-4 h-4 text-gray-600" />
          </button>
          <AfghanistanMap clinics={clinics} onClinicClick={(c) => setSelectedClinic(c.id)} selectedClinic={selectedClinic} />
        </div>
      )}

      {!showMap && (
        <button onClick={() => setShowMap(true)} className="btn-secondary flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4" /> Show Afghanistan Map
        </button>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(c => (
          <div key={c.id} className="facility-card">
            <div className="p-5">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-2xl flex-shrink-0">
                  {c.image}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{c.name}</h3>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-xs text-gray-600">{c.rating}</span>
                    {c.country === 'Afghanistan' && <span className="ml-1 text-xs">🇦🇫</span>}
                  </div>
                </div>
              </div>
              <div className="space-y-1.5 text-xs text-gray-500">
                <div className="flex items-center gap-2"><MapPin className="w-3 h-3 flex-shrink-0" /> <span className="truncate">{c.address}</span></div>
                <div className="flex items-center gap-2"><Phone className="w-3 h-3" /> {c.phone}</div>
                <div className="flex items-center gap-2"><Clock className="w-3 h-3" /> {c.hours}</div>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {c.specialties.map(s => <span key={s} className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full text-[10px] font-medium">{s}</span>)}
              </div>
            </div>
            <div className="border-t border-gray-100 p-3 flex gap-2">
              <button onClick={() => setSelectedClinic(c.id)} className="flex-1 text-xs py-2 rounded-lg border border-gray-200 hover:bg-gray-50 font-medium text-gray-700">
                View Details
              </button>
              <button onClick={() => navigate('/appointments')} className="flex-1 text-xs py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 text-white font-medium hover:opacity-90">
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <div className="text-4xl mb-3">🏥</div>
          <p className="text-gray-500">No clinics found matching your search.</p>
        </div>
      )}

      {clinic && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Clinic Details</h3>
              <button onClick={() => setSelectedClinic(null)} className="p-2 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-3xl">
                {clinic.image}
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-800">{clinic.name}</h4>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-sm text-gray-600">{clinic.rating} rating</span>
                  {clinic.country === 'Afghanistan' && <span className="ml-1">🇦🇫</span>}
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm"><MapPin className="w-4 h-4 text-gray-400" /> <span>{clinic.address}</span></div>
                <div className="flex items-center gap-2 text-sm"><Phone className="w-4 h-4 text-gray-400" /> <span>{clinic.phone}</span></div>
                <div className="flex items-center gap-2 text-sm"><Clock className="w-4 h-4 text-gray-400" /> <span>{clinic.hours}</span></div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <h5 className="text-sm font-semibold text-gray-700 mb-2">Specialties</h5>
                <div className="flex flex-wrap gap-2">
                  {clinic.specialties.map(s => <span key={s} className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium">{s}</span>)}
                </div>
              </div>
              {clinicDoctors.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <h5 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"><Users className="w-4 h-4" /> Doctors</h5>
                  <div className="space-y-2">
                    {clinicDoctors.map(d => (
                      <div key={d.id} className="flex items-center gap-3 bg-white rounded-lg p-2">
                        <SafeImage src={d.image} alt={d.name} className="w-9 h-9 rounded-full object-cover" fallback={<span className="text-lg">👨‍⚕️</span>} />
                        <div>
                          <p className="text-sm font-medium text-gray-800">{d.name}</p>
                          <p className="text-xs text-gray-500">{d.specialty}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button onClick={() => { setSelectedClinic(null); navigate('/appointments'); }} className="w-full btn-primary mt-6 py-3">
              Book Appointment at {clinic.name}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindClinic;
