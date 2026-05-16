import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { Products } from './pages/Products';
import { Audits } from './pages/Audits';
import { Login } from './pages/Login';
import { ForgotPassword } from './pages/ForgotPassword';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LayoutDashboard, Package, LogOut, FileText } from 'lucide-react';
import { ToastProvider, ConfirmDialog } from './components/ui';
import { useState } from 'react';

const Navigation: React.FC = () => {
  const location = useLocation();
  const { logout, user } = useAuth();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleLogoutClick = () => {
    setIsLogoutDialogOpen(true);
  };

  const handleLogoutConfirm = () => {
    logout();
  };

  return (
    <nav className="bg-white shadow-md mb-4 md:mb-8">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 sm:py-0 sm:h-16 gap-3 sm:gap-0">
          <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-6">
            <h1 className="text-lg sm:text-xl font-bold text-gray-800">Inventory Management</h1>
            {user && (
              <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                <span className="text-xs sm:text-sm text-gray-600">Welcome,</span>
                <span className="text-xs sm:text-sm font-bold text-blue-700">{user.fullName || user.username}</span>
              </div>
            )}
          </div>
          <div className="flex items-center justify-center sm:justify-end space-x-2 sm:space-x-4">
            <Link
              to="/"
              className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base ${
                isActive('/')
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <LayoutDashboard size={18} className="sm:w-5 sm:h-5" />
              <span className="hidden xs:inline">Dashboard</span>
            </Link>
            <Link
              to="/products"
              className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base ${
                isActive('/products')
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Package size={18} className="sm:w-5 sm:h-5" />
              <span className="hidden xs:inline">Products</span>
            </Link>
            <Link
              to="/audits"
              className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base ${
                isActive('/audits')
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FileText size={18} className="sm:w-5 sm:h-5" />
              <span className="hidden xs:inline">Audits</span>
            </Link>
            <button
              onClick={handleLogoutClick}
              className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors text-sm sm:text-base"
            >
              <LogOut size={18} className="sm:w-5 sm:h-5" />
              <span className="hidden xs:inline">Logout</span>
            </button>
            <ConfirmDialog
              isOpen={isLogoutDialogOpen}
              onClose={() => setIsLogoutDialogOpen(false)}
              onConfirm={handleLogoutConfirm}
              title="Logout"
              message="Are you sure you want to logout?"
              confirmText="Logout"
              cancelText="Cancel"
              variant="warning"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const isAuthPage = location.pathname === '/login' || location.pathname === '/forgot-password';

  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated && !isAuthPage && <Navigation />}
      <div className={isAuthenticated && !isAuthPage ? "container mx-auto px-2 sm:px-4 py-4 sm:py-6" : ""}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            }
          />
          <Route
            path="/audits"
            element={
              <ProtectedRoute>
                <Audits />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;

