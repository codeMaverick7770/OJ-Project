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
    solutionCode: '',
    language: 'cpp',
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

    const solutionCode = {
      cpp: '',
      java: '',
      python: '',
    };
    solutionCode[form.language] = form.solutionCode;

    const payload = {
      title: form.title,
      description: form.description,
      difficulty: form.difficulty,
      tags: form.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      testCases,
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Create New Problem</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
          />
          <select
            name="difficulty"
            value={form.difficulty}
            onChange={handleChange}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>

          <input
            type="text"
            name="tags"
            placeholder="Tags (comma-separated)"
            value={form.tags}
            onChange={handleChange}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
          />

          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">Test Case Inputs</h3>
            <textarea
              name="bulkInput"
              value={form.bulkInput}
              onChange={handleChange}
              placeholder={`One input per line\nExample:\n1 2\n4 5`}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
              rows={4}
              required
            />

            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mt-4 mb-1">Expected Outputs</h3>
            <textarea
              name="bulkOutput"
              value={form.bulkOutput}
              onChange={handleChange}
              placeholder={`One output per line\nExample:\n3\n9`}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
              rows={4}
              required
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mt-4 mb-1">Solution Code</h3>
            <select
              name="language"
              value={form.language}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            >
              <option value="cpp">C++</option>
              <option value="java">Java</option>
              <option value="python">Python</option>
            </select>
            <textarea
              name="solutionCode"
              value={form.solutionCode}
              onChange={handleChange}
              placeholder={`Paste correct solution code here`}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white mt-2"
              rows={6}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Submit Problem
          </button>
        </form>
      </div>
    </div>
  );
}
