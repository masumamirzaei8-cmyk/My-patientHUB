import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { validatePhone } from '../utils/validation';
import { User, Mail, Phone, Calendar, MapPin, Save, X, Edit, Camera, Trash2 } from 'lucide-react';

const MyAccount = () => {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imageError, setImageError] = useState('');
  const fileInputRef = useRef(null);
  
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    dob: user?.dob || '',
    address: user?.address || '',
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  // Load profile image from localStorage on mount
  useEffect(() => {
    const savedImage = localStorage.getItem(`profile_image_${user?.id}`);
    if (savedImage) {
      setProfileImage(savedImage);
    }
  }, [user?.id]);

  const handleSave = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    const phoneResult = validatePhone(form.phone);
    if (!phoneResult.valid) errs.phone = phoneResult.message;
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    updateProfile({ name: form.name, phone: form.phone, dob: form.dob, address: form.address });
    setEditing(false);
    setSuccess('Profile updated successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleCancel = () => {
    setForm({ name: user?.name || '', phone: user?.phone || '', dob: user?.dob || '', address: user?.address || '' });
    setEditing(false);
    setErrors({});
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setImageError('Invalid file type. Please upload JPG, PNG, or WebP images.');
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      setImageError('File size exceeds 5MB. Please choose a smaller image.');
      return;
    }

    setImageError('');

    // Read file and convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result;
      setProfileImage(base64Image);
      
      // Save to localStorage for this user
      if (user?.id) {
        localStorage.setItem(`profile_image_${user.id}`, base64Image);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    setImageError('');
    if (user?.id) {
      localStorage.removeItem(`profile_image_${user.id}`);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm animate-fadeIn">
          {success}
        </div>
      )}

      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
        {/* Gradient Banner */}
        <div className="h-32 bg-gradient-to-br from-purple-600 via-pink-500 to-rose-400 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
              <path d="M0,50 Q100,20 200,50 T400,50 L400,100 L0,100 Z" fill="white" opacity="0.3"/>
              <path d="M0,70 Q100,40 200,70 T400,70 L400,100 L0,100 Z" fill="white" opacity="0.2"/>
            </svg>
          </div>
        </div>

        {/* Profile Info Section */}
        <div className="px-6 pb-6 pt-0">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-16 relative z-10">
            {/* Profile Picture */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-2xl bg-white border-4 border-white shadow-xl overflow-hidden flex items-center justify-center">
                {profileImage ? (
                  <img 
                    src={profileImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover object-center"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center text-4xl font-bold text-purple-700">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                )}
              </div>
              
              {/* Upload/Change Photo Button */}
              <button
                onClick={triggerFileInput}
                className="absolute bottom-2 right-2 w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all hover:scale-110"
                aria-label="Upload profile photo"
                title="Upload photo"
              >
                <Camera className="w-5 h-5" />
              </button>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageUpload}
                className="hidden"
                aria-label="Choose profile photo file"
              />
            </div>

            {/* User Info */}
            <div className="flex-1 pb-2">
              <h2 className="text-2xl font-bold text-gray-800">{user?.name || 'User'}</h2>
              <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                <Mail className="w-4 h-4" />
                {user?.email}
              </p>
              
              {/* Photo action buttons */}
              {profileImage && (
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={triggerFileInput}
                    className="text-xs px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors font-medium"
                  >
                    Change Photo
                  </button>
                  <button
                    onClick={handleRemoveImage}
                    className="text-xs px-3 py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-medium flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Image upload error message */}
          {imageError && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {imageError}
            </div>
          )}

          {/* Image upload info */}
          <div className="mt-4 text-xs text-gray-400">
            <p>Supported formats: JPG, PNG, WebP. Maximum size: 5MB.</p>
            <p className="mt-1 text-gray-400 italic">
              Note: Profile pictures are stored locally in your browser and will not sync across devices.
            </p>
          </div>
        </div>
      </div>

      {/* Profile Form Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-800">Profile Information</h3>
          {!editing && (
            <button 
              onClick={() => setEditing(true)} 
              className="btn-secondary flex items-center gap-2 text-sm py-2"
              aria-label="Edit profile information"
            >
              <Edit className="w-4 h-4" /> Edit Profile
            </button>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="form-label" htmlFor="name">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                id="name"
                type="text" 
                value={form.name} 
                onChange={e => setForm({ ...form, name: e.target.value })} 
                disabled={!editing}
                className={`form-input pl-10 ${!editing ? 'bg-gray-50' : ''} ${errors.name ? 'border-red-300' : ''}`} 
              />
            </div>
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Email Address */}
          <div>
            <label className="form-label" htmlFor="email">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                id="email"
                type="email" 
                value={user?.email || ''} 
                disabled 
                className="form-input pl-10 bg-gray-50" 
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
          </div>

          {/* Phone Number */}
          <div>
            <label className="form-label" htmlFor="phone">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                id="phone"
                type="text" 
                value={form.phone} 
                onChange={e => setForm({ ...form, phone: e.target.value })} 
                disabled={!editing} 
                placeholder="+1 (555) 123-4567"
                className={`form-input pl-10 ${!editing ? 'bg-gray-50' : ''} ${errors.phone ? 'border-red-300' : ''}`} 
              />
            </div>
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>

          {/* Date of Birth */}
          <div>
            <label className="form-label" htmlFor="dob">Date of Birth</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                id="dob"
                type="date" 
                value={form.dob} 
                onChange={e => setForm({ ...form, dob: e.target.value })} 
                disabled={!editing}
                className={`form-input pl-10 ${!editing ? 'bg-gray-50' : ''}`} 
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="form-label" htmlFor="address">Address</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <textarea 
                id="address"
                value={form.address} 
                onChange={e => setForm({ ...form, address: e.target.value })} 
                disabled={!editing} 
                rows={2} 
                placeholder="Your address..."
                className={`form-input pl-10 resize-none ${!editing ? 'bg-gray-50' : ''}`} 
              />
            </div>
          </div>

          {/* Action Buttons */}
          {editing && (
            <div className="flex gap-3 pt-2">
              <button 
                type="button" 
                onClick={handleCancel} 
                className="flex-1 btn-secondary py-2.5 flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
              <button 
                type="submit" 
                className="flex-1 btn-primary py-2.5 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default MyAccount;
