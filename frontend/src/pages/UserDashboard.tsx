import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Cards';
import type { User } from '../types/user';
import { Link } from 'react-router-dom';
import { EditUserModal } from '../components/users/EditUserModal';

export const UserDashboard = () => {
  const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL as string) || 'http://localhost:5000';
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);


  const editUser = (user: User | null) => {
      setEditingUser(user);
    };

  const closeEditModal = () => {
    setEditingUser(null);
  };

  const handleUserUpdate = (updatedUser: User) => {
    setUser(updatedUser);
  };

  useEffect(() => {
    api.get(`${BACKEND_URL}/users/me`).then(res => {
      setUser(res.data.user);
    }).catch(() => {
      window.location.href = '/login';
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto">
        <Card header=" Welcome, User!">
          <div className="text-center space-y-6">
            <div className="w-32 h-32 mx-auto bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-4xl text-white font-bold">
              {user?.name}
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{user?.name}</h2>
              <p className="text-xl text-gray-600">{user?.email}</p>
            </div>
            <Button className="w-full px-12 py-4 text-xl" onClick={()=>editUser(user)}>Edit Profile</Button>
          </div>
        </Card>

        <div className="grid md:grid-cols-1 gap-6 mt-8">
          <Card header="📍 Your Location">
            <div className="space-y-2 text-lg">
              <p><strong>City:</strong> {user?.city}</p>
              <p><strong>Phone:</strong> {user?.phone}</p>
            </div>
          </Card>
          
        </div>

        <Link 
            to="/" 
            className="text-sm text-blue-600 hover:underline"
        >
            ← Back to Home
        </Link>

        {editingUser && (
          <EditUserModal
            user={editingUser}
            onClose={closeEditModal}
            onUpdate={handleUserUpdate}
          />
        )}
      </div>
    </div>
  );
};
