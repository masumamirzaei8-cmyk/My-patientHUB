import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { doctors } from '../data/doctors';
import { clinics } from '../data/clinics';
import { 
  Calendar, 
  Clock, 
  Stethoscope, 
  Building2, 
  FileText, 
  Users, 
  TrendingUp, 
  ArrowRight,
  Activity,
  Bell,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import DashboardCard from '../components/DashboardCard';
import DonutChart from '../components/DonutChart';
import ChartLegend from '../components/ChartLegend';
import DetailModal from '../components/DetailModal';
import HealthTrendChart from '../components/HealthTrendChart';
import { formatDate, formatTime } from '../utils/formatters';

// Chart data
const clinicPromoData = [
  { name: 'Klinik Lee Healthcare', value: 19, color: '#E60093' },
  { name: 'Klinik Bandar Baru Nilai', value: 4, color: '#A020B5' },
  { name: 'Klinik Mediviron Giant Nilai', value: 10, color: '#2680F7' },
  { name: 'Klinik Nilai Impian', value: 21, color: '#20BFE5' },
  { name: 'Klinik Mediviron', value: 2, color: '#22A06B' },
];

const pharmacyPromoData = [
  { name: 'ALPRO Pharmacy Nilai', value: 15, color: '#E60093' },
  { name: 'ALPRO Pharmacy Pekan Nilai', value: 12, color: '#A020B5' },
  { name: 'OK Pharmacy', value: 5, color: '#2680F7' },
  { name: 'Pharmart Pharmacy Nilai', value: 9, color: '#20BFE5' },
  { name: 'Health Lane Family Pharmacy', value: 14, color: '#22A06B' },
];

const marketUsageData = [
  { name: 'Food Panda', value: 25, color: '#E60093' },
  { name: 'Grab Food', value: 3, color: '#A020B5' },
  { name: 'Other Apps', value: 72, color: '#2680F7' },
];

const healthTrendData = [
  { label: 'Mon', value: 65 },
  { label: 'Tue', value: 68 },
  { label: 'Wed', value: 66 },
  { label: 'Thu', value: 70 },
  { label: 'Fri', value: 72 },
  { label: 'Sat', value: 69 },
  { label: 'Sun', value: 70 },
];

// Recent activity data
const recentActivity = [
  { id: 1, type: 'appointment', message: 'Appointment booked with Dr. Sarah Johnson', time: '2 hours ago', icon: '📅' },
  { id: 2, type: 'prescription', message: 'Prescription ready for pickup', time: '5 hours ago', icon: '💊' },
  { id: 3, type: 'message', message: 'New message from Dr. Michael Chen', time: '1 day ago', icon: '💬' },
  { id: 4, type: 'payment', message: 'Payment processed successfully', time: '2 days ago', icon: '💳' },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { appointments, dependents, notifications } = useApp();
  const upcoming = appointments.filter(a => a.status === 'upcoming');
  
  // Modal states
  const [showClinicDetails, setShowClinicDetails] = useState(false);
  const [showPharmacyDetails, setShowPharmacyDetails] = useState(false);
  const [showMarketDetails, setShowMarketDetails] = useState(false);
  const [showHealthDetails, setShowHealthDetails] = useState(false);

  const stats = [
    { title: 'Total Appointments', value: appointments.length, icon: Calendar, color: '#E60093', bg: 'bg-pink-50' },
    { title: 'Upcoming', value: upcoming.length, icon: Clock, color: '#2680F7', bg: 'bg-blue-50' },
    { title: 'Doctors', value: doctors.length, icon: Stethoscope, color: '#A020B5', bg: 'bg-purple-50' },
    { title: 'Clinics', value: clinics.length, icon: Building2, color: '#20BFE5', bg: 'bg-cyan-50' },
    { title: 'Prescriptions', value: 4, icon: FileText, color: '#F4B400', bg: 'bg-amber-50' },
    { title: 'Dependents', value: dependents.length, icon: Users, color: '#22A06B', bg: 'bg-green-50' },
  ];

  const quickActions = [
    { label: 'Book Appointment', path: '/appointments', icon: Calendar, color: 'bg-pink-100 text-pink-700' },
    { label: 'Find Doctor', path: '/find-doctor', icon: Stethoscope, color: 'bg-purple-100 text-purple-700' },
    { label: 'Find Clinic', path: '/find-clinic', icon: Building2, color: 'bg-blue-100 text-blue-700' },
    { label: 'Find Pharmacy', path: '/find-pharmacy', icon: FileText, color: 'bg-cyan-100 text-cyan-700' },
    { label: 'Marketplace', path: '/marketplace', icon: TrendingUp, color: 'bg-amber-100 text-amber-700' },
  ];

  return (
    <div className="dashboard-container">
      {/* Welcome Section */}
      <div className="dashboard-welcome">
        <h1>Welcome To MyPatientHUB!</h1>
        <p>Here's what's happening with your healthcare today</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card">
            <div className={`stat-icon ${stat.bg}`}>
              <stat.icon style={{ color: stat.color }} />
            </div>
            <div className="stat-content">
              <p className="stat-value">{stat.value}</p>
              <p className="stat-label">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts Grid */}
      <div className="charts-grid">
        {/* Promotion by Clinics */}
        <DashboardCard 
          title="Promotion by Clinics" 
          icon={<Building2 className="w-5 h-5" />}
          onMoreDetails={() => setShowClinicDetails(true)}
        >
          <div className="chart-wrapper">
            <DonutChart data={clinicPromoData} size={180} strokeWidth={35} />
            <ChartLegend data={clinicPromoData} />
          </div>
        </DashboardCard>

        {/* Promotion by Pharmacies */}
        <DashboardCard 
          title="Promotion by Pharmacies" 
          icon={<FileText className="w-5 h-5" />}
          onMoreDetails={() => setShowPharmacyDetails(true)}
        >
          <div className="chart-wrapper">
            <DonutChart data={pharmacyPromoData} size={180} strokeWidth={35} />
            <ChartLegend data={pharmacyPromoData} />
          </div>
        </DashboardCard>

        {/* Smart Market Usage */}
        <DashboardCard 
          title="Smart Market Usage by App" 
          icon={<TrendingUp className="w-5 h-5" />}
          onMoreDetails={() => setShowMarketDetails(true)}
        >
          <div className="chart-wrapper">
            <DonutChart data={marketUsageData} size={180} strokeWidth={35} />
            <ChartLegend data={marketUsageData} />
          </div>
        </DashboardCard>

        {/* Health Index */}
        <DashboardCard 
          title="Health Index" 
          icon={<Activity className="w-5 h-5" />}
          onMoreDetails={() => setShowHealthDetails(true)}
        >
          <div className="health-index-content">
            <div className="health-score">
              <span className="health-value">70%</span>
              <span className="health-trend">
                <TrendingUp className="w-4 h-4" />
                +3%
              </span>
            </div>
            <HealthTrendChart data={healthTrendData} width={350} height={120} />
          </div>
        </DashboardCard>
      </div>

      {/* Additional Sections */}
      <div className="additional-sections">
        {/* Recent Appointments */}
        <DashboardCard title="Upcoming Appointments" icon={<Calendar className="w-5 h-5" />}>
          <div className="appointments-list">
            {upcoming.slice(0, 4).map(apt => (
              <div key={apt.id} className="appointment-item">
                <div className="appointment-icon">🩺</div>
                <div className="appointment-info">
                  <p className="appointment-doctor">{apt.doctorName}</p>
                  <p className="appointment-specialty">{apt.specialty}</p>
                </div>
                <div className="appointment-time">
                  <p className="appointment-date">{formatDate(apt.date)}</p>
                  <p className="appointment-hour">{formatTime(apt.time)}</p>
                </div>
              </div>
            ))}
            {upcoming.length === 0 && (
              <p className="empty-state">No upcoming appointments</p>
            )}
          </div>
        </DashboardCard>

        {/* Recent Activity */}
        <DashboardCard title="Recent Activity" icon={<Activity className="w-5 h-5" />}>
          <div className="activity-list">
            {recentActivity.map(activity => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon">{activity.icon}</div>
                <div className="activity-info">
                  <p className="activity-message">{activity.message}</p>
                  <p className="activity-time">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>

        {/* Notifications */}
        <DashboardCard title="Notifications" icon={<Bell className="w-5 h-5" />}>
          <div className="notifications-list">
            {notifications.slice(0, 4).map(notif => (
              <div key={notif.id} className={`notification-item ${!notif.read ? 'unread' : ''}`}>
                <div className="notification-icon">
                  {notif.type === 'appointment' && <Calendar className="w-4 h-4" />}
                  {notif.type === 'message' && <Bell className="w-4 h-4" />}
                  {notif.type === 'system' && <CheckCircle className="w-4 h-4" />}
                </div>
                <div className="notification-info">
                  <p className="notification-title">{notif.title}</p>
                  <p className="notification-message">{notif.message}</p>
                  <p className="notification-time">{notif.time}</p>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>

        {/* Quick Actions */}
        <DashboardCard title="Quick Actions" icon={<ArrowRight className="w-5 h-5" />}>
          <div className="quick-actions-grid">
            {quickActions.map((action, i) => (
              <button key={i} onClick={() => navigate(action.path)} className="quick-action-btn">
                <div className={`quick-action-icon ${action.color}`}>
                  <action.icon className="w-5 h-5" />
                </div>
                <span className="quick-action-label">{action.label}</span>
              </button>
            ))}
          </div>
        </DashboardCard>
      </div>

      {/* Modals */}
      <DetailModal 
        isOpen={showClinicDetails} 
        onClose={() => setShowClinicDetails(false)}
        title="Clinic Promotions Details"
      >
        <div className="modal-details">
          <p className="modal-description">Detailed breakdown of clinic promotions (Demo Data)</p>
          <div className="details-list">
            {clinicPromoData.map((clinic, i) => (
              <div key={i} className="detail-item">
                <div className="detail-color" style={{ backgroundColor: clinic.color }}></div>
                <div className="detail-info">
                  <span className="detail-name">{clinic.name}</span>
                  <div className="detail-bar">
                    <div 
                      className="detail-bar-fill" 
                      style={{ width: `${clinic.value}%`, backgroundColor: clinic.color }}
                    ></div>
                  </div>
                </div>
                <span className="detail-value">{clinic.value}%</span>
              </div>
            ))}
          </div>
          <div className="details-summary">
            <p><strong>Total:</strong> {clinicPromoData.reduce((sum, c) => sum + c.value, 0)}%</p>
            <p className="demo-note">* This is demonstration data</p>
          </div>
        </div>
      </DetailModal>

      <DetailModal 
        isOpen={showPharmacyDetails} 
        onClose={() => setShowPharmacyDetails(false)}
        title="Pharmacy Promotions Details"
      >
        <div className="modal-details">
          <p className="modal-description">Detailed breakdown of pharmacy promotions (Demo Data)</p>
          <div className="details-list">
            {pharmacyPromoData.map((pharmacy, i) => (
              <div key={i} className="detail-item">
                <div className="detail-color" style={{ backgroundColor: pharmacy.color }}></div>
                <div className="detail-info">
                  <span className="detail-name">{pharmacy.name}</span>
                  <div className="detail-bar">
                    <div 
                      className="detail-bar-fill" 
                      style={{ width: `${pharmacy.value}%`, backgroundColor: pharmacy.color }}
                    ></div>
                  </div>
                </div>
                <span className="detail-value">{pharmacy.value}%</span>
              </div>
            ))}
          </div>
          <div className="details-summary">
            <p><strong>Total:</strong> {pharmacyPromoData.reduce((sum, p) => sum + p.value, 0)}%</p>
            <p className="demo-note">* This is demonstration data</p>
          </div>
        </div>
      </DetailModal>

      <DetailModal 
        isOpen={showMarketDetails} 
        onClose={() => setShowMarketDetails(false)}
        title="Smart Market Usage Details"
      >
        <div className="modal-details">
          <p className="modal-description">Detailed breakdown of marketplace app usage (Demo Data)</p>
          <div className="details-list">
            {marketUsageData.map((app, i) => (
              <div key={i} className="detail-item">
                <div className="detail-color" style={{ backgroundColor: app.color }}></div>
                <div className="detail-info">
                  <span className="detail-name">{app.name}</span>
                  <div className="detail-bar">
                    <div 
                      className="detail-bar-fill" 
                      style={{ width: `${app.value}%`, backgroundColor: app.color }}
                    ></div>
                  </div>
                </div>
                <span className="detail-value">{app.value}%</span>
              </div>
            ))}
          </div>
          <div className="details-summary">
            <p><strong>Total:</strong> {marketUsageData.reduce((sum, a) => sum + a.value, 0)}%</p>
            <p className="demo-note">* This is demonstration data</p>
          </div>
        </div>
      </DetailModal>

      <DetailModal 
        isOpen={showHealthDetails} 
        onClose={() => setShowHealthDetails(false)}
        title="Health Index Details"
      >
        <div className="modal-details">
          <p className="modal-description">Your health index trend over the past week (Demo Data)</p>
          <div className="health-details-score">
            <div className="health-big-score">70%</div>
            <div className="health-trend-indicator">
              <TrendingUp className="w-6 h-6" />
              <span>+3% from last week</span>
            </div>
          </div>
          <div className="health-trend-data">
            <h4>Daily Health Index</h4>
            <div className="trend-data-grid">
              {healthTrendData.map((day, i) => (
                <div key={i} className="trend-data-item">
                  <span className="trend-day">{day.label}</span>
                  <span className="trend-value">{day.value}%</span>
                </div>
              ))}
            </div>
          </div>
          <div className="details-summary">
            <p className="demo-note">* This is demonstration data. Not a medical assessment.</p>
          </div>
        </div>
      </DetailModal>
    </div>
  );
};

export default Dashboard;
