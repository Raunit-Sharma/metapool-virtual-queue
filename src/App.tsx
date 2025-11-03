import { useState, useEffect } from 'react';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import PublicQueue from './components/PublicQueue';
import { adminLogin, adminLogout, getAdminSession } from './lib/auth';
import { type AdminUser } from './lib/supabase';
import { Shield } from 'lucide-react';

function App() {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [admin, setAdmin] = useState<AdminUser | null>(null);

  // Check for existing admin session on mount
  useEffect(() => {
    const session = getAdminSession();
    if (session) {
      setAdmin(session);
    }
  }, []);

  const handleAdminLogin = async (email: string, password: string) => {
    const adminUser = await adminLogin(email, password);
    setAdmin(adminUser);
    setShowAdminLogin(false);
  };

  const handleLogout = () => {
    adminLogout();
    setAdmin(null);
    setShowAdminLogin(false);
  };

  const handleBackToQueue = () => {
    setShowAdminLogin(false);
  };

  // Show admin dashboard if logged in
  if (admin) {
    return <AdminDashboard admin={admin} onLogout={handleLogout} />;
  }

  // Show admin login if requested
  if (showAdminLogin) {
    return <AdminLogin onLogin={handleAdminLogin} onBack={handleBackToQueue} />;
  }

  // Default: Show public queue with admin access button
  return (
    <div className="relative">
      <PublicQueue />
      
      {/* Floating Admin Button */}
      <button
        onClick={() => setShowAdminLogin(true)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-2xl transition-all transform hover:scale-110 z-50 flex items-center gap-2"
        title="Admin Login"
      >
        <Shield className="w-6 h-6" />
        <span className="hidden sm:inline font-semibold">Admin</span>
      </button>
    </div>
  );
}

export default App;
