import { useEffect, useState } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function ProblemList() {
  const [problems, setProblems] = useState([]);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const fetchProblems = async () => {
    try {
      const res = await API.get('/problem');
      setProblems(res.data.problems);
    } catch (err) {
      setError('Failed to fetch problems');
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this problem?');
    if (!confirm) return;
    try {
      const token = localStorage.getItem('token');
      await API.delete(`/problem/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProblems(problems.filter(p => p._id !== id));
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete problem');
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Problems</h2>
      {error && <p className="text-red-500">{error}</p>}
      <ul className="space-y-4">
        {problems.map(problem => (
          <li key={problem._id} className="bg-white dark:bg-gray-800 p-4 rounded shadow">
            <Link to={`/problem/${problem._id}`}>
              <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-300 hover:underline cursor-pointer">
                {problem.title}
              </h3>
            </Link>
            <p className="text-sm text-gray-700 dark:text-gray-300">{problem.description}</p>
            <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">Difficulty: {problem.difficulty}</p>

            {user?.role === 'admin' && (
              <div className="mt-2 flex gap-2">
                <Link
                  to={`/edit-problem/${problem._id}`}
                  className="px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(problem._id)}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
