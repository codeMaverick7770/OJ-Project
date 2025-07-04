import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CompilerEditor from '../components/CompilerEditor';
import OutputBox from '../components/OutputBox';
import API from '../services/api';

const defaultHelloWorld = {
  cpp: `#include <iostream>\nusing namespace std;\nint main() {\n  cout << "Hello, World!";\n  return 0;\n}`,
  java: `public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, World!");\n  }\n}`,
  python: `print("Hello, World!")`,
};

export default function CompilerPage() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState('cpp');
  const [code, setCode] = useState(defaultHelloWorld);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    if (id) {
      API.get(`/problem/${id}`)
        .then(res => {
          const prob = res.data;
          setProblem(prob);
          const availableLang = Object.keys(prob.starterCode).find(lang => prob.starterCode[lang]) || 'cpp';
          setLanguage(availableLang);
          setCode(prev => {
            const currentCode = prev[availableLang]?.trim();
            const defaultCode = defaultHelloWorld[availableLang]?.trim();
            const isUnmodified = currentCode === defaultCode;
            return isUnmodified
              ? { ...prev, [availableLang]: prob.starterCode[availableLang] || defaultCode }
              : prev;
          });
          setFeedback([]);
        })
        .catch(console.error);
    }
  }, [id]);

  const handleRun = async () => {
    try {
      const res = await axios.post(
        import.meta.env.VITE_COMPILER_URL,
        { language, code: code[language], input },
        { withCredentials: true }
      );
      setOutput(res.data.output);
    } catch (err) {
      setOutput(err.response?.data?.error?.stderr || 'Compilation error');
    }
  };

  const handleSubmit = async () => {
    if (!problem) return;
    const results = [];

    for (const tc of problem.testCases) {
      try {
        const { data } = await axios.post(
          import.meta.env.VITE_COMPILER_URL,
          {
            language,
            code: code[language],
            input: tc.input,
          },
          { withCredentials: true }
        );

        results.push({
          input: tc.input,
          expected: tc.expectedOutput.trim(),
          actual: data.output.trim(),
          pass: data.output.trim() === tc.expectedOutput.trim(),
        });
      } catch {
        results.push({
          input: tc.input,
          expected: tc.expectedOutput.trim(),
          actual: 'Error',
          pass: false,
        });
      }
    }

    setFeedback(results);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0c0c2d] to-black text-white px-4 pt-16 pb-10 py-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <h2 className="text-4xl font-extrabold text-center bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text ">
           {problem ? `Problem – ${problem.title}` : 'Online Code Compiler'}
        </h2>

        {problem && (
          <div className="bg-white/5 backdrop-blur-md p-4 rounded-lg text-sm border border-white/10 shadow-inner">
            <pre className="whitespace-pre-wrap">{problem.description}</pre>
          </div>
        )}

        <div className="flex justify-end">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-black/60 text-white border border-white/20 px-4 py-2 rounded"
          >
            <option value="cpp">C++</option>
            <option value="java">Java</option>
            <option value="python">Python</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Code Editor */}
          <div className="bg-white/5 rounded-xl border border-white/10 shadow-lg p-4 backdrop-blur-md">
            <CompilerEditor
              code={code[language]}
              setCode={(newCode) =>
                setCode((prev) => ({ ...prev, [language]: newCode }))
              }
            />
          </div>

          {/* Input + Output */}
          <div className="space-y-4">
            <textarea
              className="bg-white/5 backdrop-blur-md w-full rounded-xl p-4 border border-white/10 text-white text-sm outline-none min-h-[150px] placeholder:text-white/50"
              placeholder="Standard Input..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <OutputBox output={output} />
          </div>
        </div>

        <div className="flex justify-center gap-6">
          <button
            onClick={handleRun}
            className="bg-gradient-to-r from-purple-600 to-pink-500 hover:brightness-110 text-white font-semibold px-6 py-2 rounded-full shadow-md"
          >
             Run
          </button>

          {problem && (
            <button
              onClick={handleSubmit}
              className="bg-black/80 hover:bg-black/90 border border-white/20 text-white font-semibold px-6 py-2 rounded-full shadow-md"
            >
              Submit to Test Cases
            </button>
          )}
        </div>

        {/* Feedback Test Case Results */}
        {feedback.length > 0 && (
          <div className="mt-6 space-y-4">
            {feedback.map((r, i) => (
              <div
                key={i}
                className={`p-4 rounded-lg ${
                  r.pass ? 'bg-green-900/40 border border-green-500' : 'bg-red-900/40 border border-red-500'
                }`}
              >
                <p className="font-semibold text-sm">Test Case {i + 1}</p>
                <p><strong>Input:</strong> {r.input}</p>
                <p><strong>Expected:</strong> {r.expected}</p>
                <p><strong>Got:</strong> {r.actual}</p>
                <p>{r.pass ? '✅ Passed' : '❌ Failed'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
