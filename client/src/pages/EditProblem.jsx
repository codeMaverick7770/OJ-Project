import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function EditProblem() {
  const { id } = useParams();
  const [form, setForm] = useState({ title: '', description: '', difficulty: 'Easy' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await API.get(`/problem/${id}`);
        const { title, description, difficulty } = res.data;
        setForm({ title, description, difficulty });
      } catch (err) {
        setError('Failed to load problem');
      }
    };
    fetchProblem();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await API.put(`/problem/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/problems');
    } catch (err) {
      setError(err.response?.data?.error || 'Update failed');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-white">Edit Problem</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
        />
        <select
          name="difficulty"
          value={form.difficulty}
          onChange={handleChange}
          className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
        >
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Update Problem
        </button>
      </form>
    </div>
  );
}
