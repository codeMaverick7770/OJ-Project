import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CompilerEditor from '../components/CompilerEditor';
import OutputBox from '../components/OutputBox';
import API from '../services/api';

export default function CompilerPage() {
  const { id } = useParams(); // problem ID if solving
  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState('cpp');
  const [code, setCode] = useState({
    cpp: '#include <iostream>\nusing namespace std;\nint main(){string s;getline(cin,s);cout<<"Hello, "<<s;return 0;}',
    java: 'import java.util.*;\npublic class Main{public static void main(String[]args){Scanner sc=new Scanner(System.in);String s=sc.nextLine();System.out.println("Hello, "+s);}}',
    python: 's=input()\nprint("Hello,",s)'
  });
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    if (id) {
      API.get(`/problem/${id}`)
        .then(res => {
          setProblem(res.data);
          setLanguage(Object.keys(res.data.solutionCode).find(lang => res.data.solutionCode[lang]));
          setCode(res.data.solutionCode);
          setFeedback([]);
        })
        .catch(console.error);
    }
  }, [id]);

  const handleRun = () => {
    axios.post(import.meta.env.VITE_COMPILER_URL, { language, code: code[language], input }, { withCredentials: true })
      .then(res => setOutput(res.data.output))
      .catch(err => setOutput(err.response?.data?.error?.stderr || 'Error'));
  };

  const handleSubmit = async () => {
    if (!problem) return;
    const results = [];
    for (const tc of problem.testCases) {
      const { data } = await axios.post(import.meta.env.VITE_COMPILER_URL, {
        language,
        code: code[language],
        input: tc.input
      }, { withCredentials: true });
      results.push({
        input: tc.input,
        expected: tc.expectedOutput.trim(),
        actual: data.output.trim(),
        pass: data.output.trim() === tc.expectedOutput.trim()
      });
    }
    setFeedback(results);
  };

  return (
    <div className="min-h-screen bg-white/80 px-4 py-10 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto space-y-6">

        <h2 className="text-3xl font-semibold text-center">⚙️ {problem ? 'Solve – ' + problem.title : 'Online Code Compiler'}</h2>

        {problem && (
          <p className="bg-gray-100 dark:bg-gray-700 p-4 rounded whitespace-pre-line">
            {problem.description}
          </p>
        )}

        <select value={language} onChange={e => setLanguage(e.target.value)} className="border rounded px-3 py-2">
          <option value="cpp">C++</option>
          <option value="java">Java</option>
          <option value="python">Python</option>
        </select>

        <div className="border rounded bg-gray-50 p-4">
          <CompilerEditor
            code={code[language]}
            setCode={newCode => setCode(c => ({ ...c, [language]: newCode }))}
          />
        </div>

        <textarea
          className="w-full p-2 border rounded text-sm"
          rows={3}
          placeholder="Standard input…"
          value={input}
          onChange={e => setInput(e.target.value)}
        />

        <div className="flex gap-4">
          <button onClick={handleRun} className="px-5 py-2 bg-purple-500 text-white rounded">Run</button>
          {problem && <button onClick={handleSubmit} className="px-5 py-2 bg-green-600 text-white rounded">Submit to Test Cases</button>}
        </div>

        <OutputBox output={output} />

        {feedback.length > 0 && (
          <div className="mt-6 space-y-4">
            {feedback.map((r, i) => (
              <div key={i} className={`p-4 rounded ${r.pass ? 'bg-green-100' : 'bg-red-100'}`}>
                <p><strong>Test Case {i + 1}:</strong></p>
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
