import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import UserManagement from './components/UserManagement';
import CaseManagement from './components/CaseManagement';
import LegalLibrary from './components/LegalLibrary';
import AppointmentManagement from './components/AppointmentManagement';
import PaymentsReports from './components/PaymentsReports';
import Notifications from './components/Notifications';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAccess();
  }, [user]);

  const checkAdminAccess = async () => {
    if (!user) {
      navigate('/admin/login');
      return;
    }

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking admin access:', error);
        navigate('/admin/login');
        return;
      }

      if (!profile || profile.user_type !== 'admin') {
        navigate('/admin/login');
        return;
      }

      setLoading(false);
    } catch (err) {
      console.error('Unexpected error checking admin access:', err);
      navigate('/admin/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="ri-loader-4-line text-4xl text-teal-600 animate-spin"></i>
          <p className="mt-4 text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'users':
        return <UserManagement />;
      case 'cases':
        return <CaseManagement />;
      case 'library':
        return <LegalLibrary />;
      case 'appointments':
        return <AppointmentManagement />;
      case 'payments':
        return <PaymentsReports />;
      case 'notifications':
        return <Notifications />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {activeTab === 'dashboard' && 'Dashboard'}
                  {activeTab === 'users' && 'User Management'}
                  {activeTab === 'cases' && 'Case Management'}
                  {activeTab === 'library' && 'Legal Library'}
                  {activeTab === 'appointments' && 'Appointments'}
                  {activeTab === 'payments' && 'Payments & Reports'}
                  {activeTab === 'notifications' && 'Notifications'}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {activeTab === 'dashboard' && 'Overview of your legal hub'}
                  {activeTab === 'users' && 'Manage users, roles, and permissions'}
                  {activeTab === 'cases' && 'Track and manage legal cases'}
                  {activeTab === 'library' && 'Manage legal documents and resources'}
                  {activeTab === 'appointments' && 'Schedule and manage appointments'}
                  {activeTab === 'payments' && 'View payments and generate reports'}
                  {activeTab === 'notifications' && 'Send and manage notifications'}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg cursor-pointer">
                  <i className="ri-notification-3-line text-xl"></i>
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    3
                  </span>
                </button>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                    <i className="ri-user-line text-teal-600"></i>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">{user?.email}</p>
                    <p className="text-xs text-gray-500">Administrator</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
