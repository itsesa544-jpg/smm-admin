
import React from 'react';
import { LayoutDashboard, Users, ShoppingCart, List, DollarSign, MessageSquare, Settings, X, LogOut } from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: any) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  handleLogout: () => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'users', label: 'User Management', icon: Users },
  { id: 'orders', label: 'Order Management', icon: ShoppingCart },
  { id: 'services', label: 'Service Management', icon: List },
  { id: 'funds', label: 'Fund Management', icon: DollarSign },
  { id: 'support', label: 'Support System', icon: MessageSquare },
  { id: 'settings', label: 'Site Settings', icon: Settings },
];

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, isOpen, setIsOpen, handleLogout }) => {
  const handleNavClick = (page: any) => {
    setCurrentPage(page);
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  return (
    <aside className={`fixed top-0 left-0 z-40 w-64 h-screen bg-sidebar text-sidebar-text flex flex-col flex-shrink-0 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold text-white">SMM Admin</h2>
        <button className="p-1 rounded-md lg:hidden text-sidebar-text hover:bg-gray-700" onClick={() => setIsOpen(false)}>
            <X size={20} />
        </button>
      </div>
      <nav className="mt-4 flex-1">
        <ul>
          {navItems.map((item) => (
            <li key={item.id} className="px-2">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.id);
                }}
                className={`flex items-center px-4 py-3 rounded-md transition-colors duration-200 ${
                  currentPage === item.id
                    ? 'bg-sidebar-active text-white'
                    : 'hover:bg-gray-700'
                }`}
              >
                <item.icon size={20} className="mr-3" />
                <span>{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
       <div className="px-2 py-4">
        <a
            href="#"
            onClick={(e) => {
                e.preventDefault();
                handleLogout();
            }}
            className={`flex items-center px-4 py-3 rounded-md transition-colors duration-200 text-sidebar-text hover:bg-red-500 hover:text-white`}
        >
            <LogOut size={20} className="mr-3" />
            <span>Logout</span>
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
