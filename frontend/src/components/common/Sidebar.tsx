import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, UserCircle, Settings } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Leads', path: '/leads', icon: Users },
    { name: 'Profile', path: '/profile', icon: UserCircle },
  ];

  return (
    <div className="bg-dark-900 text-white w-64 flex-shrink-0 flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-dark-800">
        <div className="flex items-center gap-2 text-xl font-bold">
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-white">
            G
          </div>
          GigFlow
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4 px-3">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-300 hover:bg-dark-800 hover:text-white'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
