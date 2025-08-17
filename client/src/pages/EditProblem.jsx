import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import RichTextEditor from '../components/RichTextEditor.jsx';
import EnhancedRenderer from '../utils/enhancedRenderer.jsx';
import { Save, Eye, EyeOff, ArrowLeft, Trash2 } from 'lucide-react';

export default function EditProblem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    inputFormat: '',
    outputFormat: '',
    constraints: '',
    difficulty: 'Easy',
    tags: '',
    language: 'cpp',
    starterCode: '',
    solutionCode: '',
    examples: [{ input: '', output: '' }],
    testCases: [{ input: '', expectedOutput: '' }]
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    fetchProblem();
  }, [id]);

  const fetchProblem = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/problem/${id}`);
      const prob = response.data;
      setProblem(prob);
      
      // Convert arrays to strings for form inputs
      setForm({
        title: prob.title || '',
        description: prob.description || '',
        inputFormat: prob.inputFormat || '',
        outputFormat: prob.outputFormat || '',
        constraints: Array.isArray(prob.constraints) ? prob.constraints.join('\n') : prob.constraints || '',
        difficulty: prob.difficulty || 'Easy',
        tags: Array.isArray(prob.tags) ? prob.tags.join(', ') : prob.tags || '',
        language: 'cpp', // Default language
        starterCode: prob.starterCode?.cpp || prob.starterCode?.java || prob.starterCode?.python || '',
        solutionCode: prob.solutionCode?.cpp || prob.solutionCode?.java || prob.solutionCode?.python || '',
        examples: prob.examples?.length > 0 ? prob.examples : [{ input: '', output: '' }],
        testCases: prob.testCases?.length > 0 ? prob.testCases : [{ input: '', expectedOutput: '' }]
      });
    } catch (err) {
      console.error('Failed to fetch problem:', err);
      setError('Failed to load problem');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleExampleChange = (index, field, value) => {
    const updated = [...form.examples];
    updated[index][field] = value;
    setForm({ ...form, examples: updated });
  };

  const addExample = () => {
    setForm({ ...form, examples: [...form.examples, { input: '', output: '' }] });
  };

  const removeExample = (index) => {
    const updated = [...form.examples];
    updated.splice(index, 1);
    setForm({ ...form, examples: updated });
  };

  const handleTestCaseChange = (index, field, value) => {
    const updated = [...form.testCases];
    updated[index][field] = value;
    setForm({ ...form, testCases: updated });
  };

  const addTestCase = () => {
    setForm({ ...form, testCases: [...form.testCases, { input: '', expectedOutput: '' }] });
  };

  const removeTestCase = (index) => {
    const updated = [...form.testCases];
    updated.splice(index, 1);
    setForm({ ...form, testCases: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // Prepare payload
      const payload = {
        title: form.title,
        description: form.description,
        inputFormat: form.inputFormat,
        outputFormat: form.outputFormat,
        constraints: form.constraints.split('\n').map(line => line.trim()).filter(Boolean),
        difficulty: form.difficulty,
        tags: form.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        examples: form.examples.filter(ex => ex.input && ex.output),
        testCases: form.testCases.filter(tc => tc.input && tc.expectedOutput),
        starterCode: {
          cpp: form.starterCode,
          java: form.starterCode,
          python: form.starterCode
        },
        solutionCode: {
          cpp: form.solutionCode,
          java: form.solutionCode,
          python: form.solutionCode
        }
      };

      await API.put(`/problem/${id}`, payload);
      setSuccess('✅ Problem updated successfully!');
      
      setTimeout(() => {
        navigate(`/problem/${id}`);
      }, 1500);
    } catch (err) {
      console.error('Failed to update problem:', err);
      setError(err.response?.data?.error || 'Failed to update problem');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this problem? This action cannot be undone.')) {
      return;
    }

    try {
      setSaving(true);
      await API.delete(`/problem/${id}`);
      setSuccess('✅ Problem deleted successfully!');
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      console.error('Failed to delete problem:', err);
      setError(err.response?.data?.error || 'Failed to delete problem');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-[#0c0c2d] to-black">
        <div className="text-white text-xl">Loading problem...</div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-[#0c0c2d] to-black">
        <div className="text-white text-xl">Problem not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0c0c2d] to-black px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/problem/${id}`)}
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Problem
            </button>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Edit Problem
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#7286ff]/20 text-[#7286ff] hover:bg-[#7286ff]/30 transition-colors"
            >
              {showPreview ? <EyeOff size={18} /> : <Eye size={18} />}
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
            
            <button
              type="button"
              onClick={handleDelete}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors disabled:opacity-50"
            >
              <Trash2 size={18} />
              Delete
            </button>
          </div>
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="mb-8 p-6 bg-[#18182a] rounded-lg border border-[#7286ff]/30">
            <h3 className="text-lg font-bold mb-4 text-[#7286ff] flex items-center">
              <span className="mr-2">👁️</span>
              Live Preview
            </h3>
            <div className="prose prose-invert prose-sm max-w-none">
              <EnhancedRenderer content={form.description} />
            </div>
          </div>
        )}

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-900/30 border border-red-500 text-red-400">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 rounded-lg bg-green-900/30 border border-green-500 text-green-400">
            {success}
          </div>
        )}

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      required
                      className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-[#7286ff] focus:outline-none transition-colors"
                      placeholder="Problem title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Difficulty</label>
                    <select
                      name="difficulty"
                      value={form.difficulty}
                      onChange={handleChange}
                      className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white focus:border-[#7286ff] focus:outline-none transition-colors"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Tags (comma-separated)</label>
                    <input
                      type="text"
                      name="tags"
                      value={form.tags}
                      onChange={handleChange}
                      className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-[#7286ff] focus:outline-none transition-colors"
                      placeholder="Dynamic Programming, Math, Arrays"
                    />
                  </div>
                </div>
              </div>

              {/* Input/Output Format */}
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-white mb-4">Input/Output Format</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Input Format</label>
                    <textarea
                      name="inputFormat"
                      value={form.inputFormat}
                      onChange={handleChange}
                      rows={3}
                      className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-[#7286ff] focus:outline-none transition-colors resize-none"
                      placeholder="Describe the input format..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Output Format</label>
                    <textarea
                      name="outputFormat"
                      value={form.outputFormat}
                      onChange={handleChange}
                      rows={3}
                      className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-[#7286ff] focus:outline-none transition-colors resize-none"
                      placeholder="Describe the output format..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Constraints (one per line)</label>
                    <textarea
                      name="constraints"
                      value={form.constraints}
                      onChange={handleChange}
                      rows={4}
                      className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-[#7286ff] focus:outline-none transition-colors resize-none"
                      placeholder="1 ≤ n ≤ 10^5&#10;1 ≤ arr[i] ≤ 10^9"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Code */}
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-white mb-4">Code Templates</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Starter Code</label>
                    <textarea
                      name="starterCode"
                      value={form.starterCode}
                      onChange={handleChange}
                      rows={6}
                      className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-[#7286ff] focus:outline-none transition-colors resize-none font-mono text-sm"
                      placeholder="// Write your starter code here..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Solution Code</label>
                    <textarea
                      name="solutionCode"
                      value={form.solutionCode}
                      onChange={handleChange}
                      rows={6}
                      className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-[#7286ff] focus:outline-none transition-colors resize-none font-mono text-sm"
                      placeholder="// Write your solution code here..."
                    />
                  </div>
                </div>
              </div>

              {/* Test Cases */}
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-white mb-4">Test Cases</h3>
                <div className="space-y-4">
                  {form.testCases.map((tc, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="flex-1">
                        <label className="block text-xs text-white/60 mb-1">Input {idx + 1}</label>
                        <input
                          type="text"
                          value={tc.input}
                          onChange={(e) => handleTestCaseChange(idx, 'input', e.target.value)}
                          className="w-full p-2 rounded bg-white/10 border border-white/20 text-white text-sm placeholder-white/50 focus:border-[#7286ff] focus:outline-none"
                          placeholder="Test input"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs text-white/60 mb-1">Expected Output {idx + 1}</label>
                        <input
                          type="text"
                          value={tc.expectedOutput}
                          onChange={(e) => handleTestCaseChange(idx, 'expectedOutput', e.target.value)}
                          className="w-full p-2 rounded bg-white/10 border border-white/20 text-white text-sm placeholder-white/50 focus:border-[#7286ff] focus:outline-none"
                          placeholder="Expected output"
                        />
                      </div>
                      {form.testCases.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTestCase(idx)}
                          className="mt-6 px-2 py-1 text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addTestCase}
                    className="text-sm px-3 py-1 border border-[#7286ff] text-[#7286ff] rounded hover:bg-[#7286ff]/10 transition-colors"
                  >
                    + Add Test Case
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Description Editor - Full Width */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-white mb-4">Problem Description</h3>
            <RichTextEditor
              value={form.description}
              onChange={(value) => setForm({ ...form, description: value })}
              placeholder="Write your problem description with rich formatting..."
              className="w-full"
            />
          </div>

          {/* Examples */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-white mb-4">Example Test Cases</h3>
            <div className="space-y-4">
              {form.examples.map((ex, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-xs text-white/60 mb-1">Example Input {idx + 1}</label>
                    <input
                      type="text"
                      value={ex.input}
                      onChange={(e) => handleExampleChange(idx, 'input', e.target.value)}
                      className="w-full p-2 rounded bg-white/10 border border-white/20 text-white text-sm placeholder-white/50 focus:border-[#7286ff] focus:outline-none"
                      placeholder="Example input"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-white/60 mb-1">Example Output {idx + 1}</label>
                    <input
                      type="text"
                      value={ex.output}
                      onChange={(e) => handleExampleChange(idx, 'output', e.target.value)}
                      className="w-full p-2 rounded bg-white/10 border border-white/20 text-white text-sm placeholder-white/50 focus:border-[#7286ff] focus:outline-none"
                      placeholder="Example output"
                    />
                  </div>
                  {form.examples.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeExample(idx)}
                      className="mt-6 px-2 py-1 text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addExample}
                className="text-sm px-3 py-1 border border-[#7286ff] text-[#7286ff] rounded hover:bg-[#7286ff]/10 transition-colors"
              >
                + Add Example
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-8 py-3 rounded-lg bg-gradient-to-r from-[#7286ff] to-[#fe7587] text-white font-semibold hover:brightness-110 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={20} />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
