// src/components/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await API.post('/auth/login', { email, password }, { withCredentials: true });
      const { token, user } = res.data;

      if (!user || !user._id) {
        setError("Unexpected response from server. Please try again.");
        return;
      }

      localStorage.setItem("userId", user._id);
      localStorage.setItem('token', token);

      login(user);

      // ✅ Redirect to Dashboard with state
      navigate('/dashboard', { state: { showLoginSuccess: true } });
    } catch (err) {
      console.error("❌ Login error:", err);
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="bg-gray-900 bg-opacity-70 backdrop-blur-lg p-8 rounded-xl w-full max-w-md border border-purple-500 shadow-purple-glow">
        <h2 className="text-3xl font-bold text-purple-400 text-center mb-6">Welcome Back</h2>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-purple-300">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 bg-black bg-opacity-40 border border-purple-500 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-2 rounded-md font-semibold text-white hover:shadow-lg hover:scale-105 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
