import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function ProblemPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    API.get(`/problem/${id}`)
      .then(res => setProblem(res.data))
      .catch(err => setError(err.response?.data?.error || 'Failed to load problem'));
  }, [id]);

  if (error) return <div className="p-6 text-red-500 text-center">{error}</div>;
  if (!problem) return <div className="p-6 text-white text-center">Loading…</div>;

  return (
    <div className="min-h-screen bg-black text-white py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur p-6 rounded-lg shadow">
        <h1 className="text-3xl font-bold mb-4">{problem.title}</h1>
        <p className="whitespace-pre-line mb-6 leading-relaxed text-gray-300">{problem.description}</p>
        <div className="flex justify-between items-center mt-4">
          <span className="px-3 py-1 text-sm bg-blue-700 rounded-full">Difficulty: {problem.difficulty}</span>
          <button
            onClick={() => navigate(`/solve/${id}`)}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded shadow text-white text-sm"
          >
            Solve Now
          </button>
        </div>
      </div>
    </div>
  );
}
