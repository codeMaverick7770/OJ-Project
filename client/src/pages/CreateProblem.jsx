import { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function CreateProblem() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    difficulty: 'Easy',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous error

    try {
      const token = localStorage.getItem('token');
      const res = await API.post('/problem/create', form, {
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
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-full max-w-md">
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
