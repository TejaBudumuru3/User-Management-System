import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import type { User } from '../../types/user';
import { Button } from '../ui/Button';
import { EditUserModal } from './EditUserModal';
import { Link } from 'react-router-dom';

export const UsersTable = () => {
  const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL as string) || 'http://localhost:5000';
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const fetchUsers = async (pageNum = 1, searchTerm = '') => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`${BACKEND_URL}/users?page=${pageNum}&limit=10&search=${searchTerm}`);
      setUsers(data.users);
      setTotal(data.total);
      setPages(data.pages);
      setPage(pageNum);
      setSearch(searchTerm);
    } catch (e: any) {
      setError('Failed to fetch users.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (id: string) => {
    if (!confirm('Delete this user?')) return;
    try {
      await api.delete(`${BACKEND_URL}/users/${id}`);
      fetchUsers(page, search);
    } catch (e) {
      alert('Delete failed');
    }
  };

  const editUser = (user: User) => {
    setEditingUser(user);
  };

  const closeEditModal = () => {
    setEditingUser(null);
  };

  const handleUserUpdate = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u._id === updatedUser._id ? updatedUser : u));
  };

  if (loading && users.length === 0) {
    return <div className="p-8 text-center">Loading users...</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header + Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Users ({total})</h1>
        <div className="relative w-full lg:w-80">
          <input
            placeholder="Search by name or email..."
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              fetchUsers(1, e.target.value);
            }}
          />
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Phone</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">City</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Pincode</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Country</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Image</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="px-8 py-4 font-medium text-gray-900">{user.name}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{user.email}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{user.phone || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{user.city || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{user.pincode || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{user.country || '-'}</td>
                <td className="px-6 py-4">
                  {user.profileImage ? (
                    <img
                      src={`${BACKEND_URL}${user.profileImage}`}
                      alt={`${user.name}'s profile`}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-200"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500 font-medium">
                      No Image
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => editUser(user)}
                      className="px-4 py-1.5 text-xs"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => deleteUser(user._id)}
                      className="px-4 py-1.5 text-xs"
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {error && (
          <div className="p-8 text-center text-red-600 bg-red-50 border-t border-red-200">
            {error}
            <Button onClick={() => fetchUsers(page, search)} className="mt-2 ml-4">
              Retry
            </Button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-600">
            Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, total)} of {total} users
          </div>
          <div className="flex space-x-1">
            <Button
              variant="secondary"
              size="sm"
              disabled={page === 1}
              onClick={() => fetchUsers(page - 1, search)}
              className="px-3 py-2"
            >
              Previous
            </Button>
            {Array.from({ length: Math.min(5, pages) }, (_, i) => {
              const pageNum = page > 3 ? page - 2 + i : i + 1;
              if (pageNum <= pages) {
                return (
                  <Button
                    key={pageNum}
                    variant={page === pageNum ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => fetchUsers(pageNum, search)}
                    className="px-3 py-2 w-12"
                  >
                    {pageNum}
                  </Button>
                );
              }
              return null;
            })}
            <Button
              variant="secondary"
              size="sm"
              disabled={page === pages}
              onClick={() => fetchUsers(page + 1, search)}
              className="px-3 py-2"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={closeEditModal}
          onUpdate={handleUserUpdate}
        />
      )}

      <Link 
        to="/" 
        className="text-sm text-blue-600 hover:underline"
      >
        ← Back to Home
      </Link>
    </div>
  );
};
