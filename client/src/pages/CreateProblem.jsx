import { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function CreateProblem() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    difficulty: 'Easy',
    tags: '',
    bulkInput: '',
    bulkOutput: '',
    language: 'cpp',
    starterCode: '',
    solutionCode: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const inputLines = form.bulkInput.trim().split('\n');
    const outputLines = form.bulkOutput.trim().split('\n');

    if (inputLines.length !== outputLines.length) {
      return setError('Number of inputs and outputs must match');
    }

    const testCases = inputLines.map((input, i) => ({
      input: input.trim(),
      expectedOutput: outputLines[i]?.trim() || '',
    }));

    const starterCode = { cpp: '', java: '', python: '' };
    starterCode[form.language] = form.starterCode;

    const solutionCode = { cpp: '', java: '', python: '' };
    solutionCode[form.language] = form.solutionCode;

    const payload = {
      title: form.title,
      description: form.description,
      difficulty: form.difficulty,
      tags: form.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      testCases,
      starterCode,
      solutionCode,
    };

    try {
      const token = localStorage.getItem('token');
      const res = await API.post('/problem/create', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('✅ Problem created:', res.data);
      navigate('/dashboard');
    } catch (err) {
      console.error('❌ Problem creation failed:', err.response || err.message);
      setError(err.response?.data?.error || 'Problem creation failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-[#0c0c2d] to-black px-4 py-12">
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-2xl w-full max-w-3xl shadow-xl text-white">
        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
          Create New Problem
        </h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="title" placeholder="Title" value={form.title} onChange={handleChange} required className="w-full p-3 rounded-lg bg-white/10 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500" />

          <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required className="w-full p-3 rounded-lg bg-white/10 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500" rows={4} />

          <select name="difficulty" value={form.difficulty} onChange={handleChange} className="w-full p-3 rounded-lg bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>

          <input type="text" name="tags" placeholder="Tags (comma-separated)" value={form.tags} onChange={handleChange} className="w-full p-3 rounded-lg bg-white/10 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500" />

          <textarea name="bulkInput" value={form.bulkInput} onChange={handleChange} placeholder={`Test Case Inputs (one per line)`} className="w-full p-3 rounded-lg bg-white/10 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500" rows={4} required />

          <textarea name="bulkOutput" value={form.bulkOutput} onChange={handleChange} placeholder={`Expected Outputs (one per line)`} className="w-full p-3 rounded-lg bg-white/10 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500" rows={4} required />

          <select name="language" value={form.language} onChange={handleChange} className="w-full p-3 rounded-lg bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
            <option value="cpp">C++</option>
            <option value="java">Java</option>
            <option value="python">Python</option>
          </select>

          <textarea name="starterCode" value={form.starterCode} onChange={handleChange} placeholder={`Starter Code`} className="w-full p-3 rounded-lg bg-white/10 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500" rows={6} />

          <textarea name="solutionCode" value={form.solutionCode} onChange={handleChange} placeholder={`Correct Solution Code`} className="w-full p-3 rounded-lg bg-white/10 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500" rows={6} required />

          <button type="submit" className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:brightness-110 text-white font-semibold transition-all duration-200">
            Submit Problem
          </button>
        </form>
      </div>
    </div>
  );
}
