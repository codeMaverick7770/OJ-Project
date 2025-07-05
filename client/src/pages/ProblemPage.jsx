// ProblemPage.jsx
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
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0c0c2d] to-black text-white py-20 px-4">
      <div className="max-w-3xl mx-auto bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
          {problem.title}
        </h1>
        <p className="whitespace-pre-line mb-6 leading-relaxed text-gray-300">{problem.description}</p>
        <div className="flex justify-between items-center mt-4">
          <span className="px-3 py-1 text-sm bg-purple-800 text-white rounded-full border border-white/20">Difficulty: {problem.difficulty}</span>
          <button
            onClick={() => navigate(`/solve/${id}`)}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:brightness-110 px-4 py-2 rounded-full shadow-md text-white text-sm transition-all duration-200"
          >
            Solve Now
          </button>
        </div>
      </div>
    </div>
  );
}
