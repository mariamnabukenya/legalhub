
export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-teal-600" style={{ fontFamily: '"Pacifico", serif' }}>
                LegalHub
              </h1>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-teal-600 font-medium cursor-pointer">Features</a>
              <a href="#contact" className="text-gray-700 hover:text-teal-600 font-medium cursor-pointer">Contact</a>
              <button
                onClick={() => window.REACT_APP_NAVIGATE('/admin/login')}
                className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap cursor-pointer"
              >
                <i className="ri-admin-line mr-2"></i>
                Admin Portal
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://readdy.ai/api/search-image?query=Modern%20professional%20legal%20office%20environment%20with%20elegant%20minimalist%20design%20featuring%20clean%20lines%20sophisticated%20lighting%20and%20contemporary%20workspace%20aesthetic%20emphasizing%20trust%20professionalism%20and%20innovation%20in%20legal%20services&width=1920&height=1080&seq=hero-bg-001&orientation=landscape')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/40"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20 text-center text-white">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            Legal Administration<br />Management Portal
          </h1>
          <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto text-white/90">
            Comprehensive admin dashboard for managing legal documents, cases, appointments, and client communications.
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => window.REACT_APP_NAVIGATE('/admin/login')}
              className="whitespace-nowrap cursor-pointer inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-teal-500 text-white hover:bg-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <i className="ri-admin-line mr-2"></i>
              Access Admin Portal
              <i className="ri-arrow-right-line ml-2"></i>
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Admin Management Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Complete administrative control over your legal operations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <i className="ri-file-text-line text-teal-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Document Management</h3>
              <p className="text-gray-600">Upload, organize, and manage legal documents and templates</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <i className="ri-briefcase-line text-blue-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Case Administration</h3>
              <p className="text-gray-600">Oversee all cases, assign lawyers, and track progress</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <i className="ri-calendar-line text-purple-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Appointment Control</h3>
              <p className="text-gray-600">Manage lawyer schedules and client appointments</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <i className="ri-group-line text-green-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">User Management</h3>
              <p className="text-gray-600">Control user accounts, permissions, and access levels</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <i className="ri-line-chart-line text-yellow-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Analytics & Reports</h3>
              <p className="text-gray-600">View comprehensive reports and business analytics</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <i className="ri-secure-payment-line text-red-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Payment Oversight</h3>
              <p className="text-gray-600">Monitor transactions and financial operations</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-20 bg-gradient-to-r from-teal-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Manage Your Legal Operations?
          </h2>
          <p className="text-xl text-teal-50 mb-8">
            Access the comprehensive admin dashboard to control all aspects of your legal business
          </p>
          <button
            onClick={() => window.REACT_APP_NAVIGATE('/admin/login')}
            className="bg-white text-teal-600 px-8 py-4 rounded-lg font-semibold hover:bg-teal-50 transition-colors whitespace-nowrap cursor-pointer text-lg"
          >
            <i className="ri-login-box-line mr-2"></i>
            Login to Admin Portal
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: '"Pacifico", serif' }}>
                LegalHub
              </h3>
              <p className="text-gray-400">
                Professional legal administration platform
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white cursor-pointer">Admin Features</a></li>
                <li><a href="#contact" className="hover:text-white cursor-pointer">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Access</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => window.REACT_APP_NAVIGATE('/admin/login')} className="hover:text-white cursor-pointer">Admin Login</button></li>
                <li><button onClick={() => window.REACT_APP_NAVIGATE('/admin')} className="hover:text-white cursor-pointer">Dashboard</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white cursor-pointer">Documentation</a></li>
                <li><a href="#" className="hover:text-white cursor-pointer">Help Center</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 LegalHub Admin Portal. All rights reserved. | <a href="https://readdy.ai/?origin=logo" className="hover:text-white">Powered by Readdy</a></p>
          </div>
        </div>
      </footer>
    </div>
  );
}
