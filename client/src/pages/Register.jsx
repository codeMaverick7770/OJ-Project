import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/register', form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="bg-gray-900 bg-opacity-70 backdrop-blur-lg p-8 rounded-xl w-full max-w-md border border-purple-500 shadow-purple-glow">
        <h2 className="text-3xl font-bold text-purple-400 text-center mb-6">Create Your Account</h2>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-purple-300">Full Name</label>
            <input
              type="text"
              id="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 mt-1 bg-black bg-opacity-40 border border-purple-500 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-purple-300">Email</label>
            <input
              type="email"
              id="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 mt-1 bg-black bg-opacity-40 border border-purple-500 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-purple-300">Password</label>
            <input
              type="password"
              id="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 mt-1 bg-black bg-opacity-40 border border-purple-500 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-2 rounded-md font-semibold text-white hover:shadow-lg hover:scale-105 transition"
          >
            Sign Up
          </button>
          <p className="text-sm text-center text-purple-300 mt-4">
            Already have an account?{' '}
            <a href="/login" className="underline text-purple-400 hover:text-pink-400 transition">
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
