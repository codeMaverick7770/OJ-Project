import { useEffect, useState } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function ProblemList() {
  const [problems, setProblems] = useState([]);
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

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Problems</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <ul className="space-y-4 max-w-4xl mx-auto">
        {problems.map(problem => (
          <li key={problem._id} className="bg-white/10 backdrop-blur p-4 rounded-lg shadow">
            <Link to={`/problem/${problem._id}`}>
              <h3 className="text-xl font-semibold hover:underline text-blue-400">
                {problem.title}
              </h3>
            </Link>
            <p className="text-sm text-gray-300">{problem.description}</p>
            <p className="text-xs mt-1 text-gray-500">Difficulty: {problem.difficulty}</p>

            {user?.role === 'admin' && (
              <div className="mt-2 flex gap-2">
                <Link to={`/edit-problem/${problem._id}`} className="px-3 py-1 bg-yellow-500 text-black text-sm rounded hover:bg-yellow-600">Edit</Link>
                <button onClick={() => handleDelete(problem._id)} className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700">Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
