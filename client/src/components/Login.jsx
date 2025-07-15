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
      navigate('/dashboard', { state: { showLoginSuccess: true } });
    } catch (err) {
      console.error("\u274C Login error:", err);
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#141219] text-white px-4 relative overflow-hidden">
      {/* Flare Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="flare-bg w-full h-full" />
      </div>

      {/* Login Card */}
      <div className="relative z-10 bg-gray-900 bg-opacity-70 backdrop-blur-lg p-8 rounded-xl w-full max-w-md border border-purple-500 shadow-purple-glow mt-10">
        {/* Logo + Header */}
        <div className="flex flex-col items-center space-y-2 mb-6">
          <img src="/assets/kickdsa.png" alt="KickDSA Logo" className="h-30" />
          <h2 className="text-3xl font-extrabold gradient-text">Welcome to KickDSA</h2>
          <p className="text-sm text-gray-400 text-center">
            Your account is protected with secure authentication.
          </p>
        </div>

        {/* Error */}
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        {/* Form */}
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
              placeholder="********"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-2 rounded-md font-semibold text-white hover:shadow-lg hover:scale-105 transition"
          >
            Login
          </button>
        </form>

        {/* Google Sign-In */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400 mb-2">— or sign in with —</p>
          <button
            className="w-full flex items-center justify-center gap-2 bg-white text-black py-2 rounded-md font-medium hover:scale-105 transition"
            onClick={() => alert("Google Sign-In not implemented")}
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="h-5 w-5"
            />
            Sign in with Google
          </button>
        </div>
      </div>

      {/* Styles */}
      <style>
        {`
          .gradient-text {
            background: linear-gradient(90deg, #7286ff, #fe7587);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          .flare-bg {
            background: radial-gradient(40% 40% at 50% 50%, rgba(210,32,255,0.5) 0%, rgba(210,32,255,0.15) 40%, transparent 80%);
            filter: blur(100px);
          }
        `}
      </style>
    </div>
  );
}