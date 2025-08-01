import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm({ ...form, [id]: value });
  };

  useEffect(() => {
    const calculateStrength = () => {
      let strength = 0;
      if (form.password.length > 5) strength += 1;
      if (form.password.length > 8) strength += 1;
      if (/[A-Z]/.test(form.password)) strength += 1;
      if (/[0-9]/.test(form.password)) strength += 1;
      if (/\W/.test(form.password)) strength += 1;
      return strength;
    };
    setPasswordStrength(calculateStrength());
  }, [form.password]);

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
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-[#141219] text-gray-800"
      style={{
        backgroundImage: "url('/assets/background.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="flare-bg w-full h-full" />
      </div>

      <div className="relative z-10 bg-white/80 backdrop-blur-md border border-white/30 shadow-xl rounded-2xl w-full max-w-md px-8 py-10">
        <div className="flex flex-col items-center space-y-2 mb-6">
          <img src="/assets/kickdsa.png" alt="KickDSA Logo" className="h-6 scale-500 drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]" />
          <h2 className="text-3xl font-extrabold gradient-text-dark">Welcome to KickDSA</h2>
          <p className="text-sm text-gray-600 text-center">Create your free account and start solving.</p>
        </div>

        {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              id="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 mt-1 bg-white border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={form.email}
              onChange={handleChange}
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
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 mt-1 bg-white border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Create a secure password"
            />
            {form.password && (
              <div className="w-full mt-2 h-2 rounded bg-gray-200 overflow-hidden transition-opacity duration-300">
                <div
                  className={`h-full transition-all duration-500 ${
                    passwordStrength <= 2 ? 'bg-red-500 w-1/4' :
                    passwordStrength === 3 ? 'bg-yellow-400 w-2/4' :
                    passwordStrength === 4 ? 'bg-yellow-500 w-3/4' :
                    'bg-green-500 w-full'}`}
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-2 rounded-md font-semibold text-white hover:shadow-lg hover:scale-[1.02] transition"
          >
            Sign Up
          </button>

          <p className="text-xs text-gray-500 flex items-center justify-center">— or sign up with —</p>

          <div className="flex flex-col gap-3 mt-4">
            <a
              href={`${import.meta.env.VITE_API_BASE_URL}/auth/google`}
              className="flex items-center justify-center bg-white border border-gray-300 rounded-md py-2 text-gray-700 hover:bg-gray-100 transition"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5 mr-2" />
              Sign up with Google
            </a>

            <a
              href={`${import.meta.env.VITE_API_BASE_URL}/auth/github`}
              className="flex items-center justify-center bg-gray-900 border border-gray-800 rounded-md py-2 text-white hover:bg-black transition"
            >
              <img src="https://www.svgrepo.com/show/512317/github-142.svg" alt="GitHub" className="w-5 h-5 mr-2" />
              Sign up with GitHub
            </a>
          </div>

          <p className="text-sm text-center text-gray-700 mt-4">
            Already have an account?{' '}
            <a href="/login" className="underline text-purple-500 hover:text-pink-500 transition">Login</a>
          </p>
        </form>
      </div>

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
