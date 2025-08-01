import React, { useEffect, useState } from "react";
import axios from "axios";
import GlobalLoader from "../components/GlobalLoader";

axios.defaults.withCredentials = true;

const PAGE_SIZE = 25;

export default function LeaderboardPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/leaderboard`
        );
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

  const totalPages = Math.ceil(users.length / PAGE_SIZE);
  const paginatedUsers = users.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  if (loading) return <GlobalLoader />;

  return (
    <div className="min-h-screen relative font-sans text-white">
      {/* Neon background */}
      <div className="absolute inset-0 bg-[url('/assets/background.jpg')] bg-cover bg-center z-0" />
      <div className="absolute inset-0 bg-black/80 backdrop-blur-[6px] z-0" />

      <div className="relative z-10 px-6 py-20 max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-12 text-white text-transparent bg-clip-text drop-shadow-[0_0_10px_#7286ff99]">
          Global Leaderboard
        </h1>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <div className="overflow-x-auto rounded-xl border border-white/10 bg-black/10 backdrop-blur-lg shadow-[0_0_20px_#7286ff40]">
          <table className="min-w-full text-sm md:text-base table-auto">
            <thead className="bg-white/10 text-left text-white/80">
              <tr>
                <th className="p-4 border-b border-white/10">Rank</th>
                <th className="p-4 border-b border-white/10">User</th>
                <th className="p-4 border-b border-white/10">Solved</th>
                <th className="p-4 border-b border-white/10">Submissions</th>
                <th className="p-4 border-b border-white/10">Score</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user, index) => {
                const globalIndex = (currentPage - 1) * PAGE_SIZE + index;
                return (
                  <tr
                    key={`${user.name}-${globalIndex}`}
                    className={`${
                      globalIndex % 2 === 0 ? "bg-white/5" : "bg-white/10"
                    } hover:bg-white/20 transition-all duration-200`}
                  >
                    <td className="p-4 font-bold">
                      <span
                        className={`${
                          globalIndex === 0
                            ? "text-yellow-300"
                            : globalIndex === 1
                            ? "text-gray-300"
                            : globalIndex === 2
                            ? "text-orange-400"
                            : "text-white"
                        }`}
                      >
                        {globalIndex === 0
                          ? "🥇"
                          : globalIndex === 1
                          ? "🥈"
                          : globalIndex === 2
                          ? "🥉"
                          : globalIndex + 1}
                      </span>
                    </td>
                    <td className="p-4 font-medium text-purple-200">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-sm font-bold text-black shadow">
                          {user.name?.[0]?.toUpperCase() || "U"}
                        </div>
                        {user.name}
                      </div>
                    </td>
                    <td className="p-4">{user.solvedCount ?? 0}</td>
                    <td className="p-4">{user.submissionCount ?? 0}</td>
                    <td className="p-4 text-green-300 font-semibold">
                      {user.score ?? 0}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 text-white bg-[#252336] border border-white/10 rounded hover:bg-[#3a3750] disabled:opacity-30"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => goToPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  i + 1 === currentPage
                    ? "bg-[#7286ff] text-black font-bold"
                    : "bg-[#252336] text-white hover:bg-[#3a3750]"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-white bg-[#252336] border border-white/10 rounded hover:bg-[#3a3750] disabled:opacity-30"
            >
              Next
            </button>
          </div>
        )}

        <p className="text-center text-xs text-white/40 mt-6">
          Data updates in real-time during contests.
        </p>
      </div>
    </div>
  );
}
