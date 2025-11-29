import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Cards';

export const Home = () => {
  const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL as string) || 'http://localhost:5000';
  const [stats, setStats] = useState({ totalUsers: 0, totalCities: 0 });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsLoggedIn(!!token);

    api.get(`${BACKEND_URL}/users/stats`).then(res => {
      setStats(res.data);
    }).catch(() => {});
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    setIsLoggedIn(false);
  };

  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Welcome Admin */}
          <div className="text-center mb-16">
            <h1 className="text-xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-6">
               Hello, Welcome Back!
            </h1>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
              <Button 
                onClick={() => navigate('/dashboard')} 
                variant="primary" 
                size="lg" 
                className="px-12 py-6 text-xl"
              >
                 Go to Dashboard
              </Button>
              <Button 
                onClick={handleLogout}
                variant="secondary" 
                size="lg" 
                className="px-12 py-6 text-xl"
              >
                 Logout
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card header="Total Users">
              <div className="text-4xl font-bold text-blue-600">{stats.totalUsers}</div>
            </Card>
            <Card header="Unique Cities">
              <div className="text-4xl font-bold text-green-600">{stats.totalCities}</div>
            </Card>
            <Card header="System Status">
              <div className="text-4xl font-bold text-emerald-600">🟢 Online</div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Guest Home (Public)
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      {/* ... your existing public home content ... */}
      <div className="max-w-6xl mx-auto px-4">
        {/* Hero Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-800 text-white p-12 rounded-3xl mb-12 shadow-2xl text-center">
          <h1 className="text-3xl md:text-6xl font-bold mb-6"> MERN User Management</h1>
          <p className="text-xl md:text-2xl opacity-95 max-w-3xl mx-auto">
            Production-Ready Full-Stack Application for Harvee Designs Internship
          </p>
        </div>

        {/* Public Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card header="Total Users">
            <div className="text-4xl font-bold text-blue-600">{stats.totalUsers}</div>
          </Card>
          <Card header="Unique Cities">
            <div className="text-4xl font-bold text-green-600">{stats.totalCities}</div>
          </Card>
          <Card header="Production Ready">
            <div className="text-4xl font-bold text-purple-600">✅</div>
          </Card>
        </div>

        {/* Features Grid */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900"> Core Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: '👤 User Registration', desc: 'Complete form with image upload & validation' },
              { title: '🔐 JWT Authentication', desc: 'Access + refresh tokens with auto rotation' },
              { title: '📊 Admin Dashboard', desc: 'Real-time search, pagination, CRUD operations' },
              { title: '🖼️ Image Uploads', desc: 'Profile images with Cloudinary optimization' },
              { title: '👥 Role-Based Access', desc: 'Admin-only features with proper auth guards' },
              { title: '📄 Pagination & Search', desc: 'Server-side filtering & sorting' },
            ].map((feature, i) => (
              <div key={i} className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-2xl border-l-4 border-blue-500 hover:shadow-xl transition-all">
                <h4 className="text-2xl font-bold text-blue-700 mb-4">{feature.title}</h4>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tech Stack */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">Tech Stack</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-center text-pink-600">Backend</h3>
              <div className="grid grid-cols-2 gap-4">
                {['Express.js + TypeScript', 'MongoDB + Mongoose', 'JWT + bcrypt', 'Multer Uploads'].map(t => (
                  <div key={t} className="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-4 rounded-xl text-center font-medium">{t}</div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-6 text-center text-cyan-600">Frontend</h3>
              <div className="grid grid-cols-2 gap-4">
                {['React 18 + TypeScript', 'Tailwind CSS', 'Vite + Axios', 'React Router'].map(t => (
                  <div key={t} className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-4 rounded-xl text-center font-medium">{t}</div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-6 text-center text-emerald-600">DevOps</h3>
              <div className="grid grid-cols-2 gap-4">
                {['Docker Compose', 'Render.com Deploy', 'MongoDB Atlas', 'GitHub Actions'].map(t => (
                  <div key={t} className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-4 rounded-xl text-center font-medium">{t}</div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Buttons */}
        <div className="text-center mb-16">
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
            <Link to="/register">
              <Button variant="primary" size="lg" className="w-full sm:w-auto px-12 py-6 text-xl">
                🚀 Create Account
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto px-12 py-6 text-xl">
                🔐 Admin Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
