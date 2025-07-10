import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

export default function Dashboard() {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
    setLoading(false);
  }, []);

  useEffect(() => {
    if (location.state?.showLoginSuccess) {
      setShowToast(true);
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0c0c2d] to-black text-white px-6 py-20">
      <div className="max-w-6xl mx-auto space-y-12">

        {/* Heading */}
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
            Welcome, {user?.name || 'User'} 👋
          </h1>
          <p className="text-gray-400 mt-2">Track your progress, stats, and activity</p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard title="Problems Solved" value="27" color="from-green-400 to-emerald-500" />
          <StatCard title="Submissions" value="134" color="from-blue-400 to-sky-500" />
          <StatCard title="Global Rank" value="#1452" color="from-yellow-400 to-orange-500" />
        </div>

        {/* User Info */}
        <div className="glass p-6 rounded-lg shadow-xl border border-white/10">
          <h2 className="text-xl font-semibold mb-2">Account Info</h2>
          <p className="text-sm text-gray-300 mb-1"><strong>Email:</strong> {user.email}</p>
          <p className="text-sm text-gray-300"><strong>Role:</strong> {user.role}</p>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-6 shadow-inner">
          <h2 className="text-xl font-semibold mb-4 text-purple-300">📈 Recent Activity</h2>
          <ul className="space-y-3 text-sm text-gray-300">
            <li>✅ Solved “Longest Substring Without Repeating Characters”</li>
            <li>❌ Failed “Median of Two Sorted Arrays” - 2/5 test cases</li>
            <li>🧠 Submitted code review request for “Zigzag Conversion”</li>
          </ul>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap gap-4 justify-center mt-10">
          <Link to="/problems" className="px-5 py-2 rounded-full bg-purple-600 hover:bg-purple-700 font-medium shadow">
            Solve Problems
          </Link>
          <Link to="/compiler" className="px-5 py-2 rounded-full bg-pink-500 hover:bg-pink-600 font-medium shadow">
            Open Compiler
          </Link>
          <Link to="/leaderboard" className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 font-medium shadow">
            View Leaderboard
          </Link>
        </div>
      </div>

      {/* ✅ Login Success Toast */}
      {showToast && (
        <div className="fixed top-5 right-5 z-50 bg-white text-black px-6 py-4 rounded-md shadow-lg w-72 animate-fadeIn">
          <div className="font-semibold mb-1">✅ Logged in successfully</div>
          <div className="w-full h-1 bg-gray-300 mt-2 rounded overflow-hidden">
            <div className="h-full bg-green-500 animate-progress"></div>
          </div>
        </div>
      )}

      {/* Animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.4s ease-in-out;
          }
          @keyframes progress {
            from { width: 100%; }
            to { width: 0%; }
          }
          .animate-progress {
            animation: progress 3s linear forwards;
          }
        `}
      </style>
    </div>
  );
}

function StatCard({ title, value, color }) {
  return (
    <div className={`p-6 rounded-lg bg-white/5 border border-white/10 shadow-lg backdrop-blur-md`}>
      <h3 className="text-gray-300 text-sm mb-2">{title}</h3>
      <p className={`text-3xl font-bold bg-gradient-to-r ${color} text-transparent bg-clip-text`}>
        {value}
      </p>
    </div>
  );
}
