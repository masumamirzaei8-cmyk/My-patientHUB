import React, { useState } from 'react';
import { pharmacies } from '../data/pharmacies';
import { Search, MapPin, Phone, Clock, Truck, X, Star } from 'lucide-react';

const FindPharmacy = () => {
  const [search, setSearch] = useState('');
  const [deliveryOnly, setDeliveryOnly] = useState(false);
  const [selected, setSelected] = useState(null);

  const filtered = pharmacies.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.address.toLowerCase().includes(search.toLowerCase());
    const matchDelivery = !deliveryOnly || p.delivery;
    return matchSearch && matchDelivery;
  });

  const pharmacy = selected ? pharmacies.find(p => p.id === selected) : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search pharmacies..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm" />
        </div>
        <label className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl cursor-pointer">
          <input type="checkbox" checked={deliveryOnly} onChange={e => setDeliveryOnly(e.target.checked)} className="w-4 h-4 rounded text-purple-600" />
          <span className="text-sm text-gray-700">Delivery Available</span>
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(p => (
          <div key={p.id} className="facility-card p-5">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center text-2xl flex-shrink-0">
                {p.image}
              </div>
              <div>
                <h3 className="font-bold text-gray-800">{p.name}</h3>
                <div className="flex items-center gap-1 mt-0.5">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span className="text-xs text-gray-600">{p.rating}</span>
                  {p.delivery && <span className="ml-2 px-1.5 py-0.5 bg-green-50 text-green-700 text-[10px] rounded-full font-medium flex items-center gap-0.5"><Truck className="w-2.5 h-2.5" /> Delivery</span>}
                </div>
              </div>
            </div>
            <div className="space-y-1.5 text-xs text-gray-500">
              <div className="flex items-center gap-2"><MapPin className="w-3 h-3 flex-shrink-0" /> <span className="truncate">{p.address}</span></div>
              <div className="flex items-center gap-2"><Phone className="w-3 h-3" /> {p.phone}</div>
              <div className="flex items-center gap-2"><Clock className="w-3 h-3" /> {p.hours}</div>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {p.categories.map(c => <span key={c} className="px-2 py-0.5 bg-green-50 text-green-700 rounded-full text-[10px] font-medium">{c}</span>)}
            </div>
            <button onClick={() => setSelected(p.id)} className="w-full mt-3 text-xs py-2 rounded-lg border border-gray-200 hover:bg-gray-50 font-medium text-gray-700">
              View Details
            </button>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <div className="text-4xl mb-3">💊</div>
          <p className="text-gray-500">No pharmacies found.</p>
        </div>
      )}

      {pharmacy && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Pharmacy Details</h3>
              <button onClick={() => setSelected(null)} className="p-2 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center text-3xl">{pharmacy.image}</div>
              <div>
                <h4 className="text-lg font-bold text-gray-800">{pharmacy.name}</h4>
                <div className="flex items-center gap-1"><Star className="w-4 h-4 text-amber-400 fill-amber-400" /><span className="text-sm text-gray-600">{pharmacy.rating}</span></div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-400" /> {pharmacy.address}</div>
                <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" /> {pharmacy.phone}</div>
                <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-gray-400" /> {pharmacy.hours}</div>
                <div className="flex items-center gap-2"><Truck className="w-4 h-4 text-gray-400" /> {pharmacy.delivery ? 'Delivery available' : 'No delivery'}</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <h5 className="text-sm font-semibold text-gray-700 mb-2">Available Categories</h5>
                <div className="flex flex-wrap gap-2">
                  {pharmacy.categories.map(c => <span key={c} className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">{c}</span>)}
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-4 text-center">Demo — no real prescriptions or orders are processed.</p>
            <button onClick={() => setSelected(null)} className="w-full btn-primary mt-4 py-2.5">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindPharmacy;
