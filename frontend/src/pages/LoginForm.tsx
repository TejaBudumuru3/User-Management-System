import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { Card } from '../components/ui/Cards';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const Login = () => {
  const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL as string) || 'http://localhost:5000';
  const [user, setUser] = useState('');        // email or phone
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      console.log('Login attempt:', user, password);
      const { data } = await api.post(`${BACKEND_URL}/auth/login`, { user, password });
      localStorage.setItem('accessToken', data.accessToken);
      navigate('/dashboard');
    } catch (err: any) {
      setError(
        err?.response?.data?.message || 'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="w-full max-w-md">
        <Card header="Welcome Back">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email or Phone"
              placeholder="Enter email or phone"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              required
              autoFocus
            />
            
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-8 text-center space-y-4">
            <Link 
              to="/register" 
              className="block w-full bg-white border border-gray-300 rounded-xl px-6 py-3 text-blue-600 hover:bg-blue-50 hover:border-blue-300 font-medium transition-all text-center"
            >
              Create New Account
            </Link>
            
            <Link 
              to="/" 
              className="text-sm text-blue-600 hover:underline"
            >
              ← Back to Home
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
