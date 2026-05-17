import React, { useEffect, useState } from 'react';
import { Users, TrendingUp, DollarSign, Activity } from 'lucide-react';
import api from '../../services/api';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalLeads: 0,
    newLeads: 0,
    qualifiedLeads: 0,
    lostLeads: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/leads?limit=1000');
        const leads = data.leads || [];
        setStats({
          totalLeads: leads.length,
          newLeads: leads.filter((l: any) => l.status === 'New').length,
          qualifiedLeads: leads.filter((l: any) => l.status === 'Qualified').length,
          lostLeads: leads.filter((l: any) => l.status === 'Lost').length,
        });
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { title: 'Total Leads', value: stats.totalLeads, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'New Leads', value: stats.newLeads, icon: Activity, color: 'text-green-600', bg: 'bg-green-100' },
    { title: 'Qualified', value: stats.qualifiedLeads, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-100' },
    { title: 'Lost Leads', value: stats.lostLeads, icon: DollarSign, color: 'text-red-600', bg: 'bg-red-100' },
  ];

  if (loading) {
    return <div className="animate-pulse">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500">Welcome to your GigFlow dashboard.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <div key={idx} className="card flex items-center p-6 hover:shadow-md transition-shadow">
            <div className={`p-4 rounded-full ${stat.bg} ${stat.color} mr-4`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="card mt-8">
        <h2 className="text-lg font-bold mb-4">Recent Activity</h2>
        <div className="text-gray-500 text-sm py-8 text-center border-2 border-dashed border-gray-200 rounded-lg">
          No recent activity to show yet.
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
