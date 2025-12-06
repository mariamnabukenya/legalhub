import { useState } from 'react';

export default function AppointmentManagement() {
  const [appointments] = useState([
    {
      id: 1,
      client: 'John Smith',
      lawyer: 'John Davis',
      date: '2024-02-15',
      time: '10:00 AM',
      type: 'Consultation',
      status: 'Confirmed',
      duration: '1 hour'
    },
    {
      id: 2,
      client: 'Mary Johnson',
      lawyer: 'Sarah Wilson',
      date: '2024-02-15',
      time: '2:00 PM',
      type: 'Case Review',
      status: 'Pending',
      duration: '30 minutes'
    },
    {
      id: 3,
      client: 'Robert Wilson',
      lawyer: 'Mike Brown',
      date: '2024-02-16',
      time: '9:00 AM',
      type: 'Document Signing',
      status: 'Confirmed',
      duration: '45 minutes'
    },
    {
      id: 4,
      client: 'Lisa Anderson',
      lawyer: 'John Davis',
      date: '2024-02-16',
      time: '3:30 PM',
      type: 'Initial Consultation',
      status: 'Cancelled',
      duration: '1 hour'
    }
  ]);

  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('2024-02-15');
  const [statusFilter, setStatusFilter] = useState('All');

  const statuses = ['All', 'Confirmed', 'Pending', 'Cancelled'];

  const filteredAppointments = appointments.filter(appointment => {
    const matchesStatus = statusFilter === 'All' || appointment.status === statusFilter;
    return matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Appointment Management</h1>
        <button 
          onClick={() => setShowScheduleModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
        >
          <i className="ri-calendar-line mr-2"></i>Schedule Appointment
        </button>
      </div>

      {/* Calendar View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Calendar</h2>
            <div className="space-y-2">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Quick Stats</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Today's Appointments</span>
                  <span className="font-medium text-gray-900">4</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">This Week</span>
                  <span className="font-medium text-gray-900">12</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Pending Confirmations</span>
                  <span className="font-medium text-yellow-600">3</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Today's Schedule</h2>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div className="space-y-3">
              {filteredAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <i className="ri-user-line text-blue-600"></i>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{appointment.client}</h3>
                      <p className="text-sm text-gray-600">with {appointment.lawyer}</p>
                      <p className="text-sm text-gray-600">{appointment.type} • {appointment.duration}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{appointment.time}</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">All Appointments</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Client</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Lawyer</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Date & Time</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Type</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Duration</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Status</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {appointments.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6 text-gray-900">{appointment.client}</td>
                  <td className="py-4 px-6 text-gray-900">{appointment.lawyer}</td>
                  <td className="py-4 px-6 text-gray-900">
                    {appointment.date} at {appointment.time}
                  </td>
                  <td className="py-4 px-6 text-gray-900">{appointment.type}</td>
                  <td className="py-4 px-6 text-gray-900">{appointment.duration}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg">
                        <i className="ri-check-line"></i>
                      </button>
                      <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                        <i className="ri-edit-line"></i>
                      </button>
                      <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg">
                        <i className="ri-close-line"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Schedule Appointment Modal */}
      {showScheduleModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowScheduleModal(false);
            }
          }}
        >
          <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto flex flex-col">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-lg font-semibold text-gray-900">Schedule Appointment</h2>
              <button 
                onClick={() => setShowScheduleModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close modal"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            <div className="p-4 sm:p-6">
              <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Client Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter client name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lawyer</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8">
                  <option>John Davis</option>
                  <option>Sarah Wilson</option>
                  <option>Mike Brown</option>
                  <option>Lisa Anderson</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                  <input
                    type="time"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Appointment Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8">
                  <option>Initial Consultation</option>
                  <option>Case Review</option>
                  <option>Document Signing</option>
                  <option>Court Preparation</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8">
                  <option>30 minutes</option>
                  <option>45 minutes</option>
                  <option>1 hour</option>
                  <option>1.5 hours</option>
                  <option>2 hours</option>
                </select>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 whitespace-nowrap"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 whitespace-nowrap"
                >
                  Schedule
                </button>
              </div>
            </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}