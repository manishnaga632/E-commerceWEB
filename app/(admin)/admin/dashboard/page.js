'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminContext } from '@/context/AdminContext';
import { Box, Tag, Users, UserPlus2 } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    users: 0,
    loading: true,
    error: null
  });
  const { admin, logout } = useAdminContext();
  const router = useRouter();

  useEffect(() => {
    if (!admin) return;

    const fetchData = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        if (!token) {
          throw new Error('Authentication token missing');
        }

        const endpoints = [
          { key: 'products', url: `${process.env.NEXT_PUBLIC_API_URL}/products/all_products` },
          { key: 'categories', url: `${process.env.NEXT_PUBLIC_API_URL}/categories/all_category` },
          { key: 'users', url: `${process.env.NEXT_PUBLIC_API_URL}/users/all_users` } // Fixed URL
        ];

        const results = await Promise.allSettled(
          endpoints.map(({ key, url }) =>
            fetch(url, {
              headers: { 'Authorization': `Bearer ${token}` }
            })
            .then(async res => {
              if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || `Failed to fetch ${key}`);
              }
              return res.json();
            })
            .catch(error => {
              console.error(`Error fetching ${key}:`, error);
              throw error;
            })
          )
        );

        const newStats = { loading: false, error: null };
        let hasError = false;

        results.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            newStats[endpoints[index].key] = Array.isArray(result.value) ? result.value.length : 0;
          } else {
            hasError = true;
            console.error(result.reason);
            newStats.error = newStats.error || result.reason.message;
            newStats[endpoints[index].key] = 0; // Set default value when error occurs
          }
        });

        setStats(prev => ({ ...prev, ...newStats }));

        if (hasError) {
          toast.error('Some data failed to load. Displaying partial results.');
        }
      } catch (error) {
        console.error('Dashboard error:', error);
        setStats(prev => ({ ...prev, loading: false, error: error.message }));
        toast.error(error.message || 'Failed to load dashboard');

        if (error.message.includes('Authentication')) {
          logout();
          router.push('/admin');
        }
      }
    };

    fetchData();
  }, [admin, logout, router]);

  if (stats.loading) return (
    <div className="admin-content">
      <p className="text-center py-8 text-gray-600">Loading dashboard...</p>
    </div>
  );

  if (stats.error && !stats.products && !stats.categories && !stats.users) {
    return (
      <div className="admin-content">
        <div className="error-message">
          <p>Failed to load dashboard data</p>
          <button
            onClick={() => window.location.reload()}
            className="refresh-button"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-content">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="dashboard-header">
        <h1 className="dashboard-title">
          Welcome back, {admin?.name || 'Admin'} 👋
        </h1>
        <p className="dashboard-subtitle">Here s what s happening with your store today</p>
      </div>

      {stats.error && (
        <div className="partial-error">
          <p>Note: Some data may not be current</p>
        </div>
      )}

      <div className="stats-grid">
        <StatCard
          icon={<Box className="stat-icon" />}
          title="Total Products"
          value={stats.products}
          color="var(--primary-color)"
        />
        <StatCard
          icon={<Tag className="stat-icon" />}
          title="Categories"
          value={stats.categories}
          color="var(--accent-color)"
        />
        <StatCard
          icon={<Users className="stat-icon" />}
          title="Total Users"
          value={stats.users}
          color="var(--secondary-color)"
        />
        <StatCard
          icon={<UserPlus2 className="stat-icon" />}
          title="Active Admin"
          value={admin?.name || 'You'}
          color="var(--success-color)"
        />
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, color }) => {
  return (
    <div className="stat-card" style={{ '--card-color': color }}>
      <div className="stat-icon-container" style={{ backgroundColor: `${color}20` }}>
        {icon}
      </div>
      <div className="stat-content">
        <h3 className="stat-title">{title}</h3>
        <p className="stat-value">{value}</p>
      </div>
    </div>
  );
};

export default AdminDashboard;