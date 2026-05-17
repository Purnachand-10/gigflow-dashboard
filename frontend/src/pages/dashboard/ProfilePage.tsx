import React from 'react';
import { useAuth } from '../../context/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
      
      <div className="card">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-4xl font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{user?.name}</h2>
            <p className="text-gray-500">{user?.role}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full font-medium">
              {user?.role}
            </span>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-100 pt-6">
          <h3 className="text-lg font-semibold mb-4">Account Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500">Full Name</label>
              <div className="mt-1 text-gray-900 font-medium">{user?.name}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Email Address</label>
              <div className="mt-1 text-gray-900 font-medium">{user?.email}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
