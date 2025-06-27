import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function ProblemPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await API.get(`/problem/${id}`);
        setProblem(res.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load problem');
      }
    };
    fetchProblem();
  }, [id]);

  const handleSolve = () => {
    navigate(`/solve/${id}`);
  };

  if (error) return <div className="p-6 text-red-500 text-center">{error}</div>;
  if (!problem) return <div className="p-6 text-gray-600 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
          {problem.title}
        </h1>
        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line mb-6 leading-relaxed">
          {problem.description}
        </p>
        <div className="flex items-center justify-between mt-4">
          <span className="inline-block px-4 py-1 text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-white rounded-full">
            Difficulty: {problem.difficulty}
          </span>
          <button
            onClick={handleSolve}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md shadow"
          >
            Solve Now
          </button>
        </div>
      </div>
    </div>
  );
}
