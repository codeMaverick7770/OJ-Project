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
    <div className="min-h-screen text-white relative overflow-hidden">
      {/* 🔳 Background image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/assets/background.jpg')` }}
      />
      {/* 🔲 Blur overlay */}
      <div className="absolute inset-0 z-0 backdrop-blur-sm bg-black/30" />

      {/* 🌟 Main content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 space-y-16">
        {/* 👋 Welcome Heading */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Hey, {user?.name || 'User'}!
          </h1>
          <p className="text-gray-300 text-sm md:text-base font-bold">
            Track your progress, stats, and activity
          </p>
        </div>

        {/* 📊 Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard title="Problems Solved" value="27" color="from-green-400 to-emerald-500" />
          <StatCard title="Submissions" value="134" color="from-blue-400 to-sky-500" />
          <StatCard title="Global Rank" value="#1452" color="from-yellow-400 to-orange-500" />
        </div>

        {/* 👤 Account Info */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl shadow-lg text-sm backdrop-blur-md space-y-2">
          <h2 className="text-xl font-semibold text-purple-300 mb-3">Account Info</h2>
          <p><span className="text-gray-400">Email:</span> {user.email}</p>
          <p><span className="text-gray-400">Role:</span> {user.role}</p>
        </div>

        {/* 📝 Recent Activity */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 shadow-inner backdrop-blur-md">
          <h2 className="text-xl font-semibold mb-4 text-purple-300">📈 Recent Activity</h2>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2 text-green-400">
              ✅ <span className="text-white">Solved “Longest Substring Without Repeating Characters”</span>
            </li>
            <li className="flex items-center gap-2 text-red-400">
              ❌ <span className="text-white">Failed “Median of Two Sorted Arrays” - 2/5 test cases</span>
            </li>
            <li className="flex items-center gap-2 text-pink-400">
              🧠 <span className="text-white">Submitted code review request for “Zigzag Conversion”</span>
            </li>
          </ul>
        </div>

        {/* ⚡ Quick Links */}
        <div className="flex flex-wrap gap-4 justify-center mt-10">
          <Link to="/problems" className="neon-btn">Solve Problems</Link>
          <Link to="/compiler" className="neon-btn">Open Compiler</Link>
          <Link to="/leaderboard" className="neon-btn">View Leaderboard</Link>
        </div>
      </div>

      {/* ✅ Toast Notification */}
      {showToast && (
        <div className="fixed top-5 right-5 z-50 bg-white text-black px-6 py-4 rounded-xl shadow-xl w-72 animate-fadeIn border-l-4 border-green-500">
          <div className="font-semibold mb-1">✅ Logged in successfully</div>
          <div className="w-full h-1 bg-gray-300 mt-2 rounded overflow-hidden">
            <div className="h-full bg-green-500 animate-progress" />
          </div>
        </div>
      )}

      {/* 🎨 Styles */}
      <style>
        {`
          .gradient-text {
            background: linear-gradient(90deg, #7286ff, #fe7587);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          .neon-btn {
            border-radius: 9999px;
            border: 1.5px solid transparent;
            background:
              linear-gradient(#141219, #141219) padding-box,
              linear-gradient(90deg, #7286ff, #fe7587) border-box;
            padding: 0.75rem 1.5rem;
            font-weight: 600;
            color: white;
            transition: all 0.3s ease;
          }
          .neon-btn:hover {
            background:
              linear-gradient(#2d1d34, #2d1d34) padding-box,
              linear-gradient(90deg, #7286ff, #fe7587) border-box;
            filter: drop-shadow(0 0 10px rgba(114,134,255,0.5));
            transform: scale(1.02);
          }
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
    <div className="p-6 rounded-xl bg-white/5 border border-white/10 shadow-lg backdrop-blur-md hover:shadow-purple-500/20 transition-all">
      <h3 className="text-gray-300 text-sm mb-2">{title}</h3>
      <p className={`text-3xl font-bold bg-gradient-to-r ${color} text-transparent bg-clip-text`}>
        {value}
      </p>
    </div>
  );
}
