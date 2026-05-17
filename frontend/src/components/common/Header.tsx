import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
      <div className="text-xl font-semibold text-gray-800">
        Welcome back, {user?.name}
      </div>
      
      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium text-gray-900">{user?.name}</span>
            <span className="text-xs text-gray-500">{user?.role}</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <button 
            onClick={handleLogout}
            className="ml-2 p-2 text-gray-400 hover:text-red-600 transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
