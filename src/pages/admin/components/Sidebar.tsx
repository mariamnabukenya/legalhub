interface SidebarProps {
  activeModule: string;
  setActiveModule: (module: string) => void;
}

export default function Sidebar({ activeModule, setActiveModule }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'ri-dashboard-line' },
    { id: 'legal-library', label: 'Legal Library', icon: 'ri-book-line' },
    { id: 'case-management', label: 'Case Management', icon: 'ri-briefcase-line' },
    { id: 'appointments', label: 'Appointments', icon: 'ri-calendar-line' },
    { id: 'payments', label: 'Payments & Reports', icon: 'ri-money-dollar-circle-line' },
    { id: 'notifications', label: 'Notifications', icon: 'ri-notification-line' },
    { id: 'users', label: 'User Management', icon: 'ri-user-settings-line' },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <i className="ri-scales-3-line text-white text-xl"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900" style={{fontFamily: "Pacifico, serif"}}>LegalHub</h1>
            <p className="text-sm text-gray-600">Admin Portal</p>
          </div>
        </div>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveModule(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors whitespace-nowrap ${
                  activeModule === item.id
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <i className={`${item.icon} text-lg`}></i>
                <span className="font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}