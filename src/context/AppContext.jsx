import React, { createContext, useContext, useState, useEffect } from 'react';
import { getItem, setItem } from '../utils/storage';
import { generateId } from '../utils/formatters';

const AppContext = createContext(undefined);

const defaultConversations = [
  { id: 'conv1', name: 'Dr. Sarah Johnson', avatar: '👩‍⚕️', lastMessage: 'Your appointment is confirmed for tomorrow.', lastTime: '2 hours ago', unread: 1 },
  { id: 'conv2', name: 'Dr. Michael Chen', avatar: '👨‍⚕️', lastMessage: 'Please bring your previous test results.', lastTime: '1 day ago', unread: 0 },
  { id: 'conv3', name: 'Support Team', avatar: '💬', lastMessage: 'How can we help you today?', lastTime: '3 days ago', unread: 0 },
];

const defaultMessages = [
  { id: 'm1', conversationId: 'conv1', sender: 'other', text: 'Hello! This is Dr. Sarah Johnson\'s office. Your appointment is confirmed for tomorrow at 10:00 AM.', timestamp: new Date(Date.now() - 7200000).toISOString() },
  { id: 'm2', conversationId: 'conv1', sender: 'user', text: 'Thank you, doctor. I will be there.', timestamp: new Date(Date.now() - 3600000).toISOString() },
  { id: 'm3', conversationId: 'conv2', sender: 'other', text: 'Hi, please remember to bring your previous blood test results to your appointment next week.', timestamp: new Date(Date.now() - 86400000).toISOString() },
  { id: 'm4', conversationId: 'conv3', sender: 'other', text: 'Welcome to MyPatientHUB support! How can we help you today?', timestamp: new Date(Date.now() - 259200000).toISOString() },
];

const defaultNotifications = [
  { id: 'n1', title: 'Appointment Reminder', message: 'You have an appointment with Dr. Sarah Johnson tomorrow at 10:00 AM.', time: '2 hours ago', read: false, type: 'appointment' },
  { id: 'n2', title: 'New Message', message: 'Dr. Michael Chen sent you a message.', time: '1 day ago', read: false, type: 'message' },
  { id: 'n3', title: 'Welcome!', message: 'Welcome to MyPatientHUB. Explore your health dashboard.', time: '3 days ago', read: true, type: 'system' },
  { id: 'n4', title: 'Prescription Ready', message: 'Your prescription is ready for pickup at HealthPlus Pharmacy.', time: '5 days ago', read: true, type: 'system' },
];

// Dates are relative to "today" so the demo data always shows upcoming appointments.
const dateFromToday = (offsetDays) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const defaultAppointments = [
  { id: 'a1', doctorId: 'd1', doctorName: 'Dr. Sarah Johnson', specialty: 'Cardiology', clinicId: 'c1', clinicName: 'Heart Care Clinic', date: dateFromToday(3), time: '10:00', notes: 'Annual heart checkup', status: 'upcoming', createdAt: new Date().toISOString() },
  { id: 'a2', doctorId: 'd3', doctorName: 'Dr. Emily Rodriguez', specialty: 'Pediatrics', clinicId: 'c3', clinicName: "Children's Wellness Center", date: dateFromToday(5), time: '14:30', notes: 'Child vaccination follow-up', status: 'upcoming', createdAt: new Date().toISOString() },
  { id: 'a3', doctorId: 'd6', doctorName: 'Dr. Robert Kim', specialty: 'General Practice', clinicId: 'c6', clinicName: 'Family Health Clinic', date: dateFromToday(-40), time: '09:00', notes: 'General checkup', status: 'completed', createdAt: new Date().toISOString() },
  { id: 'a4', doctorId: 'd2', doctorName: 'Dr. Michael Chen', specialty: 'Dermatology', clinicId: 'c2', clinicName: 'Skin Health Center', date: dateFromToday(9), time: '11:00', notes: 'Skin allergy consultation', status: 'upcoming', createdAt: new Date().toISOString() },
];

export const AppProvider = ({ children }) => {
  const [appointments, setAppointments] = useState(() => getItem('mph_appointments', defaultAppointments));
  const [dependents, setDependents] = useState(() => getItem('mph_dependents', []));
  const [conversations] = useState(() => getItem('mph_conversations', defaultConversations));
  const [messages, setMessages] = useState(() => getItem('mph_messages', defaultMessages));
  const [notifications, setNotifications] = useState(() => getItem('mph_notifications', defaultNotifications));
  const [cart, setCart] = useState(() => getItem('mph_cart', []));
  const [orders, setOrders] = useState(() => getItem('mph_orders', []));
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => { setItem('mph_appointments', appointments); }, [appointments]);
  useEffect(() => { setItem('mph_dependents', dependents); }, [dependents]);
  useEffect(() => { setItem('mph_messages', messages); }, [messages]);
  useEffect(() => { setItem('mph_notifications', notifications); }, [notifications]);
  useEffect(() => { setItem('mph_cart', cart); }, [cart]);
  useEffect(() => { setItem('mph_orders', orders); }, [orders]);

  const addAppointment = (apt) => {
    const newApt = { ...apt, id: generateId(), status: 'upcoming', createdAt: new Date().toISOString() };
    setAppointments(prev => [newApt, ...prev]);
  };

  const updateAppointment = (id, data) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));
  };

  const cancelAppointment = (id) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'cancelled' } : a));
  };

  const addDependent = (dep) => {
    setDependents(prev => [...prev, { ...dep, id: generateId() }]);
  };

  const updateDependent = (id, data) => {
    setDependents(prev => prev.map(d => d.id === id ? { ...d, ...data } : d));
  };

  const deleteDependent = (id) => {
    setDependents(prev => prev.filter(d => d.id !== id));
  };

  const sendMessage = (conversationId, text) => {
    const msg = { id: generateId(), conversationId, sender: 'user', text, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, msg]);
    // Simulate auto-reply
    setTimeout(() => {
      const reply = {
        id: generateId(), conversationId, sender: 'other',
        text: 'Thank you for your message. We will get back to you shortly.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, reply]);
    }, 2000);
  };

  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const addToCart = (item, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(c => c.productId === item.productId);
      if (existing) return prev.map(c => c.productId === item.productId ? { ...c, quantity: c.quantity + qty } : c);
      return [...prev, { ...item, quantity: qty }];
    });
  };

  const updateCartQuantity = (productId, qty) => {
    if (qty <= 0) { setCart(prev => prev.filter(c => c.productId !== productId)); return; }
    setCart(prev => prev.map(c => c.productId === productId ? { ...c, quantity: qty } : c));
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(c => c.productId !== productId));
  };

  const clearCart = () => setCart([]);

  const placeOrder = () => {
    if (cart.length === 0) return;
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const order = { id: generateId(), items: [...cart], total, date: new Date().toISOString() };
    setOrders(prev => [order, ...prev]);
    clearCart();
  };

  const toggleSidebar = () => setSidebarCollapsed(prev => !prev);

  return (
    <AppContext.Provider value={{
      appointments, addAppointment, updateAppointment, cancelAppointment,
      dependents, addDependent, updateDependent, deleteDependent,
      conversations, messages, sendMessage,
      notifications, markNotificationRead, markAllNotificationsRead,
      cart, addToCart, updateCartQuantity, removeFromCart, clearCart, orders, placeOrder,
      sidebarCollapsed, toggleSidebar,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
