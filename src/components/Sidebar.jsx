import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard, Calendar, Stethoscope, Building2, MessageCircle,
  ShoppingBag, Pill, Users, UserCircle, Settings, LogOut, ChevronLeft, ChevronRight, Heart, HelpCircle
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/appointments', label: 'Appointments', icon: Calendar },
  { path: '/find-doctor', label: 'Find Doctor', icon: Stethoscope },
  { path: '/find-clinic', label: 'Find Clinic', icon: Building2 },
  { path: '/chat', label: 'Chat', icon: MessageCircle },
  { path: '/marketplace', label: 'Marketplace', icon: ShoppingBag },
  { path: '/find-pharmacy', label: 'Find Pharmacy', icon: Pill },
  { path: '/dependents', label: 'My Dependents', icon: Users },
  { path: '/account', label: 'My Account', icon: UserCircle },
  { path: '/settings', label: 'Settings', icon: Settings },
  { path: '/support', label: 'Help & Support', icon: HelpCircle },
];

const Sidebar = () => {
  const { logout } = useAuth();
  const { sidebarCollapsed, toggleSidebar } = useApp();
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {!sidebarCollapsed && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={toggleSidebar} />
      )}
      <aside className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-50 transition-all duration-300 flex flex-col
        ${sidebarCollapsed ? '-translate-x-full lg:translate-x-0 lg:w-20' : 'translate-x-0 w-64'}
      `}>
        {/* Logo */}
        <div className="p-4 flex items-center gap-3 border-b border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center flex-shrink-0">
            <Heart className="w-5 h-5 text-white" />
          </div>
          {!sidebarCollapsed && (
            <div className="animate-fadeIn">
              <h1 className="text-lg font-bold text-gray-800 leading-tight">MyPatient</h1>
              <p className="text-xs text-purple-600 font-semibold -mt-0.5">HUB</p>
            </div>
          )}
          <button onClick={toggleSidebar} className="ml-auto p-1 rounded-lg hover:bg-gray-100 hidden lg:block">
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
                ${location.pathname === item.path
                  ? 'sidebar-active shadow-md'
                  : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'
                }
                ${sidebarCollapsed ? 'lg:justify-center lg:px-2' : ''}
              `}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 ${location.pathname === item.path ? 'text-white' : 'text-gray-400 group-hover:text-purple-600'}`} />
              {!sidebarCollapsed && <span className="text-sm font-medium">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-gray-100">
          <button
            onClick={logout}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-all w-full
              ${sidebarCollapsed ? 'lg:justify-center lg:px-2' : ''}
            `}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
