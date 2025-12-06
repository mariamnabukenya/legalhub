import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeCases: 0,
    totalDownloads: 0,
    monthlyRevenue: 0,
    usersChange: 0,
    casesChange: 0,
    downloadsChange: 0,
    revenueChange: 0
  });

  const [recentCases, setRecentCases] = useState<any[]>([]);
  const [recentUploads, setRecentUploads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    // Refresh data every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const now = new Date();
      const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

      // Fetch total users (current and last month)
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      const { count: lastMonthUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .lt('created_at', lastMonthStart.toISOString());

      // Fetch active cases (current and last month)
      const { data: casesData, count: casesCount } = await supabase
        .from('cases')
        .select('*', { count: 'exact' })
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(3);

      const { count: lastMonthCases } = await supabase
        .from('cases')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active')
        .lt('created_at', lastMonthStart.toISOString());

      // Fetch total downloads (current and last month)
      const { count: downloadsCount } = await supabase
        .from('user_purchases')
        .select('*', { count: 'exact', head: true });

      const { count: lastMonthDownloads } = await supabase
        .from('user_purchases')
        .select('*', { count: 'exact', head: true })
        .lt('purchased_at', lastMonthStart.toISOString());

      // Fetch monthly revenue (current and last month)
      const { data: paymentsData } = await supabase
        .from('user_purchases')
        .select('amount_paid')
        .gte('purchased_at', currentMonthStart.toISOString());

      const { data: lastMonthPayments } = await supabase
        .from('user_purchases')
        .select('amount_paid')
        .gte('purchased_at', lastMonthStart.toISOString())
        .lt('purchased_at', currentMonthStart.toISOString());

      const revenue = paymentsData?.reduce((sum, p) => sum + (p.amount_paid || 0), 0) || 0;
      const lastMonthRevenue = lastMonthPayments?.reduce((sum, p) => sum + (p.amount_paid || 0), 0) || 0;

      // Calculate percentage changes
      const calculateChange = (current: number, previous: number) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return Math.round(((current - previous) / previous) * 100);
      };

      // Fetch recent documents
      const { data: documentsData } = await supabase
        .from('legal_documents')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);

      setStats({
        totalUsers: usersCount || 0,
        activeCases: casesCount || 0,
        totalDownloads: downloadsCount || 0,
        monthlyRevenue: revenue,
        usersChange: calculateChange(usersCount || 0, lastMonthUsers || 0),
        casesChange: calculateChange(casesCount || 0, lastMonthCases || 0),
        downloadsChange: calculateChange(downloadsCount || 0, lastMonthDownloads || 0),
        revenueChange: calculateChange(revenue, lastMonthRevenue)
      });

      setRecentCases(casesData || []);
      setRecentUploads(documentsData || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <i className="ri-loader-4-line text-4xl text-teal-600 animate-spin"></i>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
              <p className={`text-sm mt-1 ${stats.usersChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                <i className={`ri-arrow-${stats.usersChange >= 0 ? 'up' : 'down'}-line`}></i> {Math.abs(stats.usersChange)}% from last month
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="ri-user-line text-blue-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Cases</p>
              <p className="text-3xl font-bold text-gray-900">{stats.activeCases}</p>
              <p className={`text-sm mt-1 ${stats.casesChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                <i className={`ri-arrow-${stats.casesChange >= 0 ? 'up' : 'down'}-line`}></i> {Math.abs(stats.casesChange)}% from last month
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="ri-briefcase-line text-green-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Downloads</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalDownloads.toLocaleString()}</p>
              <p className={`text-sm mt-1 ${stats.downloadsChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                <i className={`ri-arrow-${stats.downloadsChange >= 0 ? 'up' : 'down'}-line`}></i> {Math.abs(stats.downloadsChange)}% from last month
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <i className="ri-download-line text-purple-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
              <p className="text-3xl font-bold text-gray-900">${stats.monthlyRevenue.toLocaleString()}</p>
              <p className={`text-sm mt-1 ${stats.revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                <i className={`ri-arrow-${stats.revenueChange >= 0 ? 'up' : 'down'}-line`}></i> {Math.abs(stats.revenueChange)}% from last month
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <i className="ri-money-dollar-circle-line text-yellow-600 text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Cases */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Cases</h2>
              <button className="text-teal-600 hover:text-teal-700 text-sm font-medium whitespace-nowrap">
                View All <i className="ri-arrow-right-line ml-1"></i>
              </button>
            </div>
          </div>
          <div className="p-6">
            {recentCases.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <i className="ri-briefcase-line text-4xl mb-2"></i>
                <p>No recent cases</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentCases.map((case_item) => (
                  <div key={case_item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{case_item.title}</h3>
                      <p className="text-sm text-gray-600">Case ID: {case_item.case_number || case_item.id}</p>
                      <p className="text-sm text-gray-600">Lawyer: {case_item.assigned_lawyer || 'Unassigned'}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
                        case_item.status === 'Active' ? 'bg-green-100 text-green-800' :
                        case_item.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {case_item.status}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(case_item.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Uploads */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Document Uploads</h2>
              <button className="text-teal-600 hover:text-teal-700 text-sm font-medium whitespace-nowrap">
                View All <i className="ri-arrow-right-line ml-1"></i>
              </button>
            </div>
          </div>
          <div className="p-6">
            {recentUploads.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <i className="ri-file-text-line text-4xl mb-2"></i>
                <p>No recent uploads</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentUploads.map((upload) => (
                  <div key={upload.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <i className="ri-file-text-line text-blue-600"></i>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{upload.title}</h3>
                        <p className="text-sm text-gray-600">{upload.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">GHS {upload.price?.toFixed(2) || '0.00'}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(upload.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow text-left cursor-pointer">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <i className="ri-add-line text-blue-600 text-xl"></i>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Add New Case</h3>
            <p className="text-sm text-gray-600">Create and assign a new legal case</p>
          </button>

          <button className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow text-left cursor-pointer">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <i className="ri-upload-line text-green-600 text-xl"></i>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Upload Document</h3>
            <p className="text-sm text-gray-600">Add new legal documents to library</p>
          </button>

          <button className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow text-left cursor-pointer">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <i className="ri-user-add-line text-purple-600 text-xl"></i>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Add User</h3>
            <p className="text-sm text-gray-600">Create new user account</p>
          </button>

          <button className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow text-left cursor-pointer">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
              <i className="ri-notification-line text-yellow-600 text-xl"></i>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Send Notification</h3>
            <p className="text-sm text-gray-600">Broadcast message to users</p>
          </button>
        </div>
      </div>
    </div>
  );
}
