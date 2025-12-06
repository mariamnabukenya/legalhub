import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';

interface Case {
  id: string;
  title: string;
  client_name: string;
  lawyer_name: string;
  status: string;
  court: string;
  next_hearing: string | null;
  priority: string;
  description?: string;
  created_at: string;
}

export default function CaseManagement() {
  const { profile } = useAuth();
  const [cases, setCases] = useState<Case[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    client_name: '',
    lawyer_name: 'John Davis',
    court: '',
    priority: 'Medium',
    next_hearing: '',
    description: ''
  });

  const statuses = ['All', 'Active', 'Pending', 'Closed'];

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setCases(data);
    } catch (error) {
      console.error('Error fetching cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);

    try {
      // Create the case
      const { data: newCase, error: caseError } = await supabase
        .from('cases')
        .insert({
          case_number: newCaseData.caseNumber,
          title: newCaseData.title,
          user_id: newCaseData.clientId,
          lawyer_id: newCaseData.lawyerId,
          description: newCaseData.description,
          status: 'pending',
          priority: newCaseData.priority,
          progress: 0,
          next_hearing: newCaseData.nextHearing || null,
        })
        .select()
        .single();

      if (caseError) throw caseError;

      // Create initial timeline entry
      await supabase.from('case_timeline').insert({
        case_id: newCase.id,
        milestone: 'Case Filed',
        description: `Case ${newCaseData.caseNumber} has been filed and assigned to a lawyer.`,
        status: 'filed'
      });

      // Send notification to client
      await supabase.from('notifications').insert({
        user_id: newCaseData.clientId,
        title: 'New Case Created',
        message: `Your case "${newCaseData.title}" has been filed. Case Number: ${newCaseData.caseNumber}`,
        type: 'case',
        is_read: false
      });

      // Send notification to lawyer
      await supabase.from('notifications').insert({
        user_id: newCaseData.lawyerId,
        title: 'New Case Assignment',
        message: `You have been assigned to case "${newCaseData.title}". Case Number: ${newCaseData.caseNumber}`,
        type: 'case',
        is_read: false
      });

      alert('Case created successfully! Notifications sent to client and lawyer.');
      setShowCreateModal(false);
      setNewCaseData({
        caseNumber: '',
        title: '',
        clientId: '',
        lawyerId: '',
        description: '',
        priority: 'medium',
        nextHearing: '',
      });
      fetchCases();
    } catch (error: any) {
      console.error('Error creating case:', error);
      alert('Failed to create case: ' + error.message);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleUpdateCaseStatus = async (caseId: string, newStatus: string, milestone?: string) => {
    try {
      // Update case status
      const { error: updateError } = await supabase
        .from('cases')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', caseId);

      if (updateError) throw updateError;

      // Get case details for notification
      const { data: caseData } = await supabase
        .from('cases')
        .select('*, profiles:user_id(full_name)')
        .eq('id', caseId)
        .single();

      if (!caseData) return;

      // Add timeline entry
      const milestoneText = milestone || `Case status updated to ${newStatus}`;
      await supabase.from('case_timeline').insert({
        case_id: caseId,
        milestone: milestoneText,
        description: `Status changed to ${newStatus}`,
        status: newStatus === 'closed' ? 'closed' : newStatus === 'active' ? 'hearing' : 'filed'
      });

      // Send notification to client
      await supabase.from('notifications').insert({
        user_id: caseData.user_id,
        title: 'Case Update',
        message: `Your case "${caseData.title}" status has been updated to ${newStatus}. ${milestoneText}`,
        type: 'case',
        is_read: false
      });

      alert('Case status updated and client notified!');
      fetchCases();
    } catch (error: any) {
      console.error('Error updating case:', error);
      alert('Failed to update case: ' + error.message);
    }
  };

  const handleAddMilestone = async (caseId: string) => {
    const milestone = prompt('Enter milestone name (e.g., "Hearing Scheduled", "Judgment Received"):');
    if (!milestone) return;

    const description = prompt('Enter milestone description:');
    if (!description) return;

    const statusType = prompt('Enter status type (filed/hearing/judgment/closed):') as any;
    if (!statusType) return;

    try {
      const { data: caseData } = await supabase
        .from('cases')
        .select('user_id, title')
        .eq('id', caseId)
        .single();

      if (!caseData) return;

      // Add timeline entry
      await supabase.from('case_timeline').insert({
        case_id: caseId,
        milestone,
        description,
        status: statusType
      });

      // Send notification to client
      await supabase.from('notifications').insert({
        user_id: caseData.user_id,
        title: 'Case Milestone Update',
        message: `${milestone}: ${description}`,
        type: 'case',
        is_read: false
      });

      alert('Milestone added and client notified!');
    } catch (error: any) {
      console.error('Error adding milestone:', error);
      alert('Failed to add milestone: ' + error.message);
    }
  };

  const filteredCases = cases.filter(case_item => {
    const matchesSearch = case_item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         case_item.client_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || case_item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Case Management</h1>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
        >
          <i className="ri-add-line mr-2"></i>Create New Case
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder="Search cases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="w-full md:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8"
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Cases Table */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Case</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Client</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Lawyer</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Court</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Next Hearing</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Priority</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Status</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-500">
                    <i className="ri-loader-4-line text-2xl animate-spin"></i>
                    <p className="mt-2">Loading cases...</p>
                  </td>
                </tr>
              ) : filteredCases.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-500">
                    No cases found
                  </td>
                </tr>
              ) : (
                filteredCases.map((case_item) => (
                <tr key={case_item.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div>
                      <h3 className="font-medium text-gray-900">{case_item.title}</h3>
                      <p className="text-sm text-gray-500">{case_item.id.substring(0, 12)}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-900">{case_item.client_name}</td>
                  <td className="py-4 px-6 text-gray-900">{case_item.lawyer_name}</td>
                  <td className="py-4 px-6 text-gray-900">{case_item.court}</td>
                  <td className="py-4 px-6 text-gray-900">
                    {case_item.next_hearing ? new Date(case_item.next_hearing).toLocaleDateString() : 'Not scheduled'}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${getPriorityColor(case_item.priority)}`}>
                      {case_item.priority}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${getStatusColor(case_item.status)}`}>
                      {case_item.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                        <i className="ri-eye-line"></i>
                      </button>
                      <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg">
                        <i className="ri-edit-line"></i>
                      </button>
                      <button className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg">
                        <i className="ri-file-text-line"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Case Modal */}
      {showCreateModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowCreateModal(false);
            }
          }}
        >
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-lg font-semibold text-gray-900">Create New Case</h2>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close modal"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            <div className="p-4 sm:p-6">
              <form onSubmit={handleCreateCase} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Case Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter case title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Client Name</label>
                  <input
                    type="text"
                    required
                    value={formData.client_name}
                    onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter client name"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assigned Lawyer</label>
                  <select 
                    value={formData.lawyer_name}
                    onChange={(e) => setFormData({ ...formData, lawyer_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8"
                  >
                    <option>John Davis</option>
                    <option>Sarah Wilson</option>
                    <option>Mike Brown</option>
                    <option>Lisa Anderson</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Court</label>
                  <input
                    type="text"
                    required
                    value={formData.court}
                    onChange={(e) => setFormData({ ...formData, court: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter court name"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select 
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8"
                  >
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Next Hearing Date</label>
                  <input
                    type="date"
                    value={formData.next_hearing}
                    onChange={(e) => setFormData({ ...formData, next_hearing: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Case Description</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter case description..."
                ></textarea>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 whitespace-nowrap"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 whitespace-nowrap disabled:opacity-50"
                >
                  {createLoading ? 'Creating...' : 'Create Case'}
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