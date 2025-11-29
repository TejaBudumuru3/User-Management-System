import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { UsersTable } from '../components/users/UsersTable';
import { UserDashboard } from './UserDashboard';

export const Dashboard = () => {
  const [role, setRole] = useState<'admin' | 'user'>('user');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users/me').then(res => {
      setRole(res.data.user.role as 'admin' | 'user');
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return role === 'admin' ? <UsersTable /> : <UserDashboard />;
};
