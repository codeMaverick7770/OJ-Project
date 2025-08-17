import { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import rehypeSanitize from 'rehype-sanitize';
import 'katex/dist/katex.min.css';

export default function CreateProblem() {
  const [mode, setMode] = useState('single'); // 'single' or 'bulk'
  const [form, setForm] = useState({
    title: '',
    description: '',
    inputFormat: '',
    outputFormat: '',
    constraints: '',
    difficulty: 'Easy',
    tags: '',
    bulkInput: '',
    bulkOutput: '',
    language: 'cpp',
    starterCode: '',
    solutionCode: '',
    examples: [{ input: '', output: '' }]
  });

  const [bulkJSON, setBulkJSON] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const [showPreview, setShowPreview] = useState(false);

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

  const handleSingleSubmit = async () => {
    const inputLines = form.bulkInput.trim().split('\n');
    const outputLines = form.bulkOutput.trim().split('\n');

    if (inputLines.length !== outputLines.length) {
      return setError('Number of test case inputs and outputs must match');
    }

    const testCases = inputLines.map((input, i) => ({
      input: input.trim(),
      expectedOutput: outputLines[i]?.trim() || ''
    }));

    const starterCode = { cpp: '', java: '', python: '' };
    starterCode[form.language] = form.starterCode;

    const solutionCode = { cpp: '', java: '', python: '' };
    solutionCode[form.language] = form.solutionCode;

    const payload = {
      title: form.title,
      description: form.description,
      inputFormat: form.inputFormat,
      outputFormat: form.outputFormat,
      constraints: form.constraints.split('\n').map(line => line.trim()).filter(Boolean),
      difficulty: form.difficulty,
      tags: form.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      testCases,
      examples: form.examples.filter(ex => ex.input && ex.output),
      starterCode,
      solutionCode
    };

    const token = localStorage.getItem('token');
    await API.post('/problem/create', payload, {
      headers: { Authorization: `Bearer ${token}` }
    });

    setSuccess('✅ Problem added successfully');
    setTimeout(() => navigate('/dashboard'), 1500);
  };

  const handleBulkSubmit = async () => {
    try {
      const data = JSON.parse(bulkJSON);
      if (!Array.isArray(data)) throw new Error('JSON should be an array of problem objects');
      if (!data.every(p => p.title && p.description && p.testCases)) {
        throw new Error('Each problem must include at least title, description, and testCases');
      }

      const token = localStorage.getItem('token');
      const res = await API.post('/problem/bulk', data, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess(`✅ ${data.length} problems added successfully`);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Invalid JSON format');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (mode === 'single') {
        await handleSingleSubmit();
      } else {
        await handleBulkSubmit();
      }
    } catch (err) {
      console.error('❌ Submission failed:', err.response || err.message);
      setError(err.response?.data?.error || 'Submission failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-[#0c0c2d] to-black px-4 py-12">
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-2xl w-full max-w-4xl shadow-xl text-white">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
            {mode === 'single' ? 'Create New Problem' : 'Bulk Upload Problems'}
          </h2>
          <button
            onClick={() => {
              setMode(mode === 'single' ? 'bulk' : 'single');
              setError('');
              setSuccess('');
            }}
            className="px-3 py-1 border border-purple-400 text-purple-300 text-sm rounded hover:bg-purple-500/10"
          >
            Switch to {mode === 'single' ? 'Bulk Mode' : 'Single Mode'}
          </button>
        </div>
        {/* Preview toggle button */}
        {mode === 'single' && (
          <button
            type="button"
            className="mb-4 px-4 py-1 rounded bg-gradient-to-r from-[#7286ff] to-[#fe7587] text-white font-semibold shadow hover:brightness-110"
            onClick={() => setShowPreview((p) => !p)}
          >
            {showPreview ? 'Hide Preview' : 'Preview Description'}
          </button>
        )}
        {/* Preview area */}
        {showPreview && mode === 'single' && (
          <div className="mb-6 p-4 bg-[#18182a] rounded-lg border border-[#7286ff]/30 text-white">
            <h3 className="text-lg font-bold mb-2 text-[#7286ff]">Preview</h3>
            <ReactMarkdown
              children={form.description}
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex, rehypeHighlight, rehypeSanitize]}
              components={{
                img: ({node, ...props}) => (
                  <img {...props} style={{maxWidth: '100%', borderRadius: '8px', margin: '12px 0'}} alt={props.alt || ''} />
                ),
                code: ({node, inline, className, children, ...props}) => (
                  <code className={className} style={{background: '#232347', color: '#ffb4d0', borderRadius: '4px', padding: '2px 6px', fontSize: '0.95em'}} {...props}>
                    {children}
                  </code>
                )
              }}
            />
          </div>
        )}

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-400 mb-4">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'bulk' ? (
            <textarea
              value={bulkJSON}
              onChange={(e) => setBulkJSON(e.target.value)}
              placeholder='Paste an array of problems in JSON format'
              className="w-full p-4 rounded-lg bg-white/10 placeholder-gray-400 text-sm h-80"
              required
            />
          ) : (
            <>
              <input type="text" name="title" placeholder="Title" value={form.title} onChange={handleChange} required className="w-full p-3 rounded-lg bg-white/10 placeholder-gray-400" />

              <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required className="w-full p-3 rounded-lg bg-white/10 placeholder-gray-400" rows={4} />

              <textarea name="inputFormat" placeholder="Input Format" value={form.inputFormat} onChange={handleChange} className="w-full p-3 rounded-lg bg-white/10 placeholder-gray-400" rows={2} />
              <textarea name="outputFormat" placeholder="Output Format" value={form.outputFormat} onChange={handleChange} className="w-full p-3 rounded-lg bg-white/10 placeholder-gray-400" rows={2} />
              <textarea name="constraints" placeholder="Constraints (one per line)" value={form.constraints} onChange={handleChange} className="w-full p-3 rounded-lg bg-white/10 placeholder-gray-400" rows={3} />

              <select name="difficulty" value={form.difficulty} onChange={handleChange} className="w-full p-3 rounded-lg bg-white/10 text-white">
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>

              <input type="text" name="tags" placeholder="Tags (comma-separated)" value={form.tags} onChange={handleChange} className="w-full p-3 rounded-lg bg-white/10 placeholder-gray-400" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <textarea name="bulkInput" value={form.bulkInput} onChange={handleChange} placeholder="Test Case Inputs (one per line)" className="p-3 rounded-lg bg-white/10 placeholder-gray-400" rows={4} required />
                <textarea name="bulkOutput" value={form.bulkOutput} onChange={handleChange} placeholder="Expected Outputs (one per line)" className="p-3 rounded-lg bg-white/10 placeholder-gray-400" rows={4} required />
              </div>

              <select name="language" value={form.language} onChange={handleChange} className="w-full p-3 rounded-lg bg-white/10 text-white">
                <option value="cpp">C++</option>
                <option value="java">Java</option>
                <option value="python">Python</option>
              </select>

              <textarea name="starterCode" value={form.starterCode} onChange={handleChange} placeholder="Starter Code" className="w-full p-3 rounded-lg bg-white/10 placeholder-gray-400" rows={6} />
              <textarea name="solutionCode" value={form.solutionCode} onChange={handleChange} placeholder="Correct Solution Code" className="w-full p-3 rounded-lg bg-white/10 placeholder-gray-400" rows={6} required />

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-pink-400">💡 Example Test Cases</h3>
                {form.examples.map((ex, idx) => (
                  <div key={idx} className="flex flex-col gap-2 bg-white/5 border border-white/10 p-4 rounded">
                    <input type="text" placeholder="Input" value={ex.input} onChange={(e) => handleExampleChange(idx, 'input', e.target.value)} className="p-2 bg-white/10 rounded text-sm placeholder-gray-400" />
                    <input type="text" placeholder="Expected Output" value={ex.output} onChange={(e) => handleExampleChange(idx, 'output', e.target.value)} className="p-2 bg-white/10 rounded text-sm placeholder-gray-400" />
                    {form.examples.length > 1 && (
                      <button type="button" onClick={() => removeExample(idx)} className="text-xs text-red-400 self-end">
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addExample} className="mt-2 text-sm px-3 py-1 border border-purple-500 text-purple-400 rounded hover:bg-purple-500/10">
                  ➕ Add Example
                </button>
              </div>
            </>
          )}

          <button type="submit" className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:brightness-110 text-white font-semibold transition-all duration-200">
            {mode === 'single' ? 'Submit Problem' : 'Submit Bulk'}
          </button>
        </form>
      </div>
    </div>
  );
}
