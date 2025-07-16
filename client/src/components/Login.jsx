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
      console.error("❌ Login error:", err);
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-[#141219] text-gray-800"
      style={{
        backgroundImage: "url('/assets/background.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Flare Glow Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="flare-bg w-full h-full" />
      </div>

      {/* Login Card - Light Theme */}
      <div className="relative z-10 bg-white/80 backdrop-blur-md border border-white/30 shadow-xl rounded-2xl w-full max-w-md px-8 py-10">
        {/* Header */}
        <div className="flex flex-col items-center space-y-2 mb-6">
          <img src="/assets/kickdsa.png" alt="KickDSA Logo" className="h-6 scale-500 drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]" />
          <h2 className="text-3xl font-extrabold gradient-text-dark">Welcome Back</h2>
          <p className="text-sm text-gray-600 text-center">
            Your account is protected with secure authentication.
          </p>
        </div>

        {/* Error */}
        {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 bg-white border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 bg-white border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-2 rounded-md font-semibold text-white hover:shadow-lg hover:scale-[1.02] transition"
          >
            Login
          </button>
        </form>

        {/* Social Sign-In */}
        <div className="mt-6 text-center space-y-3">
          <p className="text-xs text-gray-500">— or sign in with —</p>

          {/* Google */}
          <button
            className="w-full flex items-center justify-center gap-2 bg-white text-black py-2 rounded-md font-medium border border-gray-200 shadow-sm hover:scale-[1.02] transition"
            onClick={() => alert("Google Sign-In not implemented")}
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5" />
            Sign in with Google
          </button>

          {/* GitHub */}
          <button
            className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-2 rounded-md font-medium border border-gray-700 shadow-sm hover:scale-[1.02] transition"
            onClick={() => alert("GitHub Sign-In not implemented")}
          >
            <img src="https://www.svgrepo.com/show/512317/github-142.svg" alt="GitHub" className="h-5 w-5" />
            Sign in with GitHub
          </button>
        </div>
      </div>

      {/* Styles */}
      <style>
        {`
          .gradient-text-dark {
            background: linear-gradient(90deg, #7286ff, #fe7587);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          .flare-bg {
            background: radial-gradient(40% 40% at 50% 50%, rgba(210,32,255,0.4) 0%, rgba(210,32,255,0.1) 40%, transparent 80%);
            filter: blur(100px);
          }
        `}
      </style>
    </div>
  );
}
