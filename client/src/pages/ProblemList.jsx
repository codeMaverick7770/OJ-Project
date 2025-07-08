import { useEffect, useState } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function ProblemList() {
  const [problems, setProblems] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    API.get('/problem')
      .then(res => setProblems(res.data.problems))
      .catch(() => setError('Failed to fetch problems'));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this problem?')) return;
    try {
      const token = localStorage.getItem('token');
      await API.delete(`/problem/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setProblems(problems.filter(p => p._id !== id));
    } catch {
      alert('Failed to delete problem');
    }
  };

  const filtered = problems.filter(problem =>
    problem.title.toLowerCase().includes(search.toLowerCase())
  );

  const difficultyColor = (level) => {
    if (level === 'Easy') return 'text-green-400';
    if (level === 'Medium') return 'text-yellow-400';
    if (level === 'Hard') return 'text-red-500';
    return 'text-gray-300';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0c0c2d] to-black text-white py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-extrabold text-center mb-8 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
          🚀 Practice Problems
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {/* Search Bar */}
        <div className="mb-6 flex justify-end">
          <input
            type="text"
            placeholder="Search problems..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 rounded-md bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-400 text-white placeholder:text-gray-400"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-white/10">
            <thead className="bg-white/10">
              <tr>
                <th className="p-3 border border-white/10 text-left">#</th>
                <th className="p-3 border border-white/10 text-left">Title</th>
                <th className="p-3 border border-white/10 text-left">Difficulty</th>
                {user?.role === 'admin' && <th className="p-3 border border-white/10">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={user?.role === 'admin' ? 4 : 3} className="text-center text-gray-400 py-8">
                    No problems found.
                  </td>
                </tr>
              ) : (
                filtered.map((problem, idx) => (
                  <tr
                    key={problem._id}
                    className="hover:bg-white/10 transition-all duration-200"
                  >
                    <td className="p-3 border border-white/10">{idx + 1}</td>
                    <td className="p-3 border border-white/10">
                      <Link
                        to={`/problem/${problem._id}`}
                        className="text-purple-300 font-medium hover:underline"
                      >
                        {problem.title}
                      </Link>
                    </td>
                    <td className={`p-3 border border-white/10 font-semibold ${difficultyColor(problem.difficulty)}`}>
                      {problem.difficulty}
                    </td>
                    {user?.role === 'admin' && (
                      <td className="p-3 border border-white/10 flex gap-2 justify-center">
                        <Link
                          to={`/edit-problem/${problem._id}`}
                          className="px-3 py-1 bg-yellow-500 text-black text-sm rounded hover:bg-yellow-600 transition-all"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(problem._id)}
                          className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-all"
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
