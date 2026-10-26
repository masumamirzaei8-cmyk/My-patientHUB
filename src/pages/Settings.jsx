import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getItem, setItem } from '../utils/storage';
import { Bell, Globe, Palette, Lock, LogOut, Moon, Sun, Check } from 'lucide-react';

const Settings = () => {
  const { logout } = useAuth();
  const { theme, setThemeMode } = useTheme();
  const [notifications, setNotifications] = useState(getItem('mph_notif_prefs', { email: true, push: true, sms: false }));
  const [language, setLanguage] = useState(getItem('mph_language', 'en'));
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', confirm: '' });
  const [passwordMsg, setPasswordMsg] = useState('');
  const [success, setSuccess] = useState('');

  const handleThemeChange = (t) => {
    setThemeMode(t);
    setSuccess('Theme preference saved!');
    setTimeout(() => setSuccess(''), 2000);
  };

  const handleNotifChange = (key) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    setItem('mph_notif_prefs', updated);
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setItem('mph_language', lang);
    setSuccess('Language preference saved!');
    setTimeout(() => setSuccess(''), 2000);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (passwordForm.newPass.length !== 4) { setPasswordMsg('New password must be 4 characters (demo)'); return; }
    if (passwordForm.newPass !== passwordForm.confirm) { setPasswordMsg('Passwords do not match'); return; }
    setPasswordMsg('');
    setShowChangePassword(false);
    setPasswordForm({ current: '', newPass: '', confirm: '' });
    setSuccess('Password changed successfully! (Demo)');
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2 animate-fadeIn"><Check className="w-4 h-4" /> {success}</div>}

      {/* Theme */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center"><Palette className="w-5 h-5 text-purple-600" /></div>
          <div>
            <h3 className="font-bold text-gray-800">Theme Preference</h3>
            <p className="text-xs text-gray-500">Choose your preferred appearance</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => handleThemeChange('light')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all ${theme === 'light' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
            <Sun className="w-4 h-4" /> Light
          </button>
          <button onClick={() => handleThemeChange('dark')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all ${theme === 'dark' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
            <Moon className="w-4 h-4" /> Dark
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center"><Bell className="w-5 h-5 text-blue-600" /></div>
          <div>
            <h3 className="font-bold text-gray-800">Notification Preferences</h3>
            <p className="text-xs text-gray-500">Manage how you receive notifications</p>
          </div>
        </div>
        <div className="space-y-3">
          {Object.entries(notifications).map(([key, value]) => (
            <label key={key} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 cursor-pointer hover:bg-gray-100">
              <span className="text-sm text-gray-700 capitalize">{key === 'email' ? 'Email Notifications' : key === 'push' ? 'Push Notifications' : 'SMS Notifications'}</span>
              <div className="relative">
                <input type="checkbox" checked={value} onChange={() => handleNotifChange(key)} className="sr-only peer" />
                <div className="w-10 h-5 bg-gray-300 rounded-full peer-checked:bg-purple-500 transition-colors"></div>
                <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-5 transition-transform"></div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Language */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center"><Globe className="w-5 h-5 text-green-600" /></div>
          <div>
            <h3 className="font-bold text-gray-800">Language</h3>
            <p className="text-xs text-gray-500">Select your preferred language</p>
          </div>
        </div>
        <select value={language} onChange={e => handleLanguageChange(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm">
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
          <option value="de">Deutsch</option>
          <option value="zh">中文</option>
          <option value="ar">العربية</option>
        </select>
        <p className="text-xs text-gray-400 mt-2">Language change applies to the interface (demo — content remains in English)</p>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center"><Lock className="w-5 h-5 text-amber-600" /></div>
          <div>
            <h3 className="font-bold text-gray-800">Change Password</h3>
            <p className="text-xs text-gray-500">Update your account password</p>
          </div>
        </div>
        {!showChangePassword ? (
          <button onClick={() => setShowChangePassword(true)} className="btn-secondary text-sm py-2">Change Password</button>
        ) : (
          <form onSubmit={handleChangePassword} className="space-y-3">
            {passwordMsg && <p className="text-red-500 text-sm">{passwordMsg}</p>}
            <input type="password" placeholder="Current password" value={passwordForm.current} onChange={e => setPasswordForm({ ...passwordForm, current: e.target.value })}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm" />
            <input type="password" placeholder="New password (4 chars - demo)" value={passwordForm.newPass} onChange={e => setPasswordForm({ ...passwordForm, newPass: e.target.value })}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm" />
            <input type="password" placeholder="Confirm new password" value={passwordForm.confirm} onChange={e => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm" />
            <div className="flex gap-3">
              <button type="button" onClick={() => { setShowChangePassword(false); setPasswordMsg(''); }} className="flex-1 btn-secondary py-2.5 text-sm">Cancel</button>
              <button type="submit" className="flex-1 btn-primary py-2.5 text-sm">Update Password</button>
            </div>
          </form>
        )}
      </div>

      {/* Sign Out */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <button onClick={logout} className="flex items-center gap-3 text-red-600 hover:bg-red-50 px-4 py-3 rounded-xl w-full transition-colors">
          <LogOut className="w-5 h-5" />
          <div className="text-left">
            <p className="font-medium text-sm">Sign Out</p>
            <p className="text-xs text-gray-400">End your current session</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Settings;
