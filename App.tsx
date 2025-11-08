import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/UsersPage';
import OrdersPage from './pages/OrdersPage';
import ServicesPage from './pages/ServicesPage';
import FundsPage from './pages/FundsPage';
import SupportPage from './pages/SupportPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import { Menu, X } from 'lucide-react';

type Page = 'dashboard' | 'users' | 'orders' | 'services' | 'funds' | 'support' | 'settings';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'users':
        return <UsersPage />;
      case 'orders':
        return <OrdersPage />;
      case 'services':
        return <ServicesPage />;
      case 'funds':
        return <FundsPage />;
      case 'support':
        return <SupportPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };
  
  const PageTitle: React.FC<{ page: Page }> = ({ page }) => {
    const title = page.charAt(0).toUpperCase() + page.slice(1);
    return <h1 className="text-2xl md:text-3xl font-bold text-text-primary">{title}</h1>;
  };

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-2xl font-semibold text-text-primary">Loading Admin Panel...</div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="flex h-screen bg-background text-text-primary">
      <div className={`fixed inset-0 z-30 bg-black/50 transition-opacity lg:hidden ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsSidebarOpen(false)}></div>
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} handleLogout={handleLogout} />
      
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="sticky top-0 z-20 flex items-center justify-between p-4 bg-card border-b border-gray-200 lg:justify-end">
          <button
            className="p-2 rounded-md text-text-secondary lg:hidden"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          <div className="hidden lg:block">
            <PageTitle page={currentPage} />
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8 flex-1">
          {renderPage()}
        </div>
      </main>
    </div>
  );
};

export default App;
