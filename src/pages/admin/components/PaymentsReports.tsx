import { useState } from 'react';

export default function PaymentsReports() {
  const [transactions] = useState([
    { id: 'TXN-001', client: 'John Smith', amount: 500, type: 'Consultation Fee', status: 'Completed', date: '2024-01-15' },
    { id: 'TXN-002', client: 'Mary Johnson', amount: 1200, type: 'Legal Services', status: 'Pending', date: '2024-01-14' },
    { id: 'TXN-003', client: 'Robert Wilson', amount: 800, type: 'Document Review', status: 'Completed', date: '2024-01-13' },
    { id: 'TXN-004', client: 'Lisa Anderson', amount: 300, type: 'Consultation Fee', status: 'Failed', date: '2024-01-12' },
    { id: 'TXN-005', client: 'TechCorp Inc.', amount: 2500, type: 'Corporate Legal', status: 'Completed', date: '2024-01-11' }
  ]);

  const [selectedPeriod, setSelectedPeriod] = useState('This Month');
  const periods = ['This Week', 'This Month', 'Last 3 Months', 'This Year'];

  const totalRevenue = transactions.filter(t => t.status === 'Completed').reduce((sum, t) => sum + t.amount, 0);
  const pendingAmount = transactions.filter(t => t.status === 'Pending').reduce((sum, t) => sum + t.amount, 0);
  const completedTransactions = transactions.filter(t => t.status === 'Completed').length;
  const failedTransactions = transactions.filter(t => t.status === 'Failed').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Payments & Reports</h1>
        <div className="flex items-center space-x-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8"
          >
            {periods.map(period => (
              <option key={period} value={period}>{period}</option>
            ))}
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap">
            <i className="ri-download-line mr-2"></i>Export Report
          </button>
        </div>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-green-600 mt-1">
                <i className="ri-arrow-up-line"></i> +15% from last month
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="ri-money-dollar-circle-line text-green-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Payments</p>
              <p className="text-3xl font-bold text-gray-900">${pendingAmount.toLocaleString()}</p>
              <p className="text-sm text-yellow-600 mt-1">
                <i className="ri-time-line"></i> Awaiting processing
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <i className="ri-time-line text-yellow-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed Transactions</p>
              <p className="text-3xl font-bold text-gray-900">{completedTransactions}</p>
              <p className="text-sm text-green-600 mt-1">
                <i className="ri-check-line"></i> Successfully processed
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="ri-check-double-line text-blue-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Failed Transactions</p>
              <p className="text-3xl font-bold text-gray-900">{failedTransactions}</p>
              <p className="text-sm text-red-600 mt-1">
                <i className="ri-close-line"></i> Requires attention
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <i className="ri-error-warning-line text-red-600 text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h2>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <i className="ri-bar-chart-line text-4xl text-gray-400 mb-2"></i>
            <p className="text-gray-600">Revenue chart visualization would be displayed here</p>
            <p className="text-sm text-gray-500">Integration with charting library required</p>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  placeholder="Search transactions..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Transaction ID</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Client</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Amount</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Type</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Date</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Status</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6 text-gray-900 font-mono text-sm">{transaction.id}</td>
                  <td className="py-4 px-6 text-gray-900">{transaction.client}</td>
                  <td className="py-4 px-6 text-gray-900 font-semibold">${transaction.amount.toLocaleString()}</td>
                  <td className="py-4 px-6 text-gray-900">{transaction.type}</td>
                  <td className="py-4 px-6 text-gray-900">{transaction.date}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                        <i className="ri-eye-line"></i>
                      </button>
                      <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg">
                        <i className="ri-download-line"></i>
                      </button>
                      {transaction.status === 'Failed' && (
                        <button className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg">
                          <i className="ri-refresh-line"></i>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i className="ri-bank-card-line text-blue-600"></i>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Credit/Debit Cards</h3>
                  <p className="text-sm text-gray-600">Visa, Mastercard, American Express</p>
                </div>
              </div>
              <span className="text-sm font-medium text-green-600">Active</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <i className="ri-paypal-line text-green-600"></i>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">PayPal</h3>
                  <p className="text-sm text-gray-600">Online payment processing</p>
                </div>
              </div>
              <span className="text-sm font-medium text-green-600">Active</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <i className="ri-bank-line text-purple-600"></i>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Bank Transfer</h3>
                  <p className="text-sm text-gray-600">Direct bank account transfer</p>
                </div>
              </div>
              <span className="text-sm font-medium text-green-600">Active</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-left">
              <div className="flex items-center space-x-3">
                <i className="ri-file-text-line text-blue-600 text-xl"></i>
                <div>
                  <h3 className="font-medium text-gray-900">Generate Invoice</h3>
                  <p className="text-sm text-gray-600">Create new client invoice</p>
                </div>
              </div>
              <i className="ri-arrow-right-line text-gray-400"></i>
            </button>
            <button className="w-full flex items-center justify-between p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-left">
              <div className="flex items-center space-x-3">
                <i className="ri-refresh-line text-green-600 text-xl"></i>
                <div>
                  <h3 className="font-medium text-gray-900">Process Refund</h3>
                  <p className="text-sm text-gray-600">Handle payment refunds</p>
                </div>
              </div>
              <i className="ri-arrow-right-line text-gray-400"></i>
            </button>
            <button className="w-full flex items-center justify-between p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-left">
              <div className="flex items-center space-x-3">
                <i className="ri-settings-line text-purple-600 text-xl"></i>
                <div>
                  <h3 className="font-medium text-gray-900">Payment Settings</h3>
                  <p className="text-sm text-gray-600">Configure payment options</p>
                </div>
              </div>
              <i className="ri-arrow-right-line text-gray-400"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}