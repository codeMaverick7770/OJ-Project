import React, { useEffect, useState } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

export default function LeaderboardPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/leaderboard`);
        if (Array.isArray(res.data)) {
          setUsers(res.data);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        console.error("Leaderboard fetch error:", err);
        setError("Failed to fetch leaderboard.");
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) return <div className="text-white text-center">Loading...</div>;

  return (
    <div className="min-h-screen px-6 py-16 bg-gradient-to-b from-black via-[#0c0c2d] to-black text-white">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 text-transparent bg-clip-text">
          🌟 Global Leaderboard
        </h1>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <div className="overflow-x-auto border border-white/10 rounded-lg shadow-md bg-white/5 backdrop-blur-md">
          <table className="min-w-full text-sm md:text-base table-auto">
            <thead className="bg-white/10 text-left">
              <tr>
                <th className="p-4 border-b border-white/10">Rank</th>
                <th className="p-4 border-b border-white/10">User</th>
                <th className="p-4 border-b border-white/10">Solved</th>
                <th className="p-4 border-b border-white/10">Submissions</th>
                <th className="p-4 border-b border-white/10">Score</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr
                  key={`${user.name}-${index}`}
                  className={`${
                    index % 2 === 0 ? "bg-white/5" : "bg-white/10"
                  } hover:bg-white/20 transition-all`}
                >
                  <td className="p-4 font-bold">
                    <span
                      className={`${
                        index === 0
                          ? "text-yellow-300"
                          : index === 1
                          ? "text-gray-300"
                          : index === 2
                          ? "text-orange-400"
                          : "text-white"
                      }`}
                    >
                      {index === 0
                        ? "🥇"
                        : index === 1
                        ? "🥈"
                        : index === 2
                        ? "🥉"
                        : index + 1}
                    </span>
                  </td>
                  <td className="p-4 font-medium text-purple-300">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-sm font-bold text-black shadow">
                        {user.name?.[0]?.toUpperCase() || "U"}
                      </div>
                      {user.name}
                    </div>
                  </td>
                  <td className="p-4">{user.solvedCount ?? 0}</td>
                  <td className="p-4">{user.submissionCount ?? 0}</td>
                  <td className="p-4">{user.score ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-center text-xs text-white/40 mt-6">
          Data updates in real-time during contests.
        </p>
      </div>
    </div>
  );
}
