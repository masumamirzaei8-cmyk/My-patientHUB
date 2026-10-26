import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { doctors } from '../data/doctors';
import { clinics } from '../data/clinics';
import { products } from '../data/products';
import {
  Search, Bell, Settings, Menu, LogOut, User
} from 'lucide-react';

const pageNames = {
  '/dashboard': 'Dashboard',
  '/appointments': 'Appointments',
  '/find-doctor': 'Find Doctor',
  '/find-clinic': 'Find Clinic',
  '/chat': 'Chat',
  '/marketplace': 'Marketplace',
  '/find-pharmacy': 'Find Pharmacy',
  '/dependents': 'My Dependents',
  '/account': 'My Account',
  '/settings': 'Settings',
  '/support': 'Help & Support',
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const { notifications, markAllNotificationsRead, toggleSidebar } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const searchRef = useRef(null);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSearch(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.length < 2) { setSearchResults([]); return; }
    const q = query.toLowerCase();
    const results = [];
    doctors.filter(d => d.name.toLowerCase().includes(q) || d.specialty.toLowerCase().includes(q))
      .forEach(d => results.push({ type: 'Doctor', name: d.name, sub: d.specialty, path: '/find-doctor', id: d.id }));
    clinics.filter(c => c.name.toLowerCase().includes(q) || c.specialties.some(s => s.toLowerCase().includes(q)))
      .forEach(c => results.push({ type: 'Clinic', name: c.name, sub: c.address.split(',')[0], path: '/find-clinic', id: c.id }));
    products.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
      .forEach(p => results.push({ type: 'Product', name: p.name, sub: `$${p.price}`, path: '/marketplace', id: p.id }));
    setSearchResults(results.slice(0, 8));
    setShowSearch(true);
  };

  const handleResultClick = (result) => {
    navigate(result.path);
    setSearchQuery('');
    setSearchResults([]);
    setShowSearch(false);
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      {/* Left side */}
      <div className="flex items-center gap-3">
        <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-gray-100 lg:hidden">
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden sm:block">
          <p className="text-xs text-gray-400">MyPatientHUB / {pageNames[location.pathname] || 'Page'}</p>
          <h2 className="text-lg font-bold text-gray-800">{pageNames[location.pathname] || 'Page'}</h2>
        </div>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-md mx-4 relative" ref={searchRef}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search doctors, clinics, products..."
            value={searchQuery}
            onChange={e => handleSearch(e.target.value)}
            onFocus={() => searchResults.length > 0 && setShowSearch(true)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white"
          />
        </div>
        {showSearch && searchResults.length > 0 && (
          <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50 animate-fadeIn">
            {searchResults.map((r, i) => (
              <button key={i} onClick={() => handleResultClick(r)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left border-b border-gray-50 last:border-0">
                <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded">{r.type}</span>
                <div>
                  <p className="text-sm font-medium text-gray-800">{r.name}</p>
                  <p className="text-xs text-gray-500">{r.sub}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 rounded-lg hover:bg-gray-100 relative">
            <Bell className="w-5 h-5 text-gray-600" />
            {unreadCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">{unreadCount}</span>}
          </button>
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50 animate-fadeIn">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800">Notifications</h3>
                <button onClick={markAllNotificationsRead} className="text-xs text-purple-600 hover:underline">Mark all read</button>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className={`px-4 py-3 border-b border-gray-50 ${!n.read ? 'bg-purple-50/50' : ''}`}>
                    <p className="text-sm font-medium text-gray-800">{n.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Settings */}
        <button onClick={() => navigate('/settings')} className="p-2 rounded-lg hover:bg-gray-100 hidden sm:block">
          <Settings className="w-5 h-5 text-gray-600" />
        </button>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button onClick={() => setShowProfile(!showProfile)} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <span className="text-sm font-medium text-gray-700 hidden md:block">{user?.name || 'User'}</span>
          </button>
          {showProfile && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50 animate-fadeIn">
              <button onClick={() => { navigate('/account'); setShowProfile(false); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-sm">My Account</span>
              </button>
              <button onClick={() => { navigate('/settings'); setShowProfile(false); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left">
                <Settings className="w-4 h-4 text-gray-500" />
                <span className="text-sm">Settings</span>
              </button>
              <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-left text-red-600 border-t border-gray-100">
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
